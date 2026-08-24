function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getBody(m) {
  return (
    m.text ||
    m.body ||
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  )
}

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup) return true
  if (!isBotAdmin) return true
  if (isAdmin) return true
  if (!m.message) return true

  const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})
  if (!Array.isArray(chat.banWords)) chat.banWords = []

  if (!chat.banWords.length) return true

  const text = getBody(m).toLowerCase().trim()
  if (!text) return true

  const matched = chat.banWords.find(word => {
    const pattern = new RegExp(`(^|\\W)${escapeRegex(word)}(?=$|\\W)`, 'iu')
    return pattern.test(text)
  })

  if (!matched) return true

  const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
  user.warn = (user.warn || 0) + 1

  try {
    await conn.sendMessage(m.chat, { delete: m.key })
  } catch {}

  await conn.reply(
    m.chat,
    `🚫 *@${m.sender.split('@')[0]}*, messaggio eliminato.\n⚠️ *Parola bannata rilevata:* ${matched}\n📜 *Warn:* ${user.warn}/3`,
    m,
    { mentions: [m.sender] }
  )

  return false
}