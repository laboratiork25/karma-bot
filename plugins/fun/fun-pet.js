
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let cooldowns = {};

const animali = [
  // Comuni
  { nome: '🐕 Cane', rarità: 'comune', fame: 100, felicità: 100, attacco: 5, prezzo: 0 },
  { nome: '🐈 Gatto', rarità: 'comune', fame: 100, felicità: 100, attacco: 4, prezzo: 0 },
  { nome: '🐹 Criceto', rarità: 'comune', fame: 100, felicità: 100, attacco: 2, prezzo: 0 },
  { nome: '🐰 Coniglio', rarità: 'comune', fame: 100, felicità: 100, attacco: 3, prezzo: 0 },
  // Non comuni
  { nome: '🦊 Volpe', rarità: 'non comune', fame: 100, felicità: 100, attacco: 8, prezzo: 200 },
  { nome: '🐺 Lupo', rarità: 'non comune', fame: 100, felicità: 100, attacco: 12, prezzo: 300 },
  { nome: '🦅 Aquila', rarità: 'non comune', fame: 100, felicità: 100, attacco: 10, prezzo: 250 },
  // Rari
  { nome: '🦁 Leone', rarità: 'raro', fame: 100, felicità: 100, attacco: 20, prezzo: 500 },
  { nome: '🐻 Orso', rarità: 'raro', fame: 100, felicità: 100, attacco: 18, prezzo: 450 },
  { nome: '🐯 Tigre', rarità: 'raro', fame: 100, felicità: 100, attacco: 22, prezzo: 550 },
  // Epici
  { nome: '🦄 Unicorno', rarità: 'epico', fame: 100, felicità: 100, attacco: 30, prezzo: 1000 },
  { nome: '🐲 Draghetto', rarità: 'epico', fame: 100, felicità: 100, attacco: 35, prezzo: 1200 },
  // Leggendari
  { nome: '🐉 Drago d\'Oro', rarità: 'leggendario', fame: 100, felicità: 100, attacco: 50, prezzo: 3000 },
  { nome: '🦅 Fenice', rarità: 'leggendario', fame: 100, felicità: 100, attacco: 45, prezzo: 2500 },
];

const raritàProb = { comune: 50, 'non comune': 28, raro: 15, epico: 5, leggendario: 2 };

function generaAnimale() {
  const roll = Math.random() * 100;
  let cum = 0;
  let rarità = 'comune';
  for (const [r, p] of Object.entries(raritàProb)) {
    cum += p;
    if (roll < cum) { rarità = r; break; }
  }
  const disp = animali.filter(a => a.rarità === rarità);
  return { ...pickRandom(disp) };
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
  const userId = m.sender;
  const groupId = m.chat;
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!user) throw '❌ Non sei registrato!';
  if (!user.pets) user.pets = [];

  switch (command) {
    case 'pet':
    case 'animale':
      await handlePetInfo(m, user, conn, userId, groupId, usedPrefix);
      break;
    case 'cercapet':
    case 'findpet':
      await handleCercaPet(m, user, conn, userId, groupId);
      break;
    case 'sfamapet':
    case 'feedpet':
      await handleSfamaPet(m, user, conn, userId, groupId, text);
      break;
    case 'coccolapet':
    case 'petpet':
      await handleCoccolaPet(m, user, conn, userId, groupId, text);
      break;
    case 'rilasciapet':
    case 'releasepet':
      await handleRilasciaPet(m, user, conn, userId, groupId, text);
      break;
    case 'petfight':
    case 'arenapet':
      await handlePetFight(m, user, users, conn, userId, groupId);
      break;
  }
};

