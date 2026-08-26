import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import fs from 'fs'
import chalk from 'chalk'
import { messageQueue, commandQueue, mediaQueue } from './lib/queue.js'
import antibot from './plugins/anti/antibot.js'

const {
  proto,
  downloadContentFromMessage,
  downloadMediaMessage,
  normalizeMessageContent,
  extractMessageContent,
  extractMessageContentDeep,
  getContentType
} = await import('@chatunity/baileys')

const isNumber = x => typeof x === 'number' && !isNaN(x)
const isArray = x => Array.isArray(x)
const safeArray = x => Array.isArray(x) ? x : []
const delay = ms => isNumber(ms) && ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : null

async function simulateHumanTyping(conn, chatId) {
  if (!conn || !chatId) return
  try {
    await conn.sendPresenceUpdate('composing', chatId)
    const typingDelay = 500 + Math.random() * 1000
    await new Promise(resolve => setTimeout(resolve, typingDelay))
  } catch (error) {
    console.error('[TYPING] Errore:', error)
  }
}

async function stopTyping(conn, chatId) {
  if (!conn || !chatId) return
  try {
    await conn.sendPresenceUpdate('paused', chatId)
  } catch (error) {
    console.error('[TYPING] Errore stop:', error)
  }
}

global.ignoredUsersGlobal = global.ignoredUsersGlobal || new Set()
global.ignoredUsersGroup = global.ignoredUsersGroup || {}
global.groupSpam = global.groupSpam || {}
global.processedMessages = global.processedMessages || new Set()
global.groupMetaCache = global.groupMetaCache || new Map()
global.runtimeSystems = global.runtimeSystems || {}
global.owner = global.owner || []
global.mods = global.mods || []
global.promoteDemoteCache = global.promoteDemoteCache || new Map()
global.kickReasons = global.kickReasons || new Map()

const DUPLICATEWINDOW = 3000
const GROUPMETACACHETTL = 300000
const MEDIAGIFDIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'media', 'gif')
const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')

function getRuntimeSystems(logger = console) {
  if (global.runtimeSystems.initialized) return global.runtimeSystems

  const manager = global.connectionManager

  const rawRateLimiter = manager?.subsystems?.rateLimiter
  const antiBan = rawRateLimiter
    ? {
        reportError(error, ctx) { rawRateLimiter.reportError() },
        reportSuccess() { rawRateLimiter.reportSuccess() },
        getAdaptiveDelay() { return 0 },
        getStats() { return rawRateLimiter.status || {} }
      }
    : {
        reportError() {},
        reportSuccess() {},
        getAdaptiveDelay() { return 0 },
        getStats() { return {} }
      }

  const rawMetrics = manager?.subsystems?.metrics
  const metricsTimers = new Map()
  const metrics = rawMetrics
    ? {
        startTimer(name) {
          const id = Symbol(name || 'timer')
          metricsTimers.set(id, rawMetrics.startTimer(name || 'unnamed'))
          return id
        },
        endTimer(id) {
          const stopFn = metricsTimers.get(id)
          if (stopFn) { stopFn(); metricsTimers.delete(id) }
        },
        recordMessageSent() { rawMetrics.increment('messages.sent') },
        recordError(msg) { rawMetrics.increment('errors') },
        getReport() { return rawMetrics.snapshot() }
      }
    : {
        startTimer() { return Date.now() },
        endTimer() {},
        recordMessageSent() {},
        recordError() {},
        getReport() { return {} }
      }

  const crashPrevention = {
    registerRecoveryStrategy() {},
    async protectedExecute(fn) { return await fn() },
    onExit() {}
  }

  const makeLimiter = () => ({ async add(fn) { return await fn() } })

  const errorHandler = {
    async handleError(error) { return { recovered: false, error } }
  }

  const security = {
    validateInput() { return { valid: true, sanitized: null } },
    encryptSensitiveData(data) { return data },
    trackIP() { return true }
  }

  global.runtimeSystems = {
    initialized: true,
    antiBan,
    crashPrevention,
    limiterMessage: makeLimiter(),
    limiterCommand: makeLimiter(),
    limiterMedia: makeLimiter(),
    metrics,
    errorHandler,
    security
  }

  return global.runtimeSystems
}

function selectQueue(m) {
  if (m.isCommand || (typeof m.text === 'string' && (m.text.startsWith('.') || m.text.startsWith('#')))) return commandQueue
  if (m.mtype?.includes('image') || m.mtype?.includes('video')) return messageQueue
  if (m.mtype?.includes('audio') || m.mtype?.includes('document') || m.mtype?.includes('sticker')) return mediaQueue
  return messageQueue
}

function selectLimiter(m, systems) {
  if (m.isCommand || (typeof m.text === 'string' && (m.text.startsWith('.') || m.text.startsWith('#')))) return systems.limiterCommand
  if (m.mtype?.includes('audio') || m.mtype?.includes('document') || m.mtype?.includes('sticker') || m.mtype?.includes('image') || m.mtype?.includes('video')) return systems.limiterMedia
  return systems.limiterMessage
}

