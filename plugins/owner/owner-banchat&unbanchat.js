let handler = async (m, { conn, command }) => {
    const userId = m.sender;
    const groupId = m.chat;
    const nomeDelBot = conn.user?.name || global.db?.data?.nomedelbot || 'ƌɽɛɑƌ-ʙᴏᴛ';

    // Comandi ban e unban (solo italiano e inglese)
    const banCommands = /^(banchat|bangp|banirchat|chatban|chatblock|chatgesperrt)$/i;
    const unbanCommands = /^(unbanchat|unbangp|desbanirchat|chatunban|chatunblock|chatfreigeben)$/i;

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

    // Testo del messaggio
    const text = isBan
        ? `✅ *Chat bannata con successo*\n\nLa chat è stata bloccata. Solo i proprietari del bot possono usare i comandi qui.`
        : `✅ *Chat sbannata con successo*\n\nLa chat è stata riattivata. Tutti i comandi sono di nuovo disponibili.`;

    await conn.sendMessage(m.chat, {
        text,
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
