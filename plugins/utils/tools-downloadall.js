import axios from 'axios'

const API_BASE = 'https://api.chatunity.it/api/download'

async function downloadMedia(url) {
    const { data } = await axios.post(API_BASE + '/all', {
        url: url,
        format: 'best'
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 60000
    })
    
    if (!data.ok) throw new Error(data.message || 'Download failed')
    return data
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text || !text.match(/^https?:\/\/[^\s]+$/)) {
            return m.reply(
                `📥 *Download All - ChatUnity*\n\nScarica video e immagini da TikTok, Pinterest, Instagram e altri.\n\n📝 *Utilizzo:*\n${usedPrefix + command} <url>\n\n📌 *Esempi:*\n${usedPrefix + command} https://tiktok.com/@user/video/...\n${usedPrefix + command} https://pinterest.com/pin/...\n${usedPrefix + command} https://instagram.com/reel/...\n\n⚡ *Powered by ChatUnity*`
            )
        }

        const url = text.trim()

        await m.reply('⏳ Download in corso...')

        const result = await downloadMedia(url)

        const downloadUrl = 'https://api.chatunity.it' + result.downloadUrl
        const fileName = result.fileName || 'download'
        const mediaType = result.mediaType || 'file'

        if (mediaType === 'video') {
            await conn.sendMessage(m.chat, {
                video: { url: downloadUrl },
                caption: `✅ *Download Completato!*\n\n📝 File: ${fileName}\n🔗 URL: ${url}\n\n⚡ *Powered by ChatUnity*`
            }, { quoted: m })
        } else if (mediaType === 'image') {
            await conn.sendMessage(m.chat, {
                image: { url: downloadUrl },
                caption: `✅ *Download Completato!*\n\n📝 File: ${fileName}\n🔗 URL: ${url}\n\n⚡ *Powered by ChatUnity*`
            }, { quoted: m })
        } else {
            await m.reply(`✅ *Download Completato!*\n\n📝 File: ${fileName}\n🔗 Download: ${downloadUrl}\n\n⚡ *Powered by ChatUnity*`)
        }

    } catch (e) {
        console.error('Download error:', e)
        const errorMessage = e.response?.data?.message || e.message || 'Errore sconosciuto'
        await m.reply(`❌ Errore: ${errorMessage}`)
    }
}

handler.command = /^(download|dl|tutti)$/i
handler.help = ['download <url>', 'dl <url>', 'tutti <url>']
handler.tags = ['downloader']
handler.limit = 5

export default handler