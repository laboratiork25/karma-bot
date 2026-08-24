let handler = async (m, { conn, text, normalizedParticipants }) => {
    const userId = m.sender
    const groupId = m.chat

    if (!text) {
        return m.reply("Usa: .amore @utente oppure .amore @utente1 + @utente2")
    }

    async function normalize(jid) {
        const clean = jid.replace(/[@\s]/g, "")
        const full = clean + "@s.whatsapp.net"

        const participant = normalizedParticipants.find(p => {
            const id = conn.decodeJid(p.id)
            return id.split("@")[0] === clean
        })

        if (participant) {
            return conn.decodeJid(participant.id)
        }

        return conn.decodeJid(full)
    }

    let u1, u2

    if (text.includes("+")) {
        let parts = text.split("+").map(v => v.replace(/[@\s]/g, ""))
        if (!parts[0] || !parts[1]) return m.reply("Formato non valido.")
        u1 = await normalize(parts[0])
        u2 = await normalize(parts[1])
    } else {
        let clean = text.replace(/[@\s]/g, "")
        u1 = conn.decodeJid(userId)
        u2 = await normalize(clean)
    }

    const tag1 = u1.split("@")[0]
    const tag2 = u2.split("@")[0]

    const percent = Math.floor(Math.random() * 101)

    let frase =
        percent < 30
            ? "💔 Compatibilità tragicomica."
            : percent < 60
            ? "💞 Potrebbe funzionare… forse."
            : percent < 85
            ? "❤️ Buone vibrazioni amorose."
            : "💘 Destinati a combinare guai insieme."

    const msg = `💟 *Affinità d'amore*\n\n@${tag1} ❤️ @${tag2}\n\n💗 Compatibilità: *${percent}%*\n${frase}`

    await conn.sendMessage(
        groupId,
        {
            text: msg,
            mentions: [u1, u2]
        },
        { quoted: m }
    )
}

handler.help = ['amore @utente', 'amore @utente1 + @utente2']
handler.tags = ['fun']
handler.command = /^amore$/i

export default handler
