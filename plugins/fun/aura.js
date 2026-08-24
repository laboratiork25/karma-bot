import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'storage', 'file-json', 'aura.json')
const dbDir = path.dirname(dbPath)
const mediaDir = path.join(process.cwd(), 'media')
const topAuraImg = path.join(mediaDir, 'topaura.jpg')
const auraGainImg = path.join(mediaDir, 'auragain.jpg')
const auraLossImg = path.join(mediaDir, 'auraloss.png')

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const cooldowns = new Map()

const auraGames = {
  flex: {
    emoji: '🕶️',
    cooldown: 20,
    success: [
      'Hai flexato così bene che pure i silenziosi hanno annuito.',
      'Entrata da protagonista, uscita da leggenda.',
      'Bro ha droppato presenza scenica e il gruppo ha accusato il colpo.',
      'Flex pulito, zero sbavature, aura in pump.',
      'Hai fatto il figo nel modo giusto, senza sembrare disperato.',
      'Flex breve, preciso, chirurgico.',
      'Hai mandato una vibe talmente pesante che l’aria si è piegata.',
      'Ti sei mosso da boss e nessuno ha osato controbattere.',
      'Hai flexato con una calma che sa di dominio.',
      'Una scena così pulita che sembrava scritta.',
      'Ti è uscito un flex da edit premium.',
      'Hai fatto capire chi comanda senza dire quasi nulla.'
    ],
    fail: [
      'Hai provato a flexare ma sembravi tuo cugino alla recita di terza media.',
      'Flex respinto dal gruppo con effetto boomerang.',
      'Hai fatto il figo e il gruppo ti ha restituito solo imbarazzo.',
      'Volevi aura, hai trovato solo silenzio giudicante.',
      'Hai provato a dominare la scena e ti si è girata contro.',
      'Flex forzato, vibe spezzata, danno certificato.',
      'Sembravi più in cerca di approvazione che di gloria.',
      'Hai lanciato il flex e lui è tornato indietro come una ciabatta.',
      'Il gruppo ti ha lasciato cuocere nel cringe.',
      'Hai cercato il momento perfetto e hai centrato l’imbarazzo.',
      'Troppo gasato, poca resa.',
      'Flex tentato, dignità in cooldown.'
    ],
    rareSuccess: [
      'Cinema assoluto. Aura stocks alle stelle.',
      'Final boss energy. Hai piegato la chat.',
      'Flex mitologico. La scena adesso ha il tuo nome.',
      'Aura nucleare. Hai lasciato un cratere sociale.'
    ],
    rareFail: [
      'Disastro storico. Hai perso aura davanti a troppi testimoni.',
      'Hai tirato un flex così brutto che il gruppo ha avuto pena.',
      'Crollo verticale di reputazione. Brutale.',
      'Hai sbagliato tutto con una sicurezza inquietante.'
    ],
    normalWin: [6, 12],
    normalLose: [5, 11],
    rareWin: [18, 28],
    rareLose: [16, 26]
  },
  seduci: {
    emoji: '💘',
    cooldown: 25,
    success: [
      'Hai sedotto con una calma criminale.',
      'Seduzione riuscita, pubblico steso, testimoni in silenzio.',
      'Hai parlato due secondi e l’atmosfera ha cambiato padrone.',
      'Mossa clean, presenza devastante.',
      'Hai tirato una frase liscia ma letale.',
      'Quello non era flirt, era controllo del clima.',
      'Seduzione da manuale, esecuzione da delinquente elegante.',
      'Hai avuto più presenza tu di tre persone messe insieme.',
      'Hai giocato sporco ma con classe.',
      'Una sola battuta e il resto della chat è diventato arredamento.',
      'Hai fatto centro senza nemmeno forzare.',
      'Seduzione pesante, effetto immediato.'
    ],
    fail: [
      'Hai provato a sedurre ma sembravi una nota vocale mandata nel gruppo sbagliato.',
      'Seduzione annullata. Hai generato più disagio che fascino.',
      'Hai flirtato come un PDF corrotto.',
      'L’unica risposta nell’aria era: “ma tutto bene?”.',
      'Hai cercato il fascino e hai trovato il panico.',
      'Troppa fiducia, zero magnetismo.',
      'Hai lasciato più dubbi che emozioni.',
      'Sembravi romantico solo nella tua testa.',
      'Hai tentato il colpo e hai colpito solo la tua reputazione.',
      'Vibe da rimorchio, resa da spam.',
      'Hai parlato come se stessi compilando un modulo.',
      'Seduzione fallita con effetti collaterali sociali.'
    ],
    rareSuccess: [
      'Seduzione leggendaria. Hai alterato l’equilibrio del gruppo.',
      'Hai piegato la tensione della chat a tuo favore.',
      'Roba da film vietato ai timidi.',
      'Hai avuto un’aura romantica da boss fight.'
    ],
    rareFail: [
      'Reject da museo. Perdita di aura certificata.',
      'Hai fallito in un modo così netto da sembrare scritto.',
      'La chat ha assistito a un crimine contro il fascino.',
      'Sei riuscito a rendere freddo anche il Wi-Fi.'
    ],
    normalWin: [6, 12],
    normalLose: [5, 11],
    rareWin: [20, 30],
    rareLose: [18, 28]
  },
  cook: {
    emoji: '👨‍🍳',
    cooldown: 20,
    success: [
      'Hai cucinato così bene che il gruppo ha chiesto il bis.',
      'Masterclass servita calda.',
      'Hai lasciato cuocere e il risultato era da standing ovation.',
      'Kitchen aura attivata. Nessuno parlava, tutti assorbivano.',
      'Hai servito una scena pulitissima.',
      'Questa volta hai cucinato davvero.',
      'Hai tirato fuori una qualità offensiva.',
      'Hai preparato una risposta che sa di superiorità.',
      'Hai fatto da chef e nessuno ha avuto da ridire.',
      'Hai cucinato con una sicurezza fuori scala.',
      'Piatto perfetto, vibe perfetta.',
      'Hai messo tutti zitti con una sola portata.'
    ],
    fail: [
      'Hai bruciato la cucina, il discorso e la dignità.',
      'Ti hanno detto "lascia cucinare" e hai causato un incendio.',
      'Hai servito una bozza, non una pietanza.',
      'Il piatto è arrivato crudo e pure l’aura.',
      'Hai cucinato male e avvelenato la situazione.',
      'Sembrava una masterclass, era un incidente.',
      'Hai spadellato il nulla cosmico.',
      'Hai tirato fuori un piatto che manco la fame giustifica.',
      'Hai aperto la cucina e chiuso la reputazione.',
      'Hai confuso il talento con l’entusiasmo.',
      'Cottura sbagliata, lettura sbagliata, finale sbagliato.',
      'Hai lasciato cucinare il caos.'
    ],
    rareSuccess: [
      'Chef supremo. Hai cucinato una scena da poster.',
      'Hai servito arte culinaria e dominio sociale.',
      'Menù stellato, aura impennata.',
      'Hai cucinato così forte che la chat si è inchinata.'
    ],
    rareFail: [
      'Hai trasformato il cook in crimine culinario.',
      'Disastro da ristorante chiuso dai NAS.',
      'Hai servito la rovina in quattro portate.',
      'Hai bruciato tutto tranne la faccia tosta.'
    ],
    normalWin: [6, 12],
    normalLose: [5, 11],
    rareWin: [18, 28],
    rareLose: [16, 26]
  },
  crashout: {
    emoji: '💥',
    cooldown: 30,
    success: [
      'Crashout controllato. Caos elegante, pubblico in delirio.',
      'Hai perso la calma ma con una regia inspiegabilmente perfetta.',
      'Esplosione emotiva, esecuzione impeccabile.',
      'Hai fatto caos ma con estetica.',
      'Sfogo tossico, resa cinematografica.',
      'Hai crashato ma sembravi comunque il protagonista.',
      'Caos ben diretto, danno bello da vedere.',
      'Hai trasformato il tilt in performance.',
      'Hai perso la pazienza con una qualità sospetta.',
      'Scena pericolosa ma dannatamente efficace.',
      'Hai mandato tutto a fuoco con stile.',
      'Il crashout ha fatto più bene che male.'
    ],
    fail: [
      'Crashout imbarazzante. Sembravi un aggiornamento fallito.',
      'Hai crashato male e il gruppo ti ha guardato come un bug noto.',
      'Sfogo tossico senza stile. Hai perso quota subito.',
      'Hai tiltato in modo triste, non iconico.',
      'Hai perso il controllo ma non hai guadagnato niente.',
      'Crisi gestita malissimo, spettacolo pessimo.',
      'Hai fatto caos e pure male.',
      'Sembravi solo stanco, non pericoloso.',
      'Tilt senza aura, combo letale.',
      'Hai alzato il volume e abbassato il rispetto.',
      'Troppa rabbia, zero regia.',
      'Crashout da segnalazione tecnica.'
    ],
    rareSuccess: [
      'Crashout mitologico. Hai fatto caos con estetica.',
      'Hai trasformato il collasso in leggenda.',
      'Esplosione da cinema underground.',
      'Hai tiltato così bene da sembrare un piano.'
    ],
    rareFail: [
      'Crashout da documentario triste.',
      'Hai fatto una scena così brutta che il gruppo si è compattato contro di te.',
      'Caduta libera di aura in tempo reale.',
      'Hai perso tutto tranne la convinzione di aver ragione.'
    ],
    normalWin: [8, 15],
    normalLose: [7, 14],
    rareWin: [22, 32],
    rareLose: [20, 30]
  },
  lockin: {
    emoji: '🎯',
    cooldown: 25,
    success: [
      'Ti sei lockato in una maniera spaventosa.',
      'Focus assoluto, zero rumore, solo risultati.',
      'Aura da final boss concentrato.',
      'Hai fissato l’obiettivo e il resto è sparito.',
      'Lock-in pulito, presenza glaciale.',
      'Sei entrato in modalità pericolosa.',
      'Hai avuto una concentrazione indecente.',
      'Ti sei chiuso nel focus e ne sei uscito più pesante.',
      'Hai lockato la partita mentale.',
      'Hai mostrato disciplina e cattiveria insieme.',
      'Concentrazione così dura che faceva rumore.',
      'Hai preso il controllo del frame.'
    ],
    fail: [
      'Hai provato a lockarti ma ti sei distratto da solo.',
      'Focus durato meno di una story.',
      'Ti sei lockato nel nulla cosmico.',
      'Hai guardato il vuoto con serietà e basta.',
      'Sembravi concentrato, eri solo assente.',
      'Ti sei isolato per produrre il niente.',
      'Lock-in fallito, testa in buffering.',
      'Hai tentato il focus e hai evocato la nebbia.',
      'Concentrazione evaporata subito.',
      'Hai preso la postura giusta e il risultato sbagliato.',
      'Ti sei chiuso in te stesso senza trovare niente.',
      'Focus inesistente, faccia convinta.'
    ],
    rareSuccess: [
      'Locked in leggendario. Aura compressa in pura efficienza.',
      'Hai raggiunto uno stato mentale illegale.',
      'Focus da boss finale.',
      'Hai lockato il mondo fuori e acceso il dominio.'
    ],
    rareFail: [
      'Hai lockato l’imbarazzo, non il risultato.',
      'Hai trovato solo silenzio e disorientamento.',
      'Lock-in catastrofico con resa zero.',
      'Sembravi pronto, eri solo congelato.'
    ],
    normalWin: [6, 12],
    normalLose: [5, 11],
    rareWin: [18, 28],
    rareLose: [16, 26]
  },
  glaze: {
    emoji: '🧎',
    cooldown: 22,
    success: [
      'Hai glazeato nel modo giusto e ti hanno pure dato ragione.',
      'Leccata strategica, ritorno enorme.',
      'Hai pompato l’ego giusto al momento giusto.',
      'Hai adulato con precisione chirurgica.',
      'Glaze riuscito. Ti odiano ma funziona.',
      'Hai gasato qualcuno e ci hai guadagnato davvero.',
      'Operazione lecchinaggio completata con stile.',
      'Hai venduto bene il film e te l’hanno comprato.',
      'Hai esagerato il giusto e ha pagato.',
      'Glaze professionale, resa altissima.'
    ],
    fail: [
      'Hai glazeato così male che sembravi in ginocchio spiritualmente.',
      'Troppa leccata, zero dignità.',
      'Hai pompato l’ego sbagliato e ci hai rimesso tu.',
      'Glaze annullato per eccesso di servilismo.',
      'Hai adulato con una fame troppo visibile.',
      'Sembravi un PR in rovina.',
      'Hai cercato favori e hai trovato umiliazione.',
      'Lecchinaggio scoperto, reputazione persa.',
      'Hai dato troppo e ricevuto il nulla.',
      'Glaze pessimo, imbarazzo premium.'
    ],
    rareSuccess: [
      'Glaze divino. Hai monetizzato l’ego altrui.',
      'Ti sei inginocchiato metaforicamente ma con profitto.',
      'Operazione adulazione leggendaria.',
      'Hai trasformato la faccia tosta in capitale sociale.'
    ],
    rareFail: [
      'Hai glazeato così forte che ti sei cancellato da solo.',
      'Cringe strutturale. Perdita di aura pesantissima.',
      'Il gruppo ha assistito a una resa senza onore.',
      'Hai perso il rispetto in HD.'
    ],
    normalWin: [5, 11],
    normalLose: [6, 12],
    rareWin: [17, 26],
    rareLose: [18, 27]
  },
  gamble: {
    emoji: '🎰',
    cooldown: 18,
    success: [
      'Hai preso il rischio giusto e ti è andata sporcamente bene.',
      'Gamble riuscito. Il destino oggi ha fatto il servo.',
      'Hai giocato sporco e hai vinto pulito.',
      'Hai spinto all-in e la chat ha dovuto assistere.',
      'Rischio alto, resa altissima.',
      'Hai sfidato il caso e per una volta ha perso lui.',
      'Hai avuto la faccia tosta giusta.',
      'Mossa pericolosa premiata subito.',
      'Hai tirato il dado e ti ha baciato.',
      'Gamble sporco ma efficace.'
    ],
    fail: [
      'Hai rischiato troppo e il destino ti ha preso a schiaffi.',
      'Gamble fallito. Il caso ti ha visto e ha goduto.',
      'Hai giocato forte e perso peggio.',
      'Mossa azzardata, finale umiliante.',
      'Hai puntato la faccia e hai perso pure quella.',
      'Rischio alto, cervello basso.',
      'Hai chiesto fortuna e ti è arrivata una fattura.',
      'Ti sei lanciato male e si è visto.',
      'Il rischio non era calcolato, era solo stupido.',
      'Hai scommesso sull’aria fritta.'
    ],
    rareSuccess: [
      'Jackpot di aura. Truffa morale riuscita.',
      'Hai piegato il RNG con intenzioni maligne.',
      'Colpo sporco da leggenda urbana.',
      'Rischio massimo, ritorno mostruoso.'
    ],
    rareFail: [
      'Hai perso così male che il caso ti deve dei danni.',
      'Fallimento da compilation.',
      'Il destino ha firmato la tua rovina.',
      'Sconfitta talmente netta da sembrare personale.'
    ],
    normalWin: [7, 14],
    normalLose: [7, 14],
    rareWin: [20, 32],
    rareLose: [20, 32]
  }
}

