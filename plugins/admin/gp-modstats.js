const handler = async (m, { conn }) => {
  const users = global.db.data.users || {}
  const entries = Object.entries(users)

  const topWarn = entries
    .filter(([_, user]) => (user.modWarn || 0) > 0)
    .sort((a, b) => (b[1].modWarn || 0) - (a[1].modWarn || 0))
    .slice(0, 10)

  const topKick = entries
    .filter(([_, user]) => (user.modKick || 0) > 0)
    .sort((a, b) => (b[1].modKick || 0) - (a[1].modKick || 0))
    .slice(0, 10)

  const topMute = entries
    .filter(([_, user]) => ((user.modMute || 0) + (user.modUnmute || 0)) > 0)
    .sort((a, b) => ((b[1].modMute || 0) + (b[1].modUnmute || 0)) - ((a[1].modMute || 0) + (a[1].modUnmute || 0)))
    .slice(0, 10)

  const formatList = (arr, key, key2 = null) => {
    if (!arr.length) return 'Nessun dato'
    return arr.map(([jid, user], i) => {
      const total = key2 ? (user[key] || 0) + (user[key2] || 0) : (user[key] || 0)
      return `${i + 1}. @${jid.split('@')[0]} — ${total}`
    }).join('\n')
  }

  const text = [
    `🧑‍⚖️ *MOD STATS*`,
    '',
    `⚠️ *Top Warn*`,
    formatList(topWarn, 'modWarn'),
    '',
    `👢 *Top Kick*`,
    formatList(topKick, 'modKick'),
    '',
    `🔇 *Top Mute/Unmute*`,
    formatList(topMute, 'modMute', 'modUnmute')
  ].join('\n')

  const mentions = [
    ...topWarn.map(([jid]) => jid),
    ...topKick.map(([jid]) => jid),
    ...topMute.map(([jid]) => jid)
  ]

  return conn.sendMessage(m.chat, {
    text,
    mentions: [...new Set(mentions)]
  }, { quoted: m })
}

handler.command = ['modstats']
handler.admin = true;
handler.moderator = true;

export default handler