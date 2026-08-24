import Jimp from 'jimp'
import fs from 'fs'
import path from 'path'
import { sticker } from '../../lib/sticker.js'

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('✳️ Esempio:\n.brat ora ci sono io')
    }

    try {
        const size = 512
        const img = new Jimp(size, size)

        // spotify stile
        const center = { r: 140, g: 207, b: 0 }
        const edge   = { r: 60, g: 120, b: 0 }

        const centerX = size / 2
        const centerY = size / 2
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY)

        // gradient 
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {

                const dx = x - centerX
                const dy = y - centerY
                const dist = Math.sqrt(dx * dx + dy * dy)

                const t = Math.min(dist / maxDist, 1)

                const r = Math.floor(center.r * (1 - t) + edge.r * t)
                const g = Math.floor(center.g * (1 - t) + edge.g * t)
                const b = Math.floor(center.b * (1 - t) + edge.b * t)

                const color = Jimp.rgbaToInt(r, g, b, 255)
                img.setPixelColor(color, x, y)
            }
        }

        const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK)

        img.print(
            font,
            0,
            0,
            {
                text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            size,
            size
        )

        const dir = './temp'
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)

        const file = path.join(dir, `brat_${Date.now()}.png`)

        await img.writeAsync(file)

        const buffer = fs.readFileSync(file)

        const stiker = await sticker(
            buffer,
            false,
            global.packname || 'Bot',
            global.author || 'Bot'
        )

        await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)

        fs.unlinkSync(file)

    } catch (e) {
        console.error(e)
        m.reply('❌ Errore nella creazione dello sticker')
    }
}

handler.help = ['brat <testo>']
handler.tags = ['sticker']
handler.command = /^brat$/i

export default handler