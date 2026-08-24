import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const topDataPath = path.join(__dirname, '../../storage', 'top-stats.json')

const onlineSessions = new Map() // sessionKey(groupId:userId) -> { startedAt, lastActivityAt, source, groupId, userId }
const ONLINE_FALLBACK_START_MS = 90 * 1000
const ONLINE_FALLBACK_EXTEND_MS = 60 * 1000
const ONLINE_FALLBACK_MAX_SESSION_MS = 10 * 60 * 1000
const ONLINE_SWEEP_INTERVAL_MS = 20 * 1000

function ensureStorageDir() {
  const storageDir = path.dirname(topDataPath)
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }
}

function getSessionKey(groupId, userId) {
  return `${groupId}:${userId}`
}

export function loadTopData() {
  ensureStorageDir()
  try {
    if (fs.existsSync(topDataPath)) {
      const rawData = fs.readFileSync(topDataPath, 'utf8')
      const data = JSON.parse(rawData)

      if (!data.daily) data.daily = {}
      if (!data.weekly) data.weekly = {}
      if (!data.alltime) data.alltime = {}

      if (!data.onlineDaily) data.onlineDaily = {}
      if (!data.onlineWeekly) data.onlineWeekly = {}
      if (!data.onlineAlltime) data.onlineAlltime = {}

      if (!data.lastResetDaily) data.lastResetDaily = new Date().toISOString()
      if (!data.lastResetWeekly) data.lastResetWeekly = new Date().toISOString()

      return data
    }
  } catch (e) {
    console.error('Errore nel caricamento dei dati top:', e.message)
  }

  return {
    daily: {},
    weekly: {},
    alltime: {},
    onlineDaily: {},
    onlineWeekly: {},
    onlineAlltime: {},
    lastResetDaily: new Date().toISOString(),
    lastResetWeekly: new Date().toISOString()
  }
}

export function saveTopData(data) {
  ensureStorageDir()
  try {
    if (!data.daily) data.daily = {}
    if (!data.weekly) data.weekly = {}
    if (!data.alltime) data.alltime = {}

    if (!data.onlineDaily) data.onlineDaily = {}
    if (!data.onlineWeekly) data.onlineWeekly = {}
    if (!data.onlineAlltime) data.onlineAlltime = {}

    if (!data.lastResetDaily) data.lastResetDaily = new Date().toISOString()
    if (!data.lastResetWeekly) data.lastResetWeekly = new Date().toISOString()

    fs.writeFileSync(topDataPath, JSON.stringify(data, null, 2), 'utf8')
  } catch (e) {
    console.error('Errore nel salvataggio dei dati top:', e.message)
  }
}

function getItalianDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }))
}

function shouldResetDaily(lastReset) {
  const lastResetDate = new Date(lastReset)
  const now = getItalianDate()

  return (
    lastResetDate.getDate() !== now.getDate() ||
    lastResetDate.getMonth() !== now.getMonth() ||
    lastResetDate.getFullYear() !== now.getFullYear()
  )
}

function shouldResetWeekly(lastReset) {
  const lastResetDate = new Date(lastReset)
  const now = getItalianDate()

  const currentMonday = new Date(now)
  currentMonday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  currentMonday.setHours(0, 0, 0, 0)

  const lastResetMonday = new Date(lastResetDate)
  lastResetMonday.setDate(lastResetDate.getDate() - lastResetDate.getDay() + (lastResetDate.getDay() === 0 ? -6 : 1))
  lastResetMonday.setHours(0, 0, 0, 0)

  return currentMonday.getTime() > lastResetMonday.getTime()
}

function ensureGroupBuckets(data, groupId) {
  if (!data.daily[groupId]) data.daily[groupId] = {}
  if (!data.weekly[groupId]) data.weekly[groupId] = {}
  if (!data.alltime[groupId]) data.alltime[groupId] = {}

  if (!data.onlineDaily[groupId]) data.onlineDaily[groupId] = {}
  if (!data.onlineWeekly[groupId]) data.onlineWeekly[groupId] = {}
  if (!data.onlineAlltime[groupId]) data.onlineAlltime[groupId] = {}
}

function resetIfNeeded(data) {
  if (shouldResetDaily(data.lastResetDaily)) {
    data.daily = {}
    data.onlineDaily = {}
    data.lastResetDaily = new Date().toISOString()
  }

  if (shouldResetWeekly(data.lastResetWeekly)) {
    data.weekly = {}
    data.onlineWeekly = {}
    data.lastResetWeekly = new Date().toISOString()
  }
}

