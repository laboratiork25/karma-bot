
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

let cooldowns = {}
let cannaLevel = {}
let pendingTrades = {}

const pesci = [
    { nome: '🐟 Sardina', rarità: 'comune', valore: 10, peso: '0.2kg' },
    { nome: '🐠 Pesce Pagliaccio', rarità: 'comune', valore: 15, peso: '0.3kg' },
    { nome: '🐡 Pesce Palla', rarità: 'comune', valore: 20, peso: '0.5kg' },
    { nome: '🐟 Sgombro', rarità: 'comune', valore: 25, peso: '0.8kg' },
    { nome: '🐟 Acciuga', rarità: 'comune', valore: 12, peso: '0.15kg' },
    { nome: '🐟 Aringa', rarità: 'comune', valore: 18, peso: '0.4kg' },
    { nome: '🐟 Triglia', rarità: 'comune', valore: 22, peso: '0.35kg' },
    { nome: '🐟 Pesce Gatto', rarità: 'comune', valore: 28, peso: '0.9kg' },

    { nome: '🐟 Merluzzo', rarità: 'non comune', valore: 40, peso: '1.5kg' },
    { nome: '🐟 Branzino', rarità: 'non comune', valore: 50, peso: '2kg' },
    { nome: '🐟 Orata', rarità: 'non comune', valore: 55, peso: '1.8kg' },
    { nome: '🐢 Tartaruga Marina', rarità: 'non comune', valore: 60, peso: '30kg' },
    { nome: '🐟 Tonno', rarità: 'non comune', valore: 65, peso: '15kg' },
    { nome: '🦞 Aragosta', rarità: 'non comune', valore: 70, peso: '2.5kg' },
    { nome: '🐟 Salmone', rarità: 'non comune', valore: 58, peso: '3kg' },
    { nome: '🐟 Anguilla', rarità: 'non comune', valore: 45, peso: '1.2kg' },

    { nome: '🦈 Squalo Martello', rarità: 'raro', valore: 150, peso: '50kg' },
    { nome: '🐙 Polpo Gigante', rarità: 'raro', valore: 120, peso: '8kg' },
    { nome: '🦑 Calamaro', rarità: 'raro', valore: 100, peso: '5kg' },
    { nome: '🦀 Granchio d\'Oro', rarità: 'raro', valore: 200, peso: '1kg' },
    { nome: '🐠 Pesce Luna', rarità: 'raro', valore: 130, peso: '250kg' },
    { nome: '🦭 Foca Curiosa', rarità: 'raro', valore: 140, peso: '90kg' },
    { nome: '🐟 Pesce Spada', rarità: 'raro', valore: 180, peso: '60kg' },

    { nome: '💀 Teschio Misterioso', rarità: 'epico', valore: 300, peso: '2kg' },
    { nome: '🗡️ Spada Antica', rarità: 'epico', valore: 400, peso: '3kg' },
    { nome: '🐋 Balena', rarità: 'epico', valore: 500, peso: '2000kg' },
    { nome: '🏺 Anfora Romana', rarità: 'epico', valore: 350, peso: '5kg' },
    { nome: '💎 Scrigno del Tesoro', rarità: 'epico', valore: 450, peso: '10kg' },
    { nome: '🦑 Kraken Neonato', rarità: 'epico', valore: 480, peso: '120kg' },

    { nome: ' Alligatore', rarità: 'leggendario', valore: 1000, peso: '???' },
    { nome: '🐉 Pesce Sblao', rarità: 'leggendario', valore: 800, peso: '15kg' },
    { nome: '🪼 Medusa', rarità: 'leggendario', valore: 1200, peso: '1kg' },
    { nome: '🩲 Intimo di Nicolino', rarità: 'leggendario', valore: 1500, peso: '???' },
    { nome: '🔞 Perizoma di Nicolino', rarità: 'leggendario', valore: 900, peso: '2kg' },

    { nome: '👢 Stivale Vecchio', rarità: 'spazzatura', valore: 1, peso: '0.5kg' },
    { nome: '🪣 Secchio Arrugginito', rarità: 'spazzatura', valore: 2, peso: '1kg' },
    { nome: '📱 iPhone Rotto', rarità: 'spazzatura', valore: 5, peso: '0.2kg' },
    { nome: '🥫 Lattina Vuota', rarità: 'spazzatura', valore: 1, peso: '0.1kg' },
    { nome: '🎣 Amo Rotto', rarità: 'spazzatura', valore: 3, peso: '0.05kg' },
    { nome: '🩴 Ciabatta Spaiata', rarità: 'spazzatura', valore: 2, peso: '0.1kg' },
    { nome: '📻 Radio Arrugginita', rarità: 'spazzatura', valore: 4, peso: '1.5kg' }
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

function pescaPesce(userId) {
    const bonusRaro = (cannaLevel[userId] || 0) * 2
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

    const disponibili = pesci.filter(p => p.rarità === raritàScelta)
    return pickRandom(disponibili)
}

let handler = async (m, { conn, command, usedPrefix, args }) => {
    const userId = m.sender
    const groupId = m.chat
    const users = global.db.data.users
    const user = users[m.sender]

    if (!user) throw '╭═━ 〖  ❌  𝒫𝑒𝓈𝒸𝒶 〗═━⪩\n│❍ 𝒩𝑜𝓃 𝓈𝑒𝒾 𝓇𝑒𝑔𝒾𝓈𝓉𝓇𝒶𝓉𝑜.\n╰━━━━━━━━━⪩'

    switch (command) {
        case 'pesca':
        case 'fish':
            await handlePesca(m, user, conn, userId, groupId)
            break
        case 'inventariopesca':
        case 'fishinv':
            await handleInventarioPesca(m, user, conn, userId, groupId)
            break
        case 'vendipesce':
        case 'sellfish':
            await handleVendiPesce(m, user, conn, userId, groupId)
            break
        case 'collezione':
        case 'fishcollection':
            await handleCollezione(m, user, conn, userId, groupId)
            break
        case 'vendicollezione':
        case 'sellcollection':
            await handleVendiCollezione(m, user, conn, userId, groupId, args)
            break
        case 'probabilità':
        case 'probabilita':
        case 'pescaprob':
            await handleProbabilità(m, conn, groupId, userId)
            break
        case 'pescatop':
        case 'fishtop':
            await handlePescaTop(m, conn, groupId, users)
            break
        case 'cannapesca':
        case 'fishrod':
            await handleCannaPesca(m, user, conn, userId, groupId)
            break
        case 'pescastat':
        case 'fishstats':
            await handlePescaStat(m, user, conn, userId, groupId)
            break
        case 'scambia':
        case 'trade':
            await handleScambia(m, user, conn, userId, groupId, args, users)
            break
        case 'accettascambio':
        case 'accepttrade':
            await handleAccettaScambio(m, user, conn, userId, groupId, args, users)
            break
        case 'rifiutascambio':
        case 'declinetrade':
            await handleRifiutaScambio(m, conn, userId, groupId)
            break
        case 'regala':
        case 'gift':
            await handleRegala(m, user, conn, userId, groupId, args, users)
            break
    }
}

async function handlePesca(m, user, conn, userId, groupId) {
    const tempoAttesa = 15 * 1000

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa) {
        const restante = Math.ceil((cooldowns[m.sender] + tempoAttesa - Date.now()) / 1000)
        throw formatBox(' ⏳  𝒫𝑒𝓈𝒸𝒶', [
            `La canna è ancora in acqua.`,
            `Aspetta *${restante}s*`
        ])
    }

    cooldowns[m.sender] = Date.now()

    if (!user.pesca) user.pesca = { pesci: [], totale: 0 }
    if (!user.pescaCollezione) user.pescaCollezione = []

    if (Math.random() < 0.10) {
        const nulla = [
            'Hai lanciato la lenza ma non hai preso nulla.',
            'L’esca è sparita e il mare ti ha trollato.',
            'Un pesce enorme ha spezzato il filo.',
            'Il mare oggi è vuoto.'
        ]
        return conn.sendMessage(groupId, {
            text: formatBox(' 🎣  𝒫𝑒𝓈𝒸𝒶', [pickRandom(nulla)])
        }, { quoted: m })
    }

    const pesce = pescaPesce(userId)
    user.pesca.pesci.push(pesce)
    user.pesca.totale++

    const isNuovo = !user.pescaCollezione.some(p => p.nome === pesce.nome)
    const emoji = raritàEmoji[pesce.rarità] || '⬜'

    let lines = [
        'Hai lanciato la lenza e hai preso:',
        `${emoji} *${pesce.nome}*`,
        `Peso: ${pesce.peso}`,
        `Rarità: *${pesce.rarità.toUpperCase()}*`,
        `Valore: *${pesce.valore} UC*`
    ]

    if (isNuovo) lines.push('Nuovo per la tua collezione.')
    if (pesce.rarità === 'leggendario') lines.push('Incredibile, una cattura leggendaria!')
    else if (pesce.rarità === 'epico') lines.push('Wow, cattura epica!')
    else if (pesce.rarità === 'spazzatura') lines.push('Beh... almeno hai preso qualcosa.')
    lines.push(`Pesci nel secchio: ${user.pesca.pesci.length}`)

    if (pesce.rarità === 'leggendario') {
        await conn.sendMessage(m.chat, { react: { text: '🎊', key: m.key } })
    } else if (pesce.rarità === 'epico') {
        await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
    } else if (pesce.rarità === 'spazzatura') {
        await conn.sendMessage(m.chat, { react: { text: '🗑️', key: m.key } })
    } else {
        await conn.sendMessage(m.chat, { react: { text: '🎣', key: m.key } })
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' 🎣  𝒫𝑒𝓈𝒸𝒶', lines),
        footer: '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄 Fishing 🎣',
        interactiveButtons: [
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '💰 Vendi subito',
                    id: `${usedPrefixSafe()}vendipescerapido`
                })
            },
            {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: '📔 Colleziona',
                    id: `${usedPrefixSafe()}collezionaultimo`
                })
            }
        ]
    }, { quoted: m })
}

