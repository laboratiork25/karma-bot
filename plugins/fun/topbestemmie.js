const bestemmiaGradi = [
  { min: 1, max: 24, nome: "Peccatore Occasionale", emoji: "😐" },
  { min: 25, max: 49, nome: "Empio Recidivo", emoji: "😶‍🌫️" },
  { min: 50, max: 74, nome: "Blasfemo Iniziato", emoji: "🩸" },
  { min: 75, max: 99, nome: "Eretico Consacrato", emoji: "🔥" },
  { min: 100, max: 149, nome: "Scomunicato Ufficiale", emoji: "🕯️" },
  { min: 150, max: 299, nome: "Profanatore Supremo", emoji: "⚰️" },
  { min: 300, max: Infinity, nome: "Avatar della Bestemmia", emoji: "⛧" }
]

function getJidUser(jid) {
  return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function normalizePhoneJid(value) {
  if (typeof value !== 'string' || !value) return null
  if (value.includes('@')) return value
  const digits = value.replace(/\D/g, '')
  return digits ? `${digits}@s.whatsapp.net` : null
}

function getBlasphemyRank(count = 0) {
  return bestemmiaGradi.find(g => count >= g.min && count <= g.max) || {
    nome: 'Eresiarca Anonimo',
    emoji: '❓'
  }
}

function getComparableSet(conn, participant = {}) {
  const out = new Set()

  const add = value => {
    if (typeof value !== 'string' || !value) return
    out.add(value)
    const decoded = conn.decodeJid ? conn.decodeJid(value) : value
    if (decoded) out.add(decoded)
    const normalized = normalizePhoneJid(value)
    if (normalized) out.add(normalized)
    const user = getJidUser(value)
    if (user) {
      out.add(`${user}@s.whatsapp.net`)
      out.add(`${user}@lid`)
    }
  }

  add(participant.id)
  add(participant.jid)
  add(participant.lid)
  add(participant.phoneNumber)
  add(participant.pn)
  add(participant.participantPn)

  return out
}

function isSameUser(conn, dbJid, comparableSet) {
  if (!dbJid || !comparableSet?.size) return false
  const variants = new Set()

  const add = value => {
    if (typeof value !== 'string' || !value) return
    variants.add(value)
    const decoded = conn.decodeJid ? conn.decodeJid(value) : value
    if (decoded) variants.add(decoded)
    const normalized = normalizePhoneJid(value)
    if (normalized) variants.add(normalized)
    const user = getJidUser(value)
    if (user) {
      variants.add(`${user}@s.whatsapp.net`)
      variants.add(`${user}@lid`)
    }
  }

  add(dbJid)

  for (const value of variants) {
    if (comparableSet.has(value)) return true
  }

  const dbUser = getJidUser(dbJid)
  if (!dbUser) return false

  for (const value of comparableSet) {
    if (getJidUser(value) === dbUser) return true
  }

  return false
}

function formatTopLine(index, jid, count) {
  const grado = getBlasphemyRank(count)
  const pos = ['🥇', '🥈', '🥉'][index] || `#${index + 1}`
  return `${pos} @${getJidUser(jid)}
┃ 📊 Bestemmie: *${count}*
┃ 🎖️ Grado: *${grado.nome}* ${grado.emoji}`
}

const handler = async (m, { conn, participants }) => {
  try {
    if (!m.isGroup) return m.reply('❌ Questo comando si usa solo nei gruppi')

    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat?.bestemmiometro) {
      return m.reply('❌ Il bestemmiometro non è attivo in questo gruppo')
    }

    const dbUsers = global.db?.data?.users || {}
    const participantSets = (participants || []).map(p => ({
      raw: p,
      set: getComparableSet(conn, p)
    }))

    const ranking = Object.entries(dbUsers)
      .map(([jid, user]) => ({
        jid,
        blasphemy: Number(user?.blasphemy || 0)
      }))
      .filter(item => item.blasphemy > 0)
      .filter(item => participantSets.some(p => isSameUser(conn, item.jid, p.set)))
      .sort((a, b) => b.blasphemy - a.blasphemy)
      .slice(0, 10)

    if (!ranking.length) {
      return m.reply('📭 Nessuna bestemmia registrata tra i membri attuali del gruppo')
    }

    const mentions = ranking.map(item => {
      const match = participantSets.find(p => isSameUser(conn, item.jid, p.set))
      if (!match) return item.jid
      const preferred = match.raw.phoneNumber ? normalizePhoneJid(match.raw.phoneNumber) : null
      return preferred || conn.decodeJid?.(match.raw.id) || match.raw.jid || item.jid
    })

    const totalBestemmie = ranking.reduce((sum, item) => sum + item.blasphemy, 0)

    const testo = `╭━ ƌɽɛɑƌ-ʙᴏᴛ-𐌱𐍉𐍄━╮
┃ 🏆 Top bestemmie del gruppo
╰━━━━━━━━━━━━━╯

${ranking.map((item, index) => formatTopLine(index, item.jid, item.blasphemy)).join('\n\n')}

📊 Totale top 10: *${totalBestemmie}*`

    await conn.sendMessage(m.chat, {
      text: testo,
      footer: '𝐁𝚺𝐒𝑻𝚺𝐌𝐌𝕀𝚶𝐌𝚺𝑻𝑹𝚯🛐',
      buttons: [
        {
          buttonId: '.topbestemmie',
          buttonText: { displayText: '🔄 𝐀𝐆𝐆𝐈𝚯𝐑𝐍𝐀 𝐂𝐋𝐀𝐒𝐒𝕀𝐅𝐈𝐂𝐀' },
          type: 1
        }
      ],
      mentions,
      headerType: 1
    }, { quoted: m })
  } catch (e) {
    console.error('Errore topbestemmie:', e)
    m.reply(`${global.errore || '❌ Si è verificato un errore'}`)
  }
}

handler.help = ['topbestemmie']
handler.tags = ['gruppo']
handler.command = /^(topbestemmie|classificabestemmie|rankbestemmie)$/i
handler.group = true

export default handler