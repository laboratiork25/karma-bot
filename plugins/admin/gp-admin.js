import fs from 'fs'
import path from 'path'

const handler = async (m, { conn, participants, groupMetadata, args, isOwner, isAdmin }) => {
    const userId = m.sender
    const groupId = m.isGroup ? m.chat : null
    const cooldownInMilliseconds = 18 * 60 * 60 * 1000

    if (!isOwner && !isAdmin) {
        const lastUsed = handler.cooldowns.get(m.sender) || 0
        const now = Date.now()

        if (now - lastUsed < cooldownInMilliseconds) {
            const timeLeft = cooldownInMilliseconds - (now - lastUsed)
            const hours = Math.floor(timeLeft / (1000 * 60 * 60))
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
            const timeString = `${hours > 0 ? `${hours} ore, ` : ''}${minutes > 0 ? `${minutes} minuti e ` : ''}${seconds} secondi`
            await m.reply(global.t('adminsCooldown', userId, groupId, { time: timeString }))
            return
        }
        handler.cooldowns.set(m.sender, now)
    }

    if (!participants || !participants.length) {
        await m.reply('*𝐸𝓇𝓇𝑜𝓇𝑒:* 𝓃𝑜𝓃 𝓇𝒾𝑒𝓈𝒸𝑜 𝒶 𝓁𝑒𝑔𝑔𝑒𝓇𝑒 𝓁𝒶 𝓁𝒾𝓈𝓉𝒶 𝒶𝓂𝓂𝒾𝓃𝒾𝓈𝓉𝓇𝒶𝓉𝑜𝓇𝒾.')
        return
    }

    const adminGruppo = participants.filter(p => p.admin)
    if (!adminGruppo.length) {
        await m.reply('𝒩𝑒𝓈𝓈𝓊𝓃 𝒶𝒹𝓂𝒾𝓃 𝓉𝓇𝑜𝓋𝒶𝓉𝑜 𝒾𝓃 𝓆𝓊𝑒𝓈𝓉𝑜 𝑔𝓇𝓊𝓅𝓅𝑜.')
        return
    }

    const mentionList = adminGruppo.map(p => p.id)
    const messaggioUtente = args.join(' ') || global.t('adminsNoMessage', userId, groupId)

    const title = global.t('adminsTitle', userId, groupId)
    const messageLabel = global.t('adminsMessage', userId, groupId)
    const warning = global.t('adminsWarning', userId, groupId)

    const testo = `╭═━ 〖 👑 ${title} 〗═━⪩
${mentionList.map((jid, index) => `│❍ ${index + 1}. @${jid.split('@')[0]}`).join('\n')}
╰━━━━━━━━━⪩

*${messageLabel}:*
${messaggioUtente}

> ${warning}`.trim()

    const videoPath = path.join(process.cwd(), 'media', 'gif', 'admin.mp4')

    try {
        const videoBuffer = fs.readFileSync(videoPath)
        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            gifPlayback: true,
            mimetype: 'video/mp4',
            caption: testo,
            mentions: mentionList
        }, { quoted: m })
    } catch (e) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 𝒾𝓃𝓋𝒾𝑜 𝒢𝐼𝐹 𝒶𝒹𝓂𝒾𝓃:', e.message, '| path:', videoPath)
        await conn.sendMessage(m.chat, {
            text: testo,
            mentions: mentionList
        }, { quoted: m })
    }
}

handler.cooldowns = new Map()

handler.help = [
    'admins <text>',
    '@admins <text>',
    'admin <text>',
    'amministratori <text>'
]
handler.tags = ['group']
handler.command = /^(admins|@admins|admin|amministratori)$/i
handler.group = true
handler.cooldown = 18 * 60 * 60 * 1000

export default handler