
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let cooldowns = {};

const luoghi = [
  { nome: '🏚️ Casa Abbandonata', tesori: [
    { nome: '💰 Monete Antiche', valore: 50 },
    { nome: '📜 Mappa del Tesoro', valore: 100 },
    { nome: '🕸️ Ragnatele', valore: 2 },
    { nome: '🔑 Chiave Misteriosa', valore: 80 },
  ], pericoli: ['🐀 Topi giganti!', '👻 Un fantasma!', '🕷️ Ragni velenosi!'] },

  { nome: '🏰 Castello in Rovina', tesori: [
    { nome: '👑 Corona d\'Oro', valore: 300 },
    { nome: '🗡️ Spada del Re', valore: 200 },
    { nome: '🧱 Mattone Rotto', valore: 3 },
    { nome: '💎 Gemma Reale', valore: 400 },
  ], pericoli: ['🦇 Pipistrelli!', '⚔️ Guardie fantasma!', '🪤 Trappola!'] },

  { nome: '⛏️ Miniera Oscura', tesori: [
    { nome: '💎 Diamante Grezzo', valore: 250 },
    { nome: '🪨 Pepita d\'Oro', valore: 180 },
    { nome: '🪨 Sasso Inutile', valore: 1 },
    { nome: '🔮 Cristallo Magico', valore: 350 },
  ], pericoli: ['💥 Crollo!', '🦎 Lucertola di lava!', '💨 Gas tossico!'] },

  { nome: '🏴‍☠️ Isola dei Pirati', tesori: [
    { nome: '🏴‍☠️ Forziere Pirata', valore: 500 },
    { nome: '🗺️ Mappa Pirata', valore: 150 },
    { nome: '🦜 Pappagallo Morto', valore: 5 },
    { nome: '⚓ Ancora d\'Oro', valore: 400 },
  ], pericoli: ['🏴‍☠️ Pirati fantasma!', '🦈 Squali!', '🌊 Tempesta!'] },

  { nome: '🌋 Vulcano Attivo', tesori: [
    { nome: '🔥 Pietra di Fuoco', valore: 600 },
    { nome: '🪨 Ossidiana Rara', valore: 350 },
    { nome: '🌫️ Cenere...', valore: 1 },
    { nome: '💍 Anello del Drago', valore: 800 },
  ], pericoli: ['🌋 Eruzione!', '🔥 Fiamme!', '🐉 Drago di lava!'] },

  { nome: '🏛️ Tempio Antico', tesori: [
    { nome: '🏺 Vaso Sacro', valore: 400 },
    { nome: '📿 Amuleto Antico', valore: 300 },
    { nome: '🧹 Scopa Vecchia', valore: 2 },
    { nome: '⚱️ Urna d\'Oro', valore: 550 },
  ], pericoli: ['🪤 Trappola a frecce!', '🐍 Serpenti!', '☠️ Maledizione!'] },
];

let handler = async (m, { conn, command, usedPrefix }) => {
  const userId = m.sender;
  const groupId = m.chat;
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!user) throw '❌ Non sei registrato!';

  switch (command) {
    case 'esplora':
    case 'explore':
      await handleEsplora(m, user, conn, userId, groupId);
      break;
    case 'zaino':
    case 'backpack':
      await handleZaino(m, user, conn, userId, groupId);
      break;
    case 'vendizaino':
    case 'sellbackpack':
      await handleVendiZaino(m, user, conn, userId, groupId);
      break;
  }
};

