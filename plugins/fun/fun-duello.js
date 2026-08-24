
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

let cooldowns = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const userId = m.sender;
  const groupId = m.chat;
  const users = global.db.data.users;
  const user = users[m.sender];

  if (!user) throw '❌ Non sei registrato!';

  const tempoAttesa = 30 * 1000;
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
    const restante = Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000);
    throw `⏳ Sei ancora ferito dall'ultimo duello! Aspetta *${restante}s*`;
  }

  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  if (!mention) throw `❌ Sfida qualcuno!\n📌 Usa: *${usedPrefix}duello @utente*`;
  if (mention === userId) throw '❌ Non puoi sfidare te stesso, pazzo! 🤺';

  const avversario = users[mention];
  if (!avversario) throw '❌ L\'avversario non è registrato!';

  const scommessa = parseInt(text?.replace(/[^0-9]/g, '')) || 100;
  if (scommessa < 50) throw '❌ La scommessa minima è 50 UC!';
  if (scommessa > 1000) throw '❌ La scommessa massima è 1000 UC!';
  if ((user.limit || 0) < scommessa) throw `❌ Non hai abbastanza UC! Hai: ${user.limit || 0} UC`;
  if ((avversario.limit || 0) < scommessa) throw `❌ @${mention.split('@')[0]} non ha abbastanza UC!`;

  cooldowns[m.sender] = Date.now();
  cooldowns[mention] = Date.now();

  // Statistiche duello
  if (!user.duelli) user.duelli = { vinti: 0, persi: 0 };
  if (!avversario.duelli) avversario.duelli = { vinti: 0, persi: 0 };

  const armi = ['⚔️ Spada', '🏹 Arco', '🔨 Martello', '🗡️ Pugnale', '🪓 Ascia', '🔱 Tridente', '⛏️ Piccone magico', '🛡️ Scudo spinalato'];
  const mosse = [
    'ha sferrato un colpo devastante!',
    'ha schivato e contrattaccato!',
    'ha usato una mossa segreta!',
    'ha evocato il potere degli antichi!',
    'ha lanciato un attacco fulmineo!',
    'ha parato con maestria e colpito!',
    'è scivolato in una pozzanghera ma ha vinto lo stesso!',
    'ha tirato una testata fortissima!',
    'ha usato il potere dell\'amicizia (e un pugno)!'
  ];

  const armaGiocatore = pickRandom(armi);
  const armaAvversario = pickRandom(armi);

  // Calcolo risultato con bonus per chi ha più duelli vinti
  const bonusGiocatore = Math.min(user.duelli.vinti * 2, 15);
  const bonusAvversario = Math.min(avversario.duelli.vinti * 2, 15);

  const punteggioGiocatore = Math.random() * 100 + bonusGiocatore;
  const punteggioAvversario = Math.random() * 100 + bonusAvversario;

  const vincitore = punteggioGiocatore >= punteggioAvversario ? userId : mention;
  const perdente = vincitore === userId ? mention : userId;
  const mossa = pickRandom(mosse);

  // Applica risultato
  users[vincitore].limit = (users[vincitore].limit || 0) + scommessa;
  users[perdente].limit = (users[perdente].limit || 0) - scommessa;
  users[vincitore].duelli.vinti++;
  users[perdente].duelli.persi++;

  // XP bonus per il vincitore
  const xpBonus = Math.floor(scommessa / 10);
  users[vincitore].exp = (users[vincitore].exp || 0) + xpBonus;

  let testo = `⚔️ *DUELLO RPG* ⚔️\n\n`;
  testo += `🟥 @${userId.split('@')[0]} (${armaGiocatore})\n`;
  testo += `  ⚡ Potenza: ${Math.floor(punteggioGiocatore)}\n\n`;
  testo += `🆚\n\n`;
  testo += `🟦 @${mention.split('@')[0]} (${armaAvversario})\n`;
  testo += `  ⚡ Potenza: ${Math.floor(punteggioAvversario)}\n\n`;
  testo += `━━━━━━━━━━━━━━━━━━━━\n`;
  testo += `🏆 @${vincitore.split('@')[0]} ${mossa}\n\n`;
  testo += `💰 Bottino: +${scommessa} UC\n`;
  testo += `✨ +${xpBonus} XP\n\n`;
  testo += `📊 Record @${vincitore.split('@')[0]}: ${users[vincitore].duelli.vinti}W / ${users[vincitore].duelli.persi}L`;

  await conn.sendMessage(groupId, {
    text: testo,
    mentions: [userId, mention],
    contextInfo: {
      externalAdReply: {
        title: '⚔️ Duello RPG',
        body: `${vincitore.split('@')[0]} ha vinto ${scommessa} UC!`,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } });
};

handler.help = ['duello @utente <UC>', 'duel @user <UC>'];
handler.tags = ['rpg', 'fun'];
handler.command = /^(duello|duel|sfida|challenge)$/i;
handler.register = true;
handler.group = true;

export default handler;
