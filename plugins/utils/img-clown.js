import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import os from 'os'
import path from 'path'

let handler = async (m, { conn }) => {
  const userId = m.sender
  const groupId = m.chat

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
        mimeType = 'image/jpeg'
      } catch {
        return m.reply('❌ Questo utente non ha una foto profilo disponibile.')
      }
    } else if (!m.quoted && m.mentionedJid && m.mentionedJid.length > 0) {
      let who = m.mentionedJid[0]
      try {
        let url = await conn.profilePictureUrl(who, 'image')
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        mediaBuffer = Buffer.from(res.data)
        mimeType = 'image/jpeg'
      } catch {
        return m.reply('❌ Non riesco a prendere la foto profilo dell’utente menzionato.')
      }
    } else if (!m.quoted && (!mimeType || !mimeType.startsWith('image/'))) {
      let who = m.sender
      try {
        let url = await conn.profilePictureUrl(who, 'image')
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        mediaBuffer = Buffer.from(res.data)
        mimeType = 'image/jpeg'
      } catch {
        return m.reply('❌ Non riesco a prendere la tua foto profilo.')
      }
    } else {
      mediaBuffer = await quotedMsg.download()
    }

    let extension = ''
    if (mimeType.includes('image/jpeg')) extension = '.jpg'
    else if (mimeType.includes('image/png')) extension = '.png'
    else if (mimeType.includes('image/webp')) extension = '.webp'
    else return m.reply('❌ Formato immagine non supportato. Usa JPG o PNG.')

    const tempFilePath = path.join(os.tmpdir(), `clown_${Date.now()}${extension}`)
    fs.writeFileSync(tempFilePath, mediaBuffer)

    const form = new FormData()
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`)
    form.append('reqtype', 'fileupload')

    const uploadResponse = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    const imageUrl = String(uploadResponse.data || '').trim()

    fs.unlinkSync(tempFilePath)

    if (!imageUrl || !imageUrl.startsWith('http')) {
      throw new Error('Upload immagine fallito')
    }

    const apiUrl = `https://api.popcat.xyz/v2/clown?image=${encodeURIComponent(imageUrl)}`
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })

    if (!response || !response.data) {
      return m.reply('❌ Errore nella risposta dell’API clown.')
    }

    const imageBuffer = Buffer.from(response.data)

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: '🤡 Ecco la tua clown edit'
    }, { quoted: m })

  } catch (error) {
    console.error('Clown Error:', error)
    m.reply(`❌ Errore: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  }
}

handler.help = ['clown [@user / reply foto]']
handler.tags = ['fun']
handler.command = /^clown$/i

export default handler