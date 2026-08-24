const features = [
    { key: 'antiLink', label: 'antilink' },
    { key: 'antiLinkHard', label: 'antilinkhard' },
    { key: 'antimedia', label: 'antimedia' },
    { key: 'antispamcomandi', label: 'antispamcomandi' },
    { key: 'welcome', label: 'benvenuto' },
    { key: 'bye', label: 'addio' },
    { key: 'antibot', label: 'antibot' },
    { key: 'antispam', label: 'antispam' },
    { key: 'sologruppo', label: 'sologruppo' },
    { key: 'soloprivato', label: 'soloprivato' },
    { key: 'soloadmin', label: 'soloadmin' },
    { key: 'isBanned', label: 'bangruppo' },
    { key: 'antinuke', label: 'antinuke' },
    { key: 'antiCall', label: 'anticall' },
    { key: 'antiinsta', label: 'antiinsta' },
    { key: 'antiporno', label: 'antiporno' },
    { key: 'chatbot', label: 'chatbot' },
    { key: 'antitrava', label: 'antitrava' },
    { key: 'antivirus', label: 'antivirus' },
    { key: 'antivoip', label: 'antivoip' },
    { key: 'antiArab', label: 'antiarab' },
    { key: 'antisondaggi', label: 'antisondaggi' },
    { key: 'antitiktok', label: 'antitiktok' },
    { key: 'bestemmiometro', label: 'bestemmiometro' },
    { key: 'chatbotPrivato', label: 'chatbotprivato', ownerOnly: true }
]

const formatList = () => features.map(f => `│❍ *${f.label}*`).join('\n')

const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, command, args, isOwner, isROwner }) => {
    const chats = global.db?.data?.chats || {}
    const chatData = chats[m.chat] || {}
    const featureArg = (args[0] || '').trim().toLowerCase()
    const selected = features.find(f => f.label.toLowerCase() === featureArg)

    if (!featureArg || !selected) {
        const title = featureArg ? '❌ Funzione non trovata' : '⚙️ Scegli una funzione'
        const intro = featureArg
            ? `La funzione *${featureArg}* non esiste.`
            : 'Scrivi il nome della funzione da gestire.'
        return conn.reply(m.chat, `${formatBox(title, [intro, 'Funzioni disponibili:'])}
${formatList()}`, m)
    }

    if (selected.ownerOnly && !(isOwner || isROwner)) {
        return conn.reply(m.chat, formatBox('🔒 Accesso negato', [
            'Solo il proprietario può usare questa funzione.'
        ]), m)
    }

    const isEnable = /^(attiva|on|enable|1|true|si|yes)$/i.test(command)
    const setTo = isEnable

    if (selected.key === 'chatbotPrivato') {
        if (m.isGroup) {
            return conn.reply(m.chat, formatBox('❌ Comando non disponibile', [
                'ChatbotPrivato si può usare solo in privato.'
            ]), m)
        }
        global.privateChatbot = global.privateChatbot || {}
        global.privateChatbot[m.sender] = setTo
    } else {
        chatData[selected.key] = setTo
        if (global.db?.data?.chats) global.db.data.chats[m.chat] = chatData
    }

    const currentState = selected.key === 'chatbotPrivato'
        ? !!global.privateChatbot?.[m.sender]
        : !!chatData[selected.key]

    const stateIcon = currentState ? '✅' : '❌'
    const stateText = currentState ? 'attivata' : 'disattivata'

    await conn.reply(m.chat, formatBox('⚙️ Stato funzione', [
        `${stateIcon} *${selected.label}* ${stateText}.`
    ]), m)
}

handler.help = ['attiva <funzione>', 'disabilita <funzione>', 'disattiva <funzione>']
handler.tags = ['impostazioni', 'owner']
handler.command = /^(attiva|disabilita|disattiva|on|off|enable|disable|1|0|true|false|si|no|yes)$/i
handler.group = true
handler.admin = true
handler.ownerOnly = false

export default handler
