let handler = async (m, { conn, text, participants }) => {
  try {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms))

    if (!text) return m.reply("Usa: .bigtag <ripetizioni 1-100> <testo>")

    let args = text.trim().split(/\s+/)
    let repeat = parseInt(args[0])
    let customMessage = args.slice(1).join(" ").trim()

    if (isNaN(repeat)) {
      repeat = 1
      customMessage = text.trim()
    }

    if (repeat > 100) repeat = 100
    if (repeat < 1) repeat = 1

    if (!customMessage) {
      return m.reply("Scrivi un messaggio dopo il numero!")
    }

    let users = participants.map((u) => conn.decodeJid(u.id)).filter(Boolean)

    for (let i = 0; i < repeat; i++) {
      await conn.sendMessage(
        m.chat,
        {
          text: customMessage,
          mentions: users,
          linkPreview: false
        },
        { quoted: m }
      )

      if (i + 1 < repeat) await delay(300)
    }
  } catch (e) {
    console.error(e)
    m.reply("Errore durante l'esecuzione del bigtag.")
  }
}

handler.command = /^(bigtag)$/i
handler.group = true
handler.admin = true

export default handler