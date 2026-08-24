let activeMath = {}

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const userId = m.sender
    const groupId = m.chat

    if (!text) {
        return m.reply(`Scegli difficoltà:\n- ${usedPrefix}mate facile\n- ${usedPrefix}mate medio\n- ${usedPrefix}mate estremo`)
    }

    const diff = text.toLowerCase()

    if (activeMath[userId]) {
        return m.reply("Hai già un esercizio attivo, rispondi prima a quello!")
    }

    let question = ''
    let result = 0
    let seconds = 15

    switch (diff) {
        case 'facile': {
            const a = rand(1, 20)
            const b = rand(1, 20)
            const op = pick(['+', '-'])
            question = `${a} ${op} ${b}`
            result = calc(a, op, b)
            seconds = 15
            break
        }

        case 'medio': {
            seconds = 12

            const mode = pick(['single', 'single', 'double'])

            if (mode === 'single') {
                const op = pick(['+', '-', '*', '*'])
                let a, b

                if (op === '*') {
                    a = rand(12, 35)
                    b = rand(6, 15)
                } else if (op === '+') {
                    a = rand(40, 180)
                    b = rand(20, 120)
                } else {
                    a = rand(80, 220)
                    b = rand(15, 140)
                    if (b > a) [a, b] = [b, a]
                }

                question = `${a} ${op} ${b}`
                result = calc(a, op, b)
            } else {
                const a = rand(15, 60)
                const b = rand(5, 20)
                const c = rand(2, 12)
                const op1 = pick(['+', '-'])
                const op2 = '*'

                question = `${a} ${op1} ${b} ${op2} ${c}`
                result = op1 === '+'
                    ? a + (b * c)
                    : a - (b * c)
            }

            break
        }

        case 'estremo': {
            seconds = 10

            const mode = pick(['double', 'double', 'triple', 'division'])

            if (mode === 'double') {
                const a = rand(40, 180)
                const b = rand(12, 40)
                const c = rand(6, 20)
                const pattern = pick([
                    'a + b * c',
                    'a - b * c',
                    'a * b - c',
                    'a * b + c'
                ])

                if (pattern === 'a + b * c') {
                    question = `${a} + ${b} * ${c}`
                    result = a + (b * c)
                } else if (pattern === 'a - b * c') {
                    question = `${a} - ${b} * ${c}`
                    result = a - (b * c)
                } else if (pattern === 'a * b - c') {
                    question = `${a} * ${b} - ${c}`
                    result = (a * b) - c
                } else {
                    question = `${a} * ${b} + ${c}`
                    result = (a * b) + c
                }
            } else if (mode === 'triple') {
                const a = rand(20, 80)
                const b = rand(4, 15)
                const c = rand(3, 12)
                const d = rand(2, 10)

                question = `${a} + ${b} * ${c} - ${d}`
                result = a + (b * c) - d
            } else {
                const b = rand(6, 18)
                const q = rand(12, 40)
                const a = b * q
                const c = rand(15, 80)
                const op = pick(['+', '-'])

                if (op === '+') {
                    question = `${a} / ${b} + ${c}`
                    result = (a / b) + c
                } else {
                    question = `${a} / ${b} - ${c}`
                    result = (a / b) - c
                }
            }

            break
        }

        default:
            return m.reply("Difficoltà non valida. Usa: facile | medio | estremo")
    }

    activeMath[userId] = {
        answer: result,
        difficulty: diff,
        timeout: setTimeout(() => {
            delete activeMath[userId]
            m.reply("⏳ Tempo scaduto! Nessun UC guadagnato.")
        }, seconds * 1000)
    }

    await conn.reply(
        groupId,
        `🧮 *Modalità:* ${diff}\nRisolvi entro *${seconds} secondi*:\n\n👉 *${question} = ?*`,
        m
    )
}

handler.before = async (m, { conn }) => {
    const userId = m.sender

    if (!activeMath[userId]) return

    const user = global.db.data.users[userId]
    if (!user) return

    const attempt = Number(m.text.trim())
    if (isNaN(attempt)) return

    const correct = activeMath[userId].answer
    const difficulty = activeMath[userId].difficulty

    clearTimeout(activeMath[userId].timeout)

    let reward = 300
    if (difficulty === 'medio') reward = 450
    if (difficulty === 'estremo') reward = 700

    if (attempt === correct) {
        user.limit = (user.limit || 0) + reward

        await conn.reply(
            m.chat,
            `🎉 Risposta corretta!\nHai guadagnato *+${reward} UC* 💰`,
            m
        )
    } else {
        await conn.reply(
            m.chat,
            `❌ Risposta sbagliata!\nLa risposta corretta era: *${correct}*`,
            m
        )
    }

    delete activeMath[userId]
}

handler.help = ['mate <facile|medio|estremo>']
handler.tags = ['fun']
handler.command = /^mate$/i

export default handler

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function calc(a, op, b) {
    if (op === '+') return a + b
    if (op === '-') return a - b
    if (op === '*') return a * b
    if (op === '/') return a / b
    return 0
}
