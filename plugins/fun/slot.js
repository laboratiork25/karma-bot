const cooldowns = new Map()

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender]
    const bet = args[0] ? parseInt(args[0]) : 20

    if (isNaN(bet) || bet <= 0) {
        return conn.reply(
            m.chat,
            formatBox(' 🎰  𝒮𝓁𝑜𝓉', [
                `Puntata non valida.`,
                `Usa: *${usedPrefix + command} numero*`
            ]),
            m
        )
    }

    if ((user.limit || 0) < bet) {
        return conn.reply(
            m.chat,
            formatBox(' 💸  𝒮𝓁𝑜𝓉', [
                `Non hai abbastanza UC.`,
                `Puntata: *${bet}* UC`
            ]),
            m
        )
    }

    const now = Date.now()
    const cooldownMs = 300000
    const lastUsed = cooldowns.get(m.sender) || 0

    if (now - lastUsed < cooldownMs) {
        const timeLeft = cooldownMs - (now - lastUsed)
        const min = Math.floor(timeLeft / 60000)
        const sec = Math.floor((timeLeft % 60000) / 1000)

        return conn.reply(
            m.chat,
            formatBox(' ⏳  𝒮𝓁𝑜𝓉', [
                `Devi aspettare *${min}m ${sec}s* prima di rigiocare.`
            ]),
            m
        )
    }

    user.exp = Number(user.exp) || 0
    user.level = Number(user.level) || 1
    user.limit = Number(user.limit) || 0

    const slots = ['🍒', '🍋', '🔔', '💎', '7️⃣', '🍀']
    const roll = [
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)],
        slots[Math.floor(Math.random() * slots.length)]
    ]

    const allEqual = roll[0] === roll[1] && roll[1] === roll[2]
    const twoEqual = roll[0] === roll[1] || roll[1] === roll[2] || roll[0] === roll[2]

    let resultLines = [`${roll.join(' │ ')}`]

    if (allEqual) {
        const winnings = bet * 2
        const xpWin = Math.floor(bet * 0.5)
        user.limit += winnings
        user.exp += xpWin

        resultLines.push('Jackpot centrato.')
        resultLines.push(`Hai vinto *${winnings} UC*.`)
        resultLines.push(`Hai guadagnato *${xpWin} XP*.`)
    } else if (twoEqual) {
        const winnings = Math.floor(bet * 1.2)
        const xpWin = Math.floor(bet * 0.2)
        user.limit += winnings
        user.exp += xpWin

        resultLines.push('Quasi jackpot.')
        resultLines.push(`Hai vinto *${winnings} UC*.`)
        resultLines.push(`Hai guadagnato *${xpWin} XP*.`)
    } else {
        const xpLoss = Math.floor(bet * 0.25)
        user.limit -= bet
        user.exp = Math.max(0, user.exp - xpLoss)

        resultLines.push('Hai perso il giro.')
        resultLines.push(`Hai perso *${bet} UC*.`)
        resultLines.push(`Hai perso *${xpLoss} XP*.`)
    }

    const { min: newMinXP, xp: newLevelXP } = xpRange(user.level, global.multiplier || 1)
    const currentLevelXP = user.exp - newMinXP

    resultLines.push(`Saldo UC: *${user.limit || 0}*`)
    resultLines.push(`XP: *${user.exp || 0}*`)
    resultLines.push(`Progresso livello: *${currentLevelXP}/${newLevelXP}*`)

    cooldowns.set(m.sender, now)

    await conn.reply(
        m.chat,
        formatBox(' 🎰  𝒮𝓁𝑜𝓉', resultLines),
        m
    )
}

handler.help = ['slot <bet>']
handler.tags = ['game']
handler.command = /^slot$/i

export default handler

function xpRange(level, multiplier = 1) {
    if (level < 0) level = 0
    const min = level === 0 ? 0 : Math.pow(level, 2) * 20
    const max = Math.pow(level + 1, 2) * 20
    const xp = Math.floor((max - min) * multiplier)
    return { min, xp, max }
}