const MAX_DELETE_COUNT = 67

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

function getRecentMessages(conn, chatId) {
  const storeSources = [
    conn?.chats?.[chatId]?.messages,
    global?.conn?.chats?.[chatId]?.messages,
    global?.store?.messages?.[chatId],
    global?.store?.chats?.[chatId]?.messages,
    this?.chats?.[chatId]?.messages
  ].filter(Boolean)

  for (const source of storeSources) {
    if (Array.isArray(source)) return source
    if (source instanceof Map) return Array.from(source.values())
    if (typeof source === 'object') return Object.values(source)
  }

  return []
}

function normalizeMsgEntry(entry) {
  if (!entry) return null
  if (entry.key?.id) return entry
  if (entry.messages?.[0]?.key?.id) return entry.messages[0]
  if (entry.msg?.key?.id) return entry.msg
  return null
}

let handler = async (m, { conn, args }) => {
  const rawCount = parseInt(args[0])
  const wantsBulkDelete = Number.isInteger(rawCount)

  if (!m.quoted && !wantsBulkDelete) {
    return conn.reply(m.chat, 'Rispondi al messaggio che vuoi eliminare oppure usa *.del 20*.', m)
  }

  try {
    if (wantsBulkDelete) {
      const count = clamp(rawCount, 1, MAX_DELETE_COUNT)
      const recent = getRecentMessages(conn, m.chat)
        .map(normalizeMsgEntry)
        .filter(Boolean)
        .filter(msg => msg.key?.id && msg.key.id !== m.key.id)
        .filter(msg => !msg.message?.protocolMessage)
        .slice(-count)

      if (!recent.length) {
        return conn.reply(m.chat, 'Non ho trovato abbastanza messaggi recenti nella cache della chat.', m)
      }

      let deleted = 0

      for (const msg of recent.reverse()) {
        try {
          const targetKey = {
            remoteJid: m.chat,
            fromMe: !!msg.key.fromMe,
            id: msg.key.id,
            participant: msg.key.participant || msg.participant || msg.sender || undefined
          }
          await conn.sendMessage(m.chat, { delete: targetKey })
          deleted++
        } catch {}
      }

      try {
        await conn.sendMessage(m.chat, { delete: m.key })
      } catch {}

      return conn.reply(m.chat, `Eliminati ${deleted} messaggi.${rawCount > MAX_DELETE_COUNT ? ` Massimo consentito: ${MAX_DELETE_COUNT}.` : ''}`, m)
    }

    const re = m.message.extendedTextMessage?.contextInfo
    const targetMsg = {
      remoteJid: m.chat,
      fromMe: false,
      id: re?.stanzaId || m.quoted.id,
      participant: re?.participant || m.quoted.sender
    }

    await conn.sendMessage(m.chat, { delete: targetMsg })
    await conn.sendMessage(m.chat, { delete: m.key })
  } catch (err) {
    try {
      if (m.quoted?.vM?.key) {
        await conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
        await conn.sendMessage(m.chat, { delete: m.key })
        return
      }
    } catch (e) {
      console.error('Errore durante eliminazione', e)
    }

    conn.reply(m.chat, `${global.errore}`, m)
  }
}

handler.help = ['del', 'del <numero>']
handler.tags = ['gruppo']
handler.command = /^(del|delete|cancella|eliminare)$/i
handler.group = true
handler.admin = true
handler.moderator = true
handler.botAdmin = true

export default handler