let userSpamCounters = {}

const STICKER_LIMIT = 6
const PHOTO_VIDEO_LIMIT = 13
const RESET_TIMEOUT = 5000

const formatAntiSpamMessage = (title, body) => `╭═━ 〖 🚨 ${title} 〗═━⪩
│❍ ${body.join('\n│❍ ')}
╰━━━━━━━━━⪩`

export async function before(m, { isAdmin, isBotAdmin, conn, setKickReason }) {
    if (m.isBaileys && m.fromMe) return true
    if (!m.isGroup) return false

    const bot = global.db.data.settings[this.user.jid] || {}
    const sender = m.sender
    const chat = m.chat

    if (!userSpamCounters[chat]) userSpamCounters[chat] = {}
    if (!userSpamCounters[chat][sender]) {
        userSpamCounters[chat][sender] = {
            stickerCount: 0,
            photoVideoCount: 0,
            messageIds: [],
            lastMessageTime: 0,
            timer: null
        }
    }

    const counter = userSpamCounters[chat][sender]
    const currentTime = Date.now()
    const isSticker = !!m.message?.stickerMessage
    const isPhotoOrVideo = !!(m.message?.imageMessage || m.message?.videoMessage)

    const resetCounter = () => {
        if (counter.timer) clearTimeout(counter.timer)
        delete userSpamCounters[chat][sender]
    }

    const scheduleReset = () => {
        if (counter.timer) clearTimeout(counter.timer)
        counter.timer = setTimeout(() => {
            delete userSpamCounters[chat]?.[sender]
        }, RESET_TIMEOUT)
    }

    const detailsText = () =>
        `Sticker: ${counter.stickerCount}, Foto/video: ${counter.photoVideoCount}, Finestra: ${RESET_TIMEOUT / 1000}s`

    if (!isSticker && !isPhotoOrVideo) {
        if (
            currentTime - counter.lastMessageTime > RESET_TIMEOUT &&
            (counter.stickerCount > 0 || counter.photoVideoCount > 0)
        ) {
            resetCounter()
        }
        return true
    }

    if (isSticker) counter.stickerCount++
    if (isPhotoOrVideo) counter.photoVideoCount++

    counter.messageIds.push(m.key.id)
    counter.lastMessageTime = currentTime

    const isStickerSpam = counter.stickerCount >= STICKER_LIMIT
    const isPhotoVideoSpam = counter.photoVideoCount >= PHOTO_VIDEO_LIMIT

    if (!isStickerSpam && !isPhotoVideoSpam) {
        scheduleReset()
        return true
    }

    if (!isBotAdmin) {
        await conn.sendMessage(chat, {
            text: formatAntiSpamMessage('𝒜𝓃𝓉𝒾𝓈𝓅𝒶𝓂', [
                'Spam rilevato.',
                'Devo essere admin per intervenire.'
            ])
        }).catch(() => {})
        scheduleReset()
        return true
    }

    if (!bot.restrict) {
        await conn.sendMessage(chat, {
            text: formatAntiSpamMessage('𝒜𝓃𝓉𝒾𝓈𝓅𝒶𝓂', [
                'Spam rilevato.',
                'La modalità restrict non è attiva.'
            ])
        }).catch(() => {})
        scheduleReset()
        return true
    }

    try {
        await conn.groupSettingUpdate(chat, 'announcement')

        if (!isAdmin) {
            setKickReason?.(chat, sender, {
                type: 'spam',
                reason: isStickerSpam ? 'Flood di sticker' : 'Flood di foto/video',
                details: detailsText(),
                source: 'plugins/anti/antispam.js',
                messageId: m.key.id,
                extra: {
                    stickerCount: counter.stickerCount,
                    photoVideoCount: counter.photoVideoCount,
                    totalMessagesFlagged: counter.messageIds.length,
                    resetTimeout: RESET_TIMEOUT
                }
            }, conn.user.jid)

            await conn.sendMessage(chat, {
                text: formatAntiSpamMessage('𝒜𝓃𝓉𝒾𝓈𝓅𝒶𝓂', [
                    `Ciao @${sender.split('@')[0]}`,
                    isStickerSpam ? 'Troppi sticker inviati in pochi secondi.' : 'Troppi media inviati in pochi secondi.',
                    'Procedo con la rimozione.'
                ]),
                mentions: [sender]
            }).catch(() => {})

            await conn.groupParticipantsUpdate(chat, [sender], 'remove')
        }

        for (const messageId of counter.messageIds) {
            await conn.sendMessage(chat, {
                delete: {
                    remoteJid: chat,
                    fromMe: false,
                    id: messageId,
                    participant: m.key.participant || sender
                }
            }).catch(() => {})
        }

        await conn.groupSettingUpdate(chat, 'not_announcement')

        await conn.sendMessage(chat, {
            text: formatAntiSpamMessage('𝒜𝓃𝓉𝒾𝓈𝓅𝒶𝓂', [
                isStickerSpam ? 'Sticker rimossi.' : 'Media rimossi.',
                'Chat sistemata.'
            ])
        }).catch(() => {})

        resetCounter()
    } catch (error) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝑔𝑒𝓈𝓉𝒾𝑜𝓃𝑒 𝒶𝓃𝓉𝒾𝓈𝓅𝒶𝓂:', error)
        await conn.sendMessage(chat, {
            text: formatAntiSpamMessage('𝒜𝓃𝓉𝒾𝓈𝓅𝒶𝓂', [
                'Ho rilevato spam, ma non sono riuscito a completare l\'intervento.'
            ])
        }).catch(() => {})
        scheduleReset()
    }

    return true
}