const SUPPORT_GROUP_LINK = 'https://chat.whatsapp.com/EKYFz0BXwKhCsb59ztwvKo?s=cl&p=i&mlu=3&ilr=0'

const handler = async (m, { conn }) => {
  const text = `🛠️ *Gruppo Supporto ƌɽɛɑƌ-ʙᴏᴛ*\n\nEntra qui:\n${SUPPORT_GROUP_LINK}`
  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

handler.help = ['support', 'supporto']
handler.tags = ['info']
handler.command = /^(support|supporto)$/i

export default handler