function loadDB() {
  try {
    if (!fs.existsSync(dbPath)) return {}
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  } catch {
    return {}
  }
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function ensureChatUser(data, chatId, userId) {
  if (!data[chatId]) data[chatId] = {}
  if (!data[chatId][userId]) {
    data[chatId][userId] = {
      aura: 0,
      wins: 0,
      losses: 0,
      steals: 0,
      dailyClaimedAt: 0,
      lastAction: null,
      updatedAt: Date.now()
    }
  }
  return data[chatId][userId]
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m <= 0) return `${s}s`
  return `${m}m ${s}s`
}

function getNameFromJid(jid = '') {
  return jid.split('@')[0]
}

function setCooldown(userId, command, seconds) {
  cooldowns.set(`${userId}:${command}`, Date.now() + seconds * 1000)
}

function getCooldownLeft(userId, command) {
  const key = `${userId}:${command}`
  const expires = cooldowns.get(key)
  if (!expires) return 0
  const left = Math.ceil((expires - Date.now()) / 1000)
  if (left <= 0) {
    cooldowns.delete(key)
    return 0
  }
  return left
}

function getImageBuffer(filePath) {
  try {
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath)
    return null
  } catch {
    return null
  }
}

function pickWeighted(entries) {
  const total = entries.reduce((sum, item) => sum + item.weight, 0)
  let r = Math.random() * total
  for (const item of entries) {
    r -= item.weight
    if (r <= 0) return item.value
  }
  return entries[entries.length - 1].value
}