function incrementMessageCount(groupId, userId, data) {
  ensureGroupBuckets(data, groupId)

  data.daily[groupId][userId] = (data.daily[groupId][userId] || 0) + 1
  data.weekly[groupId][userId] = (data.weekly[groupId][userId] || 0) + 1
  data.alltime[groupId][userId] = (data.alltime[groupId][userId] || 0) + 1
}

function addOnlineTime(groupId, userId, ms, data) {
  if (!groupId || !userId || !ms || ms <= 0) return
  ensureGroupBuckets(data, groupId)

  data.onlineDaily[groupId][userId] = (data.onlineDaily[groupId][userId] || 0) + ms
  data.onlineWeekly[groupId][userId] = (data.onlineWeekly[groupId][userId] || 0) + ms
  data.onlineAlltime[groupId][userId] = (data.onlineAlltime[groupId][userId] || 0) + ms
}

export function countMessages(groupId, userId) {
  if (!groupId || !userId) return false

  const data = loadTopData()
  resetIfNeeded(data)
  incrementMessageCount(groupId, userId, data)
  saveTopData(data)
  return true
}

export function registerMessageActivity(groupId, userId) {
  if (!groupId || !userId) return false

  const now = Date.now()
  const sessionKey = getSessionKey(groupId, userId)
  const existing = onlineSessions.get(sessionKey)

  if (!existing) {
    onlineSessions.set(sessionKey, {
      startedAt: now,
      lastActivityAt: now + ONLINE_FALLBACK_START_MS,
      source: 'estimated',
      groupId,
      userId
    })
    return true
  }

  if (existing.source === 'presence') {
    existing.groupId = groupId
    existing.userId = userId
    existing.lastActivityAt = now
    onlineSessions.set(sessionKey, existing)
    return true
  }

  const sessionAge = now - existing.startedAt
  const nextEnd = Math.min(
    Math.max(existing.lastActivityAt, now) + ONLINE_FALLBACK_EXTEND_MS,
    existing.startedAt + ONLINE_FALLBACK_MAX_SESSION_MS
  )

  existing.lastActivityAt = nextEnd
  existing.groupId = groupId
  existing.userId = userId

  if (sessionAge >= ONLINE_FALLBACK_MAX_SESSION_MS) {
    existing.lastActivityAt = existing.startedAt + ONLINE_FALLBACK_MAX_SESSION_MS
  }

  onlineSessions.set(sessionKey, existing)
  return true
}

export function trackPresenceUpdate(groupId, userId, presence) {
  if (!userId || !presence) return false

  const now = Date.now()
  const status = String(presence).toLowerCase()

  if (status === 'available' || status === 'composing' || status === 'recording') {
    if (groupId) {
      const sessionKey = getSessionKey(groupId, userId)
      const current = onlineSessions.get(sessionKey)

      if (!current) {
        onlineSessions.set(sessionKey, {
          startedAt: now,
          lastActivityAt: now,
          source: 'presence',
          groupId,
          userId
        })
      } else {
        current.groupId = groupId
        current.userId = userId
        current.source = 'presence'
        if (!current.startedAt) current.startedAt = now
        current.lastActivityAt = now
        onlineSessions.set(sessionKey, current)
      }
    } else {
      for (const [key, session] of onlineSessions.entries()) {
        if (session.userId !== userId) continue
        session.source = 'presence'
        if (!session.startedAt) session.startedAt = now
        session.lastActivityAt = now
        onlineSessions.set(key, session)
      }
    }
    return true
  }

  if (status === 'unavailable' || status === 'paused') {
    const data = loadTopData()
    resetIfNeeded(data)
    let changed = false

    for (const [key, session] of onlineSessions.entries()) {
      if (session.userId !== userId) continue
      if (groupId && session.groupId !== groupId) continue

      const startedAt = session.startedAt || now
      const endAt = session.source === 'estimated'
        ? Math.min(now, session.lastActivityAt || now)
        : now
      const elapsed = Math.max(0, endAt - startedAt)

      if (elapsed > 0 && session.groupId) {
        addOnlineTime(session.groupId, userId, elapsed, data)
        changed = true
      }

      onlineSessions.delete(key)
    }

    if (changed) saveTopData(data)
    return changed
  }

  return false
}

function sweepEstimatedOnlineSessions() {
  const now = Date.now()
  const data = loadTopData()
  let changed = false

  resetIfNeeded(data)

  for (const [key, session] of onlineSessions.entries()) {
    if (session.source !== 'estimated') continue
    if (now < session.lastActivityAt) continue

    const elapsed = Math.max(0, session.lastActivityAt - session.startedAt)
    if (elapsed > 0 && session.groupId && session.userId) {
      addOnlineTime(session.groupId, session.userId, elapsed, data)
      changed = true
    }

    onlineSessions.delete(key)
  }

  if (changed) saveTopData(data)
}

