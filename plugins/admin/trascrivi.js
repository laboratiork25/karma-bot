import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'

const TEMP_DIR = path.join(process.cwd(), 'tmp', 'transcribe')
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true })

async function uploadFileToCDN(buffer, filename) {
    try {
        const form = new FormData()
        form.append('file', buffer, { filename: filename || 'audio.mp3' })
        form.append('type', 'permanent')
        const { data } = await axios.post('https://tmp.malvryx.dev/upload', form, {
            headers: form.getHeaders(),
            timeout: 30000
        })
        return data?.cdnUrl || data?.directUrl || null
    } catch (e) {
        console.error('Upload error:', e)
        return null
    }
}

async function transcribeAudio(audioUrl, scenario = 'auto') {
    const apiUrl = `https://api.omegatech.app/api/tools/audio-transcribe?audioUrl=${encodeURIComponent(audioUrl)}&scenario=${encodeURIComponent(scenario)}`
    const { data } = await axios.get(apiUrl, { timeout: 60000 })
    if (!data.success) throw new Error('Transcription failed')
    return data
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let audioUrl = null
        let scenario = 'auto'

        // Check for scenario parameter
        const scenarioMatch = text ? text.match(/--scenario\s+([^\s]+)/i) : null
        if (scenarioMatch) {
            scenario = scenarioMatch[1]
            text = text.replace(/--scenario\s+[^\s]+/i, '').trim()
        }

        // Check if replying to audio
        const quoted = m.quoted || m
        const isAudio = quoted.mimetype && quoted.mimetype.startsWith('audio/')
        const isVoice = quoted.mimetype && quoted.mimetype.includes('ogg')

        if (isAudio || isVoice) {
            const media = await quoted.download()
            const tempFile = path.join(TEMP_DIR, `audio_${Date.now()}.mp3`)
            fs.writeFileSync(tempFile, media)

            audioUrl = await uploadFileToCDN(media, `audio_${Date.now()}.mp3`)
            fs.unlinkSync(tempFile)

            if (!audioUrl) {
                return m.reply('❌ Upload audio fallito. Riprova.')
            }
        }

        // Check if text is a URL
        if (text && text.match(/^https?:\/\/[^\s]+$/)) {
            audioUrl = text
        }

        // If no audio found
        if (!audioUrl) {
            return m.reply(
                `🎤 *Trascrizione Audio*\n\nTrascrivi file audio in testo usando l'AI.\n\n📝 *Utilizzo:*\n${usedPrefix + command} (rispondi ad audio)\n${usedPrefix + command} <audio_url>\n\n📌 *Esempi:*\n${usedPrefix + command} (rispondi a messaggio vocale)\n${usedPrefix + command} https://example.com/audio.mp3\n${usedPrefix + command} <url> --scenario meeting\n\n🎯 *Scenari:* auto, meeting, interview, lecture, ecc.`
            )
        }

        await m.reply('⏳ Trascrizione in corso...')

        const result = await transcribeAudio(audioUrl, scenario)

        const transcription = result.transcription || 'Nessuna trascrizione disponibile.'

        await conn.sendMessage(m.chat, {
            text: `📝 *Trascrizione:*\n\n${transcription}`
        }, { quoted: m })

    } catch (e) {
        console.error('Transcribe error:', e)
        await m.reply(`❌ Errore: ${e.message || 'Errore sconosciuto'}`)
    }
}

handler.command = /^(transcribe|transcript|trascrivi)$/i
handler.help = ['transcribe <audio_url>']
handler.tags = ['tools']
handler.limit = 5

export default handler