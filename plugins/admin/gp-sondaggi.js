// Codice di gp-sondaggio.js

// sondaggio by Riad

const handler = async (m, { conn, text }) => {

    if (!text) {
        return m.reply(
`⚠️ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨:
.sondaggio mare-montagna-sesso a casa`
        )
    }

    const opzioni = text
        .split('-')
        .map(v => v.trim())
        .filter(v => v.length > 0)

    if (opzioni.length < 2)
        return m.reply('❌ Devi inserire almeno 2 opzioni.')

    if (opzioni.length > 12)
        return m.reply('❌ Massimo 12 opzioni consentite nel sondaggio.')

    await conn.sendMessage(m.chat, {
        poll: {
            name: '𝐒𝐜𝐞𝐠𝐥𝐢 𝟏 𝐭𝐫𝐚 𝐥𝐞 𝐬𝐞𝐠𝐮𝐞𝐧𝐭𝐢 𝐨𝐩𝐳𝐢𝐨𝐧𝐢:',
            values: opzioni,
            selectableCount: 1
        }
    })
}

handler.command = ['poll', 'sondaggio', 'sondaggi']
handler.admin = true;
handler.moderator = true;
export default handler