setInterval(sweepEstimatedOnlineSessions, ONLINE_SWEEP_INTERVAL_MS)

function formatTimeRemaining(ms) {
  if (ms <= 0) return '0m'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  if (days > 0) return `${days}g ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatOnlineMs(ms) {
  const safe = Math.max(0, Number(ms) || 0)
  const totalSeconds = Math.floor(safe / 1000)
  const totalMinutes = Math.floor(safe / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}g ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function getNextItalianMidnight() {
  const now = getItalianDate()
  const next = new Date(now)
  next.setDate(now.getDate() + 1)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

function getNextItalianMonday() {
  const now = getItalianDate()
  const currentDay = now.getDay()
  const daysUntilMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7 || 7
  const nextMonday = new Date(now)
  nextMonday.setDate(now.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  return nextMonday.getTime()
}

function looksLikePhoneNumber(str) {
  if (!str || typeof str !== 'string') return false
  const cleaned = str.replace(/[+()\-\s]/g, '')
  return /^\d{7,15}$/.test(cleaned)
}

function cleanName(value) {
  if (!value || typeof value !== 'string') return ''
  const v = value.replace(/^@+/, '').trim()
  if (!v) return ''
  if (looksLikePhoneNumber(v)) return ''
  return v
}

function getNameFromDb(jid) {
  const user = global.db?.data?.users?.[jid]
  const name = cleanName(user?.name)
  return name || ''
}

function getNameFromParticipants(jid, participants = []) {
  const participant = (participants || []).find(p => p?.id === jid || p?.jid === jid)
  if (!participant) return ''

  return (
    cleanName(participant?.name) ||
    cleanName(participant?.notify) ||
    cleanName(participant?.verifiedName) ||
    ''
  )
}

function getDisplayName(jid, participants = []) {
  const nameFromDb = getNameFromDb(jid)
  if (nameFromDb && !looksLikePhoneNumber(nameFromDb)) return nameFromDb

  const nameFromParticipants = getNameFromParticipants(jid, participants)
  if (nameFromParticipants && !looksLikePhoneNumber(nameFromParticipants)) return nameFromParticipants

  return 'Utente'
}

function buildLiveOnlineSnapshot(groupId, persistedScope = {}) {
  const snapshot = { ...persistedScope }
  const now = Date.now()

  for (const session of onlineSessions.values()) {
    if (session.groupId !== groupId) continue
    if (!session.userId) continue

    const endAt = session.source === 'estimated'
      ? Math.min(now, session.lastActivityAt || now)
      : now
    const liveMs = Math.max(0, endAt - (session.startedAt || now))

    if (liveMs > 0) {
      snapshot[session.userId] = (snapshot[session.userId] || 0) + liveMs
    }
  }

  return snapshot
}

async function buildTopMessage(topData, participants, title, nextReset, mode = 'messages', onlineData = {}) {
  if (!topData || Object.keys(topData).length === 0) {
    return {
      text: ` ⋆｡˚『 📊 ╭ \`${title}\` ╯ 』˚｡⋆\n\nNessun dato registrato.`
    }
  }

  const sorted = Object.entries(topData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const usersList = sorted.map(([jid, count], i) => {
    const name = getDisplayName(jid, participants)
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
    const onlineMs = onlineData?.[jid] || 0
    return { jid, name, count, medal, onlineMs }
  })

  let text = ` ⋆｡˚『 📊 ╭ \`${title}\` ╯ 』˚｡⋆\n\n${usersList.map(u => {
    if (mode === 'online') {
      return `『 ${u.medal} 』${u.name}\n     🟢 ${formatOnlineMs(u.count)} online`
    }

    if (mode === 'mixed') {
      return `『 ${u.medal} 』${u.name}\n     💬 ${u.count.toLocaleString()} messaggi\n     🟢 ${formatOnlineMs(u.onlineMs)} online`
    }

    return `『 ${u.medal} 』${u.name}\n     💬 ${u.count.toLocaleString()} messaggi\n     🟢 ${formatOnlineMs(u.onlineMs)} online`
  }).join('\n\n')}`

  if (nextReset) {
    text += `\n\n╭────────────╮\n『 ⏰ 』Reset tra: *${formatTimeRemaining(nextReset - Date.now())}*\n╰────────────╯`
  }

  if (mode === 'online') {
    text += `\n\n📌 Online = presenza reale quando disponibile, altrimenti stima intelligente dai messaggi.`
  }

  return { text }
}

