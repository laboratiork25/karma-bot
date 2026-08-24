import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const topDataPath = path.join(__dirname, '../../storage', 'top-stats.json')
const TIMEZONE = 'Europe/Rome'

function ensureStorageDir() {
    const storageDir = path.dirname(topDataPath)
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true })
    }
}

function getRomeDateParts(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    const parts = formatter.formatToParts(date)
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]))

    return {
        year: map.year,
        month: map.month,
        day: map.day,
        dateKey: `${map.year}-${map.month}-${map.day}`
    }
}

function getRomeWeekKey(date = new Date()) {
    const romeNow = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }))
    const day = romeNow.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(romeNow)
    monday.setDate(romeNow.getDate() + diffToMonday)
    const parts = getRomeDateParts(monday)
    return parts.dateKey
}

function getRomeYearKey(date = new Date()) {
    return getRomeDateParts(date).year
}

function getNextRomeMidnightMs() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }))
    const next = new Date(now)
    next.setDate(now.getDate() + 1)
    next.setHours(0, 0, 0, 0)
    return next.getTime()
}

function getNextRomeMondayMs() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }))
    const currentDay = now.getDay()
    const daysUntilMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7 || 7
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + daysUntilMonday)
    nextMonday.setHours(0, 0, 0, 0)
    return nextMonday.getTime()
}

function getNextRomeYearMs() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }))
    const next = new Date(now)
    next.setFullYear(now.getFullYear() + 1)
    next.setMonth(0, 1)
    next.setHours(0, 0, 0, 0)
    return next.getTime()
}

