const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})|whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i
const urlRegex = /(https?:\/\/[^\s]+)/gi

function normalizeInvisible(text = '') {
    return String(text).replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, ' ').trim()
}

function extractRealMessageTextAndUrls(message) {
    if (!message || typeof message !== 'object') {
        return { text: '', urls: [] }
    }

    const parts = []

    const pushText = value => {
        if (typeof value !== 'string') return
        const clean = normalizeInvisible(value)
        if (clean) parts.push(clean)
    }

    pushText(message.conversation)
    pushText(message.extendedTextMessage?.text)
    pushText(message.imageMessage?.caption)
    pushText(message.videoMessage?.caption)
    pushText(message.documentMessage?.caption)
    pushText(message.buttonsResponseMessage?.selectedDisplayText)
    pushText(message.listResponseMessage?.title)
    pushText(message.listResponseMessage?.description)
    pushText(message.templateButtonReplyMessage?.selectedDisplayText)
    pushText(message.groupInviteMessage?.inviteCode)
    pushText(message.groupInviteMessage?.caption)
    pushText(message.groupInviteMessage?.groupName)

    const text = parts.join(' ').trim()
    const urls = [...new Set((text.match(urlRegex) || []).map(u => u.trim()))]

    return { text, urls }
}

function containsWhatsAppLink(text = '', urls = []) {
    linkRegex.lastIndex = 0
    if (linkRegex.test(text)) return true

    for (const url of urls) {
        linkRegex.lastIndex = 0
        if (linkRegex.test(url)) return true
    }

    return false
}

function findDetectedWhatsAppLink(text = '', urls = []) {
    for (const url of urls) {
        linkRegex.lastIndex = 0
        if (linkRegex.test(url)) return url
    }

    linkRegex.lastIndex = 0
    return text.match(linkRegex)?.[0] || null
}

async function getCurrentGroupLinkSafe(sock, chatId) {
    try {
        const inviteCode = await sock.groupInviteCode(chatId)
        if (!inviteCode) return null
        return `https://chat.whatsapp.com/${inviteCode}`
    } catch {
        return null
    }
}

function isCurrentGroupLink(currentGroupLink, normalizedText, extractedUrls) {
    if (!currentGroupLink) return false
    if (normalizedText.includes(currentGroupLink)) return true
    if (extractedUrls.includes(currentGroupLink)) return true
    return false
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

export async function before(m, { conn, isAdmin, isBotAdmin, setKickReason }) {
    if (m.isBaileys && m.fromMe) return true
    if (!m.isGroup) return false

    const chat = global.db.data.chats[m.chat] || {}
    const bot = global.db.data.settings[this.user.jid] || {}
    const delet = m.key.participant
    const bang = m.key.id
    const user = `@${m.sender.split('@')[0]}`

    if (!chat.antiLink) return false

    const unv = {
        key: {
            participants: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast',
            fromMe: false,
            id: 'Halo'
        },
        message: {
            contactMessage: {
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Cellulare\nEND:VCARD`
            }
        },
        participant: '0@s.whatsapp.net'
    }

    const { text: messageText, urls: extractedUrls } = extractRealMessageTextAndUrls(m.message || {})
    const normalizedText = normalizeInvisible(messageText)

    if (!containsWhatsAppLink(normalizedText, extractedUrls)) return true

    const currentGroupLink = await getCurrentGroupLinkSafe(this, m.chat)
    if (isCurrentGroupLink(currentGroupLink, normalizedText, extractedUrls)) return true
    if (isAdmin) return true

    if (!isBotAdmin) {
        await m.reply(formatBox(' 🚫  Antilink', [
            'Non posso intervenire.',
            'Devo essere admin del gruppo.'
        ]))
        return true
    }

    const detectedUrl = findDetectedWhatsAppLink(normalizedText, extractedUrls) || 'link WhatsApp rilevato'

    setKickReason?.(m.chat, m.sender, {
        type: 'antilink',
        reason: 'Link WhatsApp non consentito',
        details: `Contenuto rilevato: ${String(detectedUrl).slice(0, 500)}`,
        source: 'plugins/anti/antilink.js',
        messageId: m.key.id,
        rawText: normalizedText
    }, m.sender)

    await conn.sendMessage(m.chat, {
        text: formatBox(' 🚫  Antilink', [
            `Ciao ${user}`,
            'Qui i link WhatsApp non sono ammessi.',
            'Procedo con la rimozione.'
        ]),
        mentions: [m.sender]
    }, {
        quoted: unv,
        ephemeralExpiration: 24 * 60 * 100,
        disappearingMessagesInChat: 24 * 60 * 100
    })

    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: bang,
            participant: delet
        }
    }).catch(() => {})

    if (!bot.restrict) {
        await m.reply(formatBox(' ⚠️  Antilink', [
            'Link rilevato.',
            'Ma restrict non è attivo.'
        ]))
        return true
    }

    const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch(() => null)
    if (responseb?.[0]?.status === '404') return true

    return true
}