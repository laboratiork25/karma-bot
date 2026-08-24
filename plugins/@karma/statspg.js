import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const topDataPath = path.join(__dirname, '../../storage', 'top-stats.json')
const TIMEZONE = 'Europe/Rome'

function ensureStorageDir() {
    const storageDir = path.dirname(topDataPath)
    if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true })
}

function getRomeDateKey(date = new Date()) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    const parts = formatter.formatToParts(date)
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]))
    return `${map.year}-${map.month}-${map.day}`
}

function getRomeWeekKey(date = new Date()) {
    const romeNow = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }))
    const day = romeNow.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const monday = new Date(romeNow)
    monday.setDate(romeNow.getDate() + diffToMonday)
    monday.setHours(0, 0, 0, 0)
    return getRomeDateKey(monday)
}

function getRomeYearKey(date = new Date()) {
    return getRomeDateKey(date).slice(0, 4)
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
    const romeNow = new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }))
    const nextYear = romeNow.getFullYear() + 1
    const next = new Date(romeNow)
    next.setFullYear(nextYear, 0, 1)
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

function normalizeData(data) {
    if (!data || typeof data !== 'object') data = {}
    data.dailyGroups = data.dailyGroups || {}
    data.weeklyGroups = data.weeklyGroups || {}
    data.yearlyGroups = data.yearlyGroups || {}
    data.alltimeGroups = data.alltimeGroups || {}
    data.meta = data.meta || {}
    data.meta.dailyKey = data.meta.dailyKey || getRomeDateKey()
    data.meta.weeklyKey = data.meta.weeklyKey || getRomeWeekKey()
    data.meta.yearlyKey = data.meta.yearlyKey || getRomeYearKey()
    return data
}

function loadData() {
    ensureStorageDir()
    try {
        if (fs.existsSync(topDataPath)) {
            return normalizeData(JSON.parse(fs.readFileSync(topDataPath, 'utf8')))
        }
    } catch (e) {
        console.error('[STATSGP] load error:', e.message)
    }
    return normalizeData({})
}

function saveData(data) {
    ensureStorageDir()
    try {
        fs.writeFileSync(topDataPath, JSON.stringify(normalizeData(data), null, 2), 'utf8')
    } catch (e) {
        console.error('[STATSGP] save error:', e.message)
    }
}

function resetIfNeeded(data) {
    const dailyKey = getRomeDateKey()
    const weeklyKey = getRomeWeekKey()
    const yearlyKey = getRomeYearKey()

    if (data.meta.dailyKey !== dailyKey) {
        data.dailyGroups = {}
        data.meta.dailyKey = dailyKey
    }
    if (data.meta.weeklyKey !== weeklyKey) {
        data.weeklyGroups = {}
        data.meta.weeklyKey = weeklyKey
    }
    if (data.meta.yearlyKey !== yearlyKey) {
        data.yearlyGroups = {}
        data.meta.yearlyKey = yearlyKey
    }

    return data
}

function inc(store, key) {
    store[key] = Number(store[key] || 0) + 1
}

function countGroupMessage(groupId) {
    const data = resetIfNeeded(loadData())
    inc(data.dailyGroups, groupId)
    inc(data.weeklyGroups, groupId)
    inc(data.yearlyGroups, groupId)
    inc(data.alltimeGroups, groupId)
    saveData(data)
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

const handler = async (m, { args, usedPrefix }) => {
    if (!m.isGroup) {
        return m.reply(formatBox(' ⚠️  𝒮𝓉𝒶𝓉𝓈 𝒢𝓇𝓊𝓅𝓅𝑜', [
            'Questo comando funziona solo nei gruppi.'
        ]))
    }

    const data = resetIfNeeded(loadData())
    saveData(data)

    const mode = (args[0] || 'giorno').toLowerCase()
    const groupId = m.chat

    let title = ' 📈  𝒮𝓉𝒶𝓉𝓈 𝒢𝒾𝑜𝓇𝓃𝑜'
    let total = Number(data.dailyGroups[groupId] || 0)
    let resetInfo = `Reset tra: *${formatTimeRemaining(getNextRomeMidnightMs() - Date.now())}*`

    if (['settimana', 'weekly', 'settimanale'].includes(mode)) {
        title = ' 📈  𝒮𝓉𝒶𝓉𝓈 𝒮𝑒𝓉𝓉𝒾𝓂𝒶𝓃𝒶'
        total = Number(data.weeklyGroups[groupId] || 0)
        resetInfo = `Reset tra: *${formatTimeRemaining(getNextRomeMondayMs() - Date.now())}*`
    } else if (['anno', 'annuale', 'year', 'yearly'].includes(mode)) {
        title = ' 📈  𝒮𝓉𝒶𝓉𝓈 𝒜𝓃𝓃𝑜'
        total = Number(data.yearlyGroups[groupId] || 0)
        resetInfo = `Reset tra: *${formatTimeRemaining(getNextRomeYearMs() - Date.now())}*`
    } else if (['sempre', 'all', 'alltime'].includes(mode)) {
        title = ' 📈  𝒮𝓉𝒶𝓉𝓈 𝒜𝓁𝓁 𝒯𝒾𝓂𝑒'
        total = Number(data.alltimeGroups[groupId] || 0)
        resetInfo = 'Periodo: *da sempre*'
    } else if (!['giorno', 'daily', 'giornaliero'].includes(mode)) {
        return m.reply(formatBox(' ℹ️  𝒮𝓉𝒶𝓉𝓈 𝒢𝓇𝓊𝓅𝓅𝑜', [
            `Uso: *${usedPrefix}statsgp [giorno|settimana|anno|sempre]*`
        ]))
    }

    const text = formatBox(title, [
        `Messaggi totali nel gruppo: *${total.toLocaleString('it-IT')}*`,
        `Giorno stats: *${data.meta.dailyKey}*`,
        `Settimana stats da: *${data.meta.weeklyKey}*`,
        `Anno stats: *${data.meta.yearlyKey}*`,
        resetInfo
    ])

    await m.reply(text)
}

handler.all = async function (m) {
    try {
        if (!m?.isGroup) return
        if (!m.chat || !m.sender) return
        if (m.sender === this.user?.jid) return

        const isProtocol = m.key?.remoteJid === 'status@broadcast'
        if (isProtocol) return

        const text = typeof m.text === 'string' ? m.text.trim() : ''
        const hasRealPayload = !!(
            text ||
            m.message?.conversation ||
            m.message?.extendedTextMessage ||
            m.message?.imageMessage ||
            m.message?.videoMessage ||
            m.message?.documentMessage ||
            m.message?.audioMessage ||
            m.message?.stickerMessage ||
            m.message?.buttonsResponseMessage ||
            m.message?.templateButtonReplyMessage ||
            m.message?.interactiveResponseMessage ||
            m.message?.listResponseMessage
        )

        if (!hasRealPayload) return
        if (text.startsWith('.') || text.startsWith('!') || text.startsWith('/') || text.startsWith('#')) return

        countGroupMessage(m.chat)
    } catch (err) {
        console.error('[STATSGP] handler.all error:', err)
    }
}

handler.help = ['statsgp', 'statsgp giorno', 'statsgp settimana', 'statsgp anno', 'statsgp sempre']
handler.tags = ['group']
handler.command = /^(statsgp)$/i
handler.group = true

export default handler