function formatTimeRemaining(ms) {
    if (ms <= 0) return '0m'
    const days = Math.floor(ms / 86400000)
    const hours = Math.floor((ms % 86400000) / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    if (days > 0) return `${days}g ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

function formatOnlineMs(ms) {
    const safe = Math.max(0, Number(ms) || 0)
    const totalMinutes = Math.floor(safe / 60000)
    const days = Math.floor(totalMinutes / 1440)
    const hours = Math.floor((totalMinutes % 1440) / 60)
    const minutes = totalMinutes % 60

    if (days > 0) return `${days}g ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

function normalizeData(data) {
    if (!data || typeof data !== 'object') data = {}

    data.daily = data.daily || {}
    data.weekly = data.weekly || {}
    data.alltime = data.alltime || {}
    data.yearly = data.yearly || {}

    data.onlineDaily = data.onlineDaily || {}
    data.onlineWeekly = data.onlineWeekly || {}
    data.onlineAlltime = data.onlineAlltime || {}
    data.onlineYearly = data.onlineYearly || {}

    data.dailyUsers = data.dailyUsers || {}
    data.weeklyUsers = data.weeklyUsers || {}
    data.alltimeUsers = data.alltimeUsers || {}
    data.yearlyUsers = data.yearlyUsers || {}

    data.meta = data.meta || {}
    data.meta.dailyKey = data.meta.dailyKey || getRomeDateParts().dateKey
    data.meta.weeklyKey = data.meta.weeklyKey || getRomeWeekKey()
    data.meta.yearlyKey = data.meta.yearlyKey || getRomeYearKey()

    return data
}

function loadTopData() {
    ensureStorageDir()
    try {
        if (fs.existsSync(topDataPath)) {
            const rawData = fs.readFileSync(topDataPath, 'utf8')
            return normalizeData(JSON.parse(rawData))
        }
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝓃𝑒𝓁 𝒸𝒶𝓇𝒾𝒸𝒶𝓂𝑒𝓃𝓉𝑜 𝓈𝓉𝒶𝓉𝓈:', e.message)
    }

    return normalizeData({})
}

function saveTopData(data) {
    ensureStorageDir()
    try {
        fs.writeFileSync(topDataPath, JSON.stringify(normalizeData(data), null, 2), 'utf8')
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝓃𝑒𝓁 𝓈𝒶𝓁𝓋𝒶𝓉𝒶𝑔𝑔𝒾𝑜 𝓈𝓉𝒶𝓉𝓈:', e.message)
    }
}

function resetIfNeeded(data) {
    const todayKey = getRomeDateParts().dateKey
    const weekKey = getRomeWeekKey()
    const yearKey = getRomeYearKey()

    if (data.meta.dailyKey !== todayKey) {
        data.daily = {}
        data.dailyUsers = {}
        data.onlineDaily = {}
        data.meta.dailyKey = todayKey
    }

    if (data.meta.weeklyKey !== weekKey) {
        data.weekly = {}
        data.weeklyUsers = {}
        data.onlineWeekly = {}
        data.meta.weeklyKey = weekKey
    }

    if (data.meta.yearlyKey !== yearKey) {
        data.yearly = {}
        data.yearlyUsers = {}
        data.onlineYearly = {}
        data.meta.yearlyKey = yearKey
    }

    return data
}

function getRank(scope, userId) {
    const entries = Object.entries(scope || {}).sort((a, b) => b[1] - a[1])
    const index = entries.findIndex(([jid]) => jid === userId)
    return {
        rank: index >= 0 ? index + 1 : null,
        totalUsers: entries.length
    }
}

function buildStatsMessage({
    title,
    count,
    rankData,
    online,
    onlineRankData,
    resetText
}) {
    let text = `╭═━ 〖  📊  ${title} 〗═━⪩
│❍ Messaggi: *${count.toLocaleString('it-IT')}*
│❍ Posizione: *${rankData.rank ? `#${rankData.rank}` : 'N/D'}* su *${rankData.totalUsers}*
│❍ Online: *${formatOnlineMs(online)}*
│❍ Rank online: *${onlineRankData.rank ? `#${onlineRankData.rank}` : 'N/D'}* su *${onlineRankData.totalUsers}*`

    if (resetText) {
        text += `\n│❍ Reset tra: *${resetText}*`
    }

    text += `\n│
│❍ Nota: online ibrido, reale se visibile, altrimenti stimato.
╰━━━━━━━━━⪩`

    return text
}

const handler = async (m, { usedPrefix, args }) => {
    const userId = m.sender
    const groupId = m.chat

    const data = resetIfNeeded(loadTopData())
    saveTopData(data)

    const scope = (args[0] || 'giorno').toLowerCase()

    if (['giorno', 'daily', 'oggi'].includes(scope)) {
        const count = data.daily[groupId]?.[userId] || 0
        const online = data.onlineDaily[groupId]?.[userId] || 0
        const rankData = getRank(data.daily[groupId] || {}, userId)
        const onlineRankData = getRank(data.onlineDaily[groupId] || {}, userId)

        return m.reply(buildStatsMessage({
            title: 'Stats Giornaliere',
            count,
            rankData,
            online,
            onlineRankData,
            resetText: formatTimeRemaining(getNextRomeMidnightMs() - Date.now())
        }))
    }

    if (['settimana', 'weekly', 'settimanale'].includes(scope)) {
        const count = data.weekly[groupId]?.[userId] || 0
        const online = data.onlineWeekly[groupId]?.[userId] || 0
        const rankData = getRank(data.weekly[groupId] || {}, userId)
        const onlineRankData = getRank(data.onlineWeekly[groupId] || {}, userId)

        return m.reply(buildStatsMessage({
            title: 'Stats Settimanali',
            count,
            rankData,
            online,
            onlineRankData,
            resetText: formatTimeRemaining(getNextRomeMondayMs() - Date.now())
        }))
    }

    if (['annuale', 'year', 'yearly'].includes(scope)) {
        const count = data.yearly[groupId]?.[userId] || 0
        const online = data.onlineYearly[groupId]?.[userId] || 0
        const rankData = getRank(data.yearly[groupId] || {}, userId)
        const onlineRankData = getRank(data.onlineYearly[groupId] || {}, userId)

        return m.reply(buildStatsMessage({
            title: 'Stats Annuali',
            count,
            rankData,
            online,
            onlineRankData,
            resetText: formatTimeRemaining(getNextRomeYearMs() - Date.now())
        }))
    }

    if (['sempre', 'alltime', 'totali', 'totale'].includes(scope)) {
        const count = data.alltime[groupId]?.[userId] || 0
        const online = data.onlineAlltime[groupId]?.[userId] || 0
        const rankData = getRank(data.alltime[groupId] || {}, userId)
        const onlineRankData = getRank(data.onlineAlltime[groupId] || {}, userId)

        return m.reply(buildStatsMessage({
            title: 'Stats Totali',
            count,
            rankData,
            online,
            onlineRankData,
            resetText: null
        }))
    }

    return m.reply(
        `Uso del comando:\n` +
        `• ${usedPrefix}stats giorno\n` +
        `• ${usedPrefix}stats settimana\n` +
        `• ${usedPrefix}stats annuale\n` +
        `• ${usedPrefix}stats sempre`
    )
}

handler.help = [
    'stats',
    'stats giorno',
    'stats settimana',
    'stats annuale',
    'stats sempre'
]
handler.tags = ['group']
handler.command = /^(stats)$/i
handler.group = true
handler.register = true

export default handler