async function handlePetInfo(m, user, conn, userId, groupId, usedPrefix) {
  if (user.pets.length === 0) {
    return conn.sendMessage(groupId, {
      text: `🐾 Non hai ancora nessun animale!\n\n📌 Usa *${usedPrefix}cercapet* per trovarne uno nel bosco!`,
    }, { quoted: m });
  }

  let testo = '🐾 *I TUOI PET* 🐾\n\n';

  user.pets.forEach((pet, i) => {
    // Decrementa fame/felicità col tempo
    const ore = Math.floor((Date.now() - (pet.ultimoCheck || Date.now())) / 3600000);
    if (ore > 0) {
      pet.fame = Math.max(0, pet.fame - ore * 5);
      pet.felicità = Math.max(0, pet.felicità - ore * 3);
      pet.ultimoCheck = Date.now();
    }

    const fameBar = '❤️'.repeat(Math.ceil(pet.fame / 20)) + '🖤'.repeat(5 - Math.ceil(pet.fame / 20));
    const felBar = '💛'.repeat(Math.ceil(pet.felicità / 20)) + '🖤'.repeat(5 - Math.ceil(pet.felicità / 20));

    testo += `*${i + 1}.* ${pet.nome} (${pet.rarità})\n`;
    testo += `   🍖 Fame: ${fameBar} ${pet.fame}%\n`;
    testo += `   😊 Felicità: ${felBar} ${pet.felicità}%\n`;
    testo += `   ⚔️ Attacco: ${pet.attacco}\n\n`;
  });

  testo += `📌 Comandi:\n`;
  testo += `• *.sfamapet <num>* — Dai da mangiare (20 UC)\n`;
  testo += `• *.coccolapet <num>* — Coccola il pet\n`;
  testo += `• *.rilasciapet <num>* — Rilascia il pet\n`;
  testo += `• *.arenapet @utente* — Combattimento pet!`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleCercaPet(m, user, conn, userId, groupId) {
  const tempoAttesa = 30 * 1000;
  if (cooldowns[userId + '_pet'] && Date.now() - cooldowns[userId + '_pet'] < tempoAttesa) {
    const restante = Math.ceil((cooldowns[userId + '_pet'] + tempoAttesa - Date.now()) / 1000);
    throw `⏳ Stai ancora cercando! Aspetta *${restante}s* 🔍`;
  }

  if (user.pets.length >= 3) throw '❌ Hai già 3 pet! Rilasciane uno prima.';

  cooldowns[userId + '_pet'] = Date.now();

  // 30% di non trovare nulla
  if (Math.random() < 0.3) {
    const nulla = [
      '🌲 Hai cercato nel bosco ma gli animali si nascondono...',
      '🌿 Nessun animale in vista... riprova più tardi!',
      '🐾 Hai trovato delle impronte ma l\'animale è scappato!'
    ];
    return conn.sendMessage(groupId, { text: pickRandom(nulla) }, { quoted: m });
  }

  const pet = generaAnimale();
  pet.ultimoCheck = Date.now();
  user.pets.push(pet);

  let testo = '🐾 *NUOVO PET!* 🐾\n\n';
  testo += `Hai trovato un *${pet.nome}*!\n`;
  testo += `⭐ Rarità: ${pet.rarità.toUpperCase()}\n`;
  testo += `⚔️ Attacco: ${pet.attacco}\n\n`;

  if (pet.rarità === 'leggendario') {
    testo += '🎊 *LEGGENDARIO!* Che fortuna incredibile!';
    await conn.sendMessage(m.chat, { react: { text: '🎊', key: m.key } });
  } else if (pet.rarità === 'epico') {
    testo += '✨ Un pet epico! Fantastico!';
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  } else {
    await conn.sendMessage(m.chat, { react: { text: '🐾', key: m.key } });
  }

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleSfamaPet(m, user, conn, userId, groupId, text) {
  const idx = parseInt(text) - 1;
  if (isNaN(idx) || idx < 0 || idx >= user.pets.length) {
    throw `❌ Pet non valido! Hai ${user.pets.length} pet. Usa il numero.`;
  }

  const costo = 20;
  if ((user.limit || 0) < costo) throw `❌ Servono ${costo} UC per il cibo!`;

  user.limit -= costo;
  user.pets[idx].fame = Math.min(100, user.pets[idx].fame + 30);

  await conn.sendMessage(groupId, {
    text: `🍖 Hai sfamato *${user.pets[idx].nome}*!\n🍖 Fame: ${user.pets[idx].fame}%\n💸 -${costo} UC`
  }, { quoted: m });
}

async function handleCoccolaPet(m, user, conn, userId, groupId, text) {
  const idx = parseInt(text) - 1;
  if (isNaN(idx) || idx < 0 || idx >= user.pets.length) {
    throw `❌ Pet non valido!`;
  }

  const tempoAttesa = 10 * 1000;
  const cdKey = userId + '_coccola_' + idx;
  if (cooldowns[cdKey] && Date.now() - cooldowns[cdKey] < tempoAttesa) {
    throw `⏳ Hai già coccolato di recente!`;
  }
  cooldowns[cdKey] = Date.now();

  user.pets[idx].felicità = Math.min(100, user.pets[idx].felicità + 20);

  const reazioni = [
    `💕 ${user.pets[idx].nome} scodinzola felice!`,
    `😻 ${user.pets[idx].nome} fa le fusa!`,
    `🥰 ${user.pets[idx].nome} ti lecca la faccia!`,
    `🐾 ${user.pets[idx].nome} si rotola per terra di gioia!`
  ];

  await conn.sendMessage(groupId, {
    text: `${pickRandom(reazioni)}\n😊 Felicità: ${user.pets[idx].felicità}%`
  }, { quoted: m });
}

async function handleRilasciaPet(m, user, conn, userId, groupId, text) {
  const idx = parseInt(text) - 1;
  if (isNaN(idx) || idx < 0 || idx >= user.pets.length) {
    throw `❌ Pet non valido!`;
  }

  const pet = user.pets.splice(idx, 1)[0];

  await conn.sendMessage(groupId, {
    text: `👋 Hai rilasciato *${pet.nome}* in libertà...\n\n🌲 ${pet.nome} ti guarda un'ultima volta prima di andarsene. 😢`
  }, { quoted: m });
}

async function handlePetFight(m, user, users, conn, userId, groupId) {
  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  if (!mention) throw '❌ Sfida qualcuno! *.arenapet @utente*';

  const avversario = users[mention];
  if (!avversario) throw '❌ Avversario non registrato!';
  if (!user.pets || user.pets.length === 0) throw '❌ Non hai pet!';
  if (!avversario.pets || avversario.pets.length === 0) throw `❌ @${mention.split('@')[0]} non ha pet!`;

  const petG = user.pets[0]; // Usa il primo pet
  const petA = avversario.pets[0];

  // Calcola potenza con bonus fame/felicità
  const bonusG = (petG.fame / 100 * 0.3) + (petG.felicità / 100 * 0.2);
  const bonusA = (petA.fame / 100 * 0.3) + (petA.felicità / 100 * 0.2);

  const powerG = petG.attacco * (1 + bonusG) + Math.random() * 20;
  const powerA = petA.attacco * (1 + bonusA) + Math.random() * 20;

  const vincitore = powerG >= powerA ? userId : mention;
  const premio = 100;
  users[vincitore].limit = (users[vincitore].limit || 0) + premio;

  let testo = `🏟️ *ARENA PET* 🏟️\n\n`;
  testo += `${petG.nome} (di @${userId.split('@')[0]})\n`;
  testo += `⚔️ Potenza: ${Math.floor(powerG)}\n\n🆚\n\n`;
  testo += `${petA.nome} (di @${mention.split('@')[0]})\n`;
  testo += `⚔️ Potenza: ${Math.floor(powerA)}\n\n`;
  testo += `━━━━━━━━━━━━━━━━━━━━\n`;
  testo += `🏆 Vince: *${vincitore === userId ? petG.nome : petA.nome}*!\n`;
  testo += `💰 @${vincitore.split('@')[0]} guadagna ${premio} UC!`;

  await conn.sendMessage(groupId, {
    text: testo,
    mentions: [userId, mention]
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '🏟️', key: m.key } });
}

handler.help = [
  'pet — Vedi i tuoi pet',
  'cercapet — Cerca un animale',
  'sfamapet <num> — Dai da mangiare',
  'coccolapet <num> — Coccola il pet',
  'rilasciapet <num> — Rilascia pet',
  'arenapet @utente — Combattimento pet'
];
handler.tags = ['rpg', 'fun'];
handler.command = /^(pet|animale|cercapet|findpet|sfamapet|feedpet|coccolapet|petpet|rilasciapet|releasepet|petfight|arenapet)$/i;
handler.register = true;
handler.group = true;

export default handler;
