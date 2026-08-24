const COMMAND_SPAM_USER_WINDOW = 15000
const COMMAND_SPAM_USER_MAX = 5
const COMMAND_SPAM_REPEAT_WINDOW = 4500
const COMMAND_SPAM_REPEAT_MAX = 3
const COMMAND_SPAM_GROUP_WINDOW = 12000
const COMMAND_SPAM_GROUP_MAX = 10
const COMMAND_SPAM_USER_COOLDOWN = 25000
const COMMAND_SPAM_GROUP_COOLDOWN = 12000
const COMMAND_SPAM_NOTICE_COOLDOWN = 8000

global.groupSpam = global.groupSpam || {}

const HEAVY_COMMANDS = new Set([
  'play', 'music', 'song', 'ytmp3', 'ytmp4', 'yta', 'ytv', 'spotify', 'ig', 'instagram',
  'tt', 'tiktok', 'media', 'sticker', 's', 'toimg', 'img', 'hd', 'remini', 'qc', 'tourl',
  'ai', 'gpt', 'gemini', 'openai', 'claude', 'llama', 'flux', 'imagine', 'image', 'bing',
  'search', 'google', 'pinterest', 'wallpaper', 'animediff', 'dalle', 'github', 'gitclone'
])

function getJidUser(jid) {
  return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function hasValidPrefix(text, prefixes) {
  if (!text || typeof text !== 'string') return false
  if (prefixes instanceof RegExp) return prefixes.test(text)
  const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes]
  return prefixList.some(prefix => {
    if (prefix instanceof RegExp) return prefix.test(text)
    if (typeof prefix === 'string') return text.startsWith(prefix)
    return false
  })
}

function getCommandKey(text, prefixes) {
  if (typeof text !== 'string') return ''
  let withoutPrefix = text.trim()

  if (prefixes instanceof RegExp) {
    const match = prefixes.exec(withoutPrefix)
    if (match?.[0]) withoutPrefix = withoutPrefix.slice(match[0].length)
  } else {
    const prefixList = Array.isArray(prefixes) ? prefixes : [prefixes]
    for (const prefix of prefixList) {
      if (prefix instanceof RegExp) {
        const match = prefix.exec(withoutPrefix)
        if (match?.[0]) {
          withoutPrefix = withoutPrefix.slice(match[0].length)
          break
        }
      } else if (typeof prefix === 'string' && withoutPrefix.startsWith(prefix)) {
        withoutPrefix = withoutPrefix.slice(prefix.length)
        break
      }
    }
  }

  return (withoutPrefix.trim().split(/\s+/)[0] || '').toLowerCase()
}

function getCommandWeight(commandKey) {
  return HEAVY_COMMANDS.has(commandKey) ? 2 : 1
}

function getCommandSpamState(chatId) {
  if (!global.groupSpam[chatId]) {
    global.groupSpam[chatId] = {
      suspendedUntil: 0,
      lastNoticeAt: 0,
      group: {
        count: 0,
        windowStart: 0
      },
      users: {}
    }
  }
  return global.groupSpam[chatId]
}

function getUserSpamState(groupState, sender) {
  if (!groupState.users[sender]) {
    groupState.users[sender] = {
      count: 0,
      windowStart: 0,
      repeatCount: 0,
      lastCommand: '',
      lastCommandAt: 0,
      lastNoticeAt: 0,
      suspendedUntil: 0
    }
  }
  return groupState.users[sender]
}

function cleanupSpamState(groupState, now) {
  for (const [sender, state] of Object.entries(groupState.users)) {
    const inactiveLongEnough =
      now - (state.lastCommandAt || 0) > Math.max(COMMAND_SPAM_USER_COOLDOWN, 60000) &&
      now > (state.suspendedUntil || 0)

    if (inactiveLongEnough) delete groupState.users[sender]
  }
}