async function handleEsplora(m, user, conn, userId, groupId) {
  const tempoAttesa = 25 * 1000;
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
    const restante = Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000);
    throw `⏳ Sei ancora in esplorazione! Aspetta *${restante}s* 🗺️`;
  }

  cooldowns[m.sender] = Date.now();

  if (!user.zaino) user.zaino = [];
  if (!user.esplorazioni) user.esplorazioni = 0;
  user.esplorazioni++;

  const luogo = pickRandom(luoghi);

  let testo = `🗺️ *ESPLORAZIONE* 🗺️\n\n`;
  testo += `📍 Luogo: *${luogo.nome}*\n\n`;

  // 60% trova tesoro, 25% pericolo, 15% nulla
  const roll = Math.random() * 100;

  if (roll < 60) {
    // TESORO
    const tesoro = pickRandom(luogo.tesori);
    user.zaino.push(tesoro);
    user.exp = (user.exp || 0) + 15;

    testo += `🎉 Hai trovato qualcosa!\n\n`;
    testo += `✨ *${tesoro.nome}*\n`;
    testo += `💰 Valore: ${tesoro.valore} UC\n`;
    testo += `✨ +15 XP\n`;

    if (tesoro.valore >= 400) {
      testo += `\n🏆 *TESORO RARO!* Grande scoperta!\n`;
      await conn.sendMessage(m.chat, { react: { text: '💎', key: m.key } });
    } else if (tesoro.valore <= 5) {
      testo += `\n🗑️ Beh... meglio di niente...\n`;
      await conn.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } });
    } else {
      await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
    }

  } else if (roll < 85) {
    // PERICOLO
    const pericolo = pickRandom(luogo.pericoli);
    const danno = Math.floor(Math.random() * 80) + 20;
    user.limit = Math.max(0, (user.limit || 0) - danno);

    testo += `⚠️ *PERICOLO!*\n\n`;
    testo += `${pericolo}\n`;
    testo += `💸 Hai perso *${danno} UC* per le cure!\n`;

    await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });

  } else {
    // NULLA
    const nulla = [
      'Hai esplorato ovunque ma... niente di interessante.',
      'Il luogo era già stato saccheggiato...',
      'Ti sei perso e sei tornato al punto di partenza.',
      'Hai trovato solo polvere e delusione.'
    ];
    testo += `😐 ${pickRandom(nulla)}\n`;
    testo += `✨ +5 XP per lo sforzo\n`;
    user.exp = (user.exp || 0) + 5;

    await conn.sendMessage(m.chat, { react: { text: '😐', key: m.key } });
  }

  testo += `\n🎒 Oggetti nello zaino: ${user.zaino.length}`;
  testo += `\n🗺️ Esplorazioni totali: ${user.esplorazioni}`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleZaino(m, user, conn, userId, groupId) {
  if (!user.zaino || user.zaino.length === 0) {
    throw '🎒 Il tuo zaino è vuoto! Usa *.esplora* per trovare tesori!';
  }

  let testo = '🎒 *IL TUO ZAINO* 🎒\n\n';
  let valTotale = 0;

  const conteggio = {};
  for (const obj of user.zaino) {
    const key = obj.nome;
    if (!conteggio[key]) conteggio[key] = { ...obj, quantità: 0 };
    conteggio[key].quantità++;
    valTotale += obj.valore;
  }

  for (const [_, o] of Object.entries(conteggio)) {
    testo += `${o.nome} x${o.quantità} — ${o.valore * o.quantità} UC\n`;
  }

  testo += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  testo += `💰 Valore totale: *${valTotale} UC*\n`;
  testo += `📦 Oggetti: ${user.zaino.length}\n`;
  testo += `📌 Usa *.vendizaino* per vendere tutto!`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleVendiZaino(m, user, conn, userId, groupId) {
  if (!user.zaino || user.zaino.length === 0) {
    throw '🎒 Non hai nulla da vendere!';
  }

  let valTotale = 0;
  for (const o of user.zaino) valTotale += o.valore;

  const quantità = user.zaino.length;
  user.limit = (user.limit || 0) + valTotale;
  user.zaino = [];

  await conn.sendMessage(groupId, {
    text: `🏪 *VENDITA ZAINO* 🏪\n\n📦 Hai venduto *${quantità} oggetti*\n💰 Guadagno: *+${valTotale} UC*\n\n💶 Saldo: ${user.limit} UC`,
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } });
}

handler.help = ['esplora — Esplora un luogo casuale', 'zaino — Vedi i tesori trovati', 'vendizaino — Vendi tutto'];
handler.tags = ['rpg', 'fun'];
handler.command = /^(esplora|explore|zaino|backpack|vendizaino|sellbackpack)$/i;
handler.register = true;
handler.group = true;

export default handler;