function buildOutcome(game) {
  const outcomeType = pickWeighted([
    { weight: 42, value: 'success' },
    { weight: 34, value: 'fail' },
    { weight: 12, value: 'rareSuccess' },
    { weight: 12, value: 'rareFail' }
  ])

  if (outcomeType === 'success') {
    return {
      success: true,
      amount: rand(game.normalWin[0], game.normalWin[1]),
      line: pick(game.success)
    }
  }

  if (outcomeType === 'fail') {
    return {
      success: false,
      amount: rand(game.normalLose[0], game.normalLose[1]),
      line: pick(game.fail)
    }
  }

  if (outcomeType === 'rareSuccess') {
    return {
      success: true,
      amount: rand(game.rareWin[0], game.rareWin[1]),
      line: pick(game.rareSuccess)
    }
  }

  return {
    success: false,
    amount: rand(game.rareLose[0], game.rareLose[1]),
    line: pick(game.rareFail)
  }
}

function getVibe(aura) {
  if (aura >= 180) return '👑 Aura imperiale'
  if (aura >= 120) return '🦅 Aura da final boss'
  if (aura >= 70) return '😮‍💨 Aura pesante'
  if (aura >= 25) return '✨ Aura solida'
  if (aura >= 0) return '🙂 Aura fragile'
  if (aura >= -40) return '📉 Aura instabile'
  return '🪦 Aura sotto terra'
}

