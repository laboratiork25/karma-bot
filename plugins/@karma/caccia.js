function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

let cooldowns = {}
let fucileLevel = {}
let pendingTrades = {}

const prede = [
    { nome: '🐇 Coniglio', rarità: 'comune', valore: 10, peso: '2kg' },
    { nome: '🦆 Anatra', rarità: 'comune', valore: 15, peso: '3kg' },
    { nome: '🐿️ Scoiattolo', rarità: 'comune', valore: 12, peso: '1kg' },
    { nome: '🦃 Tacchino', rarità: 'comune', valore: 20, peso: '5kg' },
    { nome: '🕊️ Colomba', rarità: 'comune', valore: 9, peso: '0.8kg' },
    { nome: '🐦 Fagiano', rarità: 'comune', valore: 18, peso: '4kg' },
    { nome: '🦔 Riccio', rarità: 'comune', valore: 14, peso: '1.5kg' },

    { nome: '🦊 Volpe', rarità: 'non comune', valore: 45, peso: '8kg' },
    { nome: '🦌 Cervo', rarità: 'non comune', valore: 60, peso: '70kg' },
    { nome: '🐗 Cinghiale', rarità: 'non comune', valore: 55, peso: '90kg' },
    { nome: '🦝 Procione', rarità: 'non comune', valore: 40, peso: '6kg' },
    { nome: '🐺 Lupo Solitario', rarità: 'non comune', valore: 70, peso: '45kg' },
    { nome: '🦉 Gufo Reale', rarità: 'non comune', valore: 50, peso: '3kg' },
    { nome: '🐐 Capra Montana', rarità: 'non comune', valore: 58, peso: '40kg' },

    { nome: '🐻 Orso Bruno', rarità: 'raro', valore: 150, peso: '250kg' },
    { nome: '🦅 Aquila Reale', rarità: 'raro', valore: 130, peso: '6kg' },
    { nome: '🦌 Cervo Albino', rarità: 'raro', valore: 180, peso: '80kg' },
    { nome: '🐆 Lince', rarità: 'raro', valore: 160, peso: '25kg' },
    { nome: '🙈 scimmia col culo rosso', rarità: 'raro', valore: 200, peso: '300kg' },
    { nome: '🦬 Bisonte', rarità: 'raro', valore: 170, peso: '500kg' },

    { nome: '🦁 Leone delle Montagne', rarità: 'epico', valore: 350, peso: '120kg' },
    { nome: '🐉 Draco Selvatico', rarità: 'epico', valore: 450, peso: '???' },
    { nome: '🦄 Unicorno del Bosco', rarità: 'epico', valore: 500, peso: '???' },
    { nome: '🦇 Pipistrello Alfa', rarità: 'epico', valore: 320, peso: '4kg' },
    { nome: '🐍 Serpente Titanico', rarità: 'epico', valore: 400, peso: '150kg' },

    { nome: ' Alligatore', rarità: 'leggendario', valore: 1000, peso: '???' },
    { nome: '🪽 Fenice', rarità: 'leggendario', valore: 1400, peso: '???' },
    { nome: '🐷 Il dio porco', rarità: 'leggendario', valore: 1600, peso: '???' },
    { nome: '🐶 Il dio cane', rarità: 'leggendario', valore: 1200, peso: '???' },

    { nome: '🥾 Stivale nel Fango', rarità: 'spazzatura', valore: 1, peso: '0.5kg' },
    { nome: '🪤 Trappola Rotta', rarità: 'spazzatura', valore: 2, peso: '1kg' },
    { nome: '🦴 Osso Vecchio', rarità: 'spazzatura', valore: 3, peso: '0.4kg' },
    { nome: '🍂 Foglie Marce', rarità: 'spazzatura', valore: 1, peso: '0.1kg' },
    { nome: '🥫 Scatoletta Schiacciata', rarità: 'spazzatura', valore: 2, peso: '0.2kg' }
]

