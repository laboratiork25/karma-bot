import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text || !text.includes('|')) {
      return m.reply(
        `✳️ Esempio:\n${usedPrefix + command} studiare | copiare da chatgpt`
      )
    }

    let [text1, text2] = text.split('|').map(v => v.trim())

    if (!text1 || !text2) {
      return m.reply(
        `❌ Devi inserire due testi separati da |\n\n` +
        `Esempio:\n${usedPrefix + command} amongus | amogus`
      )
    }

    const apiUrl =
      `https://api.popcat.xyz/v2/drake?text1=${encodeURIComponent(text1)}` +
      `&text2=${encodeURIComponent(text2)}`

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
      caption: '🦉 Drake meme pronta'
    }, { quoted: m })

  } catch (error) {
    console.error('Drake Error:', error)
    m.reply(`❌ Errore: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  }
}

handler.help = ['drake <testo1> | <testo2>']
handler.tags = ['fun']
handler.command = /^drake$/i

export default handler