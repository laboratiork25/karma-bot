const adozioni = {}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, command, usedPrefix }) => {
    const userId = m.sender
    const groupId = m.chat
    const users = global.db?.data?.users || {}
    const user = users[userId]

    if (!user) throw '╭═━ 〖  ❌  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝒾 〗═━⪩\n│❍ 𝒰𝓉𝑒𝓃𝓉𝑒 𝓃𝑜𝓃 𝓇𝑒𝑔𝒾𝓈𝓉𝓇𝒶𝓉𝑜.\n╰━━━━━━━━━⪩'

    if (!user.figli) user.figli = []
    if (!user.genitore) user.genitore = null
    if (!user.orfanotrofio) user.orfanotrofio = false

    switch (command) {
        case 'adotta':
        case 'adopt':
            await handleAdotta(m, user, users, usedPrefix, conn, userId, groupId)
            break
        case 'abbandona':
        case 'abandon':
            await handleAbbandona(m, user, users, conn, userId, groupId)
            break
        case 'orfanotrofio':
        case 'orphanage':
            await handleOrfanotrofio(m, users, conn, userId, groupId)
            break
        case 'famiglia':
        case 'family':
            await handleFamiglia(m, user, users, conn, userId, groupId)
            break
        case 'diseredita':
        case 'disown':
            await handleDiseredita(m, user, users, conn, userId, groupId)
            break
        case 'scappa':
        case 'runaway':
            await handleScappa(m, user, users, conn, userId, groupId)
            break
    }
}

async function handleAdotta(m, user, users, usedPrefix, conn, userId, groupId) {
    const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)

    if (!mention) {
        throw formatBox(' 👶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'Devi menzionare qualcuno.',
            `Usa: *${usedPrefix}adotta @utente*`
        ])
    }

    if (mention === userId) {
        throw formatBox(' 👶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'Non puoi adottare te stesso.'
        ])
    }

    const target = users[mention]
    if (!target) {
        throw formatBox(' ❌  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'Quell’utente non è registrato.'
        ])
    }

    if (!target.figli) target.figli = []
    if (!target.genitore) target.genitore = null

    if (target.genitore) {
        const genitoreNome = target.genitore.split('@')[0]
        throw formatBox(' 👶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            `@${mention.split('@')[0]} ha già un genitore.`,
            `Genitore attuale: *${genitoreNome}*`
        ])
    }

    if (user.figli.includes(mention)) {
        throw formatBox(' 👶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            `@${mention.split('@')[0]} è già tuo figlio o tua figlia.`
        ])
    }

    if (user.figli.length >= 5) {
        throw formatBox(' 🏠  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'Hai già 5 figli.',
            'Non puoi adottarne altri.'
        ])
    }

    if (user.genitore === mention) {
        throw formatBox(' 🤯  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'Non puoi adottare il tuo genitore.'
        ])
    }

    if (adozioni[mention]) {
        throw formatBox(' ⏳  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            'C’è già una richiesta pendente per questo utente.'
        ])
    }

    const costo = 500
    if ((user.limit || 0) < costo) {
        throw formatBox(' 💶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            `Servono almeno *${costo} UC* per adottare qualcuno.`
        ])
    }

    adozioni[mention] = { from: userId, timeout: null }

    const frasi = [
        `@${userId.split('@')[0]} vuole adottare @${mention.split('@')[0]}.`,
        `@${userId.split('@')[0]} ha aperto le porte di casa a @${mention.split('@')[0]}.`,
        `@${userId.split('@')[0]} vuole prendere sotto la sua ala @${mention.split('@')[0]}.`
    ]

    await conn.sendMessage(groupId, {
        text: formatBox(' 👶  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            pickRandom(frasi),
            'Rispondi con *sì* o *no* entro 60 secondi.'
        ]),
        mentions: [mention, userId]
    }, { quoted: m })

    adozioni[mention].timeout = setTimeout(() => {
        if (adozioni[mention]) {
            conn.sendMessage(groupId, {
                text: formatBox(' ⏰  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
                    `La richiesta di @${userId.split('@')[0]} per @${mention.split('@')[0]} è scaduta.`
                ]),
                mentions: [userId, mention]
            }).catch(() => {})
            delete adozioni[mention]
        }
    }, 60000)
}

