import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const mentions = m.mentionedJid || []

    let user1
    let user2

    if (mentions.length >= 2) {
      user1 = mentions[0]
      user2 = mentions[1]
    } else if (mentions.length === 1) {
      user1 = m.sender
      user2 = mentions[0]
    } else if (m.quoted) {
      user1 = m.sender
      user2 = m.quoted.sender
    } else {
      return m.reply(
        `✳️ Uso:\n` +
        `${usedPrefix + command} @utente1 @utente2\n` +
        `oppure ${usedPrefix + command} @utente\n` +
        `oppure rispondi a un messaggio con ${usedPrefix + command}`
      )
    }

    let avatar1, avatar2

    try {
      avatar1 = await conn.profilePictureUrl(user1, 'image')
    } catch {
      avatar1 = 'https://cdn.popcat.xyz/avatar.png'
    }

    try {
      avatar2 = await conn.profilePictureUrl(user2, 'image')
    } catch {
      avatar2 = 'https://cdn.popcat.xyz/avatar.png'
    }

    const apiUrl =
      `https://api.popcat.xyz/v2/ship?user1=${encodeURIComponent(avatar1)}` +
      `&user2=${encodeURIComponent(avatar2)}`

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

    const percent = Math.floor(Math.random() * 101)

    const tag1 = '@' + user1.split('@')[0]
    const tag2 = '@' + user2.split('@')[0]

    const bio = `${tag1} è compatibile al ${percent}% con ${tag2} 💘`

    await conn.sendMessage(m.chat, {
      image: rawBuffer,
      mimetype: contentType,
      caption: bio,
      mentions: [user1, user2]
    }, { quoted: m })

  } catch (error) {
    console.error('Ship Error:', error)
    m.reply(`❌ Errore: ${error.response?.data?.message || error.message || 'Unknown error'}`)
  }
}

handler.help = ['ship @utente1 @utente2', 'ship @utente']
handler.tags = ['fun']
handler.command = /^(ship)$/i

export default handler