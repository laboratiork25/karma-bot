import fetch from 'node-fetch'

const languages = {
  it: 'Italiano 『🇮🇹』',
  en: 'Inglese 『🇬🇧』',
  es: 'Spagnolo 『🇪🇸』',
  fr: 'Francese 『🇫🇷』',
  de: 'Tedesco 『🇩🇪』',
  pt: 'Portoghese 『🇵🇹』',
  ru: 'Russo 『🇷🇺』',
  ja: 'Giapponese 『🇯🇵』',
  ko: 'Coreano 『🇰🇷』',
  zh: 'Cinese 『🇨🇳』',
  ar: 'Arabo 『🇸🇦』',
  hi: 'Hindi 『🇮🇳』',
  nl: 'Olandese 『🇳🇱』',
  pl: 'Polacco 『🇵🇱』',
  sv: 'Svedese 『🇸🇪』',
  tr: 'Turco 『🇹🇷』',
  uk: 'Ucraino 『🇺🇦』',
  th: 'Thailandese 『🇹🇭』',
  vi: 'Vietnamita 『🇻🇳』',
  cs: 'Ceco 『🇨🇿』',
  da: 'Danese 『🇩🇰』',
  fi: 'Finlandese 『🇫🇮』',
  no: 'Norvegese 『🇳🇴』',
  he: 'Ebraico 『🇮🇱』',
  el: 'Greco 『🇬🇷』',
  hu: 'Ungherese 『🇭🇺』',
  id: 'Indonesiano 『🇮🇩』',
  ms: 'Malese 『🇲🇾』'
}

const max = 5000
const maxtts = 200

const splitText = (text, maxLength) => {
  if (text.length <= maxLength) return [text]
  const chunks = []
  let current = ''
  const sentences = text.split(/(?<=[.!?])\s+/)

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length <= maxLength) {
      current = (current + ' ' + sentence).trim()
    } else {
      if (current) chunks.push(current)
      current = sentence.trim()
    }
  }

  if (current) chunks.push(current)
  return chunks
}

const getQuotedText = (msg) => {
  if (!msg) return ''
  return (
    msg.text ||
    msg.caption ||
    msg.contentText ||
    msg.selectedDisplayText ||
    msg.conversation ||
    msg?.msg?.text ||
    msg?.msg?.caption ||
    msg?.msg?.conversation ||
    msg?.message?.conversation ||
    msg?.message?.extendedTextMessage?.text ||
    ''
  ).trim()
}