function getJidUser(jid) {
  return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function formatUserTag(jid) {
  return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : 'sconosciuto'
}

function toReasonString(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function normalizeKickReasonInput(input) {
  if (typeof input === 'string') {
    return {
      type: 'manual',
      reason: input.trim() || 'motivo non specificato',
      details: '',
      source: 'unknown',
      messageId: null,
      rawText: '',
      extra: null
    }
  }

  if (!input || typeof input !== 'object') {
    return {
      type: 'manual',
      reason: 'motivo non specificato',
      details: '',
      source: 'unknown',
      messageId: null,
      rawText: '',
      extra: null
    }
  }

  return {
    type: toReasonString(input.type || 'manual') || 'manual',
    reason: toReasonString(input.reason) || 'motivo non specificato',
    details: toReasonString(input.details),
    source: toReasonString(input.source || 'unknown') || 'unknown',
    messageId: input.messageId || null,
    rawText: toReasonString(input.rawText),
    extra: input.extra ?? null
  }
}

function setKickReason(chatId, userId, input, by = null) {
  if (!chatId || !userId) return false
  const key = `${chatId}:${userId}`
  const normalized = normalizeKickReasonInput(input)

  global.kickReasons.set(key, {
    ...normalized,
    by: by || null,
    at: Date.now()
  })

  setTimeout(() => global.kickReasons.delete(key), 5 * 60 * 1000)
  return true
}

function getKickReason(chatId, userId) {
  if (!chatId || !userId) return null
  return global.kickReasons.get(`${chatId}:${userId}`) || null
}

function deleteKickReason(chatId, userId) {
  if (!chatId || !userId) return false
  return global.kickReasons.delete(`${chatId}:${userId}`)
}

function getKickEventLabel(type = '') {
  switch ((type || '').toLowerCase()) {
    case 'spam': return 'spam'
    case 'antilink': return 'anti-link'
    case 'antitraba': return 'anti-traba'
    case 'kickcmd': return 'comando kick'
    case 'ban': return 'ban'
    case 'manual': return 'rimozione manuale'
    default: return 'remove'
  }
}

function formatKickReason(kickInfo) {
  if (!kickInfo) {
    return {
      label: 'remove',
      reason: 'remove rilevato da evento',
      details: '',
      source: 'evento gruppo'
    }
  }

  return {
    label: getKickEventLabel(kickInfo.type),
    reason: toReasonString(kickInfo.reason) || 'motivo non specificato',
    details: toReasonString(kickInfo.details),
    source: toReasonString(kickInfo.source || 'unknown') || 'unknown'
  }
}

function shouldLogKickEvent(chat, kickInfo, author) {
  if (chat?.modlog === false) return false

  const type = (kickInfo?.type || '').toLowerCase()

  if (type === 'spam' && chat?.modlogSpam === false) return false
  if (type === 'antilink' && chat?.modlogAntilink === false) return false
  if (type === 'antitraba' && chat?.modlogAntitraba === false) return false
  if (type === 'kickcmd' && chat?.modlogKick === false) return false
  if (type === 'ban' && chat?.modlogBan === false) return false
  if (type === 'manual' && chat?.modlogManual === false) return false

  if (!kickInfo && !author && chat?.modlogUnknown === false) return false
  return true
}

function buildKickLogText({ groupName, user, actor, kickInfo }) {
  void groupName
  void user
  void actor
  void kickInfo
  return ''
}

function invalidateGroupMetaCache(chatId) {
  if (!chatId) return
  global.groupMetaCache.delete(chatId)
}

async function getGroupMetadataCached(conn, chatId, force = false) {
  const cached = global.groupMetaCache.get(chatId)
  if (!force && cached && Date.now() - cached.timestamp < GROUPMETACACHETTL) return cached.data
  const metadata = await conn.groupMetadata(chatId).catch(() => null)
  if (metadata) global.groupMetaCache.set(chatId, { data: metadata, timestamp: Date.now() })
  return metadata || cached?.data || null
}

function normalizePhoneJid(value) {
  if (typeof value !== 'string') return null
  if (value.includes('@')) return value
  const digits = value.replace(/\D/g, '')
  return digits ? `${digits}@s.whatsapp.net` : null
}

function hasAdminRole(participant) {
  return participant?.admin === 'admin' || participant?.admin === 'superadmin'
}

async function getComparableJids(conn, jid, participants) {
  const variants = new Set()
  const list = safeArray(participants)

  const addCandidate = value => {
    if (typeof value !== 'string' || !value) return
    variants.add(value)
    const decoded = conn.decodeJid ? conn.decodeJid(value) : value
    if (typeof decoded === 'string') variants.add(decoded)
    const normalized = normalizePhoneJid(value.trim())
    if (normalized) variants.add(normalized)
    const user = getJidUser(value)
    if (user) {
      variants.add(`${user}@lid`)
      variants.add(`${user}@s.whatsapp.net`)
    }
  }

  addCandidate(jid)
  const user = getJidUser(jid)
  const participant = list.find(entry => {
    const values = [entry?.id, entry?.jid, entry?.lid, entry?.phoneNumber, entry?.pn, entry?.participantPn]
    return values.some(value => {
      if (typeof value !== 'string') return false
      const normalized = normalizePhoneJid(value.trim())
      const decoded = conn.decodeJid ? conn.decodeJid(value) : value
      return (typeof normalized === 'string' && variants.has(normalized)) || getJidUser(decoded) === user
    })
  })

  if (participant) {
    addCandidate(participant.id)
    addCandidate(participant.jid)
    addCandidate(participant.lid)
    addCandidate(participant.phoneNumber)
    addCandidate(participant.pn)
    addCandidate(participant.participantPn)
    addCandidate(getParticipantPhoneJid(conn, participant))
  }

  const getPnById =
    typeof conn.getPNById === 'function' ? conn.getPNById.bind(conn) :
    typeof conn.getPNForLID === 'function' ? conn.getPNForLID.bind(conn) : null

  const getLidById =
    typeof conn.getLIDById === 'function' ? conn.getLIDById.bind(conn) :
    typeof conn.getLIDForPN === 'function' ? conn.getLIDForPN.bind(conn) : null

  for (const candidate of [...variants]) {
    if (getPnById) {
      try { addCandidate(await getPnById(candidate)) } catch {}
    }
    if (getLidById) {
      try { addCandidate(await getLidById(candidate)) } catch {}
    }
  }

  return variants
}

async function findParticipantByJid(conn, jid, participants) {
  const list = safeArray(participants)
  if (!jid || !list.length) return null
  const variants = await getComparableJids(conn, jid, list)
  const user = getJidUser(jid)

  return list.find(participant => {
    const values = [participant?.id, participant?.jid, participant?.lid, participant?.phoneNumber, participant?.pn, participant?.participantPn]
    return values.some(value => {
      if (typeof value !== 'string') return false
      const normalized = normalizePhoneJid(value.trim())
      const decoded = conn.decodeJid ? conn.decodeJid(value) : value
      return (typeof normalized === 'string' && variants.has(normalized)) || getJidUser(decoded) === user
    })
  }) || null
}

function getParticipantPhoneJid(conn, participant) {
  const candidates = [participant?.phoneNumber, participant?.pn, participant?.participantPn, participant?.jid, participant?.id]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !candidate) continue
    const normalized = candidate.includes('@') ? candidate : `${candidate.replace(/\D/g, '')}@s.whatsapp.net`
    if (!normalized.endsWith('@s.whatsapp.net')) continue
    return conn.decodeJid ? conn.decodeJid(normalized) : normalized
  }
  return participant?.id ? (conn.decodeJid ? conn.decodeJid(participant.id) : participant.id) : null
}

async function resolveMentionJid(conn, jid, participants) {
  if (!jid || typeof jid !== 'string') return jid
  const normalized = conn.decodeJid ? conn.decodeJid(jid) : jid
  const jidUser = getJidUser(normalized)
  const list = safeArray(participants)

  const match = list.find(participant => {
    const participantId = conn.decodeJid ? conn.decodeJid(participant?.id) : participant?.id
    const participantLid = conn.decodeJid ? conn.decodeJid(participant?.lid) : participant?.lid
    const participantPhone = normalizePhoneJid(participant?.phoneNumber)
    const participantPn = normalizePhoneJid(participant?.pn)
    const participantParticipantPn = normalizePhoneJid(participant?.participantPn)
    const values = [participantId, participantLid, participantPhone, participantPn, participantParticipantPn].filter(Boolean)
    return values.some(value => value === normalized || getJidUser(value) === jidUser)
  })

  if (match) return getParticipantPhoneJid(conn, match) || (conn.decodeJid ? conn.decodeJid(match.id) : match.id) || normalized
  return normalized
}

function isSuspiciousText(text) {
  if (typeof text !== 'string') return false
  if (text.length > 12000) return true
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text)) return true
  if (/(.)\1{150,}/s.test(text)) return true
  return false
}

function sanitizeText(text) {
  if (typeof text !== 'string') return ''
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').slice(0, 4096)
}

