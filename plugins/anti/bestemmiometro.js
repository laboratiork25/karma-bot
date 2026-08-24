const bestemmiaGradi = [
    { min: 1, max: 24, nome: '𝒫𝑒𝒸𝒸𝒶𝓉𝑜𝓇𝑒 𝒪𝒸𝒸𝒶𝓈𝒾𝑜𝓃𝒶𝓁𝑒', emoji: '😐' },
    { min: 25, max: 49, nome: '𝐸𝓂𝓅𝒾𝑜 𝑅𝑒𝒸𝒾𝒹𝒾𝓋𝑜', emoji: '😶‍🌫️' },
    { min: 50, max: 74, nome: '𝐵𝓁𝒶𝓈𝒻𝑒𝓂𝑜 𝐼𝓃𝒾𝓏𝒾𝒶𝓉𝑜', emoji: '🩸' },
    { min: 75, max: 99, nome: '𝐸𝓇𝑒𝓉𝒾𝒸𝑜 𝒞𝑜𝓃𝓈𝒶𝒸𝓇𝒶𝓉𝑜', emoji: '🔥' },
    { min: 100, max: 149, nome: '𝒮𝒸𝑜𝓂𝓊𝓃𝒾𝒸𝒶𝓉𝑜 𝒰𝒻𝒻𝒾𝒸𝒾𝒶𝓁𝑒', emoji: '🕯️' },
    { min: 150, max: 299, nome: '𝒫𝓇𝑜𝒻𝒶𝓃𝒶𝓉𝑜𝓇𝑒 𝒮𝓊𝓅𝓇𝑒𝓂𝑜', emoji: '⚰️' },
    { min: 300, max: Infinity, nome: '𝒜𝓋𝒶𝓉𝒶𝓇 𝒹𝑒𝓁𝓁𝒶 𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝒶', emoji: '⛧' }
]

const bestemmieRegex = /\b(?:porc[o0]\s*[-_.]*\s*di[o0]|porc[o0]d[i1]o|porc[o0]\s*[-_.]*\s*dd[i1]o|di[o0]\s*[-_.]*\s*can[e3]|di[o0]can[e3]|di[o0]\s*[-_.]*\s*bastard[o0]|di[o0]\s*[-_.]*\s*crist[o0]|di[o0]crist[o0]|crist[o0]\s*[-_.]*\s*madonn[a4]|di[o0]\s*[-_.]*\s*maial[e3]|di[o0]maial[e3]|madonn[a4]\s*[-_.]*\s*porc[a4]|porc[a4]\s*[-_.]*\s*madonn[a4]|madonn[a4]\s*[-_.]*\s*puttan[a4]|madonn[a4]\s*[-_.]*\s*troi[a4]|madonn[a4]\s*[-_.]*\s*vacc[a4]|madonn[a4]\s*[-_.]*\s*inculat[a4]|zoccol[a4]\s*[-_.]*\s*madonn[a4]|maremma\s*[-_.]*\s*maial[a4]|jes[uù]\s*[-_.]*\s*porc[o0]|di[o0]\s*[-_.]*\s*froci[o0]|di[o0]\s*[-_.]*\s*gay|di[o0]\s*[-_.]*\s*infuocat[o0]|di[o0]\s*[-_.]*\s*crocifissat[o0]|padr[e3]\s*[-_.]*\s*pi[o0]|di[o0]\s*[-_.]*\s*pentit[o0]|di[o0]\s*[-_.]*\s*stuprator[e3]\s*[-_.]*\s*di\s*[-_.]*\s*feti\s*[-_.]*\s*abortiti|di[o0]\s*[-_.]*\s*stuprator[e3]\s*[-_.]*\s*di\s*[-_.]*\s*femboy|di[o0]\s*[-_.]*\s*giocator[e3]\s*[-_.]*\s*accanit[o0]\s*[-_.]*\s*di\s*[-_.]*\s*call\s*[-_.]*\s*of\s*[-_.]*\s*duty)\b/iu
const BLASPHEMY_WINDOW = 15000
const BLASPHEMY_MAX_IN_WINDOW = 4
const BLASPHEMY_COOLDOWN = 45000
const BLASPHEMY_NOTICE_COOLDOWN = 12000

global.blasphemySpam = global.blasphemySpam || {}

function getJidUser(jid) {
    return typeof jid === 'string' ? jid.split('@')[0].split(':')[0] : ''
}

function getBlasphemySpamKey(chatId, sender) {
    return `${chatId}:${sender}`
}

function getBlasphemySpamState(chatId, sender) {
    const key = getBlasphemySpamKey(chatId, sender)
    if (!global.blasphemySpam[key]) {
        global.blasphemySpam[key] = {
            timestamps: [],
            cooldownUntil: 0,
            lastNoticeAt: 0
        }
    }
    return global.blasphemySpam[key]
}

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

