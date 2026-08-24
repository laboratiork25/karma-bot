import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let quotedMsg = m.quoted ? m.quoted : m
    let mimeType = (quotedMsg.msg || quotedMsg).mimetype || ''
    let mediaBuffer

    if (m.quoted && (!mimeType || !mimeType.startsWith('image/'))) {
      let who = m.quoted.sender || m.sender
      try {
        let url = await conn.profilePictureUrl(who, 'image')
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        mediaBuffer = Buffer.from(res.data)
      } catch {
        return m.reply('❌ Questo utente non ha una foto profilo disponibile.')
      }
    } else if (!m.quoted && m.mentionedJid && m.mentionedJid.length > 0) {
      let who = m.mentionedJid[0]
      try {
        let url = await conn.profilePictureUrl(who, 'image')
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        mediaBuffer = Buffer.from(res.data)
      } catch {
        return m.reply('❌ Non riesco a prendere la foto profilo dell’utente menzionato.')
      }
    } else if (!m.quoted && (!mimeType || !mimeType.startsWith('image/'))) {
      let who = m.sender
      try {
        let url = await conn.profilePictureUrl(who, 'image')
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        mediaBuffer = Buffer.from(res.data)
      } catch {
        return m.reply(
          `✳️ Uso:\n` +
          `${usedPrefix + command}\n` +
          `oppure rispondi a una foto con ${usedPrefix + command}\n` +
          `oppure ${usedPrefix + command} @utente`
        )
      }
    } else {
      mediaBuffer = await quotedMsg.download()
    }

    const normalizedJpeg = await sharp(mediaBuffer)
      .rotate()
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer()

    const tempFilePath = path.join(os.tmpdir(), `mnm_${Date.now()}.jpg`)
    fs.writeFileSync(tempFilePath, normalizedJpeg)

    const form = new FormData()
    form.append('fileToUpload', fs.createReadStream(tempFilePath), {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    })
    form.append('reqtype', 'fileupload')

    const uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    fs.unlinkSync(tempFilePath)

    const imageUrl = String(uploadResponse.data || '').trim()
    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('Upload immagine fallito')
    }

    const apiUrl = `https://api.popcat.xyz/v2/mnm?image=${encodeURIComponent(imageUrl)}`
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      validateStatus: () => true
    })

    const contentType = String(response.headers['content-type'] || '').toLowerCase()
    const rawBuffer = Buffer.from(response.data)

    if (!contentType.startsWith('image/')) {
      const body = rawBuffer.toString('utf8').slice(0, 300)
      throw new Error(`Risposta API non valida: ${body}`)
    }

    await conn.sendMessage(m.chat, {
      image: rawBuffer,
      mimetype: contentType,
      caption: '🍫 M&M edit pronta'
    }, { quoted: m })

  } catch (error) {
    console.error('MNM Error:', error)
    m.reply(`❌ Errore: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  }
}

handler.help = ['mnm', 'mms']
handler.tags = ['fun']
handler.command = /^(mnm|mms|m&m)$/i

export default handler