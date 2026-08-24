let handler = async (m, { conn, usedPrefix }) => {
    const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender

    if (!(who in global.db.data.users)) {
        return m.reply('╭═━ 〖  🏛️  𝐵𝒶𝓃𝒸𝒶 〗═━⪩\n│❍ 𝒰𝓉𝑒𝓃𝓉𝑒 𝓃𝑜𝓃 𝓉𝓇𝑜𝓋𝒶𝓉𝑜.\n╰━━━━━━━━━⪩')
    }

    const user = global.db.data.users[who]
    user.bank = Number(user.bank) || 0

    const balance = formatNumber(user.bank)
    const isOwn = who === m.sender

    const message = isOwn
        ? `╭═━ 〖  🏛️  𝐵𝒶𝓃𝒸𝒶 〗═━⪩
│❍ 𝐼𝓁 𝓉𝓊𝑜 𝓈𝒶𝓁𝒹𝑜 𝒷𝒶𝓃𝒸𝒶𝓇𝒾𝑜 è: *${balance} UC*
╰━━━━━━━━━⪩`
        : `╭═━ 〖  🏛️  𝐵𝒶𝓃𝒸𝒶 〗═━⪩
│❍ 𝒮𝒶𝓁𝒹𝑜 𝒹𝒾 @${who.split('@')[0]}: *${balance} UC*
╰━━━━━━━━━⪩`

    const buttons = isOwn ? [
        {
            buttonId: `${usedPrefix}deposit`,
            buttonText: { displayText: ' 💰  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝒶' },
            type: 1
        },
        {
            buttonId: `${usedPrefix}withdraw`,
            buttonText: { displayText: ' 💸  𝒫𝓇𝑒𝓁𝑒𝓋𝒶' },
            type: 1
        },
        {
            buttonId: `${usedPrefix}transfer`,
            buttonText: { displayText: ' 🔁  𝒯𝓇𝒶𝓈𝒻𝑒𝓇𝒾𝓈𝒸𝒾' },
            type: 1
        }
    ] : []

    await conn.sendMessage(m.chat, {
        image: { url: 'media/cubank.jpg' },
        caption: message,
        buttons: buttons.length > 0 ? buttons : undefined,
        footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝐵𝒶𝓃𝓀',
        mentions: [who],
        contextInfo: {
            externalAdReply: {
                title: '🏛️ 𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝐵𝒶𝓃𝓀',
                body: `𝒮𝒶𝓁𝒹𝑜: ${balance} UC`,
                thumbnailUrl: 'https://i.ibb.co/bank-icon.png',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
        react: { text: '🏛️', key: m.key }
    })
}

handler.help = ['bank', 'banca']
handler.tags = ['economy']
handler.command = /^(bank|banca)$/i
handler.register = true

export default handler

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}