const raritàProb = {
    spazzatura: 15,
    comune: 35,
    'non comune': 24,
    raro: 12,
    epico: 7,
    leggendario: 7
}

const raritàEmoji = {
    spazzatura: '🗑️',
    comune: '⬜',
    'non comune': '🟩',
    raro: '🟦',
    epico: '🟪',
    leggendario: '🟨'
}

const ordineRarità = ['leggendario', 'epico', 'raro', 'non comune', 'comune', 'spazzatura']

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

function usedPrefixSafe() {
    return global.prefix ? String(global.prefix).charAt(0) : '.'
}

function barraProb(percent) {
    const totaleBarre = 20
    const piene = Math.round((percent / 100) * totaleBarre)
    return '▓'.repeat(piene) + '░'.repeat(totaleBarre - piene)
}

function cacciaPreda(userId) {
    const bonusRaro = (fucileLevel[userId] || 0) * 2
    const probAggiustata = { ...raritàProb }

    if (bonusRaro > 0) {
        probAggiustata.raro += bonusRaro
        probAggiustata.epico += Math.floor(bonusRaro / 2)
        probAggiustata.leggendario += Math.floor(bonusRaro / 4)
        probAggiustata.comune -= bonusRaro
    }

    const roll = Math.random() * 100
    let cumulativo = 0
    let raritàScelta = 'comune'

    for (const [rarità, prob] of Object.entries(probAggiustata)) {
        cumulativo += prob
        if (roll < cumulativo) {
            raritàScelta = rarità
            break
        }
    }

    const disponibili = prede.filter(p => p.rarità === raritàScelta)
    return pickRandom(disponibili)
}

let handler = async (m, { conn, command, args }) => {
    const userId = m.sender
    const groupId = m.chat
    const users = global.db.data.users
    const user = users[m.sender]

    if (!user) throw formatBox(' ❌  𝒞𝒶𝒸𝒸𝒾𝒶', ['Non sei registrato.'])

    switch (command) {
        case 'caccia':
        case 'hunt':
            await handleCaccia(m, user, conn, userId, groupId)
            break
        case 'inventariocaccia':
        case 'huntinv':
            await handleInventarioCaccia(m, user, conn, userId, groupId)
            break
        case 'vendicaccia':
        case 'sellhunt':
            await handleVendiCaccia(m, user, conn, userId, groupId)
            break
        case 'collezionecaccia':
        case 'huntcollection':
            await handleCollezioneCaccia(m, user, conn, userId, groupId)
            break
        case 'vendicollezionecaccia':
        case 'sellhuntcollection':
            await handleVendiCollezioneCaccia(m, user, conn, userId, groupId, args)
            break
        case 'probabilitàcaccia':
        case 'probabilitacaccia':
        case 'huntprob':
            await handleProbabilitàCaccia(m, conn, groupId, userId)
            break
        case 'cacciatop':
        case 'hunttop':
            await handleCacciaTop(m, conn, groupId, users)
            break
        case 'fucile':
        case 'rifle':
            await handleFucile(m, user, conn, userId, groupId)
            break
        case 'cacciastat':
        case 'huntstats':
            await handleCacciaStat(m, user, conn, userId, groupId)
            break
        case 'scambiacaccia':
        case 'hunttrade':
            await handleScambiaCaccia(m, user, conn, userId, groupId, args, users)
            break
        case 'accettascambiocaccia':
        case 'accepthunttrade':
            await handleAccettaScambioCaccia(m, user, conn, userId, groupId, args, users)
            break
        case 'rifiutascambiocaccia':
        case 'declinehunttrade':
            await handleRifiutaScambioCaccia(m, conn, userId, groupId)
            break
        case 'regalacaccia':
        case 'huntgift':
            await handleRegalaCaccia(m, user, conn, userId, groupId, args, users)
            break
    }
}

