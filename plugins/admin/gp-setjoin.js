import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const MEDIA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'media', 'welcome')

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const userId = m.sender
  const groupId = m.isGroup ? m.chat : null

  const isWelcome = /^(setwelcome|setbenvenuto)$/i.test(command)
  const isBye = /^(setbye|setaddio)$/i.test(command)
  const isRemoveWelcome = /^(removewelcome|removebenvenuto)$/i.test(command)
  const isRemoveBye = /^(removebye|removeaddio)$/i.test(command)

  const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

  if (isRemoveWelcome) {
    if (chat.sWelcomeMedia) {
      try { fs.unlinkSync(chat.sWelcomeMedia) } catch {}
    }
    delete chat.sWelcomeMedia
    delete chat.sWelcomeMediaType
    delete chat.sWelcomeIsGif
    delete chat.sWelcomeMimetype
    m.reply('✅ Media del benvenuto rimosso.')
    return
  }

  if (isRemoveBye) {
    if (chat.sByeMedia) {
      try { fs.unlinkSync(chat.sByeMedia) } catch {}
    }
    delete chat.sByeMedia
    delete chat.sByeMediaType
    delete chat.sByeIsGif
    delete chat.sByeMimetype
    m.reply('✅ Media dell\'addio rimosso.')
    return
  }

  if (isWelcome || isBye) {
    if (!text) throw isWelcome ? 'Inserisci il testo del benvenuto.' : 'Inserisci il testo dell\'addio.'

    if (isWelcome) chat.sWelcome = text
    else chat.sBye = text

    const q = m.quoted ? m.quoted : m
    
    const mime = (q.msg || q).mimetype || ''
    const mediaType = mime.split('/')[0]

    if (mime && (mediaType === 'image' || mediaType === 'video')) {
      const buffer = await q.download()

      if (buffer && buffer.length > 0) {
        const normalizedType = mediaType === 'image' ? 'image' : 'video'
        
        // Rileva GIF: durata < 10s OPPURE dimensione < 1MB
        const videoDuration = q.seconds || q.msg?.seconds || 0
        const isGif = videoDuration > 0 && videoDuration <= 10
        
        // Salva come .gif se è un GIF
        const fileExt = isGif ? 'gif' : 'mp4'
        const safeLabel = `${isWelcome ? 'welcome' : 'bye'}-${String(m.chat || 'group').replace(/[^a-zA-Z0-9_-]/g, '_')}`
        const filePath = path.join(MEDIA_DIR, `${safeLabel}.${fileExt}`)

        fs.mkdirSync(MEDIA_DIR, { recursive: true })
        fs.writeFileSync(filePath, buffer)

        if (filePath) {
          if (isWelcome) {
            chat.sWelcomeMedia = filePath
            chat.sWelcomeMediaType = normalizedType
            chat.sWelcomeIsGif = isGif
            chat.sWelcomeMimetype = isGif ? 'image/gif' : 'video/mp4'
          } else {
            chat.sByeMedia = filePath
            chat.sByeMediaType = normalizedType
            chat.sByeIsGif = isGif
            chat.sByeMimetype = isGif ? 'image/gif' : 'video/mp4'
          }
          m.reply(`✅ ${isWelcome ? 'Benvenuto' : 'Addio'} e media impostati! ${isGif ? '(GIF)' : ''}`)
        } else {
          m.reply(`⚠️ ${isWelcome ? 'Benvenuto' : 'Addio'} impostato ma media non salvato.`)
        }
      } else {
        m.reply(`⚠️ ${isWelcome ? 'Benvenuto' : 'Addio'} impostato ma download media fallito.`)
      }
    } else {
      m.reply(`✅ ${isWelcome ? 'Benvenuto' : 'Addio'} impostato (solo testo).`)
    }
    return
  }

  m.reply(`
╭━━〔 Set Welcome/Bye 〕━━⬣
┃ ${usedPrefix}setbenvenuto <testo>
┃ ${usedPrefix}setaddio <testo>
┃ ${usedPrefix}setwelcome <text>
┃ ${usedPrefix}setbye <text>
┃ ${usedPrefix}removebenvenuto
┃ ${usedPrefix}removeaddio
┃ ${usedPrefix}removewelcome
┃ ${usedPrefix}removebye
┃
┃ Rispondi a un'immagine/video/gif
┃ per aggiungerla al messaggio.
╰━━━━━━━━━━━━━━━━━━━━⬣
`)
}

handler.help = ['setbenvenuto <testo>', 'setaddio <testo>', 'removebenvenuto', 'removeaddio', 'setwelcome <text>', 'setbye <text>', 'removewelcome', 'removebye']
handler.tags = ['group']
handler.command = /^(setwelcome|setbenvenuto|setbye|setaddio|removewelcome|removebye|removebenvenuto|removeaddio)$/i
handler.admin = true
handler.group = true

export default handler