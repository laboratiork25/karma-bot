function getJidUser(jid) {
    return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function normalizePhoneJid(value) {
    if (typeof value !== 'string') return null
    if (value.includes('@')) return value
    const digits = value.replace(/\D/g, '')
    return digits ? `${digits}@s.whatsapp.net` : null
}

function resolveTarget(m, conn, participants, text = '') {
    const rawMentions = m.msg?.contextInfo?.mentionedJid || []

    const getParticipantPhoneJid = participant => {
        for (const candidate of [participant?.phoneNumber, participant?.pn, participant?.participantPn, participant?.jid, participant?.id]) {
            const normalized = typeof candidate === 'string'
                ? (candidate.includes('@') ? candidate : `${candidate.replace(/\D/g, '')}@s.whatsapp.net`)
                : null
            if (!normalized?.endsWith('@s.whatsapp.net')) continue
            return normalized
        }
        return participant?.id ? conn.decodeJid(participant.id) : null
    }

    const resolveLid = jid => {
        if (!jid) return jid
        const jidUser = getJidUser(jid)
        const match = participants.find(p =>
            conn.decodeJid(p.id) === jid ||
            p.lid === jid ||
            conn.decodeJid(p.lid || '') === jid ||
            getJidUser(p.id) === jidUser ||
            getJidUser(p.lid) === jidUser
        )
        if (match) return getParticipantPhoneJid(match) || conn.decodeJid(match.id)
        return conn.decodeJid(jid)
    }

    const resolvedMentions = rawMentions.map(resolveLid)
    const mention = m.mentionedJid?.[0] || resolvedMentions[0] || (m.quoted ? m.quoted.sender : null)
    if (mention) return mention

    const explicitNumber = text?.replace(/[^0-9]/g, '')
    if (explicitNumber) return normalizePhoneJid(explicitNumber)
    return null
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, command, text }) => {
    const chat = global.db.data.chats[m.chat]
    if (!chat) return

    if (!chat.moderators) chat.moderators = []

    const isAddMod = /^(addmod|aggiungimod|aggiungimoderatore)$/i.test(command)
    const isRemoveMod = /^(removemod|rimuovimod|rimuovimoderatore)$/i.test(command)
    const isListMod = /^(listmod|listamod|listamods|listamoderatori|moderatori|moderators|modlist)$/i.test(command)

    // LISTA MOD
    if (isListMod) {
        if (!chat.moderators.length) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' 🛡️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    'Non ci sono moderatori in questo gruppo.'
                ])
            }, { quoted: m })
        }

        let listText = `╭═━ 〖  🛡️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾 〗═━⪩\n`
        for (let i = 0; i < chat.moderators.length; i++) {
            listText += `│❍ ${i + 1}. @${getJidUser(chat.moderators[i])}\n`
        }
        listText += '╰━━━━━━━━━⪩'

        return conn.sendMessage(m.chat, {
            text: listText,
            mentions: chat.moderators
        }, { quoted: m })
    }

    const groupMeta = await conn.groupMetadata(m.chat).catch(() => null)
    const groupParticipants = groupMeta?.participants || []
    const target = resolveTarget(m, conn, groupParticipants, text)

    // Aggiunta MOD
    if (isAddMod) {
        if (!target) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ⚠️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    'Menziona o rispondi alla persona da aggiungere.'
                ])
            }, { quoted: m })
        }

        if (target === conn.user.jid) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ⚠️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    'Il bot non può essere moderatore.'
                ])
            }, { quoted: m })
        }

        if (chat.moderators.includes(target)) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ℹ️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    `@${getJidUser(target)} è già moderatore.`
                ]),
                mentions: [target]
            }, { quoted: m })
        }

        chat.moderators.push(target)

        return conn.sendMessage(m.chat, {
            text: formatBox(' 🛡️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                `@${getJidUser(target)} è stato aggiunto come *moderatore*.`,
                'Ora può usare i comandi essenziali del gruppo.'
            ]),
            mentions: [target]
        }, { quoted: m })
    }

    // RIMOZIONE MOD — ORA FUNZIONA ANCHE CON IL NUMERO
    if (isRemoveMod) {

        // RIMOZIONE TRAMITE NUMERO
        if (text && /^\d+$/.test(text.trim())) {
            const index = parseInt(text.trim()) - 1

            if (index < 0 || index >= chat.moderators.length) {
                return conn.sendMessage(m.chat, {
                    text: formatBox(' ⚠️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                        'Numero non valido. Usa *.listmod* per vedere la lista numerata.'
                    ])
                }, { quoted: m })
            }

            const removed = chat.moderators.splice(index, 1)[0]

            return conn.sendMessage(m.chat, {
                text: formatBox(' 🛡️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    `@${getJidUser(removed)} è stato rimosso dal ruolo di *moderatore*.`
                ]),
                mentions: [removed]
            }, { quoted: m })
        }

        // RIMOZIONE CLASSICA (TAG)
        if (!target) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ⚠️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    'Menziona o usa *.rimuovimod <numero>*'
                ])
            }, { quoted: m })
        }

        const index = chat.moderators.indexOf(target)
        if (index === -1) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ℹ️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                    `@${getJidUser(target)} non è moderatore.`
                ]),
                mentions: [target]
            }, { quoted: m })
        }

        chat.moderators.splice(index, 1)

        return conn.sendMessage(m.chat, {
            text: formatBox(' 🛡️  𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝑜𝓇𝒾', [
                `@${getJidUser(target)} è stato rimosso dal ruolo di *moderatore*.`
            ]),
            mentions: [target]
        }, { quoted: m })
    }
}

handler.help = [
    'addmod @user',
    'removemod @user',
    'rimuovimod <numero>',
    'listmod',
    'moderatori'
]
handler.tags = ['group']
handler.command = /^(addmod|aggiungimod|aggiungimoderatore|removemod|rimuovimod|rimuovimoderatore|listmod|listamod|listamods|listamoderatori|moderatori|moderators|modlist)$/i
handler.group = true
handler.admin = true

export default handler

