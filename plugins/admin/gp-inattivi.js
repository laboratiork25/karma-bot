const formatBox = (title, lines) => `╭═━ 〖 ${title} 〗═━⪩
${lines.map(line => `│❍ ${line}`).join('\n')}
╰━━━━━━━━━⪩`

let handler = async (m, { conn, args, groupMetadata, isAdmin, isOwner }) => {
    await conn.sendPresenceUpdate('composing', m.chat)

    const userId = m.sender
    const groupId = m.isGroup ? m.chat : null

    const lama = 86400000 * 7
    const now = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })
    const milliseconds = new Date(now).getTime()

    const member = groupMetadata.participants.map(v => v.id)
    let total = 0
    const sider = []

    for (let i = 0; i < member.length; i++) {
        const users = groupMetadata.participants.find(u => u.id === member[i])
        if (
            (typeof global.db.data.users[member[i]] === 'undefined' ||
                milliseconds - global.db.data.users[member[i]].lastseen > lama) &&
            !users?.isAdmin &&
            !users?.isSuperAdmin
        ) {
            if (typeof global.db.data.users[member[i]] !== 'undefined') {
                if (global.db.data.users[member[i]].banned !== true) {
                    total++
                    sider.push(member[i])
                }
            } else {
                total++
                sider.push(member[i])
            }
        }
    }

    if (!args[0]) {
        const buttons = [
            {
                buttonId: '.inattivi lista',
                buttonText: { displayText: ' 📋  𝓛𝒾𝓈𝓉𝒶' },
                type: 1
            },
            {
                buttonId: '.inattivi rimuovi',
                buttonText: { displayText: ' 🗑️  𝑅𝒾𝓂𝓊𝑜𝓋𝒾' },
                type: 1
            }
        ]

        const buttonMessage = {
            text: formatBox(' 👥  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                `𝒰𝓉𝑒𝓃𝓉𝒾 𝒾𝓃𝒶𝓉𝓉𝒾𝓋𝒾 𝓉𝓇𝑜𝓋𝒶𝓉𝒾: *${total}*`,
                `𝑀𝑒𝓂𝒷𝓇𝒾 𝓉𝑜𝓉𝒶𝓁𝒾: *${member.length}*`
            ]),
            footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
            buttons,
            headerType: 1
        }
        return conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    }

    if (args[0] === 'lista') {
        if (!isAdmin && !isOwner) {
            return conn.reply(m.chat, formatBox(' 🔒  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                'Solo admin o owner possono vedere questa lista.'
            ]), m)
        }

        if (total === 0) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ✅  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                    'Nessun utente inattivo trovato.'
                ]),
                footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
                buttons: [{
                    buttonId: '.inattivi',
                    buttonText: { displayText: ' ↩️  𝐼𝓃𝒹𝒾𝑒𝓉𝓇𝑜' },
                    type: 1
                }],
                headerType: 1
            }, { quoted: m })
        }

        const groupName = await conn.getName(m.chat)
        const message = `╭═━ 〖  📋  𝐿𝒾𝓈𝓉𝒶 𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾 〗═━⪩
│❍ 𝒢𝓇𝓊𝓅𝓅𝑜: *${groupName}*
│❍ 𝒯𝑜𝓉𝒶𝓁𝑒 𝒾𝓃𝒶𝓉𝓉𝒾𝓋𝒾: *${total}*
│
${sider.map((v, i) => `│❍ ${i + 1}. @${v.replace(/@.+/, '')}`).join('\n')}
╰━━━━━━━━━⪩`

        return conn.sendMessage(m.chat, {
            text: message,
            footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
            buttons: [
                {
                    buttonId: '.inattivi rimuovi',
                    buttonText: { displayText: ' 🗑️  𝑅𝒾𝓂𝓊𝑜𝓋𝒾' },
                    type: 1
                },
                {
                    buttonId: '.inattivi',
                    buttonText: { displayText: ' ↩️  𝐼𝓃𝒹𝒾𝑒𝓉𝓇𝑜' },
                    type: 1
                }
            ],
            headerType: 1,
            contextInfo: { mentionedJid: sider }
        }, { quoted: m })
    }

    if (args[0] === 'rimuovi') {
        if (!isOwner && !isAdmin) {
            return conn.reply(m.chat, formatBox(' 🔒  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                'Solo admin o owner possono rimuovere utenti inattivi.'
            ]), m)
        }

        if (total === 0) {
            return conn.sendMessage(m.chat, {
                text: formatBox(' ✅  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                    'Non ci sono utenti inattivi da rimuovere.'
                ]),
                footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
                buttons: [{
                    buttonId: '.inattivi',
                    buttonText: { displayText: ' ↩️  𝐼𝓃𝒹𝒾𝑒𝓉𝓇𝑜' },
                    type: 1
                }],
                headerType: 1
            }, { quoted: m })
        }

        return conn.sendMessage(m.chat, {
            text: formatBox(' ⚠️  𝑅𝒾𝓂𝑜𝓏𝒾𝑜𝓃𝑒 𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                `Stai per rimuovere *${total}* utenti inattivi.`,
                'Premi conferma per continuare.'
            ]),
            footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
            buttons: [
                {
                    buttonId: '.inattivi conferma',
                    buttonText: { displayText: ' ✅  𝒞𝑜𝓃𝒻𝑒𝓇𝓂𝒶' },
                    type: 1
                },
                {
                    buttonId: '.inattivi',
                    buttonText: { displayText: ' ❌  𝒜𝓃𝓃𝓊𝓁𝓁𝒶' },
                    type: 1
                }
            ],
            headerType: 1
        }, { quoted: m })
    }

    if (args[0] === 'conferma') {
        if (!isOwner && !isAdmin) {
            return conn.reply(m.chat, formatBox(' 🔒  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                'Solo admin o owner possono confermare la rimozione.'
            ]), m)
        }

        if (total === 0) {
            return conn.reply(m.chat, formatBox(' ✅  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
                'Non ci sono utenti inattivi da rimuovere.'
            ]), m)
        }

        let removedCount = 0
        const errors = []

        for (const user of sider) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                removedCount++
            } catch {
                errors.push(user)
            }
        }

        const successMessage = removedCount > 0
            ? formatBox(' 🗑️  𝑅𝒾𝓈𝓊𝓁𝓉𝒶𝓉𝑜', [
                `Utenti rimossi: *${removedCount}*`,
                `Errori: *${errors.length}*`
            ])
            : formatBox(' ℹ️  𝑅𝒾𝓈𝓊𝓁𝓉𝒶𝓉𝑜', [
                'Nessun utente è stato rimosso.'
            ])

        return conn.sendMessage(m.chat, {
            text: successMessage,
            footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
            buttons: [{
                buttonId: '.inattivi',
                buttonText: { displayText: ' ↩️  𝐼𝓃𝒹𝒾𝑒𝓉𝓇𝑜' },
                type: 1
            }],
            headerType: 1
        }, { quoted: m })
    }

    return conn.sendMessage(m.chat, {
        text: formatBox(' ❌  𝐼𝓃𝒶𝓉𝓉𝒾𝓋𝒾', [
            'Opzione non riconosciuta.'
        ]),
        footer: '𝒞𝒽𝒶𝓉𝒰𝓃𝒾𝓉𝓎 𝑀𝑜𝒹𝑒𝓇𝒶𝓉𝒾𝑜𝓃',
        buttons: [{
            buttonId: '.inattivi',
            buttonText: { displayText: ' ↩️  𝐼𝓃𝒹𝒾𝑒𝓉𝓇𝑜' },
            type: 1
        }],
        headerType: 1
    }, { quoted: m })
}

handler.help = [
    'inattivi',
    'inactive',
    'inactivos',
    'inactivo',
    'inativos',
    'inativo',
    'inaktiv',
    'inaktive'
]
handler.tags = ['group']
handler.command = /^(inattivi|inactive)$/i
handler.group = true
handler.moderator = true
handler.owner = false
handler.botAdmin = true

export default handler