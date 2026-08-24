
const formatNumber = num => new Intl.NumberFormat('it-IT').format(num)

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

let handler = async (m, { conn, usedPrefix }) => {
  const userId = m.sender
  const groupId = m.chat

  const who = m.quoted
    ? m.quoted.sender
    : m.mentionedJid?.[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? conn.user.jid
        : m.sender

  const user = global.db.data.users[who]
  const name = conn.getName(who)

  if (!(who in global.db.data.users)) {
    throw global.t('walletNotFound', userId, groupId)
  }

  if (typeof user.limit !== 'number') user.limit = 0
  if (typeof user.bank !== 'number') user.bank = 0

  const imgUrl = 'https://i.ibb.co/4RSNsdx9/Sponge-Bob-friendship-wallet-meme-9.png'

  const message = styles.box('PORTAFOGLIO', [
    `Utente: *${name}*`,
    `Contanti: \`${formatNumber(user.limit)} UC\``,
    `Banca: \`${formatNumber(user.bank)} UC\``,
    `Azioni rapide disponibili qui sotto`
  ])

  const buttons = [
    {
      buttonId: `${usedPrefix}deposit`,
      buttonText: { displayText: '🏦 Deposita' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}withdraw`,
      buttonText: { displayText: '💸 Preleva' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}games`,
      buttonText: { displayText: '🎮 Giochi' },
      type: 1
    }
  ]

  await conn.sendMessage(
    m.chat,
    {
      text: message,
      footer: '`₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄 Economy`',
      buttons,
      mentions: [who],
      contextInfo: {
        externalAdReply: {
          title: ` 💼  *Saldo di ${name}*`,
          body: `Contanti disponibili: ${formatNumber(user.limit)} UC`,
          thumbnailUrl: imgUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  )

  await conn.sendMessage(m.chat, {
    react: { text: '💶', key: m.key }
  })
}

handler.help = ['wallet', 'portafoglio', 'balance']
handler.tags = ['economy']
handler.command = /^(soldi|wallet|portafoglio|uc|saldo|unitycoins|balance)$/i
handler.register = true

export default handler
