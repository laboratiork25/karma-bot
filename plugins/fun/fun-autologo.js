let handler = async (m, { conn, text }) => {
    const userId = m.sender;
    const groupId = m.chat;

    if (!text) {
        return m.reply("Usa: .amore @utente oppure .amore @utente1 + @utente2");
    }

    let users = [];

    if (text.includes("+")) {
        let parts = text.split("+");
        for (let p of parts) {
            let clean = p.replace(/[@\s]/g, "");
            if (clean) users.push(clean + "@s.whatsapp.net");
        }
    } else {
        let clean = text.replace(/[@\s]/g, "");
        users.push(userId);
        users.push(clean + "@s.whatsapp.net");
    }

    if (users.length < 2) {
        return m.reply("Devi indicare due persone!");
    }

    const u1 = users[0];
    const u2 = users[1];

    const tag1 = u1.split("@")[0];
    const tag2 = u2; 

    const percent = Math.floor(Math.random() * 101);

    let frase =
        percent < 30
            ? "💔 Compatibilità tragicomica."
            : percent < 60
            ? "💞 Potrebbe funzionare… forse."
            : percent < 85
            ? "❤️ Buone vibrazioni amorose."
            : "💘 Destinati a litigare insieme per sempre.";

    const msg = `💟 *Affinità d'amore*\n\n@${tag1} ❤️ ${tag2}\n\n💗 Compatibilità: *${percent}%*\n${frase}`;

    await conn.sendMessage(
        groupId,
        {
            text: msg,
            mentions: [u1, u2]
        },
        { quoted: m }
    );
};

handler.help = ['amore @utente', 'amore @utente1 + @utente2'];
handler.tags = ['fun'];
handler.command = /^amore$/i;

export default handler;
