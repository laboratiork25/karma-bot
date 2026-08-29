import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function clockString(ms) {
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [d, h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const handler = async (message, { conn, usedPrefix }) => {
  const userId = message.sender
  const groupId = message.isGroup ? message.chat : null
  const uptime = process.uptime() * 1000
  const menuText = generateMenuText(usedPrefix, userId, groupId, uptime)
  const imagePath = path.join(__dirname, '../../media/principale.jpeg')
  const footerText = global.t?.('chooseMenu', userId, groupId) || 'Scegli un menu:'

  await conn.sendMessage(message.chat, {
    image: { url: imagePath },
    caption: menuText,
    footer: footerText,
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🏠 Menu Principale' }, type: 1 },
      { buttonId: `${usedPrefix}menufunzioni`, buttonText: { displayText: '✨ Menu Funzioni' }, type: 1 },
      { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: '👥 Menu Gruppo' }, type: 1 },
      { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: '👑 Menu Owner' }, type: 1 }
    ],
    viewOnce: true,
    headerType: 4
  }, { quoted: message })
}

handler.help = ['menuadmin', 'adminmenu', 'menumod', 'modmenu']
handler.tags = ['menu']
handler.command = /^(menuadmin|adminmenu|menumod|modmenu)$/i

export default handler

function generateMenuText(prefix, userId, groupId, uptime) {
  const vs = global.vs || '8.0'
  const botName = global.db.data.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'
  const createSection = (title, commands) => {
    const commandLines = commands.trim().split('\n').map(c => `│ ${c.trim()}`).join('\n')
    return `╭★ ${title} ★╮\n${commandLines}\n╰★────────────★╯`
  }

  const sections = [
    createSection('🛡️ ADMIN', `
⬆️ *${prefix}promuovi* @user
⬇️ *${prefix}retrocedi* @user
👢 *${prefix}kick* @user
🗑️ *${prefix}del/elimina* 
🗑️ *${prefix}del/elimina* (numero di msg che vuoi eliminare)
🔇 *${prefix}muta* @user
🔊 *${prefix}smuta* @user
⚠️ *${prefix}warn* @user
✅ *${prefix}unwarn* @user
📜 *${prefix}listawarn*
✏️ *${prefix}setname* [nome]
📢 *${prefix}hidetag* [testo]
📢 *${prefix}bigtag* [numero] [testo]
👥 *${prefix}tagall*
🔓 *${prefix}aperto*
🔒 *${prefix}chiuso*
📊 *${prefix}sondaggio*
🧹 *${prefix}inattivi*
🚫 *${prefix}banword* [parola]
✅ *${prefix}unbanword* [parola]
📚 *${prefix}listabanword*
🧑‍⚖️ *${prefix}modstats* — chi ha fatto più`),
    createSection('🛡️ MODERATORE', `
🗑️ *${prefix}del* / ${prefix}del (num)
📢 *${prefix}hidetag* [testo]
🗑️ *${prefix}del/elimina* 
🗑️ *${prefix}del/elimina* (numero di msg che vuoi eliminare)
👥 *${prefix}tagall*
🛡️ *${prefix}listmod*
⚠️ *${prefix}warn* @user
✅ *${prefix}unwarn* @user
📜 *${prefix}listawarn*
🧹 *${prefix}inattivi*
🚫 *${prefix}banword* [parola]
✅ *${prefix}unbanword* [parola]
📚 *${prefix}listabanword*
🧑‍⚖️ *${prefix}modstats* — chi ha fatto più`)
  ]

  return `
╭━ ƌɽɛɑƌ-ʙᴏᴛ-𐌱𐍉𐍄━╮
┃ 𖤓 *Name:* ${botName}
┃ 𖤓 *Runtime:* ${clockString(uptime)}
╰━━━━━━━━━━━━━╯

${sections.join('\n\n')}
`.trim()
}