async function handleInventarioPesca(m, user, conn, userId, groupId) {
    if (!user.pesca || user.pesca.pesci.length === 0) {
        throw formatBox(' 🪣  𝒮𝑒𝒸𝒸𝒽𝒾𝑜', [
            'Il tuo secchio è vuoto.',
            'Vai a pescare con *.pesca*'
        ])
    }

    let testo = '╭═━ 〖  🪣  𝒮𝑒𝒸𝒸𝒽𝒾𝑜 〗═━⪩\n'
    let valTotale = 0
    const conteggio = {}

    for (const p of user.pesca.pesci) {
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
    testo += `│❍ Pesci totali: ${user.pesca.pesci.length}\n`
    testo += `│❍ Usa *.vendipesce* per vendere tutto.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiPesce(m, user, conn, userId, groupId) {
    if (!user.pesca || user.pesca.pesci.length === 0) {
        throw formatBox(' 🏪  𝒱𝑒𝓃𝒹𝒾𝓉𝒶', [
            'Non hai pesci da vendere.',
            'Vai a pescare con *.pesca*'
        ])
    }

    let valTotale = 0
    for (const p of user.pesca.pesci) valTotale += p.valore

    const quantità = user.pesca.pesci.length
    user.limit = (user.limit || 0) + valTotale
    user.pesca.pesci = []

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶', [
            `Hai venduto *${quantità}* pesci.`,
            `Guadagno: *+${valTotale} UC*`,
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleCollezione(m, user, conn, userId, groupId) {
    if (!user.pescaCollezione) user.pescaCollezione = []

    if (user.pescaCollezione.length === 0) {
        throw formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒', [
            'Non hai ancora nessun pesce in collezione.',
            'Pesca con *.pesca*'
        ])
    }

    const totaleSpecie = pesci.length
    const grouped = {}
    let valoreTotale = 0

    for (const rarità of ordineRarità) grouped[rarità] = []

    for (const p of user.pescaCollezione) {
        grouped[p.rarità]?.push(p)
        valoreTotale += p.valore
    }

    let testo = '╭═━ 〖  📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒 〗═━⪩\n'
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
    testo += `│❍ Specie scoperte: *${user.pescaCollezione.length}/${totaleSpecie}*\n`
    testo += `│❍ Valore totale collezione: *${valoreTotale} UC*\n`
    testo += `│❍ Usa *.vendicollezione <numero>* o *.regala @utente <numero>*\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handleVendiCollezione(m, user, conn, userId, groupId, args) {
    if (!user.pescaCollezione || user.pescaCollezione.length === 0) {
        throw formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒', [
            'La tua collezione è vuota.'
        ])
    }

    const numero = parseInt(args[0])
    if (!numero || numero < 1 || numero > user.pescaCollezione.length) {
        throw formatBox(' ❌  𝒱𝑒𝓃𝒹𝒾𝓉𝒶', [
            'Numero non valido.',
            'Usa *.collezione* per vedere la lista.'
        ])
    }

    const [venduto] = user.pescaCollezione.splice(numero - 1, 1)
    user.limit = (user.limit || 0) + venduto.valore

    await conn.sendMessage(groupId, {
        text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒', [
            `${raritàEmoji[venduto.rarità]} Hai venduto *${venduto.nome}*`,
            `Guadagno: *+${venduto.valore} UC*`,
            'Rimosso dalla collezione permanente.',
            `Saldo attuale: *${user.limit} UC*`
        ])
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } })
}