handler.before = async function (m, { conn }) {
    const userId = m.sender
    const users = global.db?.data?.users || {}

    if (!adozioni[userId]) return

    const risposta = m.text?.toLowerCase().trim()
    if (risposta !== 'sì' && risposta !== 'si' && risposta !== 'no') return

    const { from } = adozioni[userId]
    const genitore = users[from]
    const figlio = users[userId]

    clearTimeout(adozioni[userId].timeout)
    delete adozioni[userId]

    if (risposta === 'no') {
        return conn.sendMessage(m.chat, {
            text: formatBox(' 💔  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
                `@${userId.split('@')[0]} ha rifiutato l’adozione di @${from.split('@')[0]}.`
            ]),
            mentions: [userId, from]
        })
    }

    const costo = 500
    if ((genitore.limit || 0) < costo) {
        return conn.sendMessage(m.chat, {
            text: formatBox(' ❌  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
                `@${from.split('@')[0]} non ha più abbastanza UC per l’adozione.`
            ]),
            mentions: [from]
        })
    }

    genitore.limit -= costo
    if (!genitore.figli) genitore.figli = []
    genitore.figli.push(userId)
    figlio.genitore = from
    figlio.orfanotrofio = false

    const frasi = [
        `@${from.split('@')[0]} ha adottato @${userId.split('@')[0]}.`,
        `@${userId.split('@')[0]} è stato adottato da @${from.split('@')[0]}.`,
        `Adozione completata con successo.`
    ]

    await conn.sendMessage(m.chat, {
        text: formatBox(' 🎉  𝒜𝒹𝑜𝓏𝒾𝑜𝓃𝑒', [
            pickRandom(frasi),
            `Costo adozione: *${costo} UC*`
        ]),
        mentions: [from, userId]
    })

    await conn.sendMessage(m.chat, { react: { text: '👨‍👧', key: m.key } })
}

async function handleAbbandona(m, user, users, conn, userId, groupId) {
    const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
    if (!mention) throw formatBox(' 😢  𝒜𝒷𝒷𝒶𝓃𝒹𝑜𝓃𝒶', ['Devi menzionare il figlio da abbandonare.'])

    if (!user.figli || !user.figli.includes(mention)) {
        throw formatBox(' 😢  𝒜𝒷𝒷𝒶𝓃𝒹𝑜𝓃𝒶', [`@${mention.split('@')[0]} non è tuo figlio o tua figlia.`])
    }

    const figlio = users[mention]
    user.figli = user.figli.filter(f => f !== mention)

    if (figlio) {
        figlio.genitore = null
        figlio.orfanotrofio = true
    }

    const frasi = [
        `@${userId.split('@')[0]} ha abbandonato @${mention.split('@')[0]}.`,
        `@${mention.split('@')[0]} è stato mandato all’orfanotrofio.`,
        `Povero piccolo cuore spezzato.`
    ]

    await conn.sendMessage(groupId, {
        text: formatBox(' 😢  𝒜𝒷𝒷𝒶𝓃𝒹𝑜𝓃𝒶', frasi),
        mentions: [userId, mention]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '😢', key: m.key } })
}

async function handleOrfanotrofio(m, users, conn, userId, groupId) {
    const orfani = []

    for (const [jid, u] of Object.entries(users)) {
        if (u.orfanotrofio === true && !u.genitore) {
            orfani.push(jid)
        }
    }

    if (!orfani.length) {
        return conn.sendMessage(groupId, {
            text: formatBox(' 🏠  𝒪𝓇𝒻𝒶𝓃𝑜𝓉𝓇𝑜𝒻𝒾𝑜', [
                'L’orfanotrofio è vuoto.',
                'Nessun bambino in attesa di adozione.'
            ])
        }, { quoted: m })
    }

    let lista = `╭═━ 〖  🏚️  𝒪𝓇𝒻𝒶𝓃𝑜𝓉𝓇𝑜𝒻𝒾𝑜 〗═━⪩\n│❍ 𝐵𝒶𝓂𝒷𝒾𝓃𝒾 𝒾𝓃 𝒶𝓉𝓉𝑒𝓈𝒶:\n`
    orfani.slice(0, 20).forEach((jid, i) => {
        lista += `│❍ ${i + 1}. @${jid.split('@')[0]}\n`
    })

    if (orfani.length > 20) {
        lista += `│❍ ... e altri ${orfani.length - 20}\n`
    }

    lista += `│❍ 𝒯𝑜𝓉𝒶𝓁𝑒 𝑜𝓇𝒻𝒶𝓃𝒾: ${orfani.length}\n╰━━━━━━━━━⪩`

    await conn.sendMessage(groupId, {
        text: lista,
        mentions: orfani.slice(0, 20)
    }, { quoted: m })
}

