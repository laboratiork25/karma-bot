let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🚫 *Uso corretto:* *${usedPrefix}banword* [parola]`
    }, { quoted: m })
  }

  let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})
  if (!Array.isArray(chat.banWords)) chat.banWords = []

  let word = text.trim().toLowerCase()
  if (!word) {
    return conn.sendMessage(m.chat, {
      text: '🚫 *Inserisci una parola valida.*'
    }, { quoted: m })
  }

  if (chat.banWords.includes(word)) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *Parola già bannata:* ${word}`
    }, { quoted: m })
  }

  chat.banWords.push(word)

  return conn.sendMessage(m.chat, {
    text: `✅ *Parola bannata:* ${word}\n📚 *Totale parole:* ${chat.banWords.length}`
  }, { quoted: m })
}

handler.command = ['banword']
handler.admin = true;
handler.moderator = true;
export default handler

