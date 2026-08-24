import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const userId = m.sender
  const groupId = m.chat
  const mention = m.mentionedJid?.[0] || m.quoted?.sender

  if (!mention) return

  const testo = `@${userId.split('@')[0]} ha baciato @${mention.split('@')[0]}`
  const videoPath = path.join(process.cwd(), 'media', 'gif', 'kiss.mp4')

  try {
    const videoBuffer = fs.readFileSync(videoPath)
    await conn.sendMessage(groupId, {
      video: videoBuffer,
      gifPlayback: true,
      mimetype: 'video/mp4',
      caption: testo,
      mentions: [mention, userId]
    }, { quoted: m })
  } catch {
    await conn.sendMessage(groupId, {
      text: testo,
      mentions: [mention, userId]
    }, { quoted: m })
  }
}

handler.help = ['bacia @utente', 'kiss @utente']
handler.tags = ['fun']
handler.command = /^(bacia|kiss)$/i
handler.group = true

export default handler