function isPrivilegedUser(conn, m) {
  const decodedUserId = conn.decodeJid ? conn.decodeJid(global.conn.user.id) : global.conn.user.id
  const ownerJids = [decodedUserId, ...global.owner.map(([number]) => number)]
    .filter(Boolean)
    .map(value => value.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

  const isROwner = ownerJids.includes(m.sender)
  const isOwner = isROwner || m.fromMe
  const isMods = isOwner || global.mods.map(value => value.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isPrems = isROwner || isOwner || isMods || global.db.data.users[m.sender]?.premiumTime > 0

  return { isOwner, isMods, isPrems }
}

async function sendSpamNotice(conn, chatId, text, mentions = [], bucket = null) {
  const now = Date.now()
  if (bucket && now - (bucket.lastNoticeAt || 0) < COMMAND_SPAM_NOTICE_COOLDOWN) return
  if (bucket) bucket.lastNoticeAt = now
  await conn.sendMessage(chatId, { text, mentions }).catch(() => {})
}

async function enforceCommandAntispam(conn, m, chat) {
  if (!m.isGroup || !chat?.antispamcomandi || typeof m.text !== 'string') return false

  const prefixes = conn.prefix || global.prefix
  if (!hasValidPrefix(m.text, prefixes)) return false

  const { isOwner, isMods, isPrems } = isPrivilegedUser(conn, m)
  if (isOwner || isMods || isPrems) return false

  const commandKey = getCommandKey(m.text, prefixes)
  if (!commandKey) return false

  const weight = getCommandWeight(commandKey)
  const now = Date.now()
  const groupState = getCommandSpamState(m.chat)
  cleanupSpamState(groupState, now)

  if (groupState.suspendedUntil > now) {
    m.commandBlocked = true
    const seconds = Math.ceil((groupState.suspendedUntil - now) / 1000)
    await sendSpamNotice(
      conn,
      m.chat,
      `『 ⚠ 』 Anti-spam comandi\n\nTroppi comandi ravvicinati nel gruppo.\nRiprova tra *${seconds} secondi*.`,
      [],
      groupState
    )
    return true
  }

  const userState = getUserSpamState(groupState, m.sender)

  if (userState.suspendedUntil > now) {
    m.commandBlocked = true
    const seconds = Math.ceil((userState.suspendedUntil - now) / 1000)
    await sendSpamNotice(
      conn,
      m.chat,
      `『 ⚠ 』 Anti-spam comandi\n\n@${getJidUser(m.sender)} stai inviando troppi comandi troppo velocemente.\nRiprova tra *${seconds} secondi*.`,
      [m.sender],
      userState
    )
    return true
  }

  if (now - groupState.group.windowStart > COMMAND_SPAM_GROUP_WINDOW) {
    groupState.group.count = 0
    groupState.group.windowStart = now
  }
  groupState.group.count += weight

  if (now - userState.windowStart > COMMAND_SPAM_USER_WINDOW) {
    userState.count = 0
    userState.windowStart = now
  }
  userState.count += weight

  if (userState.lastCommand === commandKey && now - userState.lastCommandAt <= COMMAND_SPAM_REPEAT_WINDOW) {
    userState.repeatCount += 1
  } else {
    userState.repeatCount = 1
  }

  userState.lastCommand = commandKey
  userState.lastCommandAt = now

  if (groupState.group.count >= COMMAND_SPAM_GROUP_MAX) {
    groupState.suspendedUntil = now + COMMAND_SPAM_GROUP_COOLDOWN
    m.commandBlocked = true
    await sendSpamNotice(
      conn,
      m.chat,
      `『 ⚠ 』 Anti-spam comandi\n\nTroppi comandi ravvicinati nel gruppo.\nComandi bloccati per *${Math.ceil(COMMAND_SPAM_GROUP_COOLDOWN / 1000)} secondi*.`,
      [],
      groupState
    )
    return true
  }

  if (userState.count >= COMMAND_SPAM_USER_MAX || userState.repeatCount >= COMMAND_SPAM_REPEAT_MAX) {
    userState.suspendedUntil = now + COMMAND_SPAM_USER_COOLDOWN
    m.commandBlocked = true
    await sendSpamNotice(
      conn,
      m.chat,
      `『 ⚠ 』 Anti-spam comandi\n\n@${getJidUser(m.sender)} hai superato il limite di comandi consecutivi.\nAttendi *${Math.ceil(COMMAND_SPAM_USER_COOLDOWN / 1000)} secondi* prima di riprovare.`,
      [m.sender],
      userState
    )
    return true
  }

  return false
}

let handler = function () {}

handler.all = async function (m) {
  if (!m?.isGroup || typeof m.text !== 'string') return
  const chat = global.db?.data?.chats?.[m.chat] || {}
  await enforceCommandAntispam(this, m, chat)
}

export default handler