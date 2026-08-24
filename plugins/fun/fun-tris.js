const trisRooms = global.trisRooms || (global.trisRooms = {})

const EMPTY = '▫️'
const X = '❌'
const O = '⭕'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const args = (text || '').trim().split(/\s+/).filter(Boolean)
  const sub = (args[0] || '').toLowerCase()
  const roomName = (args[1] || '').toLowerCase().trim()

  if (!sub) return m.reply(helpText(usedPrefix, command))

  if (sub === 'crea') {
    if (!roomName) {
      return m.reply(`❌ Usa così:\n*${usedPrefix + command} crea nomestanza*\n*${usedPrefix + command} crea nomestanza bot*`)
    }

    if (trisRooms[roomName]) return m.reply(`❌ La stanza *${roomName}* esiste già.`)

    const vsBot = (args[2] || '').toLowerCase() === 'bot'

    trisRooms[roomName] = {
      name: roomName,
      chat: m.chat,
      creator: m.sender,
      playerX: m.sender,
      playerO: vsBot ? 'bot' : null,
      mode: vsBot ? 'bot' : 'pvp',
      status: vsBot ? 'playing' : 'waiting',
      board: Array(9).fill(EMPTY),
      turn: X,
      messageId: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    if (!vsBot) {
      return conn.sendMessage(m.chat, {
        text:
`🎮 *STANZA TRIS CREATA*
📛 Nome: *${roomName}*
👤 Creatore: @${m.sender.split('@')[0]}

Per entrare:
*${usedPrefix + command} entra ${roomName}*

Per vedere le stanze:
*${usedPrefix + command} lista*`,
        mentions: [m.sender]
      }, { quoted: m })
    }

    const room = trisRooms[roomName]
    const sent = await conn.sendMessage(m.chat, {
      text:
`🎮 *TRIS VS BOT*
📛 Stanza: *${room.name}*

${renderBoard(room.board)}

*ISTRUZIONI*
1. Rispondi a *questo messaggio*
2. Scrivi solo un numero da *1 a 9*
3. Il numero è la casella dove vuoi giocare

Esempio:
*5*

Tu sei ${X}
Bot è ${O}
Inizi tu.`,
      mentions: [room.playerX]
    }, { quoted: m })

    room.messageId = sent?.key?.id || null
    return
  }

  if (sub === 'entra') {
    if (!roomName) return m.reply(`❌ Usa così:\n*${usedPrefix + command} entra nomestanza*`)

    const room = trisRooms[roomName]
    if (!room) return m.reply(`❌ La stanza *${roomName}* non esiste.`)
    if (room.mode !== 'pvp') return m.reply(`❌ Questa stanza è contro il bot.`)
    if (room.status !== 'waiting') return m.reply(`❌ La stanza *${roomName}* è già piena.`)
    if (room.playerX === m.sender) return m.reply(`❌ Non puoi entrare nella tua stessa stanza.`)

    room.playerO = m.sender
    room.status = 'playing'
    room.updatedAt = Date.now()

    const sent = await conn.sendMessage(m.chat, {
      text:
`🔥 *PARTITA INIZIATA*
📛 Stanza: *${room.name}*
❌ @${room.playerX.split('@')[0]}
⭕ @${room.playerO.split('@')[0]}

${renderBoard(room.board)}

*ISTRUZIONI*
1. Rispondi a *questo messaggio*
2. Scrivi solo un numero da *1 a 9*
3. Il numero è la casella dove vuoi giocare

Tocca a: ${X} @${room.playerX.split('@')[0]}`,
      mentions: [room.playerX, room.playerO]
    }, { quoted: m })

    room.messageId = sent?.key?.id || null
    return
  }

  if (sub === 'lista') {
    const rooms = Object.values(trisRooms).filter(r => r.chat === m.chat)
    if (!rooms.length) return m.reply('📭 Nessuna stanza tris attiva in questa chat.')

    const txt = rooms.map(r => {
      const opponent = r.mode === 'bot' ? 'bot' : r.playerO ? '@' + r.playerO.split('@')[0] : 'in attesa'
      return `• *${r.name}* — ${r.status} — @${r.playerX.split('@')[0]} vs ${opponent}`
    }).join('\n')

    const mentions = [...new Set(rooms.flatMap(r => [r.playerX, r.playerO].filter(Boolean).filter(v => v !== 'bot')))]

    return conn.sendMessage(m.chat, {
      text: `📚 *STANZE ATTIVE*\n\n${txt}`,
      mentions
    }, { quoted: m })
  }

  if (sub === 'stato') {
    if (!roomName) return m.reply(`❌ Usa così:\n*${usedPrefix + command} stato nomestanza*`)

    const room = trisRooms[roomName]
    if (!room) return m.reply(`❌ La stanza *${roomName}* non esiste.`)

    const current = room.turn === X ? room.playerX : room.playerO
    const currentText = current === 'bot' ? 'bot' : current ? '@' + current.split('@')[0] : 'in attesa'

    return conn.sendMessage(m.chat, {
      text:
`📋 *STATO STANZA*
📛 Nome: *${room.name}*
📌 Stato: *${room.status}*

${renderBoard(room.board)}

Turno: ${room.turn} ${currentText}`,
      mentions: [room.playerX, room.playerO].filter(Boolean).filter(v => v !== 'bot')
    }, { quoted: m })
  }

  if (sub === 'chiudi') {
    if (!roomName) return m.reply(`❌ Usa così:\n*${usedPrefix + command} chiudi nomestanza*`)

    const room = trisRooms[roomName]
    if (!room) return m.reply(`❌ La stanza *${roomName}* non esiste.`)

    const allowed = [room.creator, room.playerX, room.playerO].includes(m.sender) || m.fromMe
    if (!allowed) return m.reply('❌ Solo chi ha creato la stanza o chi gioca può chiuderla.')

    delete trisRooms[roomName]
    return m.reply(`🧹 Stanza *${roomName}* chiusa.`)
  }

  return m.reply(helpText(usedPrefix, command))
}

