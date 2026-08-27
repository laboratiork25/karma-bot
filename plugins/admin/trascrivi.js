import axios from 'axios'
import FormData from 'form-data'

const CDN_UPLOAD = 'https://tmp.malvryx.dev/upload'

async function uploadToCDN(buffer, filename) {
  try {
    const form = new FormData()
    form.append('file', buffer, { filename: filename || 'audio.mp3' })
    form.append('type', 'permanent')
    const { data } = await axios.post(CDN_UPLOAD, form, {
      headers: form.getHeaders(),
      timeout: 30000
    })
    return data?.cdnUrl || data?.directUrl || null
  } catch (e) {
    console.error('Upload error:', e)
    return null
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let audioUrl = null

    const quoted = m.quoted || m
    const isAudio = quoted.mimetype && quoted.mimetype.startsWith('audio/')
    const isVideo = quoted.mimetype && quoted.mimetype.startsWith('video/')

    if (isAudio || isVideo) {
      await m.reply('⏳ Download e trascrizione in corso...')

      const media = await quoted.download()
      const ext = isVideo ? 'mp4' : 'mp3'
      const filename = `media_${Date.now()}.${ext}`

      audioUrl = await uploadToCDN(media, filename)

      if (!audioUrl) {
        return m.reply('❌ Upload audio/video fallito. Riprova.')
      }
    } else if (text && text.match(/^https?:\/\/[^\s]+$/)) {
      audioUrl = text.trim()
    }

    if (!audioUrl) {
      return m.reply(
        `🎤 *Trascrizione Audio*\n\nTrascrivi audio/video in testo usando l'AI.\n\n📝 *Utilizzo:*\n${usedPrefix + command} (rispondi ad audio/video)\n${usedPrefix + command} <url>\n\n📌 *Esempi:*\n${usedPrefix + command} (rispondi a messaggio vocale)\n${usedPrefix + command} https://youtu.be/LRVF8MjmvWU\n${usedPrefix + command} https://www.youtube.com/watch?v=VIDEO_ID\n\n⚡ *Powered by ChatUnity*`
      )
    }

    if (!isAudio && !isVideo) {
      await m.reply('⏳ Trascrizione in corso...')
    }

    const { data } = await axios.post(
      'https://api.chatunity.it/api/tools/transcribe',
      { url: audioUrl, language: 'it' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 120000
      }
    )

    if (!data.ok) {
      throw new Error(data.message || 'Transcription failed')
    }

    const transcription = data.transcript || 'Nessuna trascrizione disponibile.'

    await conn.sendMessage(
      m.chat,
      {
        text: `📝 *Trascrizione:*\n\n${transcription}`
      },
      { quoted: m }
    )
  } catch (e) {
    console.error('Transcribe error:', e)
    const errorMessage = e.response?.data?.message || e.message || 'Errore sconosciuto'
    await m.reply(`❌ Errore: ${errorMessage}`)
  }
}

handler.command = /^(transcribe|transcript|trascrivi)$/i
handler.help = ['transcribe <url>', 'transcribe (rispondi ad audio/video)']
handler.tags = ['tools']
handler.limit = 5

export default handler