async function shouldBlockBlasphemy(conn, m) {
    const state = getBlasphemySpamState(m.chat, m.sender)
    const now = Date.now()

    if (state.cooldownUntil > now) {
        if (now - state.lastNoticeAt >= BLASPHEMY_NOTICE_COOLDOWN) {
            state.lastNoticeAt = now
            const seconds = Math.ceil((state.cooldownUntil - now) / 1000)
            await conn.sendMessage(m.chat, {
                text: formatBox(' ⚠️  𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑜𝓂𝑒𝓉𝓇𝑜', [
                    '𝒜𝓃𝓉𝒾-𝓈𝓅𝒶𝓂 𝒶𝓉𝓉𝒾𝓋𝑜.',
                    `@${getJidUser(m.sender)} 𝒽𝒶𝒾 𝒾𝓃𝓋𝒾𝒶𝓉𝑜 𝓉𝓇𝑜𝓅𝓅𝑒 𝒷𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑒 𝒾𝓃 𝓅𝑜𝒸𝑜 𝓉𝑒𝓂𝓅𝑜.`,
                    `𝐼𝓁 𝒸𝑜𝓃𝓉𝒶𝓉𝑜𝓇𝑒 è 𝓈𝑜𝓈𝓅𝑒𝓈𝑜 𝓅𝑒𝓇 *${seconds} 𝓈𝑒𝒸𝑜𝓃𝒹𝒾*.`
                ]),
                mentions: [m.sender]
            }, { quoted: m }).catch(() => {})
        }
        return true
    }

    state.timestamps = state.timestamps.filter(ts => now - ts <= BLASPHEMY_WINDOW)
    state.timestamps.push(now)

    if (state.timestamps.length > BLASPHEMY_MAX_IN_WINDOW) {
        state.cooldownUntil = now + BLASPHEMY_COOLDOWN
        state.timestamps = []
        state.lastNoticeAt = now

        await conn.sendMessage(m.chat, {
            text: formatBox(' ⚠️  𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑜𝓂𝑒𝓉𝓇𝑜', [
                `@${getJidUser(m.sender)} 𝒽𝒶𝒾 𝓈𝓊𝓅𝑒𝓇𝒶𝓉𝑜 𝒾𝓁 𝓁𝒾𝓂𝒾𝓉𝑒.`,
                `𝒟𝒶 𝑜𝓇𝒶 𝓁𝑒 𝒷𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑒 𝓃𝑜𝓃 𝓋𝑒𝓇𝓇𝒶𝓃𝓃𝑜 𝒸𝑜𝓃𝓉𝒶𝓉𝑒 𝓅𝑒𝓇 *${Math.ceil(BLASPHEMY_COOLDOWN / 1000)} 𝓈𝑒𝒸𝑜𝓃𝒹𝒾*.`
            ]),
            mentions: [m.sender]
        }, { quoted: m }).catch(() => {})

        return true
    }

    return false
}

export async function before(m, { conn }) {
    const chat = global.db.data.chats[m.chat]
    if (!chat || chat.bestemmiometro !== true) return
    if (typeof m.text !== 'string' || !bestemmieRegex.test(m.text)) return

    const blocked = await shouldBlockBlasphemy(conn, m)
    if (blocked) return

    const user = global.db.data.users[m.sender]
    user.blasphemy = user.blasphemy || 0
    user.blasphemy += 1

    const grado = bestemmiaGradi.find(g => user.blasphemy >= g.min && user.blasphemy <= g.max) || {
        nome: '𝐸𝓇𝑒𝓈𝒾𝒶𝓇𝒸𝒶 𝒜𝓃𝑜𝓃𝒾𝓂𝑜',
        emoji: '❓'
    }

    const testo = `╭═━ 〖  🛐  𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑜𝓂𝑒𝓉𝓇𝑜 〗═━⪩
│❍ 𝒰𝓉𝑒𝓃𝓉𝑒: @${getJidUser(m.sender)}
│❍ 𝒞𝑜𝓃𝓉𝑒𝑔𝑔𝒾𝑜: *${user.blasphemy}*
│❍ 𝒢𝓇𝒶𝒹𝑜: *${grado.nome}* ${grado.emoji}
╰━━━━━━━━━⪩`

    await conn.sendMessage(m.chat, {
        text: testo,
        footer: '𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑜𝓂𝑒𝓉𝓇𝑜',
        buttons: [
            {
                buttonId: '.topbestemmie',
                buttonText: { displayText: ' 🏆  𝒯𝑜𝓅 𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑒' },
                type: 1
            }
        ],
        mentions: [m.sender]
    }, { quoted: m })
}