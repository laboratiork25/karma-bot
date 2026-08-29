 
let tassa = 0.02;

let handler = async (m, { conn, text }) => {
  let userId = m.sender;
  let who;
  if (m.isGroup) who = m.mentionedJid?.[0];
  else who = m.chat;

  if (!who) throw global.t('darxpNoMention', userId, null);
  if (who === userId) throw global.t('darxpNoMention', userId, null);

  let txt = text.replace('@' + who.split('@')[0], '').trim();

  if (!txt) throw global.t('darxpNoAmount', userId, null);
  if (isNaN(txt)) throw global.t('darxpInvalidAmount', userId, null);

  let xp = parseInt(txt);
  if (xp < 1) throw global.t('darxpMinAmount', userId, null);

  let exp = xp;
  let tassaImporto = Math.ceil(xp * tassa);
  exp += tassaImporto;

  let users = global.db.data.users;
  if (!users[userId]) users[userId] = { exp: 0 };
  if (!users[who]) throw global.t('darxpNoMention', userId, null);
  users[userId].exp = Number(users[userId].exp) || 0;
  users[who].exp = Number(users[who].exp) || 0;
  if (exp > users[userId].exp) throw global.t('darxpInsufficientXP', userId, null);

  users[userId].exp -= exp;
  users[who].exp += xp;

  await conn.sendMessage(
    m.chat,
    {
      text: global.t('darxpSuccess', userId, null, { xp, tassa: tassaImporto }),
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363413194245625@newsletter',
          serverMessageId: '',
          newsletterName: 'ƌɽɛɑƌ-ʙᴏᴛ',
        },
      },
    },
    { quoted: m }
  );

  await conn.sendMessage(
    m.chat,
    {
      text: `📩 +${xp} 💫 XP!`,
      contextInfo: {
        forwardingScore: 99,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363413194245625@newsletter',
          serverMessageId: '',
          newsletterName: 'ƌɽɛɑƌ-ʙᴏᴛ',
        },
      },
    },
    { quoted: m, mentions: [who] }
  );
};

handler.help = ['darxp *@user <quantità>*'];
handler.tags = ['rpg'];
handler.command = ['daixp', 'daiexp', 'donaxp'];
handler.register = true;

export default handler;