async function safeReply(conn, m, text) {
  if (!text) return
  const systems = getRuntimeSystems(console)
  const adaptiveDelay = Number(systems.antiBan.getAdaptiveDelay?.() || 0)
  if (adaptiveDelay > 0) await delay(adaptiveDelay)

  await simulateHumanTyping(conn, m.chat)

  try {
    const result = await conn.sendMessage(m.chat, { text }, { quoted: m })
    systems.antiBan.reportSuccess?.()
    systems.metrics.recordMessageSent?.()
    return result
  } catch (error) {
    systems.antiBan.reportError?.(error, { context: 'safeReply' })
    systems.metrics.recordError?.(error?.message || 'safeReplyError')
    throw error
  } finally {
    await stopTyping(conn, m.chat)
  }
}

export async function handler(chatUpdate) {
  const systems = getRuntimeSystems(console)
  if (!global.db.data.stats) global.db.data.stats = {}
  const stats = global.db.data.stats
  const activePlugins = Object.entries(global.plugins).filter(([, plugin]) => plugin && !plugin.disabled)

  this.msgqueque = this.msgqueque || []
  if (!chatUpdate?.messages?.length) return
  if (chatUpdate.type && chatUpdate.type !== 'notify') return

  return await systems.crashPrevention.protectedExecute(async () => {
    this.pushMessage(chatUpdate.messages).catch(console.error)

    for (let rawMessage of safeArray(chatUpdate.messages)) {
      if (!rawMessage?.key?.id) continue

      const msgId = rawMessage.key.id
      if (global.processedMessages.has(msgId)) continue
      global.processedMessages.add(msgId)
      setTimeout(() => global.processedMessages.delete(msgId), DUPLICATEWINDOW)

      if (global.db.data == null) await global.loadDatabase()

      let m = smsg(this, rawMessage, rawMessage)
      if (!m) continue

      if (typeof m.text !== 'string') m.text = ''
      m.text = sanitizeText(m.text)

      const securityValidation = systems.security.validateInput?.({
        text: m.text,
        sender: m.sender,
        chat: m.chat,
        id: msgId
      })

      if (securityValidation && securityValidation.valid === false) continue
      if (isSuspiciousText(m.text)) continue

      if (m.isGroup) {
        const sourceMentions = safeArray(m.msg?.contextInfo?.mentionedJid || m.mentionedJid)
        if (sourceMentions.length) {
          try {
            const metaData = await getGroupMetadataCached(this, m.chat)
            const parts = safeArray(metaData?.participants)
            const resolved = await Promise.all(sourceMentions.map(jid => resolveMentionJid(this, jid, parts)))
            m.mentionedJid = safeArray(resolved.filter(Boolean))
            if (typeof m.text === 'string') {
              const resolvedUsers = safeArray(resolved)
                .map(jid => {
                  const decoded = this.decodeJid ? this.decodeJid(jid) : jid
                  return getJidUser(decoded)
                })
                .filter(Boolean)
              let mentionIndex = 0
              m.text = m.text.replace(/@(\d{5,20})/g, full => {
                const nextUser = resolvedUsers[mentionIndex++]
                return nextUser ? `@${nextUser}` : full
              })
            }
          } catch {}
        }
      }

      for (const [name, plugin] of activePlugins) {
        const filename = join(dirname, name)
        if (typeof plugin?.all === 'function') {
          try {
            await plugin.all.call(this, m, chatUpdate, { dirname, filename })
          } catch (e) {
            console.error('Errore in plugin.all', name, e)
            systems.metrics.recordError?.(`pluginAll:${name}`)
          }
        }
      }

      if (m.commandBlocked) continue

      const queue = selectQueue(m)
      const limiter = selectLimiter(m, systems)

      await queue.add(async () => {
        const timerId = systems.metrics.startTimer?.('processMessage')
        try {
          const adaptiveDelay = Number(systems.antiBan.getAdaptiveDelay?.() || 0)
          if (adaptiveDelay > 0) await delay(adaptiveDelay)

          await limiter.add(async () =>
            await systems.crashPrevention.protectedExecute(async () =>
              await processMessage.call(this, m, chatUpdate, stats, activePlugins, systems)
            ),
            { timeout: 45000, priority: m.isCommand ? 2 : 1 }
          )
          systems.antiBan.reportSuccess?.()
        } catch (error) {
          systems.antiBan.reportError?.(error, { context: 'messageProcess', messageId: msgId, chat: m.chat })
          systems.metrics.recordError?.(error?.message || 'processError')
          try {
            await systems.errorHandler.handleError?.(error, { maxRetries: 2, context: 'handlerQueue' })
          } catch {}
          if (error?.message !== 'timeout') console.error('Errore processamento messaggio', msgId, error.message)
        } finally {
          systems.metrics.endTimer?.(timerId)
        }
      }).catch(async err => {
        systems.antiBan.reportError?.(err, { context: 'queueAdd' })
        systems.metrics.recordError?.(err?.message || 'queueError')
        if (err.message !== 'timeout') console.error('Errore coda', err)
      }, { timeout: 120000 })
    }
  }).catch(async error => {
    systems.antiBan.reportError?.(error, { context: 'handlerRoot' })
    systems.metrics.recordError?.(error?.message || 'handlerRootError')
    try {
      await systems.errorHandler.handleError?.(error, { maxRetries: 1, context: 'handlerRoot' })
    } catch {}
    console.error(error)
  })
}

