const handler = async (m, { conn }) => {
  const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})
  if (!Array.isArray(chat.banWords)) chat.banWords = []

  if (!chat.banWords.length) {
    return conn.reply(m.chat, '📚 *Nessuna parola bannata in questo gruppo.*', m)
  }

  const list = chat.banWords.map((word, i) => `${i + 1}. ${word}`).join('\n')

  return conn.reply(
    m.chat,
    `📚 *LISTA PAROLE BANNATE*\n\n${list}\n\n*Totale:* ${chat.banWords.length}`,
    m
  )
}

handler.command = ['listabanword']
handler.admin = true;
handler.moderator = true;
export default handler

