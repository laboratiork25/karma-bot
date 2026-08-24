function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

let cooldowns = {}
let picconeLevel = {}
let pendingTrades = {}

const minerali = [
    { nome: '🪨 Pietra Grezza', rarità: 'comune', valore: 10, peso: '1kg' },
    { nome: '⛏️ Carbone', rarità: 'comune', valore: 15, peso: '1.2kg' },
    { nome: '🧱 Rame', rarità: 'comune', valore: 20, peso: '0.8kg' },
    { nome: '🪨 Selce', rarità: 'comune', valore: 12, peso: '0.4kg' },
    { nome: '⚫ Ossidiana Scheggiata', rarità: 'comune', valore: 25, peso: '0.9kg' },
    { nome: '🪨 Granito Lucido', rarità: 'comune', valore: 18, peso: '1.3kg' },
    { nome: '🧱 Ferro Grezzo', rarità: 'comune', valore: 28, peso: '1.1kg' },

    { nome: '🔩 Argento', rarità: 'non comune', valore: 45, peso: '0.7kg' },
    { nome: '🟫 Bronzo Antico', rarità: 'non comune', valore: 40, peso: '1kg' },
    { nome: '🧲 Magnetite', rarità: 'non comune', valore: 55, peso: '1.6kg' },
    { nome: '🟨 Zolfo Raro', rarità: 'non comune', valore: 50, peso: '0.5kg' },
    { nome: '🪙 Pepita d’Argento', rarità: 'non comune', valore: 60, peso: '0.3kg' },
    { nome: '🪨 Cristallo di Quarzo', rarità: 'non comune', valore: 58, peso: '0.9kg' },
    { nome: '🧱 Titanite', rarità: 'non comune', valore: 70, peso: '1.4kg' },

    { nome: '💎 Rubino', rarità: 'raro', valore: 140, peso: '0.2kg' },
    { nome: '💠 Zaffiro', rarità: 'raro', valore: 150, peso: '0.2kg' },
    { nome: '🟢 Smeraldo', rarità: 'raro', valore: 180, peso: '0.25kg' },
    { nome: '🔷 Diamante Grezzo', rarità: 'raro', valore: 220, peso: '0.15kg' },
    { nome: '🧪 Uranio', rarità: 'raro', valore: 200, peso: '0.6kg' },
    { nome: '🌋 Lava Solidificata', rarità: 'raro', valore: 130, peso: '2kg' },

    { nome: '👑 Pepita d’Oro Puro', rarità: 'epico', valore: 350, peso: '0.4kg' },
    { nome: '💜 Ametista Gigante', rarità: 'epico', valore: 400, peso: '1.8kg' },
    { nome: '🧿 Opale Nero', rarità: 'epico', valore: 450, peso: '0.25kg' },
    { nome: '🧬 Cristallo Energetico', rarità: 'epico', valore: 500, peso: '0.7kg' },
    { nome: '🪬 Meteorite Antica', rarità: 'epico', valore: 480, peso: '3kg' },

    { nome: '☄️ Frammento Stellare', rarità: 'leggendario', valore: 1000, peso: '???' },
    { nome: '🔮 Gemma del Vuoto', rarità: 'leggendario', valore: 1200, peso: '0.1kg' },
    { nome: '👑 Corona Mineraria Perduta', rarità: 'leggendario', valore: 1500, peso: '2kg' },
    { nome: '🩸 Diamante Cremisi', rarità: 'leggendario', valore: 1300, peso: '0.2kg' },

    { nome: '🗑️ Sasso Inutile', rarità: 'spazzatura', valore: 1, peso: '0.5kg' },
    { nome: '🥫 Lattina Schiacciata', rarità: 'spazzatura', valore: 2, peso: '0.1kg' },
    { nome: '🔩 Bullone Rotto', rarità: 'spazzatura', valore: 3, peso: '0.05kg' },
    { nome: '🧻 Straccio Sporco', rarità: 'spazzatura', valore: 1, peso: '0.1kg' },
    { nome: '🪫 Batteria Scarica', rarità: 'spazzatura', valore: 4, peso: '0.3kg' }
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

function estraiMinerale(userId) {
    const bonusRaro = (picconeLevel[userId] || 0) * 2
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

    const disponibili = minerali.filter(p => p.rarità === raritàScelta)
    return pickRandom(disponibili)
}

let handler = async (m, { conn, command, args }) => {
    const userId = m.sender
    const groupId = m.chat
    const users = global.db.data.users
    const user = users[m.sender]

    if (!user) throw formatBox(' ❌  𝑀𝒾𝓃𝒾𝑒𝓇𝒶', ['Non sei registrato.'])

    switch (command) {
        case 'mina':
        case 'mine':
            await handleMina(m, user, conn, userId, groupId)
            break
        case 'inventariominiera':
        case 'mineinv':
            await handleInventarioMiniera(m, user, conn, userId, groupId)
            break
        case 'vendiminerali':
        case 'sellminerals':
            await handleVendiMinerali(m, user, conn, userId, groupId)
            break
        case 'collezioneminiera':
        case 'minecollection':
            await handleCollezioneMiniera(m, user, conn, userId, groupId)
            break
        case 'vendicollezionemina':
        case 'sellminecollection':
            await handleVendiCollezioneMiniera(m, user, conn, userId, groupId, args)
            break
        case 'probabilitàmina':
        case 'probabilitamina':
        case 'mineprob':
            await handleProbabilitàMina(m, conn, groupId, userId)
            break
        case 'minatop':
        case 'minetop':
            await handleMinaTop(m, conn, groupId, users)
            break
        case 'piccone':
        case 'pickaxe':
            await handlePiccone(m, user, conn, userId, groupId)
            break
        case 'minastat':
        case 'minestats':
            await handleMinaStat(m, user, conn, userId, groupId)
            break
        case 'scambiamina':
        case 'minetrade':
            await handleScambiaMina(m, user, conn, userId, groupId, args, users)
            break
        case 'accettascambiomina':
        case 'acceptminetrade':
            await handleAccettaScambioMina(m, user, conn, userId, groupId, args, users)
            break
        case 'rifiutascambiomina':
        case 'declineminetrade':
            await handleRifiutaScambioMina(m, conn, userId, groupId)
            break
        case 'regalamina':
        case 'minegift':
            await handleRegalaMina(m, user, conn, userId, groupId, args, users)
            break
    }
}

async function handleMina(m, user, conn, userId, groupId) {
    const tempoAttesa = 15 * 1000

    if (cooldowns[userId] && Date.now() - cooldowns[userId] < tempoAttesa) {
        const restante = Math.ceil((cooldowns[userId] + tempoAttesa - Date.now()) / 1000)
        throw formatBox(' ⏳  𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            'Stai ancora scavando.',
            `Aspetta *${restante}s*`
        ])
    }

    cooldowns[userId] = Date.now()

    if (!user.miniera) user.miniera = { minerali: [], totale: 0 }
    if (!user.minieraCollezione) user.minieraCollezione = []

    if (Math.random() < 0.10) {
        const nulla = [
            'Hai scavato a vuoto.',
            'Solo polvere e pietre inutili.',
            'Il filone era già esaurito.',
            'Hai colpito la roccia per niente.'
        ]
        return conn.sendMessage(groupId, {
            text: formatBox(' ⛏️  𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [pickRandom(nulla)])
        }, { quoted: m })
    }

    const minerale = estraiMinerale(userId)
    user.miniera.minerali.push(minerale)
    user.miniera.totale++

    const isNuovo = !user.minieraCollezione.some(p => p.nome === minerale.nome)
    const emoji = raritàEmoji[minerale.rarità] || '⬜'

    let lines = [
        'Hai scavato e hai trovato:',
        `${emoji} *${minerale.nome}*`,
        `Peso: ${minerale.peso}`,
        `Rarità: *${minerale.rarità.toUpperCase()}*`,
        `Valore: *${minerale.valore} UC*`
    ]

    if (isNuovo) lines.push('Nuovo per la tua collezione.')
    if (minerale.rarità === 'leggendario') lines.push('Incredibile, un ritrovamento leggendario!')
    else if (minerale.rarità === 'epico') lines.push('Wow, ritrovamento epico!')
    else if (minerale.rarità === 'spazzatura') lines.push('Beh... almeno hai trovato qualcosa.')
    lines.push(`Minerali nel carrello: ${user.miniera.minerali.length}`)

    if (minerale.rarità === 'leggendario') {
        await conn.sendMessage(m.chat, { react: { text: '💥', key: m.key } })
    } else if (minerale.rarità === 'epico') {
        await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
    } else if (minerale.rarità === 'spazzatura') {
        await conn.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } })
    } else {
        await conn.sendMessage(m.chat, { react: { text: '⛏️', key: m.key } })
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' ⛏️  𝑀𝒾𝓃𝒾𝑒𝓇𝒶', lines),
        footer: '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄 Mining ⛏️',
        interactiveButtons: [
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '💰 Vendi subito',
                    id: `${usedPrefixSafe()}vendimineralerapido`
                })
            },
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '📚 Colleziona',
                    id: `${usedPrefixSafe()}collezionaultimominerale`
                })
            }
        ]
    }, { quoted: m })
}