async function processMessage(m, chatUpdate, stats, activePlugins, systems) {
  try {
    m.exp = 0
    m.limit = false
    m.money = false

    try {
      let user = global.db.data.users[m.sender]
      if (typeof user !== 'object') global.db.data.users[m.sender] = user = {}
      if (user) {
        if (!isNumber(user.messaggi)) user.messaggi = 0
        if (!isNumber(user.blasphemy)) user.blasphemy = 0
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.money)) user.money = 0
        if (!isNumber(user.warn)) user.warn = 0
        if (!isNumber(user.joincount)) user.joincount = 2
        if (!('premium' in user)) user.premium = false
        if (!isNumber(user.premiumDate)) user.premiumDate = -1
        if (!('name' in user)) user.name = m.name
        if (!('muto' in user)) user.muto = false
        if (!isNumber(user.level)) user.level = 0
        if (!isNumber(user.limit)) user.limit = 15000
        if (!isNumber(user.premiumTime)) user.premiumTime = 0
      } else global.db.data.users[m.sender] = {
        messaggi: 0,
        blasphemy: 0,
        exp: 0,
        money: 0,
        warn: 0,
        joincount: 2,
        limit: 15000,
        premium: false,
        premiumDate: -1,
        premiumTime: 0,
        level: 0,
        name: m.name,
        muto: false
      }

      let chat = global.db.data.chats[m.chat]
      if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
      chat = global.db.data.chats[m.chat]

      if (!('isBanned' in chat)) chat.isBanned = false
      if (!('detect' in chat)) chat.detect = true
      if (!('delete' in chat)) chat.delete = false
      if (!('antiLink' in chat)) chat.antiLink = true
      if (!('antiTraba' in chat)) chat.antiTraba = true
      if (!('antispia' in chat)) chat.antispia = true
      if (!('antioneview' in chat)) chat.antioneview = true
      if (!('modlog' in chat)) chat.modlog = true
      if (!('modlogSpam' in chat)) chat.modlogSpam = true
      if (!('modlogAntilink' in chat)) chat.modlogAntilink = true
      if (!('modlogAntitraba' in chat)) chat.modlogAntitraba = true
      if (!('modlogKick' in chat)) chat.modlogKick = true
      if (!('modlogBan' in chat)) chat.modlogBan = true
      if (!('modlogManual' in chat)) chat.modlogManual = true
      if (!('modlogUnknown' in chat)) chat.modlogUnknown = true
      if (!isNumber(chat.expired)) chat.expired = 0
      if (!isNumber(chat.messaggi)) chat.messaggi = 0
      if (!('name' in chat)) chat.name = this.getName(m.chat)
      if (!('antispamcomandi' in chat)) chat.antispamcomandi = true
      if (!('welcome' in chat)) chat.welcome = true
      if (!('bye' in chat)) chat.bye = 'welcome' in chat ? !!chat.welcome : true
      if (!isArray(chat.moderators)) chat.moderators = []

      let settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = settings = {}
      if (settings) {
        if (!('self' in settings)) settings.self = false
        if (!('autoread' in settings)) settings.autoread = false
        if (!('restrict' in settings)) settings.restrict = true
        if (!('antiCall' in settings)) settings.antiCall = false
      } else global.db.data.settings[this.user.jid] = {
        self: false,
        autoread: false,
        restrict: true,
        antiCall: false
      }
    } catch (e) {
      console.error(e)
      systems.metrics.recordError?.(e?.message || 'dbInitError')
    }

    if (opts['nyimak']) return
    if (!m.fromMe && opts['self']) return
    if (opts['pconly'] && m.chat.endsWith('g.us')) return
    if (opts['gconly'] && !m.chat.endsWith('g.us')) return

        if (typeof m.text !== 'string') m.text = ''
    m.text = sanitizeText(m.text)

        const ownerList = safeArray(global.owner)
    const modList = safeArray(global.mods)

    const extractNumberFromJid = (jid) => {
      if (!jid || typeof jid !== 'string') return ''
      return jid.split('@')[0].replace(/[^0-9]/g, '')
    }

    const ownerNumbers = ownerList
      .map(entry => isArray(entry) ? entry[0] : entry)
      .filter(v => typeof v === 'string')
      .map(v => v.replace(/[^0-9]/g, ''))
      .filter(n => n.length > 5)

    const modNumbers = modList
      .filter(v => typeof v === 'string')
      .map(v => v.replace(/[^0-9]/g, ''))
      .filter(n => n.length > 5)

    const botNumber = ownerNumbers[0] || extractNumberFromJid(this.user.jid || this.user?.id)
    
    let realSenderNumber = ''
    
    if (m.isGroup) {
      const metadata = await getGroupMetadataCached(this, m.chat)
      const participants = safeArray(metadata?.participants)
      
      const participant = participants.find(p => {
        const pid = this.decodeJid ? this.decodeJid(p?.id) : p?.id
        const plid = this.decodeJid ? this.decodeJid(p?.lid) : p?.lid
        const pjid = p?.jid
        return pid === m.sender || plid === m.sender || pjid === m.sender
      })
      
      if (participant) {
        const phoneJid = getParticipantPhoneJid(this, participant)
        realSenderNumber = extractNumberFromJid(phoneJid || participant?.id || participant?.jid)
      }
    }
    
    if (!realSenderNumber) {
      realSenderNumber = extractNumberFromJid(m.sender)
    }

    const realFromMe = realSenderNumber === botNumber
    const fakeFromMe = m.fromMe && !realFromMe  

    if (fakeFromMe) {
      return
    }

    const isROwner = ownerNumbers.includes(realSenderNumber)
    const isOwner2 = isROwner || realFromMe
    const isMods = isOwner2 || modNumbers.includes(realSenderNumber)
    const isPrems = isROwner || isOwner2 || isMods || (global.db.data.users[m.sender]?.premiumTime > 0)

    if (opts['queque'] && m.text && !isMods && !isPrems) {
      let queque = this.msgqueque
      let time = 5000
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      const interval = setInterval(async function () {
        if (queque.indexOf(previousID) === -1) {
          clearInterval(interval)
          await delay(time)
        }
      }, time)
    }

    if (m.isBaileys) return

    m.exp += Math.ceil(Math.random() * 10)
    let usedPrefix

    let user = global.db.data?.users?.[m.sender]
    let groupMetadata
    if (m.isGroup) groupMetadata = await getGroupMetadataCached(this, m.chat)

    await antibot(m, { conn: this }).catch(e => console.error('Antibot error', e))

    let participants = m.isGroup ? safeArray(groupMetadata?.participants) : []
    let normalizedParticipants = safeArray(participants).map(u => {
      const rawId = typeof u?.id === 'string' ? u.id : typeof u?.jid === 'string' ? u.jid : ''
      const normalizedId = this.decodeJid ? this.decodeJid(rawId) : rawId
      return {
        ...u,
        id: normalizedId || rawId,
        jid: u?.jid || normalizedId || rawId
      }
    })

    let participantUser = m.isGroup ? await findParticipantByJid(this, m.sender, normalizedParticipants) : {}
    let bot = m.isGroup ? await findParticipantByJid(this, this.user.jid, normalizedParticipants) : {}

    let isRAdmin = participantUser?.admin === 'superadmin' || false
    let isAdmin = m.isGroup ? hasAdminRole(participantUser) : false
    let isBotAdmin = m.isGroup ? hasAdminRole(bot) : false
    let isModerator = m.isGroup
      ? isAdmin || isOwner2 || safeArray(global.db.data.chats[m.chat]?.moderators).includes(m.sender)
      : false

    if (m.isGroup && (!participantUser || !Object.keys(participantUser).length || !bot || !Object.keys(bot).length)) {
      const freshMetadata = await getGroupMetadataCached(this, m.chat, true)
      const freshParticipants = safeArray(freshMetadata?.participants)
      if (freshParticipants.length) {
        groupMetadata = freshMetadata
        participants = freshParticipants
        normalizedParticipants = freshParticipants.map(u => {
          const rawId = typeof u?.id === 'string' ? u.id : typeof u?.jid === 'string' ? u.jid : ''
          const normalizedId = this.decodeJid ? this.decodeJid(rawId) : rawId
          return {
            ...u,
            id: normalizedId || rawId,
            jid: u?.jid || normalizedId || rawId
          }
        })
        participantUser = await findParticipantByJid(this, m.sender, normalizedParticipants)
        bot = await findParticipantByJid(this, this.user.jid, normalizedParticipants)
        isRAdmin = participantUser?.admin === 'superadmin' || false
        const freshIsAdminFromParticipant = participantUser?.admin === 'admin' || participantUser?.admin === 'superadmin'
        const freshIsAdmin = m.isGroup && freshIsAdminFromParticipant && (isOwner2 || isMods || ownerNumbers.includes(realSenderNumber) || modNumbers.includes(realSenderNumber))
        const freshIsBotAdmin = m.isGroup && hasAdminRole(bot)
        const freshIsModerator = m.isGroup && (freshIsAdminFromParticipant && (isOwner2 || isMods)) || safeArray(global.db.data.chats[m.chat]?.moderators).includes(m.sender) && (isOwner2 || isMods)
        isAdmin = freshIsAdmin
        isBotAdmin = freshIsBotAdmin
        isModerator = freshIsModerator
      }
    }

    if (m.commandBlocked) return

    for (const [name, plugin] of activePlugins) {
      const filename = join(dirname, name)
      if (!opts['restrict'] && plugin?.tags?.includes('admin')) continue
      if (typeof plugin?.before === 'function') {
        try {
          const shouldContinue = await plugin.before.call(this, m, {
            conn: this,
            participants: normalizedParticipants,
            groupMetadata,
            user: participantUser,
            bot,
            isROwner,
            isOwner: isOwner2,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isModerator,
            isPrems,
            chatUpdate,
            dirname,
            filename,
            setKickReason
          })
          if (shouldContinue) continue
        } catch (e) {
          console.error('Errore in plugin.before', name, e)
          systems.metrics.recordError?.(`pluginBefore:${name}`)
        }
      }
    }

    for (const [name, plugin] of activePlugins) {
      const filename = join(dirname, name)
      if (!opts['restrict'] && plugin?.tags?.includes('admin')) continue

      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      let prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix
      let match = prefix instanceof RegExp
        ? prefix.exec(m.text)
        : Array.isArray(prefix)
          ? prefix.map(p => {
              let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
              return [re.exec(m.text), re]
            }).find(p => p[0])
          : typeof prefix === 'string'
            ? [new RegExp(str2Regex(prefix)).exec(m.text), new RegExp(str2Regex(prefix))]
            : [new RegExp().exec(m.text), new RegExp()]

      if (Array.isArray(match)) {
        if (!match[0]) continue
        match = match[0]
      }

      if (typeof plugin !== 'function') continue
      if (!match) continue

      usedPrefix = match[0]
      let noPrefix = m.text.replace(usedPrefix, '')
      let [command, ...args] = noPrefix.trim().split(/\s+/).filter(v => v)
      args = noPrefix.trim().split(/\s+/).slice(1)
      let text = sanitizeText(args.join(' '))
      command = (command || '').toLowerCase()

      let fail = plugin.fail || global.dfail

      let isAccept = plugin.command instanceof RegExp
        ? plugin.command.test(command)
        : Array.isArray(plugin.command)
          ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command)
          : typeof plugin.command === 'string'
            ? plugin.command === command
            : false

      if (!isAccept) continue
      m.plugin = name

      if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
        let chat = global.db.data.chats[m.chat]
        let userDb = global.db.data.users[m.sender]
        if (name !== 'owner-banchat&unbanchat.js' && chat?.isBanned) return
        if (name !== 'owner-unbanuser.js' && userDb?.banned) return
      }

      let chatDb = global.db.data.chats[m.chat]
      let adminMode = chatDb?.soloadmin
      let mystica = plugin.botAdmin || plugin.admin || plugin.group || plugin.command

      if (adminMode && !isOwner2 && !isROwner && m.isGroup && !isAdmin && !isModerator && mystica) {
        await fail('moderator', m, this)
        continue
      }

      if (plugin.rowner && plugin.owner && !isROwner && !isOwner2) {
        await fail('owner', m, this)
        continue
      }
      if (plugin.rowner && !isROwner) {
        await fail('rowner', m, this)
        continue
      }
      if (plugin.owner && !isOwner2) {
        await fail('owner', m, this)
        continue
      }
      if (plugin.mods && !isMods) {
        await fail('mods', m, this)
        continue
      }
      if (plugin.premium && !isPrems) {
        await fail('premium', m, this)
        continue
      }
      if (plugin.group && !m.isGroup) {
        await fail('group', m, this)
        continue
      }
      if (plugin.botAdmin && !isBotAdmin) {
        await fail('botAdmin', m, this)
        continue
      }
      if (plugin.private && m.isGroup) {
        await fail('private', m, this)
        continue
      }
      if (plugin.register === true && user?.registered === false) {
        await fail('unreg', m, this)
        continue
      }

      const hasCustomModeratorRole = m.isGroup
        ? isOwner2 || isROwner || safeArray(global.db.data.chats[m.chat]?.moderators).includes(m.sender)
        : false

      const canUseModeratorCommand = m.isGroup
        ? isAdmin || hasCustomModeratorRole || isOwner2 || isROwner
        : true

      if (plugin.admin || plugin.moderator) {
        if (!canUseModeratorCommand) {
          await fail('moderator', m, this)
          continue
        }
      }

      m.isCommand = true
      let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
      if (xp > 2000) {
        await safeReply(this, m, 'Exp limit')
        continue
      } else if (plugin.money && (global.db.data.users[m.sender]?.money || 0) < plugin.money) {
        await fail('senzasoldi', m, this)
        continue
      }

      m.exp += xp
      if (!isPrems && plugin.limit && (global.db.data.users[m.sender]?.limit || 0) < plugin.limit) continue
      if ((plugin.level || 0) > (user?.level || 0)) {
        await safeReply(this, m, 'livello troppo basso')
        continue
      }

      let extra = {
        match,
        usedPrefix,
        noPrefix,
        args,
        command,
        text,
        conn: this,
        normalizedParticipants,
        participants,
        groupMetadata,
        user: participantUser,
        bot,
        isROwner,
        isOwner: isOwner2,
        isRAdmin,
        isAdmin,
        isBotAdmin,
        isModerator,
        isPrems,
        chatUpdate,
        dirname,
        filename,
        mentionedJid: safeArray(m.mentionedJid),
        antiBan: systems.antiBan,
        metrics: systems.metrics,
        errorHandler: systems.errorHandler,
        security: systems.security,
        setKickReason
      }

      try {
        await simulateHumanTyping(this, m.chat)

        const pluginTimer = systems.metrics.startTimer?.(`plugin:${name}`)
        await systems.crashPrevention.protectedExecute(async () => await plugin.call(this, m, extra), { timeout: 60000 })
        systems.metrics.endTimer?.(pluginTimer)

        if (!isPrems) m.limit = m.limit || plugin.limit || false
        m.money = m.money || plugin.money || false
        systems.antiBan.reportSuccess?.()
      } catch (e) {
        m.error = e
        systems.antiBan.reportError?.(e, { context: 'pluginCall', plugin: name, command })
        systems.metrics.recordError?.(e?.message || `pluginCall:${name}`)
        console.error(e)
        try {
          await systems.errorHandler.handleError?.(e, { maxRetries: 2, context: 'pluginCall', plugin: name, command })
        } catch {}
        if (e) {
          let textErr = format(e)
          for (let key of Object.values(global.APIKeys || {})) {
            textErr = textErr.replace(new RegExp(key, 'g'), 'HIDDEN')
          }
          textErr = sanitizeText(textErr.slice(0, 3000))
          await safeReply(this, m, textErr).catch(() => {})
        }
      } finally {
        await stopTyping(this, m.chat)

        if (typeof plugin.after === 'function') {
          try {
            await plugin.after.call(this, m, extra)
          } catch (e) {
            console.error('Errore in plugin.after', name, e)
            systems.metrics.recordError?.(`pluginAfter:${name}`)
          }
        }
      }
      break
    }
  } catch (e) {
    console.error(e)
    systems.antiBan.reportError?.(e, { context: 'processMessageRoot' })
    systems.metrics.recordError?.(e?.message || 'processMessageRoot')
  } finally {
    if (opts['queque'] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
    }

    if (m?.sender) {
      let user = global.db.data.users[m.sender]
      let chat = global.db.data.chats[m.chat]

      const isMutedHere = user &&
        (user.muto === true || (typeof user.muto === 'object' && user.muto?.[m.chat]))

      if (isMutedHere) {
        await this.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant
          }
        }).catch(console.error)
      }

      if (user) {
        user.exp += m.exp || 0
        user.limit -= m.limit || 0
        user.money -= m.money || 0
        user.messaggi += 1
      }
      if (chat) chat.messaggi += 1
    }

    if (m?.plugin) {
      let now = new Date()
      if (!stats[m.plugin]) stats[m.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0 }
      const stat = stats[m.plugin]
      stat.total += 1
      stat.last = now
      if (!m.error) {
        stat.success += 1
        stat.lastSuccess = now
      }
    }

    const sysStats = systems.antiBan.getStats?.() || {}
    global.db.data.system = global.db.data.system || {}
    global.db.data.system.metrics = systems.metrics.getReport?.()
    global.db.data.system.antiBan = sysStats

    if (typeof global.markDbDirty === 'function') global.markDbDirty()

    try {
      if (!opts['noprint']) (await import('./lib/print.js')).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }

    if (opts['autoread']) await this.readMessages([m.key]).catch(() => {})
  }
}

