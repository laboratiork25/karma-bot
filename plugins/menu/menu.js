import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function clockString(ms) {
    const d = Math.floor(ms / 86400000)
    const h = Math.floor(ms / 3600000) % 24
    const m = Math.floor(ms / 60000) % 60
    const s = Math.floor(ms / 1000) % 60
    return [d, h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const handler = async (message, { conn, usedPrefix }) => {
    const userId = message.sender
    const groupId = message.isGroup ? message.chat : null
    const uptime = process.uptime() * 1000
    const menuText = generateMenuText(usedPrefix, userId, groupId, uptime)
    const imagePath = path.join(__dirname, '../../media/principale.jpeg')
    const footerText = global.t?.('chooseMenu', userId, groupId) || 'Scegli un menu'

    try {
        await conn.sendMessage(message.chat, {
            image: { url: imagePath },
            caption: menuText,
            footer: footerText,
            buttons: [
                { buttonId: `${usedPrefix}menufunzioni`, buttonText: { displayText: ' ✨  𝐹𝓊𝓃𝓏𝒾𝑜𝓃𝒾' }, type: 1 },
                { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: ' 👥  𝒢𝓇𝓊𝓅𝓅𝑜' }, type: 1 },
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: ' 🛡️  𝒜𝒹𝓂𝒾𝓃/𝑀𝑜𝒹' }, type: 1 },
                { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ' 👑  𝒪𝓌𝓃𝑒𝓇' }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }, { quoted: message })
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝒾𝓃𝓋𝒾𝑜 𝓂𝑒𝓃𝓊:', e.message)
        await message.reply(menuText)
    }
}

handler.help = ['menu', 'menup', 'home', 'start']
handler.tags = ['menu']
handler.command = /^(menu|menup|home|start)$/i

export default handler

function generateMenuText(prefix, userId, groupId, uptime) {
    const botName = global.db.data.nomedelbot || '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄'

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│❍ ${c.trim()}`).join('\n')
        return `╭═━ 〖 ${title} 〗
${commandLines}
╰━━━━━━━━━⪩`
    }

    const sections = [
        createSection(' ⚡  𝒜𝒸𝒸𝑒𝓈𝓈𝑜 𝓇𝒶𝓅𝒾𝒹𝑜', `
💤 *${prefix}afk*
🚀 *${prefix}ping*
🤖 *${prefix}ia*
👑 *${prefix}top*
📝 *${prefix}segnala*
💡 *${prefix}suggerisci*
👑 *${prefix}creatore*
👑 *${prefix}owner*
`)
    ]

    return `·˚*୨୧꒰*˚· *${botName}* ·˚*꒱୨୧*˚·
𖤓 *𝒯𝑒𝓂𝓅𝑜 𝒶𝓉𝓉𝒾𝓋𝑜:* ${clockString(uptime)}

${sections.join('\n\n')}`.trim()
}