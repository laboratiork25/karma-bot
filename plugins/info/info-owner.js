import fs from 'fs'

async function handler(m, { conn }) {
    const data = global.owner.filter(([id, isCreator]) => id && isCreator)

    const vcard = data.map(([id, name]) => {
        return `BEGIN:VCARD
VERSION:3.0
N:${name || 'Owner'};;;
FN:${name || 'Owner'}
TEL;type=CELL;type=VOICE;waid=${id.replace(/[^0-9]/g, '')}:${id.replace(/[^0-9]/g, '')}
END:VCARD`
    }).join('\n')

    const quoted = {
        key: {
            fromMe: false,
            participant: '0@s.whatsapp.net',
            id: 'ChatUnityOwner'
        },
        message: {
            locationMessage: {
                name: '✦ ₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄 • Owner Panel',
                jpegThumbnail: fs.readFileSync('./media/fallback.png')
            }
        }
    }

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${data.length} Owner`,
            contacts: data.map(([id, name]) => ({
                displayName: name || id,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:${name || 'Owner'};;;
FN:${name || 'Owner'}
TEL;type=CELL;waid=${id.replace(/[^0-9]/g, '')}:${id.replace(/[^0-9]/g, '')}
END:VCARD`
            }))
        }
    }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = /^(padroni|proprietario|owner)$/i

export default handler