function getEventActor(update, fallback = null) {
  const candidates = [
    update?.author,
    update?.participant,
    update?.actor,
    update?.sender,
    fallback
  ]

  return candidates.find(value => typeof value === 'string' && value.length) || null
}

async function resolvePersistedMediaPayload(conn, mediaType, mediaContent) {
  if (!mediaType || mediaContent == null) return null

  const fetchUrlBuffer = async (url) => {
    if (!url || !/^https?:\/\//i.test(url)) return null
    try {
      const response = await fetch(url)
      if (!response.ok) return null
      const bytes = Buffer.from(await response.arrayBuffer())
      return bytes.length > 0 ? bytes : null
    } catch (error) {
      console.error('[WELCOME_MEDIA] fetch URL failed', error)
      return null
    }
  }

  if (typeof mediaContent === 'string') {
    const normalizedPath = mediaContent.trim()
    const candidatePath = normalizedPath.startsWith('/') || normalizedPath.startsWith('\\') || /^[A-Za-z]:[\\/]/.test(normalizedPath)
      ? normalizedPath
      : path.resolve(process.cwd(), normalizedPath.includes('media') ? normalizedPath : path.join('media', normalizedPath))

    if (fs.existsSync(candidatePath)) {
      const fileBuffer = fs.readFileSync(candidatePath)
      if (fileBuffer && fileBuffer.length > 0) return fileBuffer
    }

    const fetched = await fetchUrlBuffer(normalizedPath)
    if (fetched) return fetched
    return null
  }

  if (Buffer.isBuffer(mediaContent)) return mediaContent
  if (ArrayBuffer.isView(mediaContent) || mediaContent instanceof ArrayBuffer) {
    return Buffer.from(mediaContent)
  }
  if (mediaContent && typeof mediaContent === 'object' && mediaContent.type === 'Buffer' && Array.isArray(mediaContent.data)) {
    return Buffer.from(mediaContent.data)
  }

  const directUrl = typeof mediaContent?.url === 'string' && /^https?:\/\//i.test(mediaContent.url) ? mediaContent.url : null
  const directPath = typeof mediaContent?.directPath === 'string' && mediaContent.directPath ? mediaContent.directPath : null

  const localCandidatePaths = [
    directPath,
    mediaContent?.path,
    mediaContent?.filePath,
    mediaContent?.localPath,
    path.resolve(process.cwd(), 'media', String(mediaContent?.name || ''))
  ].filter(Boolean)

  for (const candidatePath of localCandidatePaths) {
    if (!candidatePath || typeof candidatePath !== 'string') continue
    const resolved = path.resolve(process.cwd(), candidatePath)
    if (fs.existsSync(resolved)) {
      const fileBuffer = fs.readFileSync(resolved)
      if (fileBuffer && fileBuffer.length > 0) return fileBuffer
    }
  }

  if (directUrl) {
    const fetched = await fetchUrlBuffer(directUrl)
    if (fetched) return fetched
  }

  if (mediaContent && typeof mediaContent === 'object') {
    const typeName = mediaType === 'sticker' ? 'sticker' : (mediaType === 'image' ? 'image' : mediaType)
    try {
      const stream = await downloadContentFromMessage(mediaContent, typeName)
      const chunks = []
      for await (const chunk of stream) chunks.push(Buffer.from(chunk))
      const downloaded = Buffer.concat(chunks)
      if (downloaded.length > 0) {
        return downloaded
      }
    } catch (error) {
      console.error('[WELCOME_MEDIA] downloadContentFromMessage failed', error)
    }
  }

  const messageType = mediaType === 'sticker' ? 'stickerMessage' : `${mediaType}Message`
  const wrapper = {
    key: { id: `welcome-media-${Date.now()}` },
    message: { [messageType]: mediaContent }
  }

  try {
    const downloaded = await conn.downloadMediaMessage?.(wrapper, 'buffer', {}, { logger: console })
    if (downloaded?.length) return downloaded
  } catch (error) {
    console.error('[WELCOME_MEDIA] downloadMediaMessage failed', error)
  }

  return null
}

function normalizeMentionJid(conn, jid) {
  if (!jid || typeof jid !== 'string') return null

  const candidates = [jid.trim()]
  const decoded = conn.decodeJid ? conn.decodeJid(jid) : jid
  if (decoded && decoded !== jid) candidates.push(decoded)

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'string') continue

    const value = candidate.trim()
    if (value.endsWith('@s.whatsapp.net')) return value

    if (value.endsWith('@lid')) {
      const mapped = global.lidCache?.get(value) || global.jidCache?.get(value)
      if (typeof mapped === 'string') {
        const normalizedMapped = normalizeMentionJid(conn, mapped)
        if (normalizedMapped) return normalizedMapped
      }

      const number = value.split('@')[0].split(':')[0].replace(/\D/g, '')
      if (/^\d+$/.test(number)) return `${number}@s.whatsapp.net`
    }

    const number = value.split('@')[0].split(':')[0].replace(/\D/g, '')
    if (/^\d+$/.test(number)) return `${number}@s.whatsapp.net`
  }

  return null
}