handler.before = async function (m, { conn }) {
  if (!m.isGroup) return
  if (!m.quoted?.id) return
  if (!m.text) return

  const text = m.text.trim()
  if (!/^[1-9]$/.test(text)) return

  const room = Object.values(trisRooms).find(r =>
    r.chat === m.chat &&
    r.status === 'playing' &&
    r.messageId &&
    r.messageId === m.quoted.id
  )

  if (!room) return

  const currentPlayer = room.turn === X ? room.playerX : room.playerO

  if (currentPlayer !== 'bot' && m.sender !== currentPlayer) {
    await conn.sendMessage(m.chat, {
      text: `⏳ Non è il tuo turno.`,
      mentions: currentPlayer === 'bot' ? [] : [currentPlayer]
    }, { quoted: m })
    return true
  }

  const position = Number(text) - 1

  if (room.board[position] !== EMPTY) {
    await conn.sendMessage(m.chat, {
      text: '❌ Casella occupata.\nRispondi di nuovo con un numero libero da 1 a 9.'
    }, { quoted: m })
    return true
  }

  room.board[position] = room.turn
  room.updatedAt = Date.now()

  const result = checkWinner(room.board)

  if (result.winner) {
    const winner = room.turn === X ? room.playerX : room.playerO
    const winnerText = winner === 'bot' ? 'bot' : '@' + winner.split('@')[0]

    await conn.sendMessage(m.chat, {
      text:
`🏆 *PARTITA FINITA*
📛 Stanza: *${room.name}*

${renderBoard(room.board)}

Vincitore: ${winnerText} ${result.winner}`,
      mentions: winner === 'bot' ? [] : [winner]
    }, { quoted: m })

    delete trisRooms[room.name]
    return true
  }

  if (isDraw(room.board)) {
    await conn.sendMessage(m.chat, {
      text:
`🤝 *PAREGGIO*
📛 Stanza: *${room.name}*

${renderBoard(room.board)}`
    }, { quoted: m })

    delete trisRooms[room.name]
    return true
  }

  room.turn = room.turn === X ? O : X

  if (room.mode === 'bot' && room.turn === O) {
    const botMove = getBotMove(room.board)
    room.board[botMove] = O
    room.updatedAt = Date.now()

    const botResult = checkWinner(room.board)

    if (botResult.winner) {
      await conn.sendMessage(m.chat, {
        text:
`🤖 *IL BOT HA VINTO*
📛 Stanza: *${room.name}*

${renderBoard(room.board)}`
      }, { quoted: m })

      delete trisRooms[room.name]
      return true
    }

    if (isDraw(room.board)) {
      await conn.sendMessage(m.chat, {
        text:
`🤝 *PAREGGIO COL BOT*
📛 Stanza: *${room.name}*

${renderBoard(room.board)}`
      }, { quoted: m })

      delete trisRooms[room.name]
      return true
    }

    room.turn = X

    const sent = await conn.sendMessage(m.chat, {
      text:
`🤖 Il bot ha giocato.

${renderBoard(room.board)}

Ora tocca a te ${X}

*Rispondi a questo messaggio con un numero da 1 a 9.*`,
      mentions: [room.playerX]
    }, { quoted: m })

    room.messageId = sent?.key?.id || room.messageId
    return true
  }

  const nextPlayer = room.turn === X ? room.playerX : room.playerO

  const sent = await conn.sendMessage(m.chat, {
    text:
`✅ Mossa registrata

${renderBoard(room.board)}

Tocca a ${room.turn} @${nextPlayer.split('@')[0]}

*Rispondi a questo messaggio con un numero da 1 a 9.*`,
    mentions: [room.playerX, room.playerO].filter(Boolean).filter(v => v !== 'bot')
  }, { quoted: m })

  room.messageId = sent?.key?.id || room.messageId
  return true
}

