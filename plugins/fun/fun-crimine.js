
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let cooldowns = {};

const lavori = [
  { nome: '🍕 Pizzaiolo', guadagnoMin: 30, guadagnoMax: 80, xp: 15, messaggio: 'Hai fatto pizze tutto il giorno!' },
  { nome: '🚕 Taxista', guadagnoMin: 20, guadagnoMax: 70, xp: 12, messaggio: 'Hai portato gente in giro per la città!' },
  { nome: '👨‍🍳 Chef', guadagnoMin: 40, guadagnoMax: 100, xp: 20, messaggio: 'Hai cucinato piatti gourmet!' },
  { nome: '🧹 Spazzino', guadagnoMin: 15, guadagnoMax: 50, xp: 10, messaggio: 'Hai pulito le strade!' },
  { nome: '📦 Corriere', guadagnoMin: 25, guadagnoMax: 65, xp: 14, messaggio: 'Hai consegnato pacchi tutto il giorno!' },
  { nome: '💊 Farmacista', guadagnoMin: 50, guadagnoMax: 120, xp: 25, messaggio: 'Hai venduto medicine!' },
  { nome: '🎤 Cantante di strada', guadagnoMin: 10, guadagnoMax: 150, xp: 18, messaggio: 'Hai cantato per i passanti!' },
  { nome: '🧑‍🏫 Insegnante', guadagnoMin: 35, guadagnoMax: 90, xp: 22, messaggio: 'Hai insegnato a dei marmocchi!' },
  { nome: '🐕 Dog sitter', guadagnoMin: 20, guadagnoMax: 60, xp: 10, messaggio: 'Hai portato a spasso dei cani!' },
  { nome: '🎭 Attore', guadagnoMin: 30, guadagnoMax: 200, xp: 20, messaggio: 'Hai recitato in un film!' },
  { nome: '💻 Hacker (etico)', guadagnoMin: 60, guadagnoMax: 180, xp: 30, messaggio: 'Hai trovato bug per un\'azienda!' },
  { nome: '🗑️ Raccoglitore di rifiuti', guadagnoMin: 10, guadagnoMax: 40, xp: 8, messaggio: 'Hai raccolto spazzatura... bel lavoro!' },
];

const crimini = [
  { nome: '🏪 Rapina al Minimarket', difficoltà: 30, guadagnoMin: 100, guadagnoMax: 300, multaMin: 100, multaMax: 400, xp: 30 },
  { nome: '💎 Furto di Gioielli', difficoltà: 50, guadagnoMin: 200, guadagnoMax: 500, multaMin: 200, multaMax: 600, xp: 50 },
  { nome: '🏦 Rapina in Banca', difficoltà: 70, guadagnoMin: 400, guadagnoMax: 1000, multaMin: 400, multaMax: 1200, xp: 80 },
  { nome: '🎰 Truccare il Casinò', difficoltà: 60, guadagnoMin: 300, guadagnoMax: 800, multaMin: 300, multaMax: 900, xp: 60 },
  { nome: '🚗 Furto d\'Auto', difficoltà: 40, guadagnoMin: 150, guadagnoMax: 400, multaMin: 150, multaMax: 500, xp: 35 },
  { nome: '🖼️ Furto al Museo', difficoltà: 65, guadagnoMin: 350, guadagnoMax: 900, multaMin: 350, multaMax: 1000, xp: 70 },
];

let handler = async (m, { conn, command, text, usedPrefix }) => {
  const userId = m.sender;
  const groupId = m.chat;
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!user) throw '❌ Non sei registrato!';
  if (!user.crimini) user.crimini = { rapine: 0, successi: 0, arrestato: 0 };

  switch (command) {
    case 'lavora':
    case 'work':
      await handleLavora(m, user, conn, userId, groupId);
      break;
    case 'crimine':
    case 'crime':
      await handleCrimine(m, user, conn, userId, groupId, text);
      break;
    case 'crimini':
    case 'crimes':
      await handleListaCrimini(m, conn, groupId, usedPrefix);
      break;
    case 'fedinapenale':
    case 'record':
      await handleFedina(m, user, conn, userId, groupId);
      break;
  }
};

async function handleLavora(m, user, conn, userId, groupId) {
  const cd = 45 * 1000;
  if (cooldowns[userId + '_lavoro'] && Date.now() - cooldowns[userId + '_lavoro'] < cd) {
    const restante = Math.ceil((cooldowns[userId + '_lavoro'] + cd - Date.now()) / 1000);
    throw `⏳ Sei già stanco! Riposa per *${restante}s* 😴`;
  }

  cooldowns[userId + '_lavoro'] = Date.now();

  const lavoro = pickRandom(lavori);
  const guadagno = Math.floor(Math.random() * (lavoro.guadagnoMax - lavoro.guadagnoMin + 1)) + lavoro.guadagnoMin;

  user.limit = (user.limit || 0) + guadagno;
  user.exp = (user.exp || 0) + lavoro.xp;

  // Mancia casuale
  let mancia = '';
  if (Math.random() < 0.2) {
    const extra = Math.floor(Math.random() * 50) + 10;
    user.limit += extra;
    mancia = `\n🤑 Mancia extra: +${extra} UC!`;
  }

  let testo = `💼 *LAVORO* 💼\n\n`;
  testo += `${lavoro.nome}\n`;
  testo += `📝 ${lavoro.messaggio}\n\n`;
  testo += `💰 Guadagno: *+${guadagno} UC*\n`;
  testo += `✨ +${lavoro.xp} XP${mancia}\n`;
  testo += `\n💶 Saldo: ${user.limit} UC`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
  await conn.sendMessage(m.chat, { react: { text: '💼', key: m.key } });
}