async function resolvePhoneMentionJid(conn, jid, participants = []) {
  if (!jid) return null

  const original = String(jid)
  const decoded = conn.decodeJid ? conn.decodeJid(original) : original
  const originalUser = getJidUser(decoded)

  const participant = participants.find(entry => {
    const values = [
      entry?.id,
      entry?.jid,
      entry?.lid,
      entry?.phoneNumber,
      entry?.pn,
      entry?.participantPn
    ].filter(value => typeof value === 'string')

    return values.some(value => {
      const valueDecoded = conn.decodeJid ? conn.decodeJid(value) : value
      return value === original || valueDecoded === decoded || getJidUser(valueDecoded) === originalUser
    })
  })

  const candidates = [
    participant?.phoneNumber,
    participant?.pn,
    participant?.participantPn,
    participant?.id,
    participant?.jid,
    participant?.lid,
    original
  ]

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'string') continue

    let value = candidate

    try {
      if (value.endsWith('@lid') && typeof conn.getPNForLID === 'function') {
        value = await conn.getPNForLID(value)
      } else if (value.endsWith('@lid') && typeof conn.getPNById === 'function') {
        value = await conn.getPNById(value)
      }
    } catch {}

    const normalized = normalizeMentionJid(conn, value)
    if (normalized?.endsWith('@s.whatsapp.net')) return normalized
  }

  return normalizeMentionJid(conn, original)
}
export async function participantsUpdate(update) {
  const systems = getRuntimeSystems(console)
  if (opts['self']) return
  if (this.isInit) return
  if (global.db.data == null) await global.loadDatabase()

  const id = update?.id
  const rawParticipants = safeArray(update?.participants)
  const action = update?.action
  const eventAuthor = getEventActor(update)

  if (!id || !rawParticipants.length || !action) return

  invalidateGroupMetaCache(id)

  let chat = global.db.data.chats[id]
  if (typeof chat !== 'object') global.db.data.chats[id] = {}
  chat = global.db.data.chats[id]

  if (!('welcome' in chat)) chat.welcome = true
  if (!('bye' in chat)) chat.bye = true
  if (!('modlog' in chat)) chat.modlog = true
  if (!('modlogSpam' in chat)) chat.modlogSpam = true
  if (!('modlogAntilink' in chat)) chat.modlogAntilink = true
  if (!('modlogAntitraba' in chat)) chat.modlogAntitraba = true
  if (!('modlogKick' in chat)) chat.modlogKick = true
  if (!('modlogBan' in chat)) chat.modlogBan = true
  if (!('modlogManual' in chat)) chat.modlogManual = true
  if (!('modlogUnknown' in chat)) chat.modlogUnknown = true

  const groupMetadata = await this.groupMetadata(id).catch(() => this.chats[id]?.metadata || {})
  const groupName = groupMetadata?.subject || await this.getName(id)
  const groupParticipants = safeArray(groupMetadata?.participants)

  switch (action) {
case 'add': {
  if (!chat.welcome) break

  const mentionJids = []
  for (const participant of [...new Set(rawParticipants)]) {
    const mentionJid = await resolvePhoneMentionJid(this, participant, groupParticipants)
    const normalized = normalizeMentionJid(this, mentionJid)
    if (normalized && !mentionJids.includes(normalized)) mentionJids.push(normalized)
  }

  if (!mentionJids.length) break

  const tags = mentionJids.map(user => `@${getJidUser(user) || 'sconosciuto'}`).join(' ')
  const welcomeText = (chat.sWelcome || 'Benvenuti @user in @group')
    .replace(/@subject/g, groupName)
    .replace(/@group/g, groupName)
    .replace(/@desc/g, groupMetadata?.desc?.toString() || 'Nessuna descrizione disponibile')
    .replace(/@user/g, tags)

  const text = sanitizeText(welcomeText)

if (chat.sWelcomeMedia && chat.sWelcomeMediaType) {
  const fs = await import('fs')
  const mediaPath = chat.sWelcomeMedia
  const mediaType = chat.sWelcomeMediaType
  const isGif = chat.sWelcomeIsGif || false

  if (fs.existsSync(mediaPath)) {
    const buffer = fs.readFileSync(mediaPath)

    if (mediaType === 'image') {
      await this.sendMessage(id, {
        image: buffer,
        caption: text,
        mentions: mentionJids,
        mimetype: 'image/jpeg'
      })
    } else if (mediaType === 'video') {
      await this.sendMessage(id, {
        video: buffer,
        caption: text,
        mentions: mentionJids,
        mimetype: 'video/mp4',  // ← DEVE ESSERE video/mp4
        gifPlayback: isGif       // ← QUESTO FA LA DIFFERENZA
      })
    } else if (mediaType === 'sticker') {
      await this.sendMessage(id, {
        sticker: buffer,
        mimetype: 'image/webp'
      })
      await this.sendMessage(id, {
        text,
        mentions: mentionJids
      })
    }
  } else {
    await this.sendMessage(id, {
      text,
      mentions: mentionJids
    })
  }
} else {
  await this.sendMessage(id, {
    text,
    mentions: mentionJids
  })
}

  systems.antiBan.reportSuccess?.()
  systems.metrics.recordMessageSent?.()
  break
}

    case 'remove': {
      for (const participant of rawParticipants) {
        const user = await resolvePhoneMentionJid(this, participant, groupParticipants) || participant
        const kickInfo = getKickReason(id, participant) || getKickReason(id, user)

        if (kickInfo) {
          const actor = kickInfo.by || eventAuthor || null

          if (shouldLogKickEvent(chat, kickInfo, actor)) {
            const logText = buildKickLogText({
              groupName,
              user,
              actor,
              kickInfo
            })


            void logText
          }

          deleteKickReason(id, participant)
          deleteKickReason(id, user)
          continue
        }

        if (!chat.bye) continue

        const byeText = sanitizeText((chat.sBye || 'Arrivederci @user')
          .replace(/@group/g, groupName)
          .replace(/@user/g, `@${getJidUser(user) || 'sconosciuto'}`))

        if (chat.sByeMedia && chat.sByeMediaType) {
  const fs = await import('fs')
  const mediaPath = chat.sByeMedia
  const mediaType = chat.sByeMediaType
  const isGif = chat.sByeIsGif || mediaPath.toLowerCase().endsWith('.gif')

  if (fs.existsSync(mediaPath)) {
    const buffer = fs.readFileSync(mediaPath)

    if (mediaType === 'image') {
      await this.sendMessage(id, {
        image: buffer,
        caption: byeText,
        mentions: [user],
        mimetype: 'image/jpeg'
      })
    } else if (mediaType === 'video') {
      await this.sendMessage(id, {
        video: buffer,
        caption: byeText,
        mentions: [user],
        mimetype: isGif ? 'image/gif' : 'video/mp4',
        gifPlayback: isGif
      })
    } else if (mediaType === 'sticker') {
      await this.sendMessage(id, {
        sticker: buffer,
        mimetype: 'image/webp'
      })
      await this.sendMessage(id, {
        text: byeText,
        mentions: [user]
      })
    }
  } else {
    await this.sendMessage(id, {
      text: byeText,
      mentions: [user]
    })
  }
} else {
  await this.sendMessage(id, {
    text: byeText,
    mentions: [user]
  })
}
      }
      break
    }

    case 'promote':
    case 'demote': {
      const isPromote = action === 'promote'
      const eventActor = eventAuthor || null

      for (const participant of rawParticipants) {
        const user = await resolvePhoneMentionJid(this, participant, groupParticipants) || participant
        const normalizedUser = normalizeMentionJid(this, user) || user
        const normalizedParticipant = normalizeMentionJid(this, participant) || participant
        const cacheKey = `${action}:${id}:${normalizedUser}`

        const commandAuthor = global.groupActionAuthors?.get(`${action}:${id}:${normalizedParticipant}`) || global.groupActionAuthors?.get(`${action}:${id}:${participant}`)
        const actor = commandAuthor || eventActor || null

        const normalizedActor = normalizeMentionJid(this, actor) || actor
        const actorTag = normalizedActor ? `@${getJidUser(normalizedActor) || 'admin'}` : '@admin'
        const userTag = `@${getJidUser(normalizedUser) || 'sconosciuto'}`

        let text = isPromote
          ? (chat.sPromote || `${userTag} è stato promosso ad amministratore. Modificato da ${actorTag}`)
          : (chat.sDemote || `${userTag} non è più amministratore. Modificato da ${actorTag}`)

        text = text
          .replace(/@group/g, groupName)
          .replace(/@user/g, userTag)
          .replace(/@author/g, actorTag)

        text = sanitizeText(text)

        await this.sendMessage(id, {
          text,
          mentions: [normalizedUser, normalizedActor].filter(Boolean)
        }).catch(error => {
          systems.antiBan.reportError?.(error, { context: `participantsUpdate:${action}` })
          systems.metrics.recordError?.(error?.message || `participantsUpdate:${action}`)
        })
      }
      break
    }
  }
}