const handler = async (m, { conn, participants, args, usedPrefix }) => {
  if (!m.isGroup) {
    return m.reply('⚠️ Questo comando funziona solo nei gruppi')
  }

  const groupId = m.chat
  let data = loadTopData()
  resetIfNeeded(data)
  saveTopData(data)

  const command = args[0]?.toLowerCase()
  const modeArg = args[1]?.toLowerCase()

  if (command === 'reset') {
    const resetType = args[1]?.toLowerCase()

    if (['giorno', 'daily', 'giornaliero'].includes(resetType)) {
      if (data.daily[groupId]) delete data.daily[groupId]
      if (data.onlineDaily[groupId]) delete data.onlineDaily[groupId]
      data.lastResetDaily = new Date().toISOString()
      saveTopData(data)
      return m.reply('✅ Top giornaliero resettato')
    }

    if (['settimana', 'weekly', 'settimanale'].includes(resetType)) {
      if (data.weekly[groupId]) delete data.weekly[groupId]
      if (data.onlineWeekly[groupId]) delete data.onlineWeekly[groupId]
      data.lastResetWeekly = new Date().toISOString()
      saveTopData(data)
      return m.reply('✅ Top settimanale resettato')
    }

    if (['sempre', 'alltime', 'all'].includes(resetType)) {
      if (data.alltime[groupId]) delete data.alltime[groupId]
      if (data.onlineAlltime[groupId]) delete data.onlineAlltime[groupId]
      saveTopData(data)
      return m.reply('✅ Top di sempre resettato')
    }

    return m.reply(`Uso: ${usedPrefix}top reset [giorno|settimana|sempre]`)
  }

  let topScope = data.daily[groupId] || {}
  let onlineScope = buildLiveOnlineSnapshot(groupId, data.onlineDaily[groupId] || {})
  let title = 'TOP UTENTI'
  let nextReset = getNextItalianMidnight()
  let mode = 'messages'

  if (['settimana', 'weekly', 'settimanale'].includes(command)) {
    topScope = data.weekly[groupId] || {}
    onlineScope = buildLiveOnlineSnapshot(groupId, data.onlineWeekly[groupId] || {})
    title = 'TOP UTENTI SETTIMANALE'
    nextReset = getNextItalianMonday()
  } else if (['sempre', 'alltime', 'all'].includes(command)) {
    topScope = data.alltime[groupId] || {}
    onlineScope = buildLiveOnlineSnapshot(groupId, data.onlineAlltime[groupId] || {})
    title = 'TOP UTENTI ALL TIME'
    nextReset = null
  }

  if (['online', 'on'].includes(command)) {
    topScope = buildLiveOnlineSnapshot(groupId, data.onlineDaily[groupId] || {})
    onlineScope = topScope
    title = 'TOP ONLINE GIORNALIERO'
    nextReset = getNextItalianMidnight()
    mode = 'online'
  } else if (['online', 'on'].includes(modeArg)) {
    mode = 'mixed'
  }

  if (['settimana', 'weekly', 'settimanale'].includes(command) && ['online', 'on'].includes(modeArg)) {
    topScope = buildLiveOnlineSnapshot(groupId, data.onlineWeekly[groupId] || {})
    onlineScope = topScope
    title = 'TOP ONLINE SETTIMANALE'
    mode = 'online'
  }

  if (['sempre', 'alltime', 'all'].includes(command) && ['online', 'on'].includes(modeArg)) {
    topScope = buildLiveOnlineSnapshot(groupId, data.onlineAlltime[groupId] || {})
    onlineScope = topScope
    title = 'TOP ONLINE ALL TIME'
    mode = 'online'
    nextReset = null
  }

  const built = await buildTopMessage(topScope, participants, title, nextReset, mode, onlineScope)

  await conn.sendMessage(m.chat, {
    text: built.text
  }, { quoted: m })
}

handler.all = async function (m) {
  try {
    if (!m.isGroup) return
    if (!m.sender || m.sender === this.user?.jid) return

    const text = typeof m.text === 'string' ? m.text.trim() : ''
    if (text.startsWith('.') || text.startsWith('!') || text.startsWith('/') || text.startsWith('#')) return
    if (!text && !m.message) return

    countMessages(m.chat, m.sender)
    registerMessageActivity(m.chat, m.sender)
  } catch (err) {
    console.error('[TOP] Errore in handler.all:', err)
  }
}

handler.help = [
  'top',
  'top online',
  'top giorno',
  'top giorno online',
  'top settimana',
  'top settimana online',
  'top sempre',
  'top sempre online',
  'top reset giorno',
  'top reset settimana',
  'top reset sempre'
]

handler.tags = ['group']
handler.command = /^(top)$/i
handler.group = true

export default handler
