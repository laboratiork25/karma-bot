import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getJidUser = jid => typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''

const normalizePhoneJid = value => {
    if (typeof value !== 'string') return null
    if (value.includes('@')) return value
    const digits = value.replace(/\D/g, '')
    return digits ? `${digits}@s.whatsapp.net` : null
}

const getParticipantPhoneJid = (participant, conn) => {
    for (const candidate of [participant?.phoneNumber, participant?.pn, participant?.participantPn, participant?.jid, participant?.id]) {
        if (typeof candidate !== 'string') continue
        const normalized = normalizePhoneJid(candidate.trim()) || conn.decodeJid(candidate)
        if (normalized?.endsWith('@s.whatsapp.net')) return normalized
    }
    return participant?.id ? conn.decodeJid(participant.id) : null
}

const resolveTarget = (jid, participants, conn) => {
    if (!jid) return null

    const decoded = conn.decodeJid(jid)
    const jidUser = getJidUser(jid)

    const match = participants.find(participant => {
        const values = [
            participant?.id,
            participant?.jid,
            participant?.lid,
            participant?.phoneNumber,
            participant?.pn,
            participant?.participantPn
        ]

        return values.some(value => {
            if (typeof value !== 'string') return false
            const normalized = normalizePhoneJid(value.trim()) || conn.decodeJid(value)
            return normalized === decoded || getJidUser(normalized) === jidUser
        })
    })

    return match ? (getParticipantPhoneJid(match, conn) || conn.decodeJid(match.id)) : decoded
}

async function handler(m, { conn, text }) {
    const rawMentions = m.msg?.contextInfo?.mentionedJid || []
    const groupMeta = await conn.groupMetadata(m.chat).catch(() => null)
    const participants = groupMeta?.participants || []

    const explicitNumber = text?.replace(/[^0-9]/g, '')
    const mentionTarget = m.mentionedJid?.[0] || rawMentions.map(jid => resolveTarget(jid, participants, conn)).find(Boolean)
    const quotedTarget = m.quoted?.sender ? resolveTarget(m.quoted.sender, participants, conn) : null
    const numericTarget = explicitNumber ? resolveTarget(`${explicitNumber}@s.whatsapp.net`, participants, conn) : null
    const user = mentionTarget || quotedTarget || numericTarget

    if (!user) {
        return conn.sendMessage(m.chat, {
            text: 'ⓘ 𝑀𝑒𝓃𝓏𝒾𝑜𝓃𝒶 𝑜 𝓇𝒾𝓈𝓅𝑜𝓃𝒹𝒾 𝒶𝓁𝓁𝒶 𝓅𝑒𝓇𝓈𝑜𝓃𝒶 𝒹𝒶 𝓅𝓇𝑜𝓂𝓊𝑜𝓋𝑒𝓇𝑒.'
        }, { quoted: m })
    }

    if (user === conn.user.jid) {
        return conn.sendMessage(m.chat, {
            text: 'ⓘ 𝐼𝓁 𝒷𝑜𝓉 è 𝑔𝒾à 𝒶𝒹𝓂𝒾𝓃.'
        }, { quoted: m })
    }

    const participant = participants.find(entry => {
        const decodedId = conn.decodeJid(entry.id)
        const phoneJid = getParticipantPhoneJid(entry, conn)
        return decodedId === user || phoneJid === user
    })

    if (!participant) {
        return conn.sendMessage(m.chat, {
            text: 'ⓘ 𝒩𝑜𝓃 𝓇𝒾𝑒𝓈𝒸𝑜 𝒶 𝓉𝓇𝑜𝓋𝒶𝓇𝑒 𝓆𝓊𝑒𝓈𝓉𝑜 𝓊𝓉𝑒𝓃𝓉𝑒 𝓃𝑒𝓁 𝑔𝓇𝓊𝓅𝓅𝑜.'
        }, { quoted: m })
    }

    if (participant.admin === 'admin' || participant.admin === 'superadmin') {
        return conn.sendMessage(m.chat, {
            text: 'ⓘ 𝒬𝓊𝑒𝓈𝓉𝑜 𝓊𝓉𝑒𝓃𝓉𝑒 è 𝑔𝒾à 𝒶𝒹𝓂𝒾𝓃.'
        }, { quoted: m })
    }

    global.promoteDemoteCache = global.promoteDemoteCache || new Map()
    const cacheKey = `promote_${m.chat}_${user}`

    if (global.promoteDemoteCache.has(cacheKey)) {
        return conn.sendMessage(m.chat, {
            text: 'ⓘ 𝒫𝓇𝑜𝓂𝑜𝓏𝒾𝑜𝓃𝑒 𝑔𝒾à 𝒾𝓃 𝒸𝑜𝓇𝓈𝑜...'
        }, { quoted: m })
    }

    global.promoteDemoteCache.set(cacheKey, true)
    setTimeout(() => global.promoteDemoteCache.delete(cacheKey), 3000)

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

        const senderPhone = getJidUser(m.sender)
        const userPhone = getJidUser(user)
        const text2 = `╭═━ 〖 👑 𝒫𝓇𝑜𝓂𝑜𝓏𝒾𝑜𝓃𝑒 〗═━⪩
│❍ @${userPhone} è 𝓈𝓉𝒶𝓉𝑜 𝓅𝓇𝑜𝓂𝑜𝓈𝓈𝑜 𝒶𝒹 𝒶𝓂𝓂𝒾𝓃𝒾𝓈𝓉𝓇𝒶𝓉𝑜𝓇𝑒
│❍ 𝒟𝒶 @${senderPhone}
╰━━━━━━━━━⪩`
        const fallbackPath = path.join(__dirname, '../../media/fallback.png')
        const mentions = [user, m.sender]

        if (fs.existsSync(fallbackPath)) {
            return conn.sendMessage(m.chat, {
                text: text2,
                mentions,
                contextInfo: {
                    externalAdReply: {
                        title: '𝒫𝓇𝑜𝓂𝑜𝓏𝒾𝑜𝓃𝑒',
                        body: '',
                        previewType: 'PHOTO',
                        thumbnail: fs.readFileSync(fallbackPath),
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m })
        }

        return conn.sendMessage(m.chat, {
            text: text2,
            mentions
        }, { quoted: m })
    } catch (error) {
        console.error('𝐸𝓇𝓇𝑜𝓇𝑒 promozione admin:', error)
        return conn.sendMessage(m.chat, {
            text: '❌ *𝒩𝑜𝓃 𝓈𝑜𝓃𝑜 𝓇𝒾𝓊𝓈𝒸𝒾𝓉𝑜 𝒶 𝓅𝓇𝑜𝓂𝓊𝑜𝓋𝑒𝓇𝑒 𝓆𝓊𝑒𝓈𝓉𝑜 𝓊𝓉𝑒𝓃𝓉𝑒.*'
        }, { quoted: m })
    } finally {
        global.promoteDemoteCache.delete(cacheKey)
    }
}

handler.help = ['promuovi @user']
handler.tags = ['group']
handler.command = /^(p|promuovi|mettiadmin|giveadmin|promote|makeadmin|setadmin)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true
handler.fail = null

export default handler