export async function groupsUpdate(groupsUpdate) {
  const systems = getRuntimeSystems(console)
  if (opts['self']) return

  for (const groupUpdate of safeArray(groupsUpdate)) {
    const id = groupUpdate?.id
    if (!id) continue

    invalidateGroupMetaCache(id)

    let chats = global.db.data.chats[id]
    let text = ''
    if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || 'immagine modificata').replace('@icon', groupUpdate.icon)
    if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || 'link reimpostato, nuovo link: @revoke').replace('@revoke', groupUpdate.revoke)
    if (!text) continue

    text = sanitizeText(text)
    const adaptiveDelay = Number(systems.antiBan.getAdaptiveDelay?.() || 0)
    if (adaptiveDelay > 0) await delay(adaptiveDelay)

    await this.sendMessage(id, { text, mentions: safeArray(this.parseMention?.(text)) })
      .then(() => {
        systems.antiBan.reportSuccess?.()
        systems.metrics.recordMessageSent?.()
      })
      .catch(error => {
        systems.antiBan.reportError?.(error, { context: 'groupsUpdate' })
        systems.metrics.recordError?.(error?.message || 'groupsUpdate')
      })
  }
}

export async function callUpdate(callUpdate) {
  const systems = getRuntimeSystems(console)
  let isAnticall = global.db.data.settings?.[this.user.jid]?.antiCall
  if (!isAnticall) return

  for (let nk of safeArray(callUpdate)) {
    if (!nk?.isGroup && nk?.status === 'offer') {
      const adaptiveDelay = Number(systems.antiBan.getAdaptiveDelay?.() || 0)
      if (adaptiveDelay > 0) await delay(adaptiveDelay)

      let callmsg = await this.reply(
        nk.from,
        `ciao @${nk.from.split('@')[0]}, c'è l'anticall.`,
        false,
        { mentions: [nk.from] }
      ).catch(console.error)

      let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
TEL;waid=39351396399139:+39 351 396 3991
X-ABLabel:WA-BIZ
END:VCARD`

      await this.sendMessage(nk.from, {
        contacts: {
          displayName: 'Unlimited',
          contacts: [{ vcard }]
        }
      }, { quoted: callmsg }).catch(console.error)

      await this.updateBlockStatus(nk.from, 'block').catch(console.error)
      systems.metrics.recordMessageSent?.()
    }
  }
}

export async function deleteUpdate(message) {
  return
}

global.dfail = async function (type, m, conn) {
  let msg = {
    rowner: `╭═━ 〖 ⚠️ Accesso negato 〗═━⪩
│❍ Solo il proprietario reale può usare questo comando.
╰━━━━━━━━━⪩`,
    owner: `╭═━ 〖 ⚠️ Accesso negato 〗═━⪩
│❍ Solo il proprietario può usare questo comando.
╰━━━━━━━━━⪩`,
    mods: `╭═━ 〖 ⚠️ Accesso negato 〗═━⪩
│❍ Solo i moderatori possono usare questo comando.
╰━━━━━━━━━⪩`,
    premium: `╭═━ 〖 ⚠️ Accesso negato 〗═━⪩
│❍ Solo gli utenti premium possono usare questo comando.
╰━━━━━━━━━⪩`,
    group: `╭═━ 〖 ⚠️ Comando non disponibile 〗═━⪩
│❍ Questo comando si può usare solo nei gruppi.
╰━━━━━━━━━⪩`,
    private: `╭═━ 〖 ⚠️ Comando non disponibile 〗═━⪩
│❍ Questo comando si può usare solo in privato.
╰━━━━━━━━━⪩`,
    admin: `╭═━ 〖 ⚠️ Permessi insufficienti 〗═━⪩
│❍ Solo gli admin possono usare questo comando.
╰━━━━━━━━━⪩`,
    moderator: `╭═━ 〖 ⚠️ Permessi insufficienti 〗═━⪩
│❍ Solo i moderatori possono usare questo comando.
╰━━━━━━━━━⪩`,
    botAdmin: `╭═━ 〖 ⚠️ Permessi mancanti 〗═━⪩
│❍ Il bot deve essere admin per usare questo comando.
╰━━━━━━━━━⪩`,
    restrict: `╭═━ 〖 ⚠️ Funzione limitata 〗═━⪩
│❍ Questa funzione non è disponibile ora.
╰━━━━━━━━━⪩`
}[type]

  if (!msg || !conn?.sendMessage || !m?.chat) return

  try {
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
  } catch (error) {
    console.error('Errore invio messaggio permessi', error)
    return conn.sendMessage(m.chat, { text: msg }).catch(fallbackError => {
      console.error('Errore fallback messaggio permessi', fallbackError)
    })
  }
}

const file = fileURLToPath(import.meta.url)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.redBright('Update handler.js'))
  if (global.reloadHandler) console.log(await global.reloadHandler())
})