async function handleCaccia(m, user, conn, userId, groupId) {
    const tempoAttesa = 15 * 1000

    if (cooldowns[userId] && Date.now() - cooldowns[userId] < tempoAttesa) {
        const restante = Math.ceil((cooldowns[userId] + tempoAttesa - Date.now()) / 1000)
        throw formatBox(' ⏳  𝒞𝒶𝒸𝒸𝒾𝒶', [
            'Sei ancora in appostamento.',
            `Aspetta *${restante}s*`
        ])
    }

    cooldowns[userId] = Date.now()

    if (!user.caccia) user.caccia = { prede: [], totale: 0 }
    if (!user.cacciaCollezione) user.cacciaCollezione = []

    if (Math.random() < 0.10) {
        const nulla = [
            'Hai sparato ma non hai preso nulla.',
            'La preda è scappata nel bosco.',
            'Hai trovato solo impronte vecchie.',
            'Oggi il bosco è silenzioso.'
        ]
        return conn.sendMessage(groupId, {
            text: formatBox(' 🏹  𝒞𝒶𝒸𝒸𝒾𝒶', [pickRandom(nulla)])
        }, { quoted: m })
    }

    const preda = cacciaPreda(userId)
    user.caccia.prede.push(preda)
    user.caccia.totale++

    const isNuovo = !user.cacciaCollezione.some(p => p.nome === preda.nome)
    const emoji = raritàEmoji[preda.rarità] || '⬜'

    let lines = [
        'Sei partito a caccia e hai trovato:',
        `${emoji} *${preda.nome}*`,
        `Peso: ${preda.peso}`,
        `Rarità: *${preda.rarità.toUpperCase()}*`,
        `Valore: *${preda.valore} UC*`
    ]

    if (isNuovo) lines.push('Nuovo per la tua collezione.')
    if (preda.rarità === 'leggendario') lines.push('Incredibile, una preda leggendaria!')
    else if (preda.rarità === 'epico') lines.push('Wow, una cattura epica!')
    else if (preda.rarità === 'spazzatura') lines.push('Beh... almeno non torni a mani vuote.')
    lines.push(`Prede nello zaino: ${user.caccia.prede.length}`)

    if (preda.rarità === 'leggendario') {
        await conn.sendMessage(m.chat, { react: { text: '👑', key: m.key } })
    } else if (preda.rarità === 'epico') {
        await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
    } else if (preda.rarità === 'spazzatura') {
        await conn.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } })
    } else {
        await conn.sendMessage(m.chat, { react: { text: '🏹', key: m.key } })
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' 🏹  𝒞𝒶𝒸𝒸𝒾𝒶', lines),
        footer: '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄 Hunting 🏹',
        interactiveButtons: [
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '💰 Vendi subito',
                    id: `${usedPrefixSafe()}vendicacciarapida`
                })
            },
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '📔 Colleziona',
                    id: `${usedPrefixSafe()}collezionaultimapreda`
                })
            }
        ]
    }, { quoted: m })
}