async function handleInventarioMiniera(m, user, conn, userId, groupId) {
    if (!user.miniera || user.miniera.minerali.length === 0) {
        throw formatBox(' 🛒  𝒞𝒶𝓇𝓇𝑒𝓁𝓁𝑜 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            'Il tuo carrello è vuoto.',
            'Vai a scavare con *.mina*'
        ])
    }

    let testo = '╭═━ 〖  🛒  𝒞𝒶𝓇𝓇𝑒𝓁𝓁𝑜 𝑀𝒾𝓃𝒾𝑒𝓇𝒶 〗═━⪩\n'
    let valTotale = 0
    const conteggio = {}

    for (const p of user.miniera.minerali) {
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
    testo += `│❍ Minerali totali: ${user.miniera.minerali.length}\n`
    testo += `│❍ Usa *.vendiminerali* per vendere tutto.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiMinerali(m, user, conn, userId, groupId) {
    if (!user.miniera || user.miniera.minerali.length === 0) {
        throw formatBox(' 🏪  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            'Non hai minerali da vendere.',
            'Vai a scavare con *.mina*'
        ])
    }

    let valTotale = 0
    for (const p of user.miniera.minerali) valTotale += p.valore

    const quantità = user.miniera.minerali.length
    user.limit = (user.limit || 0) + valTotale
    user.miniera.minerali = []

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝑀𝒾𝓃𝑒𝓇𝒶𝓁𝒾', [
            `Hai venduto *${quantità}* minerali.`,
            `Guadagno: *+${valTotale} UC*`,
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleCollezioneMiniera(m, user, conn, userId, groupId) {
    if (!user.minieraCollezione) user.minieraCollezione = []

    if (user.minieraCollezione.length === 0) {
        throw formatBox(' 📚  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            'Non hai ancora nessun minerale in collezione.',
            'Scava con *.mina*'
        ])
    }

    const totaleSpecie = minerali.length
    const grouped = {}
    let valoreTotale = 0

    for (const rarità of ordineRarità) grouped[rarità] = []

    for (const p of user.minieraCollezione) {
        grouped[p.rarità]?.push(p)
        valoreTotale += p.valore
    }

    let testo = '╭═━ 〖  📚  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶 〗═━⪩\n'
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
    testo += `│❍ Specie scoperte: *${user.minieraCollezione.length}/${totaleSpecie}*\n`
    testo += `│❍ Valore totale collezione: *${valoreTotale} UC*\n`
    testo += `│❍ Usa *.vendicollezionemina <numero>* o *.regalamina @utente <numero>*\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiCollezioneMiniera(m, user, conn, userId, groupId, args) {
    if (!user.minieraCollezione || user.minieraCollezione.length === 0) {
        throw formatBox(' 📚  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            'La tua collezione è vuota.'
        ])
    }

    const numero = parseInt(args[0])
    if (!numero || numero < 1 || numero > user.minieraCollezione.length) {
        throw formatBox(' ❌  𝒱𝑒𝓃𝒹𝒾𝓉𝒶', [
            'Numero non valido.',
            'Usa *.collezioneminiera* per vedere la lista.'
        ])
    }

    const [venduto] = user.minieraCollezione.splice(numero - 1, 1)
    user.limit = (user.limit || 0) + venduto.valore

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
            `${raritàEmoji[venduto.rarità]} Hai venduto *${venduto.nome}*`,
            `Guadagno: *+${venduto.valore} UC*`,
            'Rimosso dalla collezione permanente.',
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleProbabilitàMina(m, conn, groupId, userId) {
    const bonusRaro = (picconeLevel[userId] || 0) * 2
    const probAggiustata = { ...raritàProb }

    if (bonusRaro > 0) {
        probAggiustata.raro += bonusRaro
        probAggiustata.epico += Math.floor(bonusRaro / 2)
        probAggiustata.leggendario += Math.floor(bonusRaro / 4)
        probAggiustata.comune -= bonusRaro
    }

    let testo = '╭═━ 〖  📊  𝒫𝓇𝑜𝒷𝒶𝒷𝒾𝓁𝒾𝓉à 𝑀𝒾𝓃𝒶 〗═━⪩\n'

    for (const rarità of ordineRarità) {
        const perc = probAggiustata[rarità]
        const emoji = raritàEmoji[rarità]
        testo += `│❍ ${emoji} *${rarità.toUpperCase()}*: ${perc}%\n`
        testo += `│❍ ${barraProb(perc)}\n`
    }

    if (bonusRaro > 0) {
        testo += `│❍ Bonus piccone attivo: +${bonusRaro}%\n`
    }

    testo += `│❍ Usa *.piccone* per potenziare il tuo piccone.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleMinaTop(m, conn, groupId, users) {
    const classifica = Object.entries(users)
        .filter(([id, u]) => u.miniera && u.miniera.totale > 0)
        .sort((a, b) => (b[1].miniera.totale || 0) - (a[1].miniera.totale || 0))
        .slice(0, 10)

    if (classifica.length === 0) {
        throw formatBox(' 🏆  𝑀𝒾𝓃𝒶 𝒯𝑜𝓅', [
            'Nessuno ha ancora scavato.'
        ])
    }

    let testo = '╭═━ 〖  🏆  𝑀𝒾𝓃𝒶 𝒯𝑜𝓅 〗═━⪩\n'
    const medaglie = ['🥇', '🥈', '🥉']

    classifica.forEach(([id, u], i) => {
        const medaglia = medaglie[i] || `${i + 1}.`
        const nome = '@' + id.split('@')[0]
        testo += `│❍ ${medaglia} ${nome} — ${u.miniera.totale} minerali\n`
    })

    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, {
        text: testo,
        mentions: classifica.map(([id]) => id)
    }, { quoted: m })
}

async function handlePiccone(m, user, conn, userId, groupId) {
    const livelloAttuale = picconeLevel[userId] || 0
    const costoUpgrade = (livelloAttuale + 1) * 500

    if (m.text && m.text.split(' ')[1] === 'upgrade') {
        if ((user.limit || 0) < costoUpgrade) {
            throw formatBox(' ⛏️  𝒫𝒾𝒸𝒸𝑜𝓃𝑒', [
                `Ti servono *${costoUpgrade} UC* per potenziare il piccone.`,
                `Hai solo *${user.limit || 0} UC*`
            ])
        }

        if (livelloAttuale >= 5) {
            throw formatBox(' ⛏️  𝒫𝒾𝒸𝒸𝑜𝓃𝑒', [
                'Il tuo piccone è già al livello massimo.'
            ])
        }

        user.limit -= costoUpgrade
        picconeLevel[userId] = livelloAttuale + 1

        return conn.sendMessage(groupId, {
            text: formatBox(' ⬆️  𝒫𝒾𝒸𝒸𝑜𝓃𝑒 𝒫𝑜𝓉𝑒𝓃𝓏𝒾𝒶𝓉𝑜', [
                `Nuovo livello: *${livelloAttuale + 1}/5*`,
                `Bonus rarità: *+${(livelloAttuale + 1) * 2}%*`,
                `Speso: *${costoUpgrade} UC*`
            ])
        }, { quoted: m })
    }

    const prossimoCosto = livelloAttuale >= 5 ? 'MAX' : `${costoUpgrade} UC`

    await conn.sendMessage(groupId, {
        text: formatBox(' ⛏️  𝒫𝒾𝒸𝒸𝑜𝓃𝑒', [
            `Livello: *${livelloAttuale}/5*`,
            `Bonus attuale: *+${livelloAttuale * 2}%*`,
            `Costo prossimo livello: *${prossimoCosto}*`,
            'Usa *.piccone upgrade*'
        ])
    }, { quoted: m })
}

async function handleMinaStat(m, user, conn, userId, groupId) {
    if (!user.miniera) user.miniera = { minerali: [], totale: 0 }
    if (!user.minieraCollezione) user.minieraCollezione = []

    const livelloPiccone = picconeLevel[userId] || 0
    const totaleSpecie = minerali.length

    const testo = formatBox(' 📈  𝒮𝓉𝒶𝓉 𝑀𝒾𝓃𝒶', [
        `Minerali estratti totali: ${user.miniera.totale}`,
        `Minerali nel carrello: ${user.miniera.minerali.length}`,
        `Specie collezionate: ${user.minieraCollezione.length}/${totaleSpecie}`,
        `Livello piccone: ${livelloPiccone}/5`,
        `Saldo UC: ${user.limit || 0}`
    ])

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

function getMentioned(m) {
    return (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null
}

async function handleScambiaMina(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Non puoi scambiare con te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.minieraCollezione || !user.minieraCollezione.length) {
        throw formatBox(' 📚  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Non hai minerali nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.minieraCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Numero non valido.'])
    }

    if (pendingTrades[target]) throw formatBox(' ⏳  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['L’utente ha già una proposta in sospeso.'])

    if (!users[target].minieraCollezione || !users[target].minieraCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['L’altro utente non ha minerali in collezione.'])
    }

    const mineraleOfferto = user.minieraCollezione[numero - 1]
    const tradeTimestamp = Date.now()

    pendingTrades[target] = {
        from: userId,
        minerale: mineraleOfferto,
        indiceOrigine: numero - 1,
        timestamp: tradeTimestamp
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' 🔄  𝒫𝓇𝑜𝓅𝑜𝓈𝓉𝒶 𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', [
            `@${userId.split('@')[0]} offre ${raritàEmoji[mineraleOfferto.rarità]} *${mineraleOfferto.nome}*`,
            `Valore: *${mineraleOfferto.valore} UC*`,
            `@${target.split('@')[0]} usa *.accettascambiomina <numero>* o *.rifiutascambiomina*`,
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

async function handleAccettaScambioMina(m, user, conn, userId, groupId, args, users) {
    const trade = pendingTrades[userId]
    if (!trade) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Non hai proposte di scambio in sospeso.'])

    const numero = parseInt(args[0])

    if (!user.minieraCollezione || !user.minieraCollezione.length) {
        throw formatBox(' 📚  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Non hai minerali da offrire in cambio.'])
    }

    if (!numero || numero < 1 || numero > user.minieraCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Numero non valido.'])
    }

    const fromUser = users[trade.from]
    if (!fromUser || !fromUser.minieraCollezione || !fromUser.minieraCollezione[trade.indiceOrigine]) {
        delete pendingTrades[userId]
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Lo scambio non è più valido.'])
    }

    const mineraleMio = user.minieraCollezione[numero - 1]
    const mineraleSuo = fromUser.minieraCollezione[trade.indiceOrigine]

    user.minieraCollezione.splice(numero - 1, 1)
    fromUser.minieraCollezione.splice(trade.indiceOrigine, 1)

    user.minieraCollezione.push(mineraleSuo)
    fromUser.minieraCollezione.push(mineraleMio)

    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🤝  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', [
            `@${trade.from.split('@')[0]} riceve ${raritàEmoji[mineraleMio.rarità]} ${mineraleMio.nome}`,
            `@${userId.split('@')[0]} riceve ${raritàEmoji[mineraleSuo.rarità]} ${mineraleSuo.nome}`
        ]),
        mentions: [trade.from, userId]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🤝', key: m.key } })
}

async function handleRifiutaScambioMina(m, conn, userId, groupId) {
    if (!pendingTrades[userId]) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', ['Non hai nessuna proposta da rifiutare.'])
    }

    const trade = pendingTrades[userId]
    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🚫  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝑀𝒾𝓃𝒶', [
            `@${userId.split('@')[0]} ha rifiutato lo scambio di @${trade.from.split('@')[0]}`
        ]),
        mentions: [userId, trade.from]
    }, { quoted: m })
}

async function handleRegalaMina(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶 𝑀𝒾𝓃𝒶', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶 𝑀𝒾𝓃𝒶', ['Non puoi regalare a te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶 𝑀𝒾𝓃𝒶', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.minieraCollezione || !user.minieraCollezione.length) {
        throw formatBox(' 📚  𝑅𝑒𝑔𝒶𝓁𝒶 𝑀𝒾𝓃𝒶', ['Non hai minerali nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.minieraCollezione.length) {
        throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶 𝑀𝒾𝓃𝒶', ['Numero non valido.'])
    }

    const [regalato] = user.minieraCollezione.splice(numero - 1, 1)

    if (!users[target].minieraCollezione) users[target].minieraCollezione = []
    users[target].minieraCollezione.push(regalato)

    await conn.sendMessage(groupId, {
        text: formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝑜 𝑀𝒾𝓃𝒶', [
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
    if (!user || !user.miniera || user.miniera.minerali.length === 0) return

    if (command === 'vendimineralerapido') {
        const ultimo = user.miniera.minerali.pop()
        user.limit = (user.limit || 0) + ultimo.valore

        await conn.sendMessage(m.chat, {
            text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝑅𝒶𝓅𝒾𝒹𝒶', [
                `Hai venduto *${ultimo.nome}* per *${ultimo.valore} UC*`,
                `Saldo: *${user.limit} UC*`
            ])
        }, { quoted: m })
    }

    if (command === 'collezionaultimominerale') {
        const ultimo = user.miniera.minerali[user.miniera.minerali.length - 1]
        if (!ultimo) return

        if (!user.minieraCollezione) user.minieraCollezione = []

        const giàPresente = user.minieraCollezione.some(p => p.nome === ultimo.nome)
        if (giàPresente) {
            await conn.sendMessage(m.chat, {
                text: formatBox(' 📚  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
                    `*${ultimo.nome}* è già nella tua collezione.`
                ])
            }, { quoted: m })
        } else {
            user.minieraCollezione.push(ultimo)
            await conn.sendMessage(m.chat, {
                text: formatBox(' ✅  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 𝑀𝒾𝓃𝒾𝑒𝓇𝒶', [
                    `*${ultimo.nome}* è stato aggiunto alla tua collezione.`,
                    `Rarità: *${ultimo.rarità.toUpperCase()}*`,
                    `Valore: *${ultimo.valore} UC*`
                ])
            }, { quoted: m })
        }
    }
}

handler.before = async (m, { conn }) => {
    const command = m.text?.replace(/^[./!#]/, '')
    if (command === 'vendimineralerapido' || command === 'collezionaultimominerale') {
        await handleBottoneRapido(m, conn, command, global.db.data.users)
        return true
    }
    return false
}

handler.help = [
    'mina',
    'inventariominiera',
    'vendiminerali',
    'collezioneminiera',
    'vendicollezionemina <numero>',
    'probabilitàmina',
    'minatop',
    'piccone',
    'minastat',
    'scambiamina @utente <numero>',
    'accettascambiomina <numero>',
    'rifiutascambiomina',
    'regalamina @utente <numero>'
]
handler.tags = ['rpg', 'fun']
handler.command = /^(mina|mine|inventariominiera|mineinv|vendiminerali|sellminerals|collezioneminiera|minecollection|vendicollezionemina|sellminecollection|probabilitàmina|probabilitamina|mineprob|minatop|minetop|piccone|pickaxe|minastat|minestats|scambiamina|minetrade|accettascambiomina|acceptminetrade|rifiutascambiomina|declineminetrade|regalamina|minegift)$/i
handler.register = true
handler.group = true

export default handler