handler.help = ['tris crea <stanza>', 'tris crea <stanza> bot', 'tris entra <stanza>', 'tris lista', 'tris stato <stanza>', 'tris chiudi <stanza>']
handler.tags = ['giochi']
handler.command = /^(tris|tictactoe|ttt)$/i
handler.group = true
handler.register = true

export default handler

function renderBoard(board) {
  const view = board.map((cell, i) => cell === EMPTY ? String(i + 1) + '️⃣' : cell)
  return `${view[0]} ${view[1]} ${view[2]}\n${view[3]} ${view[4]} ${view[5]}\n${view[6]} ${view[7]} ${view[8]}`
}

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (const [a, b, c] of lines) {
    if (board[a] !== EMPTY && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a] }
    }
  }

  return { winner: null }
}

function isDraw(board) {
  return board.every(cell => cell !== EMPTY)
}

function getBotMove(board) {
  const free = board.map((v, i) => v === EMPTY ? i : null).filter(v => v !== null)

  for (const i of free) {
    const copy = [...board]
    copy[i] = O
    if (checkWinner(copy).winner === O) return i
  }

  for (const i of free) {
    const copy = [...board]
    copy[i] = X
    if (checkWinner(copy).winner === X) return i
  }

  if (board[4] === EMPTY) return 4

  const corners = [0, 2, 6, 8].filter(i => board[i] === EMPTY)
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)]

  return free[Math.floor(Math.random() * free.length)]
}

function helpText(prefix, command) {
  return `🎮 *TRIS*

*Comandi*
${prefix + command} crea nomestanza
${prefix + command} crea nomestanza bot
${prefix + command} entra nomestanza
${prefix + command} lista
${prefix + command} stato nomestanza
${prefix + command} chiudi nomestanza

*Come si gioca*
1. Crea o entra in una stanza
2. Il bot manda la griglia
3. Devi rispondere al messaggio del tris
4. Scrivi solo un numero da 1 a 9`
}