async function handleFamiglia(m, user, users, conn, userId, groupId) {
    const mention = m.mentionedJid?.[0] || userId
    const target = users[mention]
    if (!target) throw formatBox(' ❌  𝐹𝒶𝓂𝒾𝑔𝓁𝒾𝒶', ['Utente non trovato.'])

    if (!target.figli) target.figli = []

    let testo = `╭═━ 〖  👨‍👧‍👦  𝐹𝒶𝓂𝒾𝑔𝓁𝒾𝒶 〗═━⪩\n`
    testo += `│❍ 𝒰𝓉𝑒𝓃𝓉𝑒: @${mention.split('@')[0]}\n`
    testo += `│❍ 𝒢𝑒𝓃𝒾𝓉𝑜𝓇𝑒: ${target.genitore ? `@${target.genitore.split('@')[0]}` : 'Nessuno'}\n`

    if (target.sposato && target.coniuge) {
        testo += `│❍ 𝒞𝑜𝓃𝒾𝓊𝑔𝑒: @${target.coniuge.split('@')[0]}\n`
    }

    testo += `│❍ 𝐹𝒾𝑔𝓁𝒾 (${target.figli.length}/5): ${target.figli.length ? '' : 'Nessuno'}\n`
    if (target.figli.length) {
        target.figli.forEach((f, i) => {
            testo += `│❍ ${i + 1}. @${f.split('@')[0]}\n`
        })
    }

    if (target.genitore && users[target.genitore]?.figli) {
        const fratelli = users[target.genitore].figli.filter(f => f !== mention)
        if (fratelli.length) {
            testo += `│❍ 𝐹𝓇𝒶𝓉𝑒𝓁𝓁𝒾/𝒮𝑜𝓇𝑒𝓁𝓁𝑒:\n`
            fratelli.forEach(f => {
                testo += `│❍ • @${f.split('@')[0]}\n`
            })
        }
    }

    testo += `│❍ 𝒮𝓉𝒶𝓉𝑜: ${target.orfanotrofio ? '🏚️ In orfanotrofio' : '🏠 In famiglia'}\n`
    testo += '╰━━━━━━━━━⪩'

    const mentions = [mention]
    if (target.genitore) mentions.push(target.genitore)
    if (target.coniuge) mentions.push(target.coniuge)
    if (target.figli.length) mentions.push(...target.figli)
    if (target.genitore && users[target.genitore]?.figli) {
        mentions.push(...users[target.genitore].figli.filter(f => f !== mention))
    }

    await conn.sendMessage(groupId, {
        text: testo,
        mentions: [...new Set(mentions)]
    }, { quoted: m })
}

async function handleDiseredita(m, user, users, conn, userId, groupId) {
    const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
    if (!mention) throw formatBox(' ⚡  𝒟𝒾𝓈𝑒𝓇𝑒𝒹𝒾𝓉𝒶', ['Devi menzionare il figlio da diseredare.'])

    if (!user.figli || !user.figli.includes(mention)) {
        throw formatBox(' ⚡  𝒟𝒾𝓈𝑒𝓇𝑒𝒹𝒾𝓉𝒶', [`@${mention.split('@')[0]} non è tuo figlio o tua figlia.`])
    }

    const figlio = users[mention]
    user.figli = user.figli.filter(f => f !== mention)

    if (figlio) {
        figlio.genitore = null
        figlio.orfanotrofio = true
        const perso = Math.min(figlio.limit || 0, 200)
        figlio.limit = (figlio.limit || 0) - perso
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' ⚡  𝒟𝒾𝓈𝑒𝓇𝑒𝒹𝒾𝓉𝒶', [
            `@${userId.split('@')[0]} ha diseredato @${mention.split('@')[0]}.`,
            'Mandato all’orfanotrofio.',
            'Ha perso 200 UC per il trauma emotivo.'
        ]),
        mentions: [userId, mention]
    }, { quoted: m })
}

async function handleScappa(m, user, users, conn, userId, groupId) {
    if (!user.genitore) {
        throw formatBox(' 🏃  𝒮𝒸𝒶𝓅𝓅𝒶', [
            'Non hai un genitore da cui scappare.'
        ])
    }

    const genitoreJid = user.genitore
    const genitore = users[genitoreJid]

    if (genitore?.figli) {
        genitore.figli = genitore.figli.filter(f => f !== userId)
    }

    user.genitore = null
    user.orfanotrofio = true

    const frasi = [
        `@${userId.split('@')[0]} è scappato da @${genitoreJid.split('@')[0]}.`,
        `Ha fatto le valigie di notte e se n’è andato.`,
        'Ora vive all’orfanotrofio.'
    ]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🏃  𝒮𝒸𝒶𝓅𝓅𝒶', frasi),
        mentions: [userId, genitoreJid]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🏃', key: m.key } })
}

handler.help = [
    'adotta @utente',
    'abbandona @utente',
    'orfanotrofio',
    'famiglia',
    'diseredita @utente',
    'scappa'
]
handler.tags = ['fun', 'rpg']
handler.command = /^(adotta|adopt|abbandona|abandon|orfanotrofio|orphanage|famiglia|family|diseredita|disown|scappa|runaway)$/i
handler.register = true
handler.group = true

export default handler