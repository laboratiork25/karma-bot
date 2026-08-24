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
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: ' 🏠  Menu Principale' }, type: 1 },
                { buttonId: `${usedPrefix}menufunzioni`, buttonText: { displayText: ' ✨  Menu Funzioni' }, type: 1 },
                { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: ' 👥  Menu Gruppo' }, type: 1 },
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: ' 🛡️  Menu Admin/Mod' }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }, { quoted: message })
    } catch (e) {
        console.error('Errore invio menu owner:', e.message)
        await message.reply(menuText)
    }
}

handler.help = ['menuowner', 'ownermenu']
handler.tags = ['menu']
handler.command = /^(menuowner|ownermenu)$/i
handler.owner = true

export default handler

function generateMenuText(prefix, userId, groupId, uptime) {
    const botName = global.db.data.nomedelbot || '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄'

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│❍ ${c.trim()}`).join('\n')
        return `╭═━ 〖 ${title} 〗═━⪩
${commandLines}
╰━━━━━━━━━⪩`
    }

    const sections = [
        createSection('👑 Menu Owner', `
⚙️ *${prefix}setgruppi*
➕ *${prefix}addgruppi*
♻️ *${prefix}resetgruppi*
⛔ *${prefix}banuser* @user
✅ *${prefix}unbanuser* @user
🧹 *${prefix}cleanup*
📥 *${prefix}getfile* [plugin]
💾 *${prefix}save* [plugin]
🔗 *${prefix}join* [link]
🚪 *${prefix}out*
🔣 *${prefix}prefix* [?]
🧠 *${prefix}godmode*
🔄 *${prefix}restart*
⛔ *${prefix}shutdown*
⬆️ *${prefix}update*`)
    ]

    return `╭═━ 〖 👑 ${botName} 〗═━⪩
│❍ *Name:* ${botName}
│❍ *Runtime:* ${clockString(uptime)}
╰━━━━━━━━━⪩

${sections.join('\n\n')}`.trim()
}
