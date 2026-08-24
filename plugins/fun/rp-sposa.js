import fs from 'fs'
import path from 'path'
import { generateWAMessageFromContent } from '@chatunity/baileys'

const proposals = {}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const users = global.db?.data?.users || {}
    const user = users[m.sender]

    if (!user) return

    const isMarry = /^(sposa|marry|sposar|marier|heiraten|结婚|жениться|تزوج|शादी|menikah|evlen)$/i.test(command)
    const isDivorce = /^(divorzia|divorce|divorciar|divorcer|scheiden|离婚|развестись|طلاق|तलाक|cerai|boşan)$/i.test(command)

    if (isMarry) {
        await handleSposa(m, user, users, text, usedPrefix, conn)
    } else if (isDivorce) {
        handleDivorzia(m, user, users)
    }
}

const handleSposa = async (m, user, users, text, usedPrefix, conn) => {
    const userId = m.sender
    const groupId = m.chat

    let mention = m.mentionedJid?.[0]
        ? m.mentionedJid[0]
        : (m.quoted ? m.quoted.sender : null)

    if (!mention || typeof mention !== 'string' || !mention.endsWith('@s.whatsapp.net')) {
        throw formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            `Usa: *${usedPrefix}sposa @utente*`
        ])
    }

    if (mention === userId) {
        throw formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            'Non puoi sposare te stesso.'
        ])
    }

    const destinatario = users[mention]
    if (!destinatario) {
        throw formatBox(' ❌  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            'Utente non trovato nel database.'
        ])
    }

    if (user.sposato) {
        return m.reply(formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            `Sei già sposato con @${user.coniuge?.split('@')[0] || 'sconosciuto'}.`
        ]), null, { mentions: user.coniuge ? [user.coniuge] : [] })
    }

    if (destinatario.sposato) {
        return m.reply(formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            `@${mention.split('@')[0]} è già sposato.`
        ]), null, { mentions: [mention] })
    }

    if (proposals[userId] || proposals[mention]) {
        throw formatBox(' ⏳  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            'C’è già una proposta in attesa.'
        ])
    }

    proposals[mention] = { from: userId, timeout: null }
    proposals[userId] = { to: mention, timeout: null }

    const proposalText = formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
        `@${userId.split('@')[0]} ha chiesto a @${mention.split('@')[0]} di sposarlo.`,
        'Hai 60 secondi per rispondere.'
    ])

    const videoPath = path.join(process.cwd(), 'media', 'gif', 'marriage.mp4')
    try {
        const videoBuffer = fs.readFileSync(videoPath)
        await conn.sendMessage(groupId, {
            video: videoBuffer,
            gifPlayback: true,
            mimetype: 'video/mp4',
            caption: proposalText,
            mentions: [mention, userId]
        }, { quoted: m })
    } catch {
        await conn.sendMessage(groupId, {
            text: proposalText,
            mentions: [mention, userId]
        }, { quoted: m })
    }

    try {
        const msg = generateWAMessageFromContent(groupId, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: `💍 @${mention.split('@')[0]}, accetti la proposta?` },
                        footer: { text: 'Rispondi con i pulsanti qui sotto.' },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: '💍 Sì',
                                        id: 'marry-yes'
                                    })
                                },
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: '💔 No',
                                        id: 'marry-no'
                                    })
                                }
                            ]
                        }
                    }
                }
            }
        }, { userJid: conn.user.jid })

        await conn.relayMessage(groupId, msg.message, { messageId: msg.key.id })
    } catch (e) {
        console.error('Marry buttons error:', e.message)
    }

    const timeoutCallback = () => {
        if (proposals[mention]) {
            conn.sendMessage(groupId, {
                text: formatBox(' ⌛  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
                    `La proposta tra @${userId.split('@')[0]} e @${mention.split('@')[0]} è scaduta.`
                ]),
                mentions: [userId, mention]
            }).catch(() => {})

            delete proposals[mention]
            delete proposals[userId]
        }
    }

    proposals[mention].timeout = setTimeout(timeoutCallback, 60000)
    proposals[userId].timeout = proposals[mention].timeout
}

handler.before = async (m) => {
    if (!m.text) return

    const userId = m.sender
    const groupId = m.chat
    const current = proposals[userId]
    if (!current) return

    clearTimeout(current.timeout)

    if (/^(no|marry-no)$/i.test(m.text.trim())) {
        const fromUser = proposals[userId].from || userId
        delete proposals[fromUser]
        delete proposals[userId]

        return m.reply(formatBox(' 💔  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            'Proposta rifiutata.'
        ]), null, { mentions: [fromUser] })
    }

    if (/^(si|sì|yes|marry-yes)$/i.test(m.text.trim())) {
        const fromUser = proposals[userId].from
        const toUser = userId

        const senderUser = global.db?.data?.users?.[fromUser]
        const receiverUser = global.db?.data?.users?.[toUser]

        if (!senderUser || !receiverUser) {
            delete proposals[fromUser]
            delete proposals[toUser]
            return m.reply(formatBox(' ❌  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
                'Utente non trovato nel database.'
            ]))
        }

        senderUser.sposato = true
        senderUser.coniuge = toUser
        senderUser.primoMatrimonio = true

        receiverUser.sposato = true
        receiverUser.coniuge = fromUser
        receiverUser.primoMatrimonio = true

        await m.reply(formatBox(' 💍  𝑀𝒶𝓉𝓇𝒾𝓂𝑜𝓃𝒾𝑜', [
            `@${toUser.split('@')[0]} e @${fromUser.split('@')[0]} ora sono sposati.`
        ]), null, { mentions: [toUser, fromUser] })

        delete proposals[fromUser]
        delete proposals[toUser]
    }
}

const handleDivorzia = (m, user, users) => {
    const userId = m.sender

    if (!user.sposato) {
        throw formatBox(' 💔  𝒟𝒾𝓋𝑜𝓇𝓏𝒾𝑜', [
            'Non sei sposato.'
        ])
    }

    const ex = users[user.coniuge]
    if (!ex) {
        throw formatBox(' ❌  𝒟𝒾𝓋𝑜𝓇𝓏𝒾𝑜', [
            'Coniuge non trovato.'
        ])
    }

    if (!Array.isArray(user.ex)) user.ex = []
    if (!user.ex.includes(user.coniuge)) user.ex.push(user.coniuge)

    if (!Array.isArray(ex.ex)) ex.ex = []
    if (!ex.ex.includes(userId)) ex.ex.push(userId)

    const exConiuge = user.coniuge

    user.sposato = false
    user.coniuge = ''
    ex.sposato = false
    ex.coniuge = ''

    m.reply(formatBox(' 💔  𝒟𝒾𝓋𝑜𝓇𝓏𝒾𝑜', [
        `Hai divorziato da @${exConiuge?.split('@')[0] || 'sconosciuto'}.`
    ]), null, { mentions: exConiuge ? [exConiuge] : [] })
}

handler.group = true
handler.command = /^(sposa|divorzia|marry|divorce|sposar|marier|heiraten|结婚|жениться|تزوج|शादी|menikah|evlen|divorciar|divorcer|scheiden|离婚|развестись|طلاق|तलाक|cerai|boşan)$/i

export default handler