async function handler(m, { conn, isBotAdmin }) {
    const nomeDelBot = conn.user?.name || global.db?.data?.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'

    if (!isBotAdmin) {
        return await conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ⚠️  𝐿𝒾𝓃𝓀 𝒢𝓇𝓊𝓅𝓅𝑜 〗═━⪩
│❍ 𝐷𝑒𝓋𝑜 𝑒𝓈𝓈𝑒𝓇𝑒 𝒶𝒹𝓂𝒾𝓃 𝓅𝑒𝓇 𝓂𝑜𝓈𝓉𝓇𝒶𝓇𝑒 𝒾𝓁 𝓁𝒾𝓃𝓀.
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    try {
        const metadata = await conn.groupMetadata(m.chat)
        const inviteCode = await conn.groupInviteCode(m.chat)
        const groupLink = `https://chat.whatsapp.com/${inviteCode}`

        await conn.sendMessage(m.chat, {
            text: `╭═━ 〖  🔗  𝐿𝒾𝓃𝓀 𝒢𝓇𝓊𝓅𝓅𝑜 〗═━⪩
│❍ *${metadata.subject}*
│❍ 𝐶𝑜𝓅𝒾𝒶 𝒾𝓁 𝓁𝒾𝓃𝓀 𝒹𝒶𝓁 𝓉𝒶𝓈𝓉𝑜 𝓆𝓊𝒾 𝓈𝑜𝓉𝓉𝑜.
╰━━━━━━━━━⪩`,
            footer: '𝐿𝒾𝓃𝓀 𝓅𝓇𝑜𝓃𝓉𝑜',
            interactiveButtons: [
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: ' 📋  𝐶𝑜𝓅𝒾𝒶 𝐿𝒾𝓃𝓀',
                        copy_code: groupLink
                    })
                }
            ],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363413194245625@newsletter',
                    serverMessageId: '',
                    newsletterName: nomeDelBot
                }
            }
        }, { quoted: m })
    } catch (error) {
        console.error('Errore link gruppo:', error)
        await conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ❌  𝐿𝒾𝓃𝓀 𝒢𝓇𝓊𝓅𝓅𝑜 〗═━⪩
│❍ 𝒩𝑜𝓃 𝓈𝑜𝓃𝑜 𝓇𝒾𝓊𝓈𝒸𝒾𝓉𝑜 𝒶 𝓇𝑒𝒸𝓊𝓅𝑒𝓇𝒶𝓇𝑒 𝒾𝓁 𝓁𝒾𝓃𝓀.
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }
}

handler.help = [
    'linkgroup',
    'linkgruppo',
    'linkgrupp',
    'linkdelgruppo',
    'grouplink',
    'linkchat',
    'chatlink'
]
handler.tags = ['group']
handler.command = /^(linkgroup|link|linkgruppo|linkgrupp|linkdelgruppo|grouplink|linkchat|chatlink)$/i
handler.group = true
handler.botAdmin = true

export default handler