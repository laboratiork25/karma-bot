const antibot2 = new Set()

const RX_BOT = /^[a-zA-Z]+-[a-fA-F0-9]+$/
const RX_WEBBOT = /^3EB0[A-Z0-9]+$/
const RX_ANDROID = /^[A-F0-9]{32}$/i
const RX_IOS_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const RX_IOS_SHORT = /^[A-Z0-9]{20,25}$/i

function rilevaDispositivoCheck(msgID = '') {
  if (!msgID) return 'sconosciuto'
  if (RX_BOT.test(msgID)) return 'bot'
  if (msgID.startsWith('false_') || msgID.startsWith('true_')) return 'web'
  if (RX_WEBBOT.test(msgID)) return 'webbot'
  if (msgID.includes(':')) return 'desktop'
  if (RX_ANDROID.test(msgID)) return 'android'
  if (RX_IOS_UUID.test(msgID)) return 'ios'
  if (RX_IOS_SHORT.test(msgID) && !msgID.startsWith('3EB0')) return 'ios'
  if (msgID.startsWith('3EB0')) return 'android_old'
  return 'sconosciuto'
}

export async function antibot(m, { conn, isAdmin, isOwner, isSam, isBotAdmin }) {
  if (!m?.isGroup || !m?.sender || !m?.key?.id) return
  if (m.fromMe || isAdmin || isOwner || isSam) return
  if (!isBotAdmin) return

  const chat = global.db.data.chats?.[m.chat]
  if (!chat?.antiBot) return

  const device = rilevaDispositivoCheck(m.key.id)
  if (device !== 'bot' && device !== 'web' && device !== 'webbot') return

  const metadata = await conn.groupMetadata(m.chat)
  const botNumber = conn.user?.jid || conn.user?.id || ''
  const autorizzati = new Set([botNumber, metadata?.owner, ...antibot2].filter(Boolean))

  if (autorizzati.has(m.sender)) return

  await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

  await conn.sendMessage(m.chat, {
    text: [
      '🚫 `Bot rilevato`',
      '',
      `➤ \`Utente:\` @${m.sender.split('@')[0]}`,
      '➤ `Azione:` Rimosso dal gruppo',
      `➤ \`Dispositivo:\` ${device.toUpperCase()}`,
      '',
    ].join('\n'),
    mentions: [m.sender]
  })
}

export default antibot