
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

  const tempoAttesa = 60 * 1000;
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
    const restante = Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000);
    throw `⏳ La polizia ti sta cercando! Nascoonditi per altri *${restante}s*`;
  }

  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  if (!mention) throw `❌ Scegli la vittima della rapina!\n📌 Usa: *${usedPrefix}rapina @utente*`;
  if (mention === userId) throw '❌ Non puoi rapinare te stesso! 🤦';

  const vittima = users[mention];
  if (!vittima) throw '❌ La vittima non è registrata!';
  if ((vittima.limit || 0) < 100) throw `❌ @${mention.split('@')[0]} è troppo povero per essere rapinato! 💀`;

  cooldowns[m.sender] = Date.now();

  if (!user.crimini) user.crimini = { rapine: 0, successi: 0, arrestato: 0 };
  user.crimini.rapine++;

  // Probabilità: 40% successo, 30% fallimento, 30% arrestato
  const roll = Math.random() * 100;

  let testo;

  if (roll < 40) {
    // SUCCESSO
    const bottino = Math.floor(Math.random() * Math.min(vittima.limit, 500)) + 50;
    user.limit = (user.limit || 0) + bottino;
    vittima.limit -= bottino;
    user.crimini.successi++;

    const scene = [
      `🔫 @${userId.split('@')[0]} ha fatto irruzione nella casa di @${mention.split('@')[0]}!\n\n💰 Ha rubato *${bottino} UC*!\n🏃 È scappato prima che arrivasse la polizia!`,
      `🥷 @${userId.split('@')[0]} si è intrufolato nel portafoglio di @${mention.split('@')[0]}!\n\n💸 Bottino: *${bottino} UC*!\n🌙 Come un fantasma nella notte...`,
      `🎭 @${userId.split('@')[0]} ha distratto @${mention.split('@')[0]} con una barzelletta e gli ha svuotato le tasche!\n\n💰 Rubati: *${bottino} UC*!`
    ];
    testo = pickRandom(scene);

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } });

  } else if (roll < 70) {
    // FALLIMENTO
    const perso = Math.floor(Math.random() * 100) + 50;
    user.limit = Math.max(0, (user.limit || 0) - perso);

    const scene = [
      `😂 @${userId.split('@')[0]} ha provato a rapinare @${mention.split('@')[0]} ma è inciampato sulla sua stessa scarpa!\n\n💸 Ha perso *${perso} UC* nella caduta!`,
      `🤣 @${userId.split('@')[0]} si è presentato con un banana al posto della pistola!\n\n@${mention.split('@')[0]} lo ha preso a calci!\n💸 -${perso} UC`,
      `😅 @${userId.split('@')[0]} ha provato a scassinare la porta ma ha rotto la chiave!\n\n🔧 Costo riparazione: *${perso} UC*`
    ];
    testo = pickRandom(scene);

    await conn.sendMessage(m.chat, { react: { text: '😂', key: m.key } });

  } else {
    // ARRESTATO
    const multa = Math.floor(Math.random() * 300) + 200;
    user.limit = Math.max(0, (user.limit || 0) - multa);
    user.crimini.arrestato++;

    const scene = [
      `🚨 @${userId.split('@')[0]} è stato ARRESTATO mentre rapinava @${mention.split('@')[0]}!\n\n👮 La polizia era già lì!\n💸 Multa: *${multa} UC*\n⛓️ 2 minuti in cella!`,
      `🚔 WEEE WOOO WEEE WOOO!\n@${userId.split('@')[0]} è stato beccato in flagrante!\n\n👮‍♂️ "Lei è in arresto!"\n💸 Multa: *${multa} UC*`,
      `🔒 @${userId.split('@')[0]} è finito in gattabuia!\n\nLa vittima @${mention.split('@')[0]} ha chiamato il 112!\n💸 Multa: *${multa} UC*`
    ];
    testo = pickRandom(scene);

    // Cooldown extra per arresto
    cooldowns[m.sender] = Date.now() + 60000;

    await conn.sendMessage(m.chat, { react: { text: '🚨', key: m.key } });
  }

  testo += `\n\n📊 Fedina penale di @${userId.split('@')[0]}:\n`;
  testo += `🔫 Rapine: ${user.crimini.rapine} | ✅ Riuscite: ${user.crimini.successi} | 🔒 Arrestato: ${user.crimini.arrestato}`;

  await conn.sendMessage(groupId, {
    text: testo,
    mentions: [userId, mention]
  }, { quoted: m });
};

handler.help = ['rapina @utente', 'rob @user'];
handler.tags = ['rpg', 'fun'];
handler.command = /^(rapina|rob|ruba|steal|rapinar|robar)$/i;
handler.register = true;
handler.group = true;

export default handler;
