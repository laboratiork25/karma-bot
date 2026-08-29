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
    const footerText = 'Scegli un menu'

    try {
        await conn.sendMessage(message.chat, {
            image: { url: imagePath },
            caption: menuText,
            footer: footerText,
            buttons: [
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: ' 🏠  Menu Principale' }, type: 1 },
                { buttonId: `${usedPrefix}menufunzioni`, buttonText: { displayText: ' ✨  Menu Funzioni' }, type: 1 },
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: ' 🛡️  Menu Admin/Mod' }, type: 1 },
                { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ' 👑  Menu Owner' }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }, { quoted: message })
    } catch (e) {
        console.error('Errore invio menu gruppo:', e.message)
        await message.reply(menuText)
    }
}

handler.help = ['menugruppo', 'gruppo', 'groupmenu', 'group']
handler.tags = ['menu']
handler.command = /^(gruppo|menugruppo|groupmenu|group)$/i

export default handler

function generateMenuText(prefix, userId, groupId, uptime) {
    const botName = global.db.data.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'
    const chat = global.db.data.chats[groupId] || {}

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│❍ ${c.trim()}`).join('\n')
        return `╭═━ 〖 ${title} 〗═━⪩
${commandLines}
╰━━━━━━━━━⪩`
    }

    const status = [
        `${chat.antiLink ? '✅' : '❌'} Antilink`,
        `${chat.antiLinkHard ? '✅' : '❌'} Antilinkhard`,
        `${chat.antitiktok ? '✅' : '❌'} AntiTiktok`,
        `${chat.antispam ? '✅' : '❌'} Antispam`,
        `${chat.antiTraba ? '✅' : '❌'} Antitrava`,
        `${chat.antimedia ? '✅' : '❌'} Antimedia`,
        `${chat.antibot ? '✅' : '❌'} Antibot`,
        `${chat.welcome ? '✅' : '❌'} Benvenuto`,
        `${chat.bye ? '❌' : '❌'} Addio`,
        `${chat.bestemmiometro ? '✅' : '❌'} Bestemmiometro`,
        `${chat.sologruppo ? '✅' : '❌'} Solo Gruppo`,
        `${chat.soloadmin ? '✅' : '❌'} Solo Admin`,
        `${chat.antiporno ? '✅' : '❌'} Antiporno`,
        `${chat.antiCall ? '✅' : '❌'} AntiCall`,
        `${chat.antivirus ? '✅' : '❌'} Antivirus`,
        `${chat.antivoip ? '✅' : '❌'} Antivoip`
    ].map(v => `│❍ ${v}`).join('\n')

    const sections = [
        createSection(' 👥  Comandi Gruppo', `
📜 *${prefix}regole*
🔗 *${prefix}linkgruppo*
🔳 *${prefix}linkqr*
📥 *${prefix}richieste*
👨‍💼 *${prefix}admins*
🛡️ *${prefix}listmod*`),
        `╭═━ 〖  🚨  Protezioni 〗═━⪩
│❍ *${prefix}attiva* [funzione]
│❍ *${prefix}disabilita* [funzione]
${status}
╰━━━━━━━━━⪩`
    ]

    return `╭═━ 〖  👥  ${botName} 〗═━⪩
│❍ *Name:* ${botName}
│❍ *Runtime:* ${clockString(uptime)}
╰━━━━━━━━━⪩

${sections.join('\n\n')}`.trim()
}
