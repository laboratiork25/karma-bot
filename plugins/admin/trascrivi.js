import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text || !text.match(/^https?:\/\/[^\s]+$/)) {
      return m.reply(
        `🎤 *Trascrizione Audio*\n\nTrascrivi audio/video in testo usando l'AI.\n\n📝 *Utilizzo:*\n${usedPrefix + command} <url>\n\n📌 *Esempi:*\n${usedPrefix + command} https://youtu.be/LRVF8MjmvWU\n${usedPrefix + command} https://www.youtube.com/watch?v=VIDEO_ID\n\n*Powered by ChatUnity API*`
      )
    }

    const url = text.trim()

    await m.reply('⏳ Trascrizione in corso...')

    const { data } = await axios.post(
      'https://api.chatunity.it/api/tools/transcribe',
      { url, language: 'it' },
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
handler.help = ['transcribe <url>']
handler.tags = ['tools']
handler.limit = 5

export default handler
