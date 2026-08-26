let handler = async (m, { conn, command }) => {
    const userId = m.sender;
    const groupId = m.chat;
    const nomeDelBot = conn.user?.name || global.db?.data?.nomedelbot || '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄';

    // Comandi ban e unban (solo italiano e inglese)
    const banCommands = /^(banchat|bangp|banirchat|chatban|chatblock|chatgesperrt|禁用聊天|забанитьчат|حظرالمحادثة|चैटबैन)$/i;
    const unbanCommands = /^(unbanchat|unbangp|desbanirchat|chatunban|chatunblock|chatfreigeben|启用聊天|разбанитьчат|رفعالحظر|चैटअनबैन)$/i;

    const isBan = banCommands.test(command);
    const isUnban = unbanCommands.test(command);

    if (!isBan && !isUnban) {
        return; // comando non riconosciuto
    }

    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {};
    }

    // Imposta correttamente lo stato
    global.db.data.chats[m.chat].isBanned = isBan;

    const messageKey = isBan ? 'banChatSuccess' : 'unbanChatSuccess';

    await conn.sendMessage(m.chat, {
        text: global.t(messageKey, userId, groupId),
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: nomeDelBot
            }
        }
    }, { quoted: m });
};

handler.help = [
    'banchat',
    'unbanchat',
    'bangp',
    'unbangp',
    'banirchat',
    'desbanirchat',
    'chatban',
    'chatunban',
    'chatblock',
    'chatunblock',
    'chatgesperrt',
    'chatfreigeben'
];

handler.tags = ['owner'];

// Solo italiano e inglese nei comandi riconosciuti
handler.command = /^(banchat|unbanchat|bangp|unbangp|banirchat|desbanirchat|chatban|chatunban|chatblock|chatunblock|chatgesperrt|chatfreigeben)$/i;

handler.rowner = true;

export default handler;
