const handler = async (m, { conn, text, participants }) => {
    try {
        const users = [...new Set(participants.map(u => conn.decodeJid(u.id)).filter(Boolean))]
        const quoted = m.quoted

        if (!users.length) {
            return m.reply('*𝐸𝓇𝓇𝑜𝓇𝑒:* non riesco a leggere i membri del gruppo.')
        }

        if (!quoted && !text?.trim()) {
            return m.reply('❌ *𝒮𝒸𝓇𝒾𝓋𝒾 𝓊𝓃 𝓉𝑒𝓈𝓉𝑜 𝑜 𝓇𝒾𝓈𝓅𝑜𝓃𝒹𝒾 𝒶 𝓊𝓃 𝓂𝑒𝓈𝓈𝒶𝑔𝑔𝒾𝑜.*')
        }

        if (!quoted) {
            await conn.sendMessage(m.chat, {
                text: text.trim(),
                mentions: users
            }, { quoted: m })
            return
        }

        const type = quoted.mtype
        const caption = text?.trim() || quoted.text || quoted.caption || ''

        if (['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(type)) {
            const media = await quoted.download()
            if (!media) {
                return m.reply('❌ *Non riesco a scaricare il contenuto del messaggio risposto.*')
            }

            if (type === 'imageMessage') {
                await conn.sendMessage(m.chat, {
                    image: media,
                    caption,
                    mentions: users
                }, { quoted: m })
                return
            }

            if (type === 'videoMessage') {
                await conn.sendMessage(m.chat, {
                    video: media,
                    caption,
                    mentions: users
                }, { quoted: m })
                return
            }

            if (type === 'audioMessage') {
                await conn.sendMessage(m.chat, {
                    audio: media,
                    mimetype: quoted.mimetype || 'audio/mp4',
                    ptt: quoted.ptt || false,
                    mentions: users
                }, { quoted: m })
                return
            }

            if (type === 'documentMessage') {
                await conn.sendMessage(m.chat, {
                    document: media,
                    mimetype: quoted.mimetype || 'application/octet-stream',
                    fileName: quoted.fileName || 'file',
                    caption,
                    mentions: users
                }, { quoted: m })
                return
            }

            if (type === 'stickerMessage') {
                await conn.sendMessage(m.chat, {
                    sticker: media,
                    mentions: users
                }, { quoted: m })
                return
            }
        }

        await conn.sendMessage(m.chat, {
            text: caption,
            mentions: users
        }, { quoted: m })
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 tag/hidetag:', e)
        m.reply(global.errore || '❌ *Si è verificato un errore.*')
    }
}

handler.help = [
    'hidetag',
    'totag',
    'tag',
    'menzione',
    'menziona',
    'mention',
    'tagall'
]
handler.tags = ['gruppo']
handler.command = /^(\.?hidetag|totag|tag|menzione|menziona|mention|tagall)$/i
handler.admin = false
handler.moderator = true
handler.group = true

export default handler