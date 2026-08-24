import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const userId = m.sender
  const groupId = m.chat
  const mention = m.mentionedJid?.[0] || m.quoted?.sender

  if (!mention) return

  const percent = Math.floor(Math.random() * 101)
  const testo = `@${userId.split('@')[0]} odia @${mention.split('@')[0]} al ${percent}%`
  const videoPath = path.join(process.cwd(), 'media', 'gif', 'odio.mp4')

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

handler.help = ['odio @utente']
handler.tags = ['fun']
handler.command = /^odio$/i
handler.group = true

export default handler