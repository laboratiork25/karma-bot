import axios from 'axios'

const API_BASE = 'https://api.omegatech.app/api/ai'

async function generateImage(prompt, imageUrl, retryCount = 0) {
    const apiUrl = `${API_BASE}/ai-nanobanana?action=generate&prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`
    console.log('[NANOBANANA] Generating image:', apiUrl)
    
    try {
        const { data } = await axios.get(apiUrl, { timeout: 120000 })
        if (!data.success) throw new Error(data.error || data.message || 'Image generation failed')
        return data
    } catch (e) {
        // Se è rate limit (429) o server error (500), retry dopo 3 secondi
        if ((e.response?.status === 429 || e.response?.status === 500) && retryCount < 3) {
            console.log(`[NANOBANANA] Rate limit/server error, retry ${retryCount + 1}/3...`)
            await new Promise(resolve => setTimeout(resolve, 3000))
            return generateImage(prompt, imageUrl, retryCount + 1)
        }
        throw e
    }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            return m.reply(
                `🎨 *AI Nanobanana - Image Editor*\n\nModifica immagini con l'AI usando prompt testuali.\n\n📝 *Utilizzo:*\n${usedPrefix + command} <prompt> (rispondi a immagine)\n${usedPrefix + command} <prompt> <image_url>\n\n📌 *Esempi:*\n${usedPrefix + command} make it black and white (rispondi a foto)\n${usedPrefix + command} turn into anime style https://example.com/image.jpg\n${usedPrefix + command} add sunglasses\n${usedPrefix + command} make it look like a painting\n\n💡 *Prompt suggeriti:*\n- make it black and white\n- turn into anime style\n- add cyberpunk effects\n- make it look vintage\n- add neon glow\n- convert to watercolor painting\n- make it look like 3D render\n\n⚠️ *Nota:* Se l'API è sovraccarica, riprova tra qualche secondo.\n\n⚡ *Powered by Omegatech AI*`
            )
        }

        let imageUrl = null

        // Check if replying to image
        const quoted = m.quoted || m
        const isImage = quoted.mimetype && quoted.mimetype.startsWith('image/')
        
        if (isImage) {
            await m.reply('📤 Download immagine...')
            const media = await quoted.download()
            
            // Upload to temporary CDN
            const FormData = (await import('form-data')).default
            const form = new FormData()
            form.append('file', media, { filename: 'image.jpg' })
            form.append('type', 'permanent')
            
            const uploadResponse = await axios.post('https://tmp.malvryx.dev/upload', form, {
                headers: form.getHeaders(),
                timeout: 30000
            })
            
            imageUrl = uploadResponse.data?.cdnUrl || uploadResponse.data?.directUrl
            
            if (!imageUrl) {
                return m.reply('❌ Upload immagine fallito. Riprova.')
            }
        }

        // Check if text contains URL
        const urlMatch = text.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
            imageUrl = urlMatch[0]
            text = text.replace(urlMatch[0], '').trim()
        }

        if (!imageUrl) {
            return m.reply('❌ Invia un\'immagine o fornisci un URL immagine.')
        }

        const prompt = text

        await m.reply('🎨 Generazione immagine in corso... Potrebbe richiedere qualche secondo.')

        const result = await generateImage(prompt, imageUrl)

        // Estrai URL corretto: data.generatedImage.url
        const generatedImageUrl = result.data?.generatedImage?.url

        if (!generatedImageUrl) {
            return m.reply(`❌ Errore: nessuna immagine generata.`)
        }

        await conn.sendMessage(m.chat, {
            image: { url: generatedImageUrl },
            caption: `🎨 *Risultato:*\n\n📝 Prompt: ${prompt}\n\n⚡ *Powered by Omegatech AI*`
        }, { quoted: m })

    } catch (e) {
        console.error('Nanobanana error:', e)
        
        // Messaggi di errore più specifici
        if (e.response?.status === 429) {
            return m.reply('⚠️ *Rate Limit*\n\nTroppe richieste in poco tempo. Attendi 10-20 secondi e riprova.')
        }
        if (e.response?.status === 500) {
            return m.reply('⚠️ *Server Error*\n\nL\'API è temporaneamente sovraccarica. Riprova tra qualche secondo.')
        }
        
        await m.reply(`❌ Errore: ${e.message || 'Errore sconosciuto'}`)
    }
}

handler.command = /^(nanobanana|editimage|aiimg|editimg)$/i
handler.help = ['nanobanana <prompt> (reply image)', 'nanobanana <prompt> <image_url>']
handler.tags = ['ai']
handler.limit = 10

export default handler