let handler = async (m, { isOwner, isAdmin, conn, args, participants }) => {
    if (!(isAdmin || isOwner)) return

    const nomeDelBot = global.db.data.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'
    const message = args.join(' ').trim() || 'Nessun messaggio.'
    const mentions = participants.map(p => p.id)

    let tagText = `╭═━ 〖  📢  𝒯𝒶𝑔 𝒜𝓁𝓁 〗═━⪩
│❍ 𝐵𝑜𝓉: ${nomeDelBot}
│❍ 𝑀𝑒𝓈𝓈𝒶𝑔𝑔𝒾𝑜: ${message}
│❍ 𝑀𝑒𝓂𝒷𝓇𝒾: ${participants.length}
╰━━━━━━━━━⪩

`

    for (const user of participants) {
        tagText += `│❍ @${user.id.split('@')[0]}\n`
    }

    await conn.sendMessage(m.chat, {
        text: tagText.trim(),
        mentions,
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
}

handler.help = ['tagall <messaggio>']
handler.tags = ['group']
handler.command = /^(tagall|everyone)$/i
handler.group = true
handler.admin = true
handler.moderator = true

export default handler