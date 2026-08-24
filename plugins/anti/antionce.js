import {
  normalizeMessageContent,
  extractMessageContent,
  downloadContentFromMessage,
  downloadMediaMessage
} from '@chatunity/baileys'

function getJidUser(jid = '') {
  return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function getViewOnceMessage(message = {}) {
  const normalized = normalizeMessageContent?.(message) || message
  const extracted = extractMessageContent?.(normalized) || normalized

  return (
    extracted?.viewOnceMessage?.message ||
    extracted?.viewOnceMessageV2?.message ||
    extracted?.viewOnceMessageV2Extension?.message ||
    extracted?.viewOnceMessageV2ExtensionMessage?.message ||
    null
  )
}

function getContentType(message = {}) {
  const keys = Object.keys(message || {})
  return keys[0] || null
}

function mediaKindFromType(type = '') {
  if (/imageMessage/i.test(type)) return 'image'
  if (/videoMessage/i.test(type)) return 'video'
  if (/audioMessage/i.test(type)) return 'audio'
  if (/stickerMessage/i.test(type)) return 'sticker'
  if (/documentMessage/i.test(type)) return 'document'
  return null
}

async function streamToBuffer(stream) {
  let buffer = Buffer.from([])
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
  return buffer
}

async function tryDownloadViewOnceBuffer(conn, m, content, mediaKind) {
  try {
    const stream = await downloadContentFromMessage(content, mediaKind)
    const buffer = await streamToBuffer(stream)
    if (buffer?.length) return buffer
  } catch {}

  try {
    const buffer = await downloadMediaMessage(
      m,
      'buffer',
      {},
      { logger: console, reuploadRequest: conn.updateMediaMessage?.bind(conn) }
    )
    if (buffer?.length) return buffer
  } catch {}

  try {
    if (typeof conn.downloadMediaMessage === 'function') {
      const buffer = await conn.downloadMediaMessage(m, 'buffer', {}, {
        reuploadRequest: conn.updateMediaMessage?.bind(conn)
      })
      if (buffer?.length) return buffer
    }
  } catch {}

  return null
}

function buildHeader(m, type) {
  const senderNum = getJidUser(m.sender)
  return (
    `*ANTI ONEVIEW*\n` +
    `• Chat: ${m.chat || '-'}\n` +
    `• Sender: @${senderNum || 'unknown'}\n` +
    `• Name: ${m.pushName || m.name || '-'}\n` +
    `• Type: ${type || '-'}\n` +
    `• ID: ${m.key?.id || '-'}\n`
  )
}

let handler = m => m

handler.before = async function (m, {
  conn,
  isROwner,
  isOwner,
  isAdmin,
  isModerator
}) {
  if (!m?.isGroup) return false
  if (m?.isBaileys) return false
  if (!m?.message) return false

  const chat = global.db.data.chats?.[m.chat]
  if (!chat?.antioneview) return false

  if (isROwner || isOwner || isAdmin || isModerator) return false

  const inner = getViewOnceMessage(m.message || m.msg || {})
  if (!inner) return false

  const type = getContentType(inner)
  const content = type ? inner[type] : null
  const mediaKind = mediaKindFromType(type)
  const header = buildHeader(m, type)

  await conn.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: m.key.id,
      participant: m.key.participant || m.sender
    }
  }).catch(() => {})

  await conn.sendMessage(m.chat, {
    text: `*@${getJidUser(m.sender)}* ha inviato un messaggio *visualizza una volta*, che non è consentito in questo gruppo.`,
    mentions: [m.sender]
  }, { quoted: m }).catch(() => {})

  m.commandBlocked = true
  return true
}

export default handler