let handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🚫 *Uso corretto:* *.unbanword* [parola]`
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

  if (!chat.banWords.includes(word)) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *Parola non trovata:* ${word}`
    }, { quoted: m })
  }

  chat.banWords = chat.banWords.filter(w => w !== word)

  return conn.sendMessage(m.chat, {
    text: `✅ *Parola sbannata:* ${word}\n📚 *Totale parole:* ${chat.banWords.length}`
  }, { quoted: m })
}

handler.command = ['unbanword']
handler.admin = true;
handler.moderator = true;
export default handler