const AFK_NOTICE_COOLDOWN = 10000

global.afk = global.afk || {}
global.afkNotifyCooldown = global.afkNotifyCooldown || {}

function getJidUser(jid) {
    return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function formatDuration(ms) {
    if (!ms || ms < 1000) return 'pochi secondi'

    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const parts = []
    if (days) parts.push(`${days}g`)
    if (hours) parts.push(`${hours}h`)
    if (minutes) parts.push(`${minutes}m`)
    if (seconds && !days) parts.push(`${seconds}s`)

    return parts.join(' ')
}

function getAfkKey(chatId, userJid) {
    return `${chatId}:${userJid}`
}

function getMentionedJids(m) {
    const fromMessage = m?.msg?.contextInfo?.mentionedJid || []
    const fromSerialized = m?.mentionedJid || []
    return [...new Set([...fromMessage, ...fromSerialized].filter(Boolean))]
}

async function resolvePhoneJidFromLid(conn, chatId, jid) {
    if (!jid || typeof jid !== 'string') return jid

    const decoded = conn.decodeJid ? conn.decodeJid(jid) : jid
    const rawUser = getJidUser(decoded)

    try {
        const metadata = await conn.groupMetadata(chatId).catch(() => null)
        const participants = metadata?.participants || []
        const participant = participants.find(p => {
            const values = [p?.id, p?.jid, p?.lid, p?.phoneNumber, p?.pn, p?.participantPn]
            return values.some(value => {
                if (typeof value !== 'string') return false
                const valueDecoded = conn.decodeJid ? conn.decodeJid(value) : value
                return value === jid || valueDecoded === decoded || getJidUser(valueDecoded) === rawUser
            })
        })

        const candidates = [
            participant?.phoneNumber,
            participant?.pn,
            participant?.participantPn,
            participant?.id,
            participant?.jid,
            participant?.lid,
            jid
        ]

        for (const candidate of candidates) {
            if (typeof candidate !== 'string' || !candidate) continue
            let value = candidate

            try {
                if (value.endsWith('@lid') && typeof conn.getPNForLID === 'function') {
                    value = await conn.getPNForLID(value)
                } else if (value.endsWith('@lid') && typeof conn.getPNById === 'function') {
                    value = await conn.getPNById(value)
                }
            } catch {}

            const normalized = value.includes('@') ? value : `${value.replace(/\D/g, '')}@s.whatsapp.net`
            if (normalized.endsWith('@s.whatsapp.net')) return normalized
        }
    } catch {}

    const fallbackNumber = (decoded || jid).split('@')[0].split(':')[0].replace(/\D/g, '')
    return fallbackNumber ? `${fallbackNumber}@s.whatsapp.net` : (decoded || jid)
}

function canSendAfkNotice(chatId, sender, target) {
    const key = `${chatId}:${sender}:${target}`
    const now = Date.now()
    const last = global.afkNotifyCooldown[key] || 0
    if (now - last < AFK_NOTICE_COOLDOWN) return false
    global.afkNotifyCooldown[key] = now
    return true
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

const handler = async (m, { text, conn }) => {
    if (!m.isGroup) {
        return m.reply(formatBox(' ❌  𝒜𝐹𝒦', [
            'Questo comando si usa solo nei gruppi.'
        ]))
    }

    const reason = (text || '').trim() || 'Nessuna ragione specificata'
    const key = getAfkKey(m.chat, m.sender)

    global.afk[key] = {
        jid: m.sender,
        chat: m.chat,
        reason,
        since: Date.now(),
        name: m.pushName || m.name || getJidUser(m.sender)
    }

    await m.reply(formatBox(' 💤  𝒜𝐹𝒦', [
        `@${getJidUser(m.sender)} ora è AFK.`,
        `Motivo: ${reason}`
    ]), null, {
        mentions: [m.sender]
    })
}

handler.help = ['afk <ragione>']
handler.tags = ['gruppo']
handler.command = /^afk$/i
handler.group = true

handler.before = async function (m) {
    if (!m?.isGroup || !m?.sender) return false
    if (m.isBaileys) return false

    const selfKey = getAfkKey(m.chat, m.sender)
    const selfAfk = global.afk[selfKey]

    if (selfAfk) {
        delete global.afk[selfKey]
        await this.sendMessage(m.chat, {
            text: formatBox(' ✅  𝒜𝐹𝒦', [
                `@${getJidUser(m.sender)} non è più AFK.`,
                `Assente da: ${formatDuration(Date.now() - selfAfk.since)}`
            ]),
            mentions: [m.sender]
        }, { quoted: m }).catch(() => {})
        return false
    }

    const mentioned = getMentionedJids(m)
    if (!mentioned.length) return false

    for (const jid of mentioned) {
        if (!jid || jid === m.sender) continue

        const afkKey = getAfkKey(m.chat, jid)
        const afkData = global.afk[afkKey]
        if (!afkData) continue
        if (!canSendAfkNotice(m.chat, m.sender, jid)) continue

        const displayJid = await resolvePhoneJidFromLid(this, m.chat, jid)

        await this.sendMessage(m.chat, {
            text: formatBox(' 💤  𝒜𝐹𝒦', [
                `@${getJidUser(displayJid)} è AFK.`,
                `Motivo: ${afkData.reason}`,
                `Da: ${formatDuration(Date.now() - afkData.since)}`
            ]),
            mentions: [displayJid]
        }, { quoted: m }).catch(() => {})
    }

    return false
}

export default handler