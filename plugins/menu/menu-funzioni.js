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
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: ' 🏠  Menu principale' }, type: 1 },
                { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: ' 👥  Gruppo' }, type: 1 },
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: ' 🛡️  Admin/Mod' }, type: 1 },
                { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ' 👑  Owner' }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }, { quoted: message })
    } catch (e) {
        console.error('Errore invio menu:', e.message)
        await message.reply(menuText)
    }
}

handler.help = ['menufunzioni', 'funzioni', 'menuall']
handler.tags = ['menu']
handler.command = /^(menufunzioni|funzioni|menuall)$/i

export default handler

function generateMenuText(prefix, userId, groupId, uptime) {
    const botName = global.db.data.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ'

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│❍ ${c.trim()}`).join('\n')
        return `╭═━ 〖 ${title} 〗
${commandLines}
╰━━━━━━━━━⪩`
    }

    const sections = [
        createSection(' 🎵  Musica & Audio', `
🎵 *${prefix}play*
🎥 *${prefix}playlist*
🔎 *${prefix}ytsearch*
🔊 *${prefix}tomp3*
🎧 *${prefix}cur*`),

        createSection(' ℹ️  Info & Utility', `
🌍 *${prefix}meteo*
ℹ️ *${prefix}info*
🛡️ *${prefix}offusca*`),

        createSection(' 🛠️  Editor & Sticker', `
🛠️ *${prefix}sticker*
🟩 *${prefix}brat*
🧠 *${prefix}clown*
🚨 *${prefix}attenzione*
🇺🇸 *${prefix}biden*
✍️ *${prefix}caption*
📝 *${prefix}scritta*
🎭 *${prefix}drake*
🔫 *${prefix}pistola*
🍬 *${prefix}mnm*
🤲 *${prefix}accarezza*
🐻 *${prefix}pooh*
💞 *${prefix}ship*
🖼️ *${prefix}toimg*
🎴 *${prefix}hornycard*
🎯 *${prefix}wanted*
📱 *${prefix}nokia*
🚔 *${prefix}carcere*`),

        createSection(' 🎨  Effetti Canvas', `
🖼️ *${prefix}invert*
🌫️ *${prefix}blur*
🧊 *${prefix}pixelate*
⭕ *${prefix}circle*
🏳️‍🌈 *${prefix}lgbt*
☀️ *${prefix}brightness*
🎚️ *${prefix}contrast*
🎞️ *${prefix}posterize*
🌗 *${prefix}solarize*
🎭 *${prefix}duotone*
📺 *${prefix}glitch*
📡 *${prefix}scanline*
🪞 *${prefix}mirror*
🔄 *${prefix}flip*
📼 *${prefix}vintage*
✨ *${prefix}sharpen*
🧩 *${prefix}edge*`),

        createSection(' 🎮  Giochi & Casino', `
🎮 *${prefix}tris*
🎲 *${prefix}dado*
🎰 *${prefix}slot*
💰 *${prefix}blackjack*
🔫 *${prefix}roulette*
🪙 *${prefix}moneta*
📈 *${prefix}scf*
🏳️ *${prefix}bandiera*
🎶 *${prefix}indovinacanzone*`),

        createSection(' 💰  Economia', `
💰 *${prefix}portafoglio*
🏦 *${prefix}banca*
💸 *${prefix}daily*
🏆 *${prefix}topuser*
🏆 *${prefix}topgruppi*
💳 *${prefix}donauc*
🤑 *${prefix}ruba*
⛏️ *${prefix}mina*
📊 *${prefix}xp*
♾️ *${prefix}donaxp*
🎯 *${prefix}rubaxp*`),

        createSection(' 💕  Social', `
💌 *${prefix}amore*
💋 *${prefix}bacia*
😡 *${prefix}odio*
🤚 *${prefix}schiaffo*
☠️ *${prefix}minaccia*
🔥 *${prefix}zizzania*
🖕 *${prefix}insulta*
👥 *${prefix}amicizia*`),

        createSection(' ⚡  Aura System', `
🕶️ *${prefix}flex*
💘 *${prefix}seduci*
👨‍🍳 *${prefix}cook*
💥 *${prefix}crashout*
🎯 *${prefix}lockin*
🍯 *${prefix}glaze*
🎲 *${prefix}gamble*
🪙 *${prefix}auraflip*
📅 *${prefix}auradaily*
🕵️ *${prefix}stealaura* @user
⚖️ *${prefix}matchaura* @user
🫧 *${prefix}myaura*
👤 *${prefix}aura* @user
🏆 *${prefix}topaura*`),

        createSection(' ⚔️  RPG & Avventura', `
🤺 *${prefix}duello*
🗡️ *${prefix}mostro*
🗺️ *${prefix}esplora*
🎒 *${prefix}zaino*
🏪 *${prefix}vendizaino*
🎣 *${prefix}pesca*
🐟 *${prefix}vendipesce*`)
    ]

    return `·˚*୨୧꒰꒱୨୧*˚· *${botName}* ·˚*୨୧꒰꒱୨୧*˚·
Tempo attivo: ${clockString(uptime)}

${sections.join('\n\n')}`.trim()
}
