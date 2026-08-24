import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`✳️ Esempio:\n${usedPrefix + command} area riservata`)
    }

    const apiUrl = `https://api.popcat.xyz/v2/caution?text=${encodeURIComponent(text)}`
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
      caption: '⚠️ Attenzione'
    }, { quoted: m })

  } catch (error) {
    console.error('Caution Error:', error)
    m.reply(`❌ Errore: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  }
}

handler.help = ['caution <testo>', 'attenzione <testo>']
handler.tags = ['fun']
handler.command = /^(caution|attenzione)$/i

export default handler