async function handleCrimine(m, user, conn, userId, groupId, text) {
  const cd = 120 * 1000;
  if (cooldowns[userId + '_crimine'] && Date.now() - cooldowns[userId + '_crimine'] < cd) {
    const restante = Math.ceil((cooldowns[userId + '_crimine'] + cd - Date.now()) / 1000);
    throw `⏳ La polizia ti sta cercando! Aspetta *${restante}s* 🚔`;
  }

  const idx = parseInt(text) - 1;
  if (isNaN(idx) || idx < 0 || idx >= crimini.length) {
    throw `❌ Scegli un crimine valido! Usa *.crimini* per la lista`;
  }

  const crimine = crimini[idx];
  cooldowns[userId + '_crimine'] = Date.now();
  user.crimini.rapine++;

  // Probabilità di successo basata sulla difficoltà
  const roll = Math.random() * 100;
  const successo = roll > crimine.difficoltà;

  let testo = `🔫 *CRIMINE* 🔫\n\n`;
  testo += `📋 Missione: *${crimine.nome}*\n\n`;

  if (successo) {
    const guadagno = Math.floor(Math.random() * (crimine.guadagnoMax - crimine.guadagnoMin + 1)) + crimine.guadagnoMin;
    user.limit = (user.limit || 0) + guadagno;
    user.exp = (user.exp || 0) + crimine.xp;
    user.crimini.successi++;

    testo += `✅ *SUCCESSO!*\n`;
    testo += `💰 Bottino: *+${guadagno} UC*\n`;
    testo += `✨ +${crimine.xp} XP\n`;
    testo += `🏃 Sei scappato senza lasciare tracce!`;

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } });
  } else {
    const multa = Math.floor(Math.random() * (crimine.multaMax - crimine.multaMin + 1)) + crimine.multaMin;
    user.limit = Math.max(0, (user.limit || 0) - multa);
    user.crimini.arrestato++;

    // Cooldown extra
    cooldowns[userId + '_crimine'] = Date.now() + 60000;

    testo += `🚨 *ARRESTATO!*\n`;
    testo += `👮 La polizia ti ha beccato!\n`;
    testo += `💸 Multa: *-${multa} UC*\n`;
    testo += `⛓️ Tempo extra in cella!`;

    await conn.sendMessage(m.chat, { react: { text: '🚨', key: m.key } });
  }

  testo += `\n\n💶 Saldo: ${user.limit} UC`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleListaCrimini(m, conn, groupId, usedPrefix) {
  let testo = `🔫 *LISTA CRIMINI* 🔫\n\n`;

  crimini.forEach((c, i) => {
    const stelle = '⭐'.repeat(Math.ceil(c.difficoltà / 20));
    testo += `*${i + 1}.* ${c.nome}\n`;
    testo += `   💰 ${c.guadagnoMin}-${c.guadagnoMax} UC | Difficoltà: ${stelle}\n\n`;
  });

  testo += `📌 Usa *${usedPrefix}crimine <numero>* per iniziare!`;

  await conn.sendMessage(groupId, { text: testo }, { quoted: m });
}

async function handleFedina(m, user, conn, userId, groupId) {
  let testo = `📋 *FEDINA PENALE* di @${userId.split('@')[0]}\n\n`;
  testo += `🔫 Crimini tentati: ${user.crimini.rapine}\n`;
  testo += `✅ Riusciti: ${user.crimini.successi}\n`;
  testo += `🔒 Volte arrestato: ${user.crimini.arrestato}\n`;
  testo += `📊 Tasso di successo: ${user.crimini.rapine > 0 ? Math.floor((user.crimini.successi / user.crimini.rapine) * 100) : 0}%\n`;
  testo += `\n${user.crimini.arrestato > 5 ? '⚠️ SEI UN RICERCATO!' : user.crimini.arrestato > 2 ? '👀 La polizia ti tiene d\'occhio...' : '😇 Fedina quasi pulita'}`;

  await conn.sendMessage(groupId, {
    text: testo,
    mentions: [userId]
  }, { quoted: m });
}

handler.help = [
  'lavora — Fai un lavoro casuale',
  'crimine <num> — Commetti un crimine',
  'crimini — Lista dei crimini',
  'fedinapenale — Le tue stats criminali'
];
handler.tags = ['rpg', 'fun'];
handler.command = /^(lavora|work|crimine|crime|crimini|crimes|fedinapenale|record)$/i;
handler.register = true;
handler.group = true;

export default handler;
