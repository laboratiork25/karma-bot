import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const userId = m.sender
  const groupId = m.chat
  const mention = m.mentionedJid?.[0] || m.quoted?.sender

  if (!mention) return

  const testo = `@${userId.split('@')[0]} ha schiaffeggiato @${mention.split('@')[0]}`
  const videoPath = path.join(process.cwd(), 'media', 'gif', 'schiaffo.mp4')

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

handler.help = ['schiaffo @utente', 'sberla @utente']
handler.tags = ['fun']
handler.command = /^(schiaffo|sberla|schiaffo|schiaffeggia)$/i
handler.group = true

export default handler