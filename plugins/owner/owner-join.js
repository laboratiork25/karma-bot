const linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i

const styles = {
  line: '࿐',
  header(title) {
    return `╭═━⪩ 〖 ${title} 〗═•${this.line}`
  },
  item(text) {
    return `│❍ ${text}`
  },
  footer() {
    return `╰━ ━ ━ ━ ━━⪩${this.line}`
  },
  box(title, rows = []) {
    return [this.header(title), ...rows.map(row => this.item(row)), this.footer()].join('\n')
  }
}

const parseDays = value => {
  const num = parseInt(value, 10)
  return Number.isNaN(num) ? null : num
}

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      styles.box('JOIN GRUPPO', [
        `Usa il comando in questo modo`,
        `\`${usedPrefix + command} https://chat.whatsapp.com/xxxxx 3\``,
        `Puoi anche usare \`inf\` per nessuna scadenza`
      ])
    )
  }

  const [_, code] = text.match(linkRegex) || []

  if (!code) {
    return m.reply(
      styles.box('LINK NON VALIDO', [
        `Inserisci un link gruppo valido`,
        `Controlla che inizi con \`https://chat.whatsapp.com/\``
      ])
    )
  }

  const args = text.trim().split(/\s+/)
  const rawExpired = args[1]

  try {
    const res = await conn.groupAcceptInvite(code)

    if (!global.db.data.chats[res]) {
      global.db.data.chats[res] = {}
    }

    if (rawExpired === 'inf') {
      delete global.db.data.chats[res].expired
      return m.reply(
        styles.box('ACCESSO CONFERMATO', [
          `Mi sono unito al gruppo`,
          `Durata: *senza scadenza*`
        ])
      )
    }

    const requestedDays = parseDays(rawExpired)
    const expired = Math.floor(
      Math.min(
        999,
        Math.max(1, isOwner ? (requestedDays ?? 3) : 3)
      )
    )

    global.db.data.chats[res].expired = Date.now() + expired * 86400000

    return m.reply(
      styles.box('ACCESSO CONFERMATO', [
        `Mi sono unito al gruppo`,
        `Durata: *${expired} giorni*`
      ])
    )
  } catch (e) {
    return m.reply(
      styles.box('ERRORE', [
        `Non sono riuscito a entrare nel gruppo`,
        `Dettagli: \`${e?.message || e}\``
      ])
    )
  }
}

handler.help = ['join <link> <giorni|inf>']
handler.tags = ['owner']
handler.command = /^join$/i
handler.owner = true

export default handler