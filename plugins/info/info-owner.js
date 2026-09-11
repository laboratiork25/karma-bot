import fs from 'fs'

async function handler(m, { conn }) {
    // guard contro global.owner undefined/non-array
    const ownerList = Array.isArray(global.owner) ? global.owner : []

    // struttura corretta: [id, name, isCreator]
    const data = ownerList.filter(([id, name, isCreator]) => id && isCreator)

    if (data.length === 0) {
        return conn.reply(m.chat, '❌ Nessun owner configurato in *global.owner*.', m)
    }

    const quoted = {
        key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            id: 'ChatUnityOwner'
        },
        message: {
            locationMessage: {
                name: '✦ ₭𐌀Ɽ₥𐌀 • Owner Panel',
                jpegThumbnail: fs.existsSync('./media/fallback.png')
                    ? fs.readFileSync('./media/fallback.png')
                    : undefined
            }
        }
    }

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${data.length} Owner`,
            contacts: data.map(([id, name]) => {
                const number = id.replace(/[^0-9]/g, '')
                return {
                    displayName: name || id,
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:${name || 'Owner'};;;
FN:${name || 'Owner'}
TEL;type=CELL;type=VOICE;waid=${number}:${number}
END:VCARD`
                }
            })
        }
    }, { quoted })
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = /^(padroni|proprietario|owner)$/i

export default handler