async function handleInventarioCaccia(m, user, conn, userId, groupId) {
    if (!user.caccia || user.caccia.prede.length === 0) {
        throw formatBox(' 🎒  𝒵𝒶𝒾𝓃𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', [
            'Il tuo zaino è vuoto.',
            'Vai a caccia con *.caccia*'
        ])
    }

    let testo = '╭═━ 〖  🎒  𝒵𝒶𝒾𝓃𝑜 𝒞𝒶𝒸𝒸𝒾𝒶 〗═━⪩\n'
    let valTotale = 0
    const conteggio = {}

    for (const p of user.caccia.prede) {
        const key = p.nome
        if (!conteggio[key]) conteggio[key] = { ...p, quantità: 0 }
        conteggio[key].quantità++
        valTotale += p.valore
    }

    let i = 1
    for (const p of Object.values(conteggio)) {
        const emoji = raritàEmoji[p.rarità] || '⬜'
        testo += `│❍ ${i}. ${emoji} ${p.nome} x${p.quantità} — ${p.valore * p.quantità} UC\n`
        i++
    }

    testo += `│❍ Valore totale: *${valTotale} UC*\n`
    testo += `│❍ Prede totali: ${user.caccia.prede.length}\n`
    testo += `│❍ Usa *.vendicaccia* per vendere tutto.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiCaccia(m, user, conn, userId, groupId) {
    if (!user.caccia || user.caccia.prede.length === 0) {
        throw formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', [
            'Non hai prede da vendere.',
            'Vai a caccia con *.caccia*'
        ])
    }

    let valTotale = 0
    for (const p of user.caccia.prede) valTotale += p.valore

    const quantità = user.caccia.prede.length
    user.limit = (user.limit || 0) + valTotale
    user.caccia.prede = []

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', [
            `Hai venduto *${quantità}* prede.`,
            `Guadagno: *+${valTotale} UC*`,
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleCollezioneCaccia(m, user, conn, userId, groupId) {
    if (!user.cacciaCollezione) user.cacciaCollezione = []

    if (user.cacciaCollezione.length === 0) {
        throw formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶', [
            'Non hai ancora nessuna preda in collezione.',
            'Vai a caccia con *.caccia*'
        ])
    }

    const totaleSpecie = prede.length
    const grouped = {}
    let valoreTotale = 0

    for (const rarità of ordineRarità) grouped[rarità] = []

    for (const p of user.cacciaCollezione) {
        grouped[p.rarità]?.push(p)
        valoreTotale += p.valore
    }

    let testo = '╭═━ 〖  📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶 〗═━⪩\n'
    let indiceGlobale = 1

    for (const rarità of ordineRarità) {
        const lista = grouped[rarità]
        if (!lista || !lista.length) continue

        testo += `│\n`
        testo += `│❍ ${raritàEmoji[rarità]} *${rarità.toUpperCase()}* — ${lista.length}\n`

        lista.forEach(p => {
            testo += `│❍ ${indiceGlobale}. ${p.nome}\n`
            testo += `│❍    Valore: ${p.valore} UC • Peso: ${p.peso}\n`
            indiceGlobale++
        })
    }

    testo += `│\n`
    testo += `│❍ Specie scoperte: *${user.cacciaCollezione.length}/${totaleSpecie}*\n`
    testo += `│❍ Valore totale collezione: *${valoreTotale} UC*\n`
    testo += `│❍ Usa *.vendicollezionecaccia <numero>* o *.regalacaccia @utente <numero>*\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiCollezioneCaccia(m, user, conn, userId, groupId, args) {
    if (!user.cacciaCollezione || user.cacciaCollezione.length === 0) {
        throw formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶', [
            'La tua collezione è vuota.'
        ])
    }

    const numero = parseInt(args[0])
    if (!numero || numero < 1 || numero > user.cacciaCollezione.length) {
        throw formatBox(' ❌  𝒱𝑒𝓃𝒹𝒾𝓉𝒶', [
            'Numero non valido.',
            'Usa *.collezionecaccia* per vedere la lista.'
        ])
    }

    const [venduto] = user.cacciaCollezione.splice(numero - 1, 1)
    user.limit = (user.limit || 0) + venduto.valore

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶', [
            `${raritàEmoji[venduto.rarità]} Hai venduto *${venduto.nome}*`,
            `Guadagno: *+${venduto.valore} UC*`,
            'Rimosso dalla collezione permanente.',
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleProbabilitàCaccia(m, conn, groupId, userId) {
    const bonusRaro = (fucileLevel[userId] || 0) * 2
    const probAggiustata = { ...raritàProb }

    if (bonusRaro > 0) {
        probAggiustata.raro += bonusRaro
        probAggiustata.epico += Math.floor(bonusRaro / 2)
        probAggiustata.leggendario += Math.floor(bonusRaro / 4)
        probAggiustata.comune -= bonusRaro
    }

    let testo = '╭═━ 〖  📊  𝒫𝓇𝑜𝒷𝒶𝒷𝒾𝓁𝒾𝓉à 𝒞𝒶𝒸𝒸𝒾𝒶 〗═━⪩\n'

    for (const rarità of ordineRarità) {
        const perc = probAggiustata[rarità]
        const emoji = raritàEmoji[rarità]
        testo += `│❍ ${emoji} *${rarità.toUpperCase()}*: ${perc}%\n`
        testo += `│❍ ${barraProb(perc)}\n`
    }

    if (bonusRaro > 0) {
        testo += `│❍ Bonus fucile attivo: +${bonusRaro}%\n`
    }

    testo += `│❍ Usa *.fucile* per potenziare il tuo fucile.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleCacciaTop(m, conn, groupId, users) {
    const classifica = Object.entries(users)
        .filter(([id, u]) => u.caccia && u.caccia.totale > 0)
        .sort((a, b) => (b[1].caccia.totale || 0) - (a[1].caccia.totale || 0))
        .slice(0, 10)

    if (classifica.length === 0) {
        throw formatBox(' 🏆  𝒞𝒶𝒸𝒸𝒾𝒶 𝒯𝑜𝓅', [
            'Nessuno ha ancora cacciato.'
        ])
    }

    let testo = '╭═━ 〖  🏆  𝒞𝒶𝒸𝒸𝒾𝒶 𝒯𝑜𝓅 〗═━⪩\n'
    const medaglie = ['🥇', '🥈', '🥉']

    classifica.forEach(([id, u], i) => {
        const medaglia = medaglie[i] || `${i + 1}.`
        const nome = '@' + id.split('@')[0]
        testo += `│❍ ${medaglia} ${nome} — ${u.caccia.totale} prede\n`
    })

    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, {
        text: testo,
        mentions: classifica.map(([id]) => id)
    }, { quoted: m })
}

async function handleFucile(m, user, conn, userId, groupId) {
    const livelloAttuale = fucileLevel[userId] || 0
    const costoUpgrade = (livelloAttuale + 1) * 500

    if (m.text && m.text.split(' ')[1] === 'upgrade') {
        if ((user.limit || 0) < costoUpgrade) {
            throw formatBox(' 🔫  𝐹𝓊𝒸𝒾𝓁𝑒', [
                `Ti servono *${costoUpgrade} UC* per potenziare il fucile.`,
                `Hai solo *${user.limit || 0} UC*`
            ])
        }

        if (livelloAttuale >= 5) {
            throw formatBox(' 🔫  𝐹𝓊𝒸𝒾𝓁𝑒', [
                'Il tuo fucile è già al livello massimo.'
            ])
        }

        user.limit -= costoUpgrade
        fucileLevel[userId] = livelloAttuale + 1

        return conn.sendMessage(groupId, {
            text: formatBox(' ⬆️  𝐹𝓊𝒸𝒾𝓁𝑒 𝒫𝑜𝓉𝑒𝓃𝓏𝒾𝒶𝓉𝑜', [
                `Nuovo livello: *${livelloAttuale + 1}/5*`,
                `Bonus rarità: *+${(livelloAttuale + 1) * 2}%*`,
                `Speso: *${costoUpgrade} UC*`
            ])
        }, { quoted: m })
    }

    const prossimoCosto = livelloAttuale >= 5 ? 'MAX' : `${costoUpgrade} UC`

    await conn.sendMessage(groupId, {
        text: formatBox(' 🔫  𝐹𝓊𝒸𝒾𝓁𝑒', [
            `Livello: *${livelloAttuale}/5*`,
            `Bonus attuale: *+${livelloAttuale * 2}%*`,
            `Costo prossimo livello: *${prossimoCosto}*`,
            'Usa *.fucile upgrade*'
        ])
    }, { quoted: m })
}

async function handleCacciaStat(m, user, conn, userId, groupId) {
    if (!user.caccia) user.caccia = { prede: [], totale: 0 }
    if (!user.cacciaCollezione) user.cacciaCollezione = []

    const livelloFucile = fucileLevel[userId] || 0
    const totaleSpecie = prede.length

    const testo = formatBox(' 📈  𝒮𝓉𝒶𝓉 𝒞𝒶𝒸𝒸𝒾𝒶', [
        `Prede catturate totali: ${user.caccia.totale}`,
        `Prede nello zaino: ${user.caccia.prede.length}`,
        `Specie collezionate: ${user.cacciaCollezione.length}/${totaleSpecie}`,
        `Livello fucile: ${livelloFucile}/5`,
        `Saldo UC: ${user.limit || 0}`
    ])

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

function getMentioned(m) {
    return (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null
}

async function handleScambiaCaccia(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non puoi scambiare con te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.cacciaCollezione || !user.cacciaCollezione.length) {
        throw formatBox(' 📔  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non hai prede nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.cacciaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Numero non valido.'])
    }

    if (pendingTrades[target]) throw formatBox(' ⏳  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['L’utente ha già una proposta in sospeso.'])

    if (!users[target].cacciaCollezione || !users[target].cacciaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['L’altro utente non ha prede in collezione.'])
    }

    const predaOfferta = user.cacciaCollezione[numero - 1]
    const tradeTimestamp = Date.now()

    pendingTrades[target] = {
        from: userId,
        preda: predaOfferta,
        indiceOrigine: numero - 1,
        timestamp: tradeTimestamp
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' 🔄  𝒫𝓇𝑜𝓅𝑜𝓈𝓉𝒶 𝒟𝒾 𝒮𝒸𝒶𝓂𝒷𝒾𝑜', [
            `@${userId.split('@')[0]} offre ${raritàEmoji[predaOfferta.rarità]} *${predaOfferta.nome}*`,
            `Valore: *${predaOfferta.valore} UC*`,
            `@${target.split('@')[0]} usa *.accettascambiocaccia <numero>* o *.rifiutascambiocaccia*`,
            'Scade in 2 minuti.'
        ]),
        mentions: [userId, target]
    }, { quoted: m })

    setTimeout(() => {
        if (pendingTrades[target] && pendingTrades[target].timestamp === tradeTimestamp) {
            delete pendingTrades[target]
        }
    }, 2 * 60 * 1000)
}

async function handleAccettaScambioCaccia(m, user, conn, userId, groupId, args, users) {
    const trade = pendingTrades[userId]
    if (!trade) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non hai proposte di scambio in sospeso.'])

    const numero = parseInt(args[0])

    if (!user.cacciaCollezione || !user.cacciaCollezione.length) {
        throw formatBox(' 📔  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non hai prede da offrire in cambio.'])
    }

    if (!numero || numero < 1 || numero > user.cacciaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Numero non valido.'])
    }

    const fromUser = users[trade.from]
    if (!fromUser || !fromUser.cacciaCollezione || !fromUser.cacciaCollezione[trade.indiceOrigine]) {
        delete pendingTrades[userId]
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Lo scambio non è più valido.'])
    }

    const predaMia = user.cacciaCollezione[numero - 1]
    const predaSua = fromUser.cacciaCollezione[trade.indiceOrigine]

    user.cacciaCollezione.splice(numero - 1, 1)
    fromUser.cacciaCollezione.splice(trade.indiceOrigine, 1)

    user.cacciaCollezione.push(predaSua)
    fromUser.cacciaCollezione.push(predaMia)

    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🤝  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝑜𝓂𝓅𝓁𝑒𝓉𝒶𝓉𝑜', [
            `@${trade.from.split('@')[0]} riceve ${raritàEmoji[predaMia.rarità]} ${predaMia.nome}`,
            `@${userId.split('@')[0]} riceve ${raritàEmoji[predaSua.rarità]} ${predaSua.nome}`
        ]),
        mentions: [trade.from, userId]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🤝', key: m.key } })
}

async function handleRifiutaScambioCaccia(m, conn, userId, groupId) {
    if (!pendingTrades[userId]) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non hai nessuna proposta da rifiutare.'])
    }

    const trade = pendingTrades[userId]
    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🚫  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', [
            `@${userId.split('@')[0]} ha rifiutato lo scambio di @${trade.from.split('@')[0]}`
        ]),
        mentions: [userId, trade.from]
    }, { quoted: m })
}

async function handleRegalaCaccia(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non puoi regalare a te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.cacciaCollezione || !user.cacciaCollezione.length) {
        throw formatBox(' 📔  𝑅𝑒𝑔𝒶𝓁𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', ['Non hai prede nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.cacciaCollezione.length) {
        throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶 𝒞𝒶𝒸𝒸𝒾𝒶', ['Numero non valido.'])
    }

    const [regalato] = user.cacciaCollezione.splice(numero - 1, 1)

    if (!users[target].cacciaCollezione) users[target].cacciaCollezione = []
    users[target].cacciaCollezione.push(regalato)

    await conn.sendMessage(groupId, {
        text: formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝑜 𝒞𝒶𝒸𝒸𝒾𝒶', [
            `@${userId.split('@')[0]} ha regalato a @${target.split('@')[0]}`,
            `${raritàEmoji[regalato.rarità]} *${regalato.nome}*`,
            `Valore: *${regalato.valore} UC*`
        ]),
        mentions: [userId, target]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🎁', key: m.key } })
}

async function handleBottoneRapido(m, conn, command, users) {
    const user = users[m.sender]
    if (!user || !user.caccia || user.caccia.prede.length === 0) return

    if (command === 'vendicacciarapida') {
        const ultimo = user.caccia.prede.pop()
        user.limit = (user.limit || 0) + ultimo.valore

        await conn.sendMessage(m.chat, {
            text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝑅𝒶𝓅𝒾𝒹𝒶', [
                `Hai venduto *${ultimo.nome}* per *${ultimo.valore} UC*`,
                `Saldo: *${user.limit} UC*`
            ])
        }, { quoted: m })
    }

    if (command === 'collezionaultimapreda') {
        const ultima = user.caccia.prede[user.caccia.prede.length - 1]
        if (!ultima) return

        if (!user.cacciaCollezione) user.cacciaCollezione = []

        const giàPresente = user.cacciaCollezione.some(p => p.nome === ultima.nome)
        if (giàPresente) {
            await conn.sendMessage(m.chat, {
                text: formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶', [
                    `*${ultima.nome}* è già nella tua collezione.`
                ])
            }, { quoted: m })
        } else {
            user.cacciaCollezione.push(ultima)
            await conn.sendMessage(m.chat, {
                text: formatBox(' ✅  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝒞𝒶𝒸𝒸𝒾𝒶', [
                    `*${ultima.nome}* è stato aggiunto alla tua collezione.`,
                    `Rarità: *${ultima.rarità.toUpperCase()}*`,
                    `Valore: *${ultima.valore} UC*`
                ])
            }, { quoted: m })
        }
    }
}

handler.before = async (m, { conn }) => {
    const command = m.text?.replace(/^[./!#]/, '')
    if (command === 'vendicacciarapida' || command === 'collezionaultimapreda') {
        await handleBottoneRapido(m, conn, command, global.db.data.users)
        return true
    }
    return false
}

handler.help = [
    'caccia',
    'inventariocaccia',
    'vendicaccia',
    'collezionecaccia',
    'vendicollezionecaccia <numero>',
    'probabilitàcaccia',
    'cacciatop',
    'fucile',
    'cacciastat',
    'scambiacaccia @utente <numero>',
    'accettascambiocaccia <numero>',
    'rifiutascambiocaccia',
    'regalacaccia @utente <numero>'
]
handler.tags = ['rpg', 'fun']
handler.command = /^(caccia|hunt|inventariocaccia|huntinv|vendicaccia|sellhunt|collezionecaccia|huntcollection|vendicollezionecaccia|sellhuntcollection|probabilitàcaccia|probabilitacaccia|huntprob|cacciatop|hunttop|fucile|rifle|cacciastat|huntstats|scambiacaccia|hunttrade|accettascambiocaccia|accepthunttrade|rifiutascambiocaccia|declinehunttrade|regalacaccia|huntgift)$/i
handler.register = true
handler.group = true

export default handler
