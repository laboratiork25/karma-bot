import { execSync } from 'child_process'

const sendForwarded = (conn, chat, text, botName, quoted) => conn.sendMessage(chat, {
    text,
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: botName
        }
    }
}, { quoted })

let handler = async (m, { conn, text }) => {
    const nomeDelBot = conn.user?.name || global.db?.data?.nomedelbot || '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄'

    try {
        await sendForwarded(conn, m.chat, '⏳ 𝒜𝑔𝑔𝒾𝑜𝓇𝓃𝒶𝓂𝑒𝓃𝓉𝑜 𝒾𝓃 𝒸𝑜𝓇𝓈𝑜, 𝒶𝓉𝓉𝑒𝓃𝒹𝒾 𝓊𝓃 𝓁𝒶𝓉𝓉𝑜.', nomeDelBot, m)

        const gitCommand = 'git pull' + (m.fromMe && text ? ' ' + text : '')
        const stdout = execSync(gitCommand, { encoding: 'utf8' })
        const output = stdout.trim()

        const isUpToDate = /already up[- ]to[- ]date/i.test(output)

        await sendForwarded(
            conn,
            m.chat,
            isUpToDate
                ? '✅ 𝒮𝑒𝒾 𝑔𝒾𝒶̀ 𝒶𝑔𝑔𝒾𝑜𝓇𝓃𝒶𝓉𝑜 𝒶𝓁𝓁\'𝓊𝓁𝓉𝒾𝓂𝒶 𝓋𝑒𝓇𝓈𝒾𝑜𝓃𝑒.'
                : `✅ *𝒜𝑔𝑔𝒾𝑜𝓇𝓃𝒶𝓂𝑒𝓃𝓉𝑜 𝒸𝑜𝓂𝓅𝓁𝑒𝓉𝒶𝓉𝑜*\n\n\`${output}\``,
            nomeDelBot,
            m
        )
    } catch (error) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝒶𝑔𝑔𝒾𝑜𝓇𝓃𝒶𝓂𝑒𝓃𝓉𝑜 𝒷𝑜𝓉:', error.message)
        await sendForwarded(conn, m.chat, `❌ *𝒜𝑔𝑔𝒾𝑜𝓇𝓃𝒶𝓂𝑒𝓃𝓉𝑜 𝒻𝒶𝓁𝓁𝒾𝓉𝑜*\n\n\`${error.message}\``, nomeDelBot, m)
    }
}

handler.help = ['aggiornabot', 'update']
handler.tags = ['owner']
handler.command = /^(aggiorna|update|aggiornabot)$/i
handler.rowner = true

export default handler