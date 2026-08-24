const gameSessions = {}
let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const userId = m.sender
    const groupId = m.chat
    const tempoAttesa = 5

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoAttesa * 1000) {
        const tempoRimanente = secondiAHMS(Math.ceil((cooldowns[m.sender] + tempoAttesa * 1000 - Date.now()) / 1000))
        return m.reply(`╭═━ 〖  ⏳  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝒜𝓈𝓅𝑒𝓉𝓉𝒶 *${tempoRimanente}* 𝓅𝓇𝒾𝓂𝒶 𝒹𝒾 𝓇𝒾𝑔𝒾𝑜𝒸𝒶𝓇𝑒.
╰━━━━━━━━━⪩`)
    }

    const validChoices = ['testa', 'croce', 'heads', 'tails']
    let normalizedText = text?.toLowerCase()

    if (normalizedText === 'heads') normalizedText = 'testa'
    if (normalizedText === 'tails') normalizedText = 'croce'

    if (!text || validChoices.includes(normalizedText)) {
        if (!gameSessions[m.chat]) {
            if (!text) {
                return conn.sendMessage(m.chat, {
                    text: `╭═━ 〖  🪙  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ @${m.sender.split('@')[0]} 𝓈𝒸𝑒𝑔𝓁𝒾 *𝓉𝑒𝓈𝓉𝒶* 𝑜 *𝒸𝓇𝑜𝒸𝑒*.
│❍ 𝒫𝓊𝓃𝓉𝒶𝓉𝒶 𝒻𝒾𝓈𝓈𝒶: *250 UC*
╰━━━━━━━━━⪩`,
                    buttons: [
                        { buttonId: `${usedPrefix}${command} testa`, buttonText: { displayText: ' 🪙  𝒯𝑒𝓈𝓉𝒶' }, type: 1 },
                        { buttonId: `${usedPrefix}${command} croce`, buttonText: { displayText: ' 🪙  𝒞𝓇𝑜𝒸𝑒' }, type: 1 }
                    ],
                    footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅',
                    mentions: [m.sender]
                }, { quoted: m })
            }

            gameSessions[m.chat] = {
                player1: m.sender,
                choice1: normalizedText,
                player2: null,
                choice2: null,
                status: 'waiting'
            }

            return conn.sendMessage(m.chat, {
                text: `╭═━ 〖  🪙  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ @${m.sender.split('@')[0]} 𝒽𝒶 𝓈𝒸𝑒𝓁𝓉𝑜 *${normalizedText}*
│❍ 𝒜𝓉𝓉𝑒𝓃𝒹𝑜 𝒾𝓁 𝓈𝑒𝒸𝑜𝓃𝒹𝑜 𝑔𝒾𝑜𝒸𝒶𝓉𝑜𝓇𝑒.
╰━━━━━━━━━⪩`,
                buttons: [
                    { buttonId: `${usedPrefix}${command} testa`, buttonText: { displayText: ' 🪙  𝒯𝑒𝓈𝓉𝒶' }, type: 1 },
                    { buttonId: `${usedPrefix}${command} croce`, buttonText: { displayText: ' 🪙  𝒞𝓇𝑜𝒸𝑒' }, type: 1 }
                ],
                footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅',
                mentions: [m.sender]
            }, { quoted: m })
        } else {
            const session = gameSessions[m.chat]

            if (session.status === 'waiting' && m.sender !== session.player1) {
                if (!validChoices.includes(normalizedText)) {
                    return conn.reply(m.chat, `╭═━ 〖  ❌  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝒮𝒸𝑒𝓁𝓉𝒶 𝓃𝑜𝓃 𝓋𝒶𝓁𝒾𝒹𝒶.
│❍ 𝒮𝒸𝓇𝒾𝓋𝒾 *${usedPrefix + command} testa* 𝑜 *${usedPrefix + command} croce*
╰━━━━━━━━━⪩`, m)
                }

                if ((global.db.data.users[session.player1]?.limit || 0) < 250) {
                    delete gameSessions[m.chat]
                    return conn.reply(m.chat, `╭═━ 〖  ❌  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ @${session.player1.split('@')[0]} 𝓃𝑜𝓃 𝒽𝒶 𝒶𝒷𝒷𝒶𝓈𝓉𝒶𝓃𝓏𝒶 UC.
╰━━━━━━━━━⪩`, m, { mentions: [session.player1] })
                }

                if ((global.db.data.users[m.sender]?.limit || 0) < 250) {
                    return conn.reply(m.chat, `╭═━ 〖  ❌  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝒩𝑜𝓃 𝒽𝒶𝒾 𝒶𝒷𝒷𝒶𝓈𝓉𝒶𝓃𝓏𝒶 UC 𝓅𝑒𝓇 𝑔𝒾𝑜𝒸𝒶𝓇𝑒.
╰━━━━━━━━━⪩`, m)
                }

                session.player2 = m.sender
                session.choice2 = normalizedText
                session.status = 'ready'

                await conn.sendMessage(m.chat, {
                    react: { text: '🪙', key: m.key }
                })

                const risultato = Math.random() < 0.5 ? 'testa' : 'croce'
                const vincitore1 = session.choice1 === risultato
                const vincitore2 = session.choice2 === risultato

                let messaggio = ''

                if (vincitore1) {
                    global.db.data.users[session.player1].limit += 500
                    messaggio += `│❍ ✅ @${session.player1.split('@')[0]} 𝒽𝒶 𝓋𝒾𝓃𝓉𝑜 *500 UC*\n`
                } else {
                    global.db.data.users[session.player1].limit -= 250
                    messaggio += `│❍ ❌ @${session.player1.split('@')[0]} 𝒽𝒶 𝓅𝑒𝓇𝓈𝑜 *250 UC*\n`
                }

                if (vincitore2) {
                    global.db.data.users[session.player2].limit += 500
                    messaggio += `│❍ ✅ @${session.player2.split('@')[0]} 𝒽𝒶 𝓋𝒾𝓃𝓉𝑜 *500 UC*\n`
                } else {
                    global.db.data.users[session.player2].limit -= 250
                    messaggio += `│❍ ❌ @${session.player2.split('@')[0]} 𝒽𝒶 𝓅𝑒𝓇𝓈𝑜 *250 UC*\n`
                }

                conn.sendMessage(m.chat, {
                    text: `╭═━ 〖  🪙  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝑅𝒾𝓈𝓊𝓁𝓉𝒶𝓉𝑜: *${risultato}*
│❍ 𝒢𝒾𝑜𝒸𝒶𝓉𝑜𝓇𝒾: @${session.player1.split('@')[0]} 𝓋𝓈 @${session.player2.split('@')[0]}
${messaggio}╰━━━━━━━━━⪩`,
                    mentions: [session.player1, session.player2],
                    footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅'
                }, { quoted: m })

                cooldowns[session.player1] = Date.now()
                cooldowns[session.player2] = Date.now()
                delete gameSessions[m.chat]
                return
            }

            if (session.status === 'waiting' && m.sender === session.player1) {
                return m.reply(`╭═━ 〖  ℹ️  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝐻𝒶𝒾 𝑔𝒾à 𝓈𝒸𝑒𝓁𝓉𝑜 *${session.choice1}*.
╰━━━━━━━━━⪩`)
            }

            return conn.reply(m.chat, `╭═━ 〖  ⚠️  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝒬𝓊𝑒𝓈𝓉𝒶 𝓅𝒶𝓇𝓉𝒾𝓉𝒶 𝓃𝑜𝓃 è 𝒹𝒾𝓈𝓅𝑜𝓃𝒾𝒷𝒾𝓁𝑒 𝓅𝑒𝓇 𝓉𝑒.
│❍ 𝒜𝓋𝓋𝒾𝒶 𝓊𝓃𝒶 𝓃𝓊𝑜𝓋𝒶 𝓅𝒶𝓇𝓉𝒾𝓉𝒶 𝒸𝑜𝓃 *${usedPrefix + command}*
╰━━━━━━━━━⪩`, m)
        }
    }

    return conn.reply(m.chat, `╭═━ 〖  ❌  𝒞𝑜𝒾𝓃 𝐹𝓁𝒾𝓅 〗═━⪩
│❍ 𝒮𝒸𝑒𝓁𝓉𝒶 𝓃𝑜𝓃 𝓋𝒶𝓁𝒾𝒹𝒶.
│❍ 𝒰𝓈𝒶 *${usedPrefix + command} testa* 𝑜 *${usedPrefix + command} croce*
╰━━━━━━━━━⪩`, m)
}

function secondiAHMS(secondi) {
    return `${secondi % 60}s`
}

handler.help = ['moneta', 'coinflip', 'cf']
handler.tags = ['game']
handler.command = /^(cf|flip|moneta|coinflip)$/i
handler.register = true

export default handler