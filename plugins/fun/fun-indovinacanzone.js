import axios from 'axios'
import fs from 'fs'
import path from 'path'

function normalize(str) {
    if (!str) return ''
    str = str
        .split(/\s*[\(\[{](?:feat|ft|featuring).*$/i)[0]
        .split(/\s*(?:feat|ft|featuring)\.?\s+.*$/i)[0]

    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function similarity(str1, str2) {
    const words1 = str1.split(' ').filter(Boolean)
    const words2 = str2.split(' ').filter(Boolean)

    const matches = words1.filter(word =>
        words2.some(w2 => w2.includes(word) || word.includes(w2))
    )

    return matches.length / Math.max(words1.length, words2.length, 1)
}

async function getRandomTrackFromItunes(artistQuery = '') {
    const keywords = [
        'Lazza', 'Melons', 'Sayf', 'Sfera Ebbasta', 'Ghali', 'Baby Gang', 'Shiva', 'Drake', 'Tony Boy',
        'Kid Yugi', '21 Savage', 'Marracash', 'Capo Plaza', 'Guè Pequeno', 'King Von', 'Chief Keef',
        'Lil Durk', 'Tha Supreme', 'Gemitaiz', 'Fabri Fibra', 'Simba La Rue', 'Il Tre', 'Rondo Da Sosa',
        'Drefgold', 'Noyz Narcos', 'Salmo', 'Clementino', 'Rocco Hunt', 'Luchè', 'Enzo Dong',
        'Calcutta', 'Gazzelle', 'Ariete'
    ]

    let found = null
    let tentativi = 0
    const requestedArtist = normalize(artistQuery)

    while (!found && tentativi < 5) {
        const term = artistQuery?.trim()
            ? artistQuery.trim()
            : keywords[Math.floor(Math.random() * keywords.length)]

        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term,
                country: 'IT',
                media: 'music',
                entity: 'song',
                limit: 50
            }
        })

        let valid = response.data.results.filter(
            b => b.previewUrl && b.trackName && b.artistName && b.artworkUrl100
        )

        if (requestedArtist) {
            valid = valid.filter(track => {
                const artistName = normalize(track.artistName)
                return (
                    artistName === requestedArtist ||
                    artistName.includes(requestedArtist) ||
                    requestedArtist.includes(artistName) ||
                    similarity(artistName, requestedArtist) >= 0.6
                )
            })
        }

        if (valid.length) {
            found = valid[Math.floor(Math.random() * valid.length)]
        }

        tentativi++
    }

    if (!found) {
        throw new Error(
            artistQuery
                ? `Nessun brano trovato per l'artista: ${artistQuery}`
                : 'Track non trovato'
        )
    }

    return {
        title: found.trackName,
        artist: found.artistName,
        preview: found.previewUrl,
        artwork: found.artworkUrl100.replace('100x100bb', '600x600bb'),
        requestedArtist: artistQuery?.trim() || null
    }
}

const activeGames = new Map()

const playAgainButton = {
    buttonId: '.ic',
    buttonText: { displayText: ' 🔁  𝒢𝒾𝑜𝒸𝒶 𝒶𝓃𝒸𝑜𝓇𝒶' },
    type: 1
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, text }) => {
    const chat = m.chat
    const artistQuery = (text || '').trim()

    if (activeGames.has(chat)) {
        return m.reply(formatBox(' 🎵  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', [
            'C’è già una partita attiva in questa chat.'
        ]))
    }

    try {
        const track = await getRandomTrackFromItunes(artistQuery)
        const audioResponse = await axios.get(track.preview, { responseType: 'arraybuffer' })

        const tmpDir = path.join(process.cwd(), 'temp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

        const audioPath = path.join(tmpDir, `song_${Date.now()}.mp3`)
        fs.writeFileSync(audioPath, Buffer.from(audioResponse.data))

        const introLines = track.requestedArtist
            ? [
                `Artista scelto: *${track.artist}*`,
                'Hai *30 secondi*.',
                'Rispondi con il *titolo* della canzone.'
            ]
            : [
                `Artista: *${track.artist}*`,
                'Hai *30 secondi*.',
                'Indovina titolo o artista.'
            ]

        await conn.sendMessage(m.chat, {
            text: formatBox(' 🎵  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', introLines),
            contextInfo: {
                externalAdReply: {
                    title: '𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝓁𝒶 𝒸𝒶𝓃𝓏𝑜𝓃𝑒',
                    body: track.requestedArtist ? `Modalità artista: ${track.artist}` : `Artista: ${track.artist}`,
                    thumbnailUrl: track.artwork,
                    sourceUrl: track.preview,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })

        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })

        fs.unlinkSync(audioPath)

        const game = {
            track,
            timeLeft: 30,
            artistMode: !!track.requestedArtist,
            interval: null
        }

        game.interval = setInterval(async () => {
            game.timeLeft -= 5

            if (game.timeLeft <= 0) {
                clearInterval(game.interval)
                activeGames.delete(chat)

                await conn.sendMessage(m.chat, {
                    text: formatBox(' ⏰  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', [
                        `Tempo scaduto.`,
                        `Titolo: *${track.title}*`,
                        `Artista: *${track.artist}*`
                    ]),
                    buttons: [playAgainButton],
                    headerType: 1
                }).catch(() => {})

                return
            }
        }, 5000)

        activeGames.set(chat, game)
    } catch (e) {
        console.error('Errore in indovina canzone:', e)
        m.reply(
            artistQuery
                ? formatBox(' ❌  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', [
                    `Non ho trovato anteprime valide per *${artistQuery}*.`,
                    'Prova con un altro artista.'
                ])
                : formatBox(' ❌  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', [
                    'Non sono riuscito ad avviare il gioco.'
                ])
        )
        activeGames.delete(chat)
    }
}

handler.before = async (m, { conn }) => {
    const chat = m.chat
    if (!activeGames.has(chat)) return
    if (!m.text) return
    if (/^[./#!]/.test(m.text)) return

    const game = activeGames.get(chat)
    const userAnswer = normalize(m.text)
    const correctTitle = normalize(game.track.title)
    const correctArtist = normalize(game.track.artist)

    if (!userAnswer || userAnswer.length < 2) return

    const titleSimilarity = similarity(userAnswer, correctTitle)
    const artistSimilarity = similarity(userAnswer, correctArtist)

    const isTitleCorrect =
        userAnswer === correctTitle ||
        (correctTitle.includes(userAnswer) && userAnswer.length > correctTitle.length * 0.5) ||
        (userAnswer.includes(correctTitle) && userAnswer.length < correctTitle.length * 1.5) ||
        titleSimilarity >= 0.7

    const isArtistCorrect =
        userAnswer === correctArtist ||
        (correctArtist.includes(userAnswer) && userAnswer.length > correctArtist.length * 0.5) ||
        (userAnswer.includes(correctArtist) && userAnswer.length < correctArtist.length * 1.5) ||
        artistSimilarity >= 0.7

    const isCorrect = game.artistMode ? isTitleCorrect : (isTitleCorrect || isArtistCorrect)

    if (isCorrect) {
        clearInterval(game.interval)
        activeGames.delete(chat)

        const reward = Math.floor(Math.random() * 100) + 50
        const exp = 500

        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
        global.db.data.users[m.sender].limit = (global.db.data.users[m.sender].limit || 0) + reward
        global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + exp

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        }).catch(() => {})

        await conn.sendMessage(m.chat, {
            text: formatBox(' ✅  𝐼𝓃𝒹𝑜𝓋𝒾𝓃𝒶 𝒞𝒶𝓃𝓏𝑜𝓃𝑒', [
                `Titolo: *${game.track.title}*`,
                `Artista: *${game.track.artist}*`,
                `Ricompensa: *${reward}* limit`,
                `EXP: *${exp}*`
            ]),
            buttons: [playAgainButton],
            headerType: 1
        }, { quoted: m }).catch(() => {})
        return
    }

    if (titleSimilarity >= 0.3 || (!game.artistMode && artistSimilarity >= 0.3)) {
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        }).catch(() => {})

        await conn.reply(m.chat, '🤏 𝒞𝒾 𝓈𝑒𝒾 𝓆𝓊𝒶𝓈𝒾.', m)
    }
}

handler.help = [
    'indovinacanzone',
    'ic',
    'ic <artista>'
]
handler.tags = ['game']
handler.command = /^(indovinacanzone|ic)$/i
handler.register = true
handler.group = true

export default handler