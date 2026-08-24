let handler = async (m, { conn }) => {
  const userId = m.sender
  const groupId = m.chat

  global.db.data.users = global.db.data.users || {}

  const user1 = m.sender
  const mentionedJid = (m.mentionedJid && m.mentionedJid[0]) || ''

  if (!mentionedJid) {
    return m.reply('❌ Devi menzionare un utente per combattere.')
  }

  const user2 = mentionedJid

  const p1 = Array.isArray(global.db.data.users[user1]?.pokemons)
    ? global.db.data.users[user1].pokemons
    : []

  const p2 = Array.isArray(global.db.data.users[user2]?.pokemons)
    ? global.db.data.users[user2].pokemons
    : []

  if (!p1.length) {
    return m.reply('⚠️ Non hai Pokémon per combattere.')
  }

  if (!p2.length) {
    return m.reply('⚠️ Il tuo avversario non ha Pokémon.')
  }

  const rawPoke1 = pickRandom(p1)
  const rawPoke2 = pickRandom(p2)

  const poke1 = normalizePokemon(rawPoke1)
  const poke2 = normalizePokemon(rawPoke2)

  const power1 = poke1.level + randBetween(-10, 10)
  const power2 = poke2.level + randBetween(-10, 10)

  let resultText
  if (power1 > power2) {
    resultText = `🏆 Vittoria di @${user1.split('@')[0]}`
  } else if (power2 > power1) {
    resultText = `🏆 Vittoria di @${user2.split('@')[0]}`
  } else {
    resultText = '🤝 Pareggio!'
  }

  const battleText = `⚔️ *Battaglia Pokémon*\n\n` +
    `👤 *${'@' + user1.split('@')[0]}* usa *${poke1.name}* (Lvl ${poke1.level}, ${poke1.rarity})\n` +
    `👤 *${'@' + user2.split('@')[0]}* usa *${poke2.name}* (Lvl ${poke2.level}, ${poke2.rarity})\n\n` +
    `💥 Potenza ${poke1.name}: *${power1}*\n` +
    `💥 Potenza ${poke2.name}: *${power2}*\n\n` +
    `${resultText}`

  await conn.sendMessage(
    m.chat,
    {
      text: battleText,
      mentions: [user1, user2]
    },
    { quoted: m }
  )
}

handler.help = ['combatti @utente']
handler.tags = ['pokemon']
handler.command = /^(combatti|battle)$/i

export default handler

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function normalizePokemon(pokemon = {}) {
  return {
    name: pokemon?.name || pokemon?.nome || 'Sconosciuto',
    level: Number.isFinite(Number(pokemon?.level)) ? Number(pokemon.level) : 1,
    rarity: pokemon?.rarity || pokemon?.rarita || 'Comune'
  }
}