function buildActionText(game, cmd, user, outcome) {
  return [
    `${game.emoji} *${cmd.toUpperCase()}*`,
    '',
    `> ${outcome.line}`,
    '',
    `${outcome.success ? '*Aura guadagnata:*' : '*Aura persa:*'} ${outcome.success ? '+' : '-'}${outcome.amount}`,
    `*Aura totale:* ${user.aura}`,
    `*Record:* ${user.wins} win / ${user.losses} lose`,
    `*Stato:* ${getVibe(user.aura)}`
  ].join('\n')
}

const handler = async (m, { conn, command, usedPrefix }) => {
  const cmd = command.toLowerCase()
  const db = loadDB()
  const chatId = m.chat
  const userId = m.sender

  if (cmd === 'myaura' || cmd === 'aura') {
    const target = m.mentionedJid?.[0] || userId
    const user = ensureChatUser(db, chatId, target)
    saveDB(db)

    const text = [
      `🫧 *AURA CHECK*`,
      '',
      `*Utente:* @${getNameFromJid(target)}`,
      `*Aura totale:* ${user.aura}`,
      `*Successi:* ${user.wins}`,
      `*Fallimenti:* ${user.losses}`,
      `*Furti riusciti:* ${user.steals || 0}`,
      `*Vibe:* ${getVibe(user.aura)}`
    ].join('\n')

    return conn.sendMessage(m.chat, {
      text,
      mentions: [target]
    }, { quoted: m })
  }

  if (cmd === 'topaura') {
    const chatData = db[chatId] || {}
    const top = Object.entries(chatData)
      .sort(([, a], [, b]) => (b.aura || 0) - (a.aura || 0))
      .slice(0, 10)

    if (!top.length) {
      return m.reply('💨 *Nessuna aura salvata.* Siete ancora troppo NPC, iniziate a sporcarvi le mani.')
    }

    const lines = top.map(([jid, user], i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '▫️'
      return `${medal} @${getNameFromJid(jid)} — *${user.aura || 0} aura*`
    })

    const text = [
      `🏆 *TOP AURA DEL GRUPPO*`,
      '',
      ...lines
    ].join('\n')

    const image = getImageBuffer(topAuraImg)

    if (image) {
      return conn.sendMessage(m.chat, {
        image,
        caption: text,
        mentions: top.map(([jid]) => jid)
      }, { quoted: m })
    }

    return conn.sendMessage(m.chat, {
      text,
      mentions: top.map(([jid]) => jid)
    }, { quoted: m })
  }

  if (cmd === 'auraflip') {
    const left = getCooldownLeft(userId, cmd)
    if (left > 0) {
      return m.reply(`🪙 *Calma gambler.* Riprova tra *${formatTime(left)}*.`)
    }

    const user = ensureChatUser(db, chatId, userId)
    const win = Math.random() < 0.5
    const amount = rand(4, 12)

    if (win) {
      user.aura += amount
      user.wins += 1
    } else {
      user.aura -= amount
      user.losses += 1
    }

    user.lastAction = cmd
    user.updatedAt = Date.now()
    saveDB(db)
    setCooldown(userId, cmd, 15)

    const text = [
      `🪙 *AURAFLIP*`,
      '',
      `> ${win ? 'Testa. Hai vinto il coinflip del destino.' : 'Croce. Il destino ti ha visto e ha riso.'}`,
      '',
      `${win ? '*Aura guadagnata:*' : '*Aura persa:*'} ${win ? '+' : '-'}${amount}`,
      `*Aura totale:* ${user.aura}`,
      `*Stato:* ${getVibe(user.aura)}`
    ].join('\n')

    const resultImage = getImageBuffer(win ? auraGainImg : auraLossImg)

    if (resultImage) {
      return conn.sendMessage(m.chat, {
        image: resultImage,
        caption: text
      }, { quoted: m })
    }

    return m.reply(text)
  }

  if (cmd === 'auradaily') {
    const user = ensureChatUser(db, chatId, userId)
    const now = Date.now()
    const cd = 24 * 60 * 60 * 1000
    const left = user.dailyClaimedAt ? user.dailyClaimedAt + cd - now : 0

    if (left > 0) {
      return m.reply(`📅 *Daily già preso.* Torna tra *${formatTime(Math.ceil(left / 1000))}*.`)
    }

    const amount = rand(10, 22)
    user.aura += amount
    user.wins += 1
    user.dailyClaimedAt = now
    user.lastAction = cmd
    user.updatedAt = now
    saveDB(db)

    const text = [
      `📅 *AURADAILY*`,
      '',
      `> Hai ritirato la paga sporca del giorno.`,
      '',
      `*Aura guadagnata:* +${amount}`,
      `*Aura totale:* ${user.aura}`,
      `*Stato:* ${getVibe(user.aura)}`
    ].join('\n')

    const img = getImageBuffer(auraGainImg)
    if (img) {
      return conn.sendMessage(m.chat, { image: img, caption: text }, { quoted: m })
    }
    return m.reply(text)
  }

  if (cmd === 'stealaura') {
    const target = m.mentionedJid?.[0]
    if (!target) return m.reply(`🕵️ *Tagga un utente.* Uso: *${usedPrefix}stealaura @utente*`)
    if (target === userId) return m.reply('🪞 *Non puoi rubare aura a te stesso.* Sarebbe triste anche per i miei standard.')

    const left = getCooldownLeft(userId, cmd)
    if (left > 0) {
      return m.reply(`🕵️ *Furto in cooldown.* Riprova tra *${formatTime(left)}*.`)
    }

    const attacker = ensureChatUser(db, chatId, userId)
    const victim = ensureChatUser(db, chatId, target)

    const success = Math.random() < 0.46
    const amount = rand(6, 16)

    let text
    let img

    if (success) {
      const stolen = Math.min(amount, Math.max(0, victim.aura))
      attacker.aura += stolen
      victim.aura -= stolen
      attacker.wins += 1
      attacker.steals = (attacker.steals || 0) + 1
      text = [
        `🕵️ *STEALAURA*`,
        '',
        `> Hai derubato @${getNameFromJid(target)} con una faccia tosta spaventosa.`,
        '',
        `*Aura rubata:* +${stolen}`,
        `*Tua aura totale:* ${attacker.aura}`,
        `*Stato:* ${getVibe(attacker.aura)}`
      ].join('\n')
      img = getImageBuffer(auraGainImg)
    } else {
      attacker.aura -= amount
      attacker.losses += 1
      text = [
        `🕵️ *STEALAURA*`,
        '',
        `> Ti hanno beccato mentre rubavi aura. Figura criminale ma senza talento.`,
        '',
        `*Aura persa:* -${amount}`,
        `*Tua aura totale:* ${attacker.aura}`,
        `*Stato:* ${getVibe(attacker.aura)}`
      ].join('\n')
      img = getImageBuffer(auraLossImg)
    }

    attacker.lastAction = cmd
    attacker.updatedAt = Date.now()
    victim.updatedAt = Date.now()

    saveDB(db)
    setCooldown(userId, cmd, 45)

    if (img) {
      return conn.sendMessage(m.chat, {
        image: img,
        caption: text,
        mentions: [target]
      }, { quoted: m })
    }

    return conn.sendMessage(m.chat, {
      text,
      mentions: [target]
    }, { quoted: m })
  }

  if (cmd === 'matchaura') {
    const target = m.mentionedJid?.[0]
    if (!target) return m.reply(`💞 *Tagga un utente.* Uso: *${usedPrefix}matchaura @utente*`)
    if (target === userId) return m.reply('💀 *Con te stesso no.* Questo è amor proprio tossico.')

    const userA = ensureChatUser(db, chatId, userId)
    const userB = ensureChatUser(db, chatId, target)
    saveDB(db)

    const total = Math.max(0, 50 + Math.floor((userA.aura + userB.aura) / 6) + rand(-20, 20))
    const percent = Math.max(0, Math.min(100, total))

    const vibe =
      percent >= 90 ? 'accoppiata criminalmente efficace'
        : percent >= 70 ? 'match pericolosamente valido'
          : percent >= 50 ? 'chimica accettabile'
            : percent >= 30 ? 'rapporto discutibile'
              : 'catastrofe romantica'

    return conn.sendMessage(m.chat, {
      text: [
        `💞 *MATCHAURA*`,
        '',
        `@${getNameFromJid(userId)} × @${getNameFromJid(target)}`,
        `*Compatibilità:* ${percent}%`,
        `*Esito:* ${vibe}`
      ].join('\n'),
      mentions: [userId, target]
    }, { quoted: m })
  }

  const game = auraGames[cmd]
  if (!game) {
    return m.reply([
      `❌ *Comando non valido.*`,
      '',
      `*Giochi:* ${usedPrefix}flex, ${usedPrefix}seduci, ${usedPrefix}cook, ${usedPrefix}crashout, ${usedPrefix}lockin, ${usedPrefix}glaze, ${usedPrefix}gamble, ${usedPrefix}auraflip`,
      `*Classifica:* ${usedPrefix}myaura, ${usedPrefix}aura @user, ${usedPrefix}topaura`,
      `*Extra:* ${usedPrefix}auradaily, ${usedPrefix}stealaura @user, ${usedPrefix}matchaura @user`
    ].join('\n'))
  }

  const left = getCooldownLeft(userId, cmd)
  if (left > 0) {
    return m.reply(`${game.emoji} *Cooldown attivo.* Riprova tra *${formatTime(left)}*.`)
  }

  const outcome = buildOutcome(game)
  const user = ensureChatUser(db, chatId, userId)

  if (outcome.success) {
    user.aura += outcome.amount
    user.wins += 1
  } else {
    user.aura -= outcome.amount
    user.losses += 1
  }

  user.lastAction = cmd
  user.updatedAt = Date.now()

  saveDB(db)
  setCooldown(userId, cmd, game.cooldown)

  const text = buildActionText(game, cmd, user, outcome)
  const resultImage = getImageBuffer(outcome.success ? auraGainImg : auraLossImg)

  if (resultImage) {
    await conn.sendMessage(m.chat, {
      image: resultImage,
      caption: text
    }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text }, { quoted: m })
  }
}

handler.help = [
  'flex',
  'seduci',
  'cook',
  'crashout',
  'lockin',
  'glaze',
  'gamble',
  'auraflip',
  'auradaily',
  'stealaura @user',
  'matchaura @user',
  'myaura',
  'aura @user',
  'topaura'
]
handler.tags = ['fun', 'game']
handler.command = /^(flex|seduci|cook|crashout|lockin|glaze|gamble|auraflip|auradaily|stealaura|matchaura|myaura|aura|topaura)$/i
handler.group = true
handler.register = true

export default handler