
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let cooldowns = {};

const mostri = [
  { nome: '🐺 Lupo Mannaro', hp: 50, attacco: 15, xp: 30, uc: 50, rarità: 'comune' },
  { nome: '💀 Scheletro', hp: 30, attacco: 10, xp: 20, uc: 30, rarità: 'comune' },
  { nome: '🧟 Zombie', hp: 40, attacco: 12, xp: 25, uc: 40, rarità: 'comune' },
  { nome: '🕷️ Ragno Gigante', hp: 35, attacco: 18, xp: 35, uc: 45, rarità: 'comune' },
  { nome: '👻 Fantasma', hp: 60, attacco: 20, xp: 50, uc: 80, rarità: 'non comune' },
  { nome: '🧛 Vampiro', hp: 80, attacco: 25, xp: 60, uc: 100, rarità: 'non comune' },
  { nome: '🧙 Strega Oscura', hp: 70, attacco: 30, xp: 70, uc: 120, rarità: 'non comune' },
  { nome: '🐲 Drago di Fuoco', hp: 150, attacco: 40, xp: 150, uc: 300, rarità: 'raro' },
  { nome: '🦁 Chimera', hp: 120, attacco: 35, xp: 120, uc: 250, rarità: 'raro' },
  { nome: '🐍 Idra a 7 Teste', hp: 180, attacco: 45, xp: 200, uc: 400, rarità: 'raro' },
  { nome: '😈 Demone Infernale', hp: 250, attacco: 55, xp: 350, uc: 600, rarità: 'epico' },
  { nome: '👹 Re dei Goblin', hp: 200, attacco: 50, xp: 300, uc: 500, rarità: 'epico' },
  { nome: '🐉 Drago Antico', hp: 400, attacco: 70, xp: 500, uc: 1000, rarità: 'leggendario' },
  { nome: '☠️ Lich Supremo', hp: 350, attacco: 65, xp: 450, uc: 900, rarità: 'leggendario' },
];

const raritàProb = { comune: 40, 'non comune': 30, raro: 18, epico: 9, leggendario: 3 };

function generaMostro() {
  const roll = Math.random() * 100;
  let cumulativo = 0;
  let raritàScelta = 'comune';
  for (const [r, p] of Object.entries(raritàProb)) {
    cumulativo += p;
    if (roll < cumulativo) { raritàScelta = r; break; }
  }
  const disponibili = mostri.filter(m => m.rarità === raritàScelta);
  const base = pickRandom(disponibili);
  const variazione = 0.8 + Math.random() * 0.4;
  return {
    ...base,
    hp: Math.floor(base.hp * variazione),
    attacco: Math.floor(base.attacco * variazione),
  };
}

const raritàEmoji = { comune: '⬜', 'non comune': '🟩', raro: '🟦', epico: '🟪', leggendario: '🟨' };

let handler = async (m, { conn, command, usedPrefix }) => {
  const userId = m.sender;
  const groupId = m.chat;
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!user) throw '❌ Non sei registrato!';

  const tempoAttesa = 20 * 1000;
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
    const restante = Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000);
    throw `⏳ Stai riprendendo le forze! Aspetta *${restante}s* 🩹`;
  }

  cooldowns[m.sender] = Date.now();

  if (!user.avventura) user.avventura = { mostri_uccisi: 0, sconfitte: 0, boss_uccisi: 0 };

  const mostro = generaMostro();
  const emoji = raritàEmoji[mostro.rarità];

  const livello = Math.floor(Math.sqrt((user.exp || 0) / 100)) + 1;
  const hpGiocatore = 80 + livello * 10;
  let attaccoGiocatore = 10 + livello * 3;

  let bonusArma = '';
  if (user.arma) {
    attaccoGiocatore += user.arma.bonus || 0;
    bonusArma = ` (+${user.arma.bonus} ${user.arma.nome})`;
  }

  let hpM = mostro.hp;
  let hpG = hpGiocatore;
  let log = '';
  let turno = 0;

  while (hpM > 0 && hpG > 0 && turno < 10) {
    turno++;
    const critGiocatore = Math.random() < 0.15;
    let dmgGiocatore = attaccoGiocatore + Math.floor(Math.random() * 10);
    if (critGiocatore) dmgGiocatore = Math.floor(dmgGiocatore * 1.5);
    const schivaMostro = Math.random() < 0.1;

    if (schivaMostro) {
      log += `⚔️ T${turno}: Attacchi ma il mostro schiva!\n`;
    } else {
      hpM -= dmgGiocatore;
      log += `⚔️ T${turno}: Colpisci per *${dmgGiocatore}* dmg${critGiocatore ? ' 💥CRITICO!' : ''}\n`;
    }

    if (hpM <= 0) break;

    const critMostro = Math.random() < 0.1;
    let dmgMostro = mostro.attacco + Math.floor(Math.random() * 8);
    if (critMostro) dmgMostro = Math.floor(dmgMostro * 1.5);
    const schivaGiocatore = Math.random() < 0.12;

    if (schivaGiocatore) {
      log += `🛡️ T${turno}: Il mostro attacca ma schivi!\n`;
    } else {
      hpG -= dmgMostro;
      log += `💢 T${turno}: Il mostro colpisce per *${dmgMostro}* dmg${critMostro ? ' 💥CRITICO!' : ''}\n`;
    }
  }

  const vittoria = hpM <= 0;

  let testo = `🗡️ *CACCIA AL MOSTRO* 🗡️\n\n`;
  testo += `${emoji} Un *${mostro.nome}* appare!\n`;
  testo += `❤️ HP: ${mostro.hp} | ⚔️ ATK: ${mostro.attacco}\n`;
  testo += `⭐ Rarità: ${mostro.rarità.toUpperCase()}\n\n`;
  testo += `👤 @${userId.split('@')[0]} (Lv.${livello})\n`;
  testo += `❤️ HP: ${hpGiocatore} | ⚔️ ATK: ${attaccoGiocatore}${bonusArma}\n\n`;
  testo += `━━━ COMBATTIMENTO ━━━\n`;
  testo += log;
  testo += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (vittoria) {
    user.limit = (user.limit || 0) + mostro.uc;
    user.exp = (user.exp || 0) + mostro.xp;
    user.avventura.mostri_uccisi++;
    if (mostro.rarità === 'leggendario' || mostro.rarità === 'epico') user.avventura.boss_uccisi++;

    testo += `🏆 *VITTORIA!*\n`;
    testo += `💰 +${mostro.uc} UC\n`;
    testo += `✨ +${mostro.xp} XP\n`;

    if (Math.random() < 0.08) {
      const armi = [
        { nome: '🗡️ Spada di Ferro', bonus: 5 },
        { nome: '⚔️ Spada d\'Argento', bonus: 10 },
        { nome: '🔱 Tridente Magico', bonus: 15 },
        { nome: '🏹 Arco Elfico', bonus: 12 },
        { nome: '🪓 Ascia del Berserker', bonus: 18 },
      ];
      const arma = pickRandom(armi);
      user.arma = arma;
      testo += `\n🎁 *DROP RARO!* Hai trovato: ${arma.nome} (+${arma.bonus} ATK)`;
    }

    const reactEmoji = mostro.rarità === 'leggendario' ? '🐉' : '🏆';
    await conn.sendMessage(m.chat, { react: { text: reactEmoji, key: m.key } });
  } else {
    const ucPersi = Math.floor(Math.random() * 50) + 20;
    user.limit = Math.max(0, (user.limit || 0) - ucPersi);
    user.avventura.sconfitte++;

    testo += `💀 *SCONFITTA!*\n`;
    testo += `😵 Sei stato sconfitto dal ${mostro.nome}!\n`;
    testo += `💸 Hai perso *${ucPersi} UC* in cure mediche.`;

    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } });
  }

  testo += `\n\n📊 Stats: ⚔️${user.avventura.mostri_uccisi} uccisi | 💀${user.avventura.sconfitte} sconfitte | 👹${user.avventura.boss_uccisi} boss`;

  await conn.sendMessage(groupId, {
    text: testo,
    mentions: [userId]
  }, { quoted: m });
};

handler.help = ['mostro — Combatti un mostro casuale', 'monster — Fight a random monster'];
handler.tags = ['rpg', 'fun'];
handler.command = /^(mostro|monster|caccia|hunt|combattimostro|fightmonster)$/i;
handler.register = true;
handler.group = true;

export default handler;
