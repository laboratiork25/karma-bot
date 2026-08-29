let handler = async (m, { conn, command }) => {
    const userId = m.sender
    const groupId = m.isGroup ? m.chat : null
    const nomeDelBot = global.db.data.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'

    const isOpen = /^(aperto|open)$/i.test(command)

    try {
        await conn.groupSettingUpdate(m.chat, isOpen ? 'not_announcement' : 'announcement')

        await conn.sendMessage(m.chat, {
            text: isOpen ? global.t('groupOpen', userId, groupId) : global.t('groupClose', userId, groupId),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363259442839354@newsletter',
                    serverMessageId: '',
                    newsletterName: nomeDelBot
                }
            }
        }, { quoted: m })
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝒶𝓅𝑒𝓇𝓉𝓊𝓇𝒶/𝒸𝒽𝒾𝓊𝓈𝓊𝓇𝒶 𝑔𝓇𝓊𝓅𝓅𝑜:', e.message)
        await m.reply('*𝐸𝓇𝓇𝑜𝓇𝑒:* 𝓃𝑜𝓃 𝓇𝒾𝑒𝓈𝒸𝑜 𝒶 𝓂𝑜𝒹𝒾𝒻𝒾𝒸𝒶𝓇𝑒 𝓁𝑒 𝒾𝓂𝓊𝓈𝓉𝒶𝓉𝑜 𝓇𝓊𝓊𝓅𝑜.')
    }
}

handler.help = [
    'open',
    'close',
    'aperto',
    'chiuso'
]
handler.tags = ['group']
handler.command = /^(aperto|chiuso|open|close)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler