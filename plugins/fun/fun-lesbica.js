let handler = async (m, { conn }) => {
    const userId = m.sender
    const groupId = m.chat

    const who = m.quoted
        ? m.quoted.sender
        : m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.sender

    const number = who.split('@')[0]
    const percent = Math.floor(Math.random() * 101)

    const text = `🏳️‍🌈 @${number} è lesbica al *${percent}%*`

    await conn.sendMessage(
        m.chat,
        {
            text,
            mentions: [who]
        },
        { quoted: m }
    )
}

handler.help = ['lesbica @utente']
handler.tags = ['fun']
handler.command = /^(lesbica)$/i

export default handler