async function handleProbabilità(m, conn, groupId, userId) {
    const bonusRaro = (cannaLevel[userId] || 0) * 2
    const probAggiustata = { ...raritàProb }

    if (bonusRaro > 0) {
        probAggiustata.raro += bonusRaro
        probAggiustata.epico += Math.floor(bonusRaro / 2)
        probAggiustata.leggendario += Math.floor(bonusRaro / 4)
        probAggiustata.comune -= bonusRaro
    }

    let testo = '╭═━ 〖  📊  𝒫𝓇𝑜𝒷𝒶𝒷𝒾𝓁𝒾𝓉à 〗═━⪩\n'
    const ordine = ['leggendario', 'epico', 'raro', 'non comune', 'comune', 'spazzatura']

    for (const rarità of ordine) {
        const perc = probAggiustata[rarità]
        const emoji = raritàEmoji[rarità]
        testo += `│❍ ${emoji} *${rarità.toUpperCase()}*: ${perc}%\n`
        testo += `│❍ ${barraProb(perc)}\n`
    }

    if (bonusRaro > 0) {
        testo += `│❍ Bonus canna attivo: +${bonusRaro}%\n`
    }

    testo += `│❍ Usa *.cannapesca* per potenziare la canna.\n`
    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

async function handlePescaTop(m, conn, groupId, users) {
    const classifica = Object.entries(users)
        .filter(([id, u]) => u.pesca && u.pesca.totale > 0)
        .sort((a, b) => (b[1].pesca.totale || 0) - (a[1].pesca.totale || 0))
        .slice(0, 10)

    if (classifica.length === 0) {
        throw formatBox(' 🏆  𝒫𝑒𝓈𝒸𝒶 𝒯𝑜𝓅', [
            'Nessuno ha ancora pescato.'
        ])
    }

    let testo = '╭═━ 〖  🏆  𝒫𝑒𝓈𝒸𝒶 𝒯𝑜𝓅 〗═━⪩\n'
    const medaglie = ['🥇', '🥈', '🥉']

    classifica.forEach(([id, u], i) => {
        const medaglia = medaglie[i] || `${i + 1}.`
        const nome = '@' + id.split('@')[0]
        testo += `│❍ ${medaglia} ${nome} — ${u.pesca.totale} pesci\n`
    })

    testo += '╰━━━━━━━━━⪩'

    await conn.sendMessage(groupId, {
        text: testo,
        mentions: classifica.map(([id]) => id)
    }, { quoted: m })
}

async function handleCannaPesca(m, user, conn, userId, groupId) {
    const livelloAttuale = cannaLevel[userId] || 0
    const costoUpgrade = (livelloAttuale + 1) * 500

    if (m.text && m.text.split(' ')[1] === 'upgrade') {
        if ((user.limit || 0) < costoUpgrade) {
            throw formatBox(' 🎣  𝒞𝒶𝓃𝓃𝒶', [
                `Ti servono *${costoUpgrade} UC* per potenziare la canna.`,
                `Hai solo *${user.limit || 0} UC*`
            ])
        }

        if (livelloAttuale >= 5) {
            throw formatBox(' 🎣  𝒞𝒶𝓃𝓃𝒶', [
                'La tua canna è già al livello massimo.'
            ])
        }

        user.limit -= costoUpgrade
        cannaLevel[userId] = livelloAttuale + 1

        return conn.sendMessage(groupId, {
            text: formatBox(' ⬆️  𝒞𝒶𝓃𝓃𝒶 𝒫𝑜𝓉𝑒𝓃𝓏𝒾𝒶𝓉𝒶', [
                `Nuovo livello: *${livelloAttuale + 1}/5*`,
                `Bonus rarità: *+${(livelloAttuale + 1) * 2}%*`,
                `Speso: *${costoUpgrade} UC*`
            ])
        }, { quoted: m })
    }

    const prossimoCosto = livelloAttuale >= 5 ? 'MAX' : `${costoUpgrade} UC`

    await conn.sendMessage(groupId, {
        text: formatBox(' 🎣  𝒞𝒶𝓃𝓃𝒶 𝒟𝒶 𝒫𝑒𝓈𝒸𝒶', [
            `Livello: *${livelloAttuale}/5*`,
            `Bonus attuale: *+${livelloAttuale * 2}%*`,
            `Costo prossimo livello: *${prossimoCosto}*`,
            'Usa *.cannapesca upgrade*'
        ])
    }, { quoted: m })
}

async function handlePescaStat(m, user, conn, userId, groupId) {
    if (!user.pesca) user.pesca = { pesci: [], totale: 0 }
    if (!user.pescaCollezione) user.pescaCollezione = []

    const livelloCanna = cannaLevel[userId] || 0
    const totaleSpecie = pesci.length

    const testo = formatBox(' 📈  𝒮𝓉𝒶𝓉 𝒫𝑒𝓈𝒸𝒶', [
        `Pesci pescati totali: ${user.pesca.totale}`,
        `Pesci nel secchio: ${user.pesca.pesci.length}`,
        `Specie collezionate: ${user.pescaCollezione.length}/${totaleSpecie}`,
        `Livello canna: ${livelloCanna}/5`,
        `Saldo UC: ${user.limit || 0}`
    ])

    await conn.sendMessage(groupId, { text: testo }, { quoted: m })
}

function getMentioned(m) {
    return (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null
}

async function handleScambia(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🔄  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Non puoi scambiare con te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.pescaCollezione || !user.pescaCollezione.length) {
        throw formatBox(' 📔  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Non hai pesci nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.pescaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Numero non valido.'])
    }

    if (pendingTrades[target]) throw formatBox(' ⏳  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['L’utente ha già una proposta in sospeso.'])

    if (!users[target].pescaCollezione || !users[target].pescaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['L’altro utente non ha pesci in collezione.'])
    }

    const pesceOfferto = user.pescaCollezione[numero - 1]
    const tradeTimestamp = Date.now()

    pendingTrades[target] = {
        from: userId,
        pesce: pesceOfferto,
        indiceOrigine: numero - 1,
        timestamp: tradeTimestamp
    }

    await conn.sendMessage(groupId, {
        text: formatBox(' 🔄  𝒫𝓇𝑜𝓅𝑜𝓈𝓉𝒶 𝒟𝒾 𝒮𝒸𝒶𝓂𝒷𝒾𝑜', [
            `@${userId.split('@')[0]} offre ${raritàEmoji[pesceOfferto.rarità]} *${pesceOfferto.nome}*`,
            `Valore: *${pesceOfferto.valore} UC*`,
            `@${target.split('@')[0]} usa *.accettascambio <numero>* o *.rifiutascambio*`,
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

async function handleAccettaScambio(m, user, conn, userId, groupId, args, users) {
    const trade = pendingTrades[userId]
    if (!trade) throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Non hai proposte di scambio in sospeso.'])

    const numero = parseInt(args[0])

    if (!user.pescaCollezione || !user.pescaCollezione.length) {
        throw formatBox(' 📔  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Non hai pesci da offrire in cambio.'])
    }

    if (!numero || numero < 1 || numero > user.pescaCollezione.length) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Numero non valido.'])
    }

    const fromUser = users[trade.from]
    if (!fromUser || !fromUser.pescaCollezione || !fromUser.pescaCollezione[trade.indiceOrigine]) {
        delete pendingTrades[userId]
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Lo scambio non è più valido.'])
    }

    const pesceMio = user.pescaCollezione[numero - 1]
    const pesceSuo = fromUser.pescaCollezione[trade.indiceOrigine]

    user.pescaCollezione.splice(numero - 1, 1)
    fromUser.pescaCollezione.splice(trade.indiceOrigine, 1)

    user.pescaCollezione.push(pesceSuo)
    fromUser.pescaCollezione.push(pesceMio)

    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🤝  𝒮𝒸𝒶𝓂𝒷𝒾𝑜 𝒞𝑜𝓂𝓅𝓁𝑒𝓉𝒶𝓉𝑜', [
            `@${trade.from.split('@')[0]} riceve ${raritàEmoji[pesceMio.rarità]} ${pesceMio.nome}`,
            `@${userId.split('@')[0]} riceve ${raritàEmoji[pesceSuo.rarità]} ${pesceSuo.nome}`
        ]),
        mentions: [trade.from, userId]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🤝', key: m.key } })
}

async function handleRifiutaScambio(m, conn, userId, groupId) {
    if (!pendingTrades[userId]) {
        throw formatBox(' ❌  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', ['Non hai nessuna proposta da rifiutare.'])
    }

    const trade = pendingTrades[userId]
    delete pendingTrades[userId]

    await conn.sendMessage(groupId, {
        text: formatBox(' 🚫  𝒮𝒸𝒶𝓂𝒷𝒾𝑜', [
            `@${userId.split('@')[0]} ha rifiutato lo scambio di @${trade.from.split('@')[0]}`
        ]),
        mentions: [userId, trade.from]
    }, { quoted: m })
}

async function handleRegala(m, user, conn, userId, groupId, args, users) {
    const target = getMentioned(m)
    if (!target) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶', ['Devi taggare un utente.'])
    if (target === userId) throw formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝒶', ['Non puoi regalare a te stesso.'])
    if (!users[target]) throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶', ['Quell’utente non è registrato.'])

    const numArg = args.find(a => /^\d+$/.test(a))
    const numero = parseInt(numArg)

    if (!user.pescaCollezione || !user.pescaCollezione.length) {
        throw formatBox(' 📔  𝑅𝑒𝑔𝒶𝓁𝒶', ['Non hai pesci nella collezione.'])
    }

    if (!numero || numero < 1 || numero > user.pescaCollezione.length) {
        throw formatBox(' ❌  𝑅𝑒𝑔𝒶𝓁𝒶', ['Numero non valido.'])
    }

    const [regalato] = user.pescaCollezione.splice(numero - 1, 1)

    if (!users[target].pescaCollezione) users[target].pescaCollezione = []
    users[target].pescaCollezione.push(regalato)

    await conn.sendMessage(groupId, {
        text: formatBox(' 🎁  𝑅𝑒𝑔𝒶𝓁𝑜', [
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
    if (!user || !user.pesca || user.pesca.pesci.length === 0) return

    if (command === 'vendipescerapido') {
        const ultimo = user.pesca.pesci.pop()
        user.limit = (user.limit || 0) + ultimo.valore

        await conn.sendMessage(m.chat, {
            text: formatBox(' 💰  𝒱𝑒𝓃𝒹𝒾𝓉𝒶 𝑅𝒶𝓅𝒾𝒹𝒶', [
                `Hai venduto *${ultimo.nome}* per *${ultimo.valore} UC*`,
                `Saldo: *${user.limit} UC*`
            ])
        }, { quoted: m })
    }

    if (command === 'collezionaultimo') {
        const ultimo = user.pesca.pesci[user.pesca.pesci.length - 1]
        if (!ultimo) return

        if (!user.pescaCollezione) user.pescaCollezione = []

        const giàPresente = user.pescaCollezione.some(p => p.nome === ultimo.nome)
        if (giàPresente) {
            await conn.sendMessage(m.chat, {
                text: formatBox(' 📔  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒', [
                    `*${ultimo.nome}* è già nella tua collezione.`
                ])
            }, { quoted: m })
        } else {
            user.pescaCollezione.push(ultimo)
            await conn.sendMessage(m.chat, {
                text: formatBox(' ✅  𝒞𝑜𝓁𝓁𝑒𝓏𝒾𝑜𝓃𝑒', [
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
    if (command === 'vendipescerapido' || command === 'collezionaultimo') {
        await handleBottoneRapido(m, conn, command, global.db.data.users)
        return true
    }
    return false
}

handler.help = [
    'pesca',
    'inventariopesca',
    'vendipesce',
    'collezione',
    'vendicollezione <numero>',
    'probabilità',
    'pescatop',
    'cannapesca',
    'pescastat',
    'scambia @utente <numero>',
    'accettascambio <numero>',
    'rifiutascambio',
    'regala @utente <numero>'
]
handler.tags = ['rpg', 'fun']
handler.command = /^(pesca|fish|inventariopesca|fishinv|vendipesce|sellfish|collezione|fishcollection|vendicollezione|sellcollection|probabilità|probabilita|pescaprob|pescatop|fishtop|cannapesca|fishrod|pescastat|fishstats|scambia|trade|accettascambio|accepttrade|rifiutascambio|declinetrade|regala|gift)$/i
handler.register = true
handler.group = true

export default handler