const generateTTS = async (text, lang, conn, m, userId, groupId) => {
  try {
    const cleanText = text.replace(/[^\p{L}\p{N}\s.,!?'"()\-[\]:;]/gu, '').trim()
    if (!cleanText) throw new Error('Testo vuoto dopo la pulizia')

    const audioText = cleanText.length > maxtts ? cleanText.slice(0, maxtts) : cleanText

    const response = await fetch(
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(audioText)}&tl=${lang}&total=1&idx=0&textlen=${audioText.length}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://translate.google.com/',
          'Accept': 'audio/mpeg, */*'
        },
        timeout: 10000
      }
    )

    if (!response.ok) throw new Error(`TTS HTTP ${response.status}`)

    const audioBuffer = await response.arrayBuffer()
    if (!audioBuffer || audioBuffer.byteLength <= 100) {
      throw new Error('Audio TTS non valido')
    }

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

    return true
  } catch (error) {
    await m.reply(global.t('translateTTSError', userId, groupId, { error: error.message }))
    return false
  }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const userId = m.sender
  const groupId = m.chat

  const languagesList = Object.entries(languages)
    .map(([code, name]) => `│ ${code}: ${name}`)
    .join('\n')

  if (command === 'ascolta_originale' || command === 'ascolta_traduzione') {
    const lang = (args[0] || '').toLowerCase()
    const text = args.slice(1).join(' ') || getQuotedText(m.quoted)

    if (!text) return m.reply(global.t('translateNoText', userId, groupId))
    if (!lang) return m.reply(global.t('translateNoLang', userId, groupId))

    await m.react('🔊')
    const success = await generateTTS(text, lang, conn, m, userId, groupId)
    await m.react(success ? '✅' : '❌')
    return
  }

  if ((!args || !args.length) && !getQuotedText(m.quoted)) {
    return m.reply(
      `🌐 *Traduttore*\n\n` +
      `Lingue disponibili:\n${languagesList}\n\n` +
      `Uso normale:\n${usedPrefix}${command} hello\n` +
      `Uso con lingua:\n${usedPrefix}${command} en ciao mondo\n` +
      `Uso in risposta:\nrispondi a un messaggio con ${usedPrefix}${command}\n\n` +
      `Default language: Italian (it)\n` +
      `To change the target language, use this format:\n${usedPrefix}${command} en hello world`
    )
  }

  let sourceLang = 'auto'
  let targetLang = 'it'
  let text = Array.isArray(args) ? args.join(' ') : ''
  const audioOnly = /^(parla|say)$/i.test(command)

  if (Array.isArray(args) && args[0]) {
    const possible = String(args[0]).toLowerCase()

    if (possible === 'auto') {
      text = args.slice(1).join(' ')
    } else if (languages[possible]) {
      targetLang = possible
      text = args.slice(1).join(' ')
    }
  }

  if (!text && m.quoted) text = getQuotedText(m.quoted)
  if (!text) return m.reply(global.t('translateWhatToTranslate', userId, groupId))
  if (text.length > max) {
    return m.reply(global.t('translateTooLong', userId, groupId, { max, length: text.length }))
  }

  await m.react('⌛')

  try {
    const textChunks = splitText(text, 1000)
    let fullTranslation = ''
    let detectedLang = sourceLang

    for (const chunk of textChunks) {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000
      })

      if (!res.ok) throw new Error(`Translate HTTP ${res.status}`)

      const json = await res.json()

      const translatedChunk = Array.isArray(json?.[0])
        ? json[0].map(part => part?.[0] || '').join('')
        : ''

      if (!translatedChunk) {
        throw new Error('Traduzione vuota o formato risposta non valido')
      }

      fullTranslation += translatedChunk

      if (sourceLang === 'auto' && typeof json?.[2] === 'string' && json[2]) {
        detectedLang = json[2]
      }
    }

    await m.react('✅')

    if (audioOnly) {
      await generateTTS(fullTranslation, targetLang, conn, m, userId, groupId)
      return
    }

    const shortOriginal = text.substring(0, 60).replace(/\n/g, ' ')
    const shortTranslation = fullTranslation.substring(0, 60).replace(/\n/g, ' ')

    const buttons = [
      {
        buttonId: `.ascolta_originale ${detectedLang} ${shortOriginal}`,
        buttonText: { displayText: global.t('translateListenOriginal', userId, groupId) },
        type: 1
      },
      {
        buttonId: `.ascolta_traduzione ${targetLang} ${shortTranslation}`,
        buttonText: { displayText: global.t('translateListenTranslation', userId, groupId) },
        type: 1
      }
    ]

    const message =
      `🌐 *Traduzione completata*\n\n` +
      `🔤 *Lingua rilevata:* ${languages[detectedLang] || detectedLang}\n` +
      `📥 *Lingua di destinazione:* ${languages[targetLang] || targetLang}\n\n` +
      `📝 *Testo originale:*\n${text}\n\n` +
      `✅ *Testo tradotto:*\n${fullTranslation}\n\n` +
      `ℹ️ Default language: Italian (it)\n` +
      `To change the target language, use this format:\n${usedPrefix}${command} en hello world`

    await conn.sendMessage(m.chat, {
      text: message,
      footer: global.t('translateFooter', userId, groupId),
      buttons,
      headerType: 1
    }, { quoted: m })
  } catch (err) {
    await m.react('❌')
    await m.reply(`❌ Errore nella traduzione: ${err.message}`)
  }
}

handler.help = [
  'traduci [lingua] [testo]',
  'traduci [lingua] (in risposta a un messaggio)',
  'parla [lingua] [testo]'
]
handler.tags = ['utility']
handler.command = /^(traduct|traduci|tr|traduzione|parla|ascolta_originale|ascolta_traduzione)$/i

export default handler