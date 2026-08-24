import { dirname } from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { fileTypeFromBuffer } from 'file-type'
import webp from 'node-webpmux'
import fetch from 'node-fetch'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tmp = path.join(__dirname, '../temp')

if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })

if (!ffmpegPath) {
  throw new Error('ffmpeg-static non trovato')
}

ffmpeg.setFfmpegPath(ffmpegPath)

async function getBuffer(input, url = false) {
  if (Buffer.isBuffer(input)) return input
  if (input instanceof ArrayBuffer) return Buffer.from(input)

  if (url && typeof url === 'string') {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch fallita: ${res.status} ${await res.text()}`)
    return Buffer.from(await res.arrayBuffer())
  }

  throw new Error('Input non valido')
}

async function toWebp(buffer, mime) {
  const ext = mime.split('/')[1] || 'bin'
  const id = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  const inputPath = path.join(tmp, `${id}.${ext}`)
  const outputPath = path.join(tmp, `${id}.webp`)

  await fs.promises.writeFile(inputPath, buffer)

  const isVideo = mime.startsWith('video/')

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)

    if (isVideo) {
      command = command.inputOptions(['-t', '8'])
    }

    command
      .on('error', async err => {
        await fs.promises.unlink(inputPath).catch(() => {})
        await fs.promises.unlink(outputPath).catch(() => {})
        reject(err)
      })
      .on('end', async () => {
        try {
          const out = await fs.promises.readFile(outputPath)
          await fs.promises.unlink(inputPath).catch(() => {})
          await fs.promises.unlink(outputPath).catch(() => {})
          resolve(out)
        } catch (err) {
          reject(err)
        }
      })
      .outputOptions([
        '-vcodec', 'libwebp',
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=increase,crop=512:512,fps=15,format=rgba',
        '-loop', '0',
        '-preset', 'default',
        '-an',
        '-vsync', '0',
        '-s', '512:512'
      ])
      .toFormat('webp')
      .save(outputPath)
  })
}

async function addExif(webpSticker, packname = '', author = '', categories = [''], extra = {}) {
  const img = new webp.Image()
  const stickerPackId = crypto.randomBytes(32).toString('hex')

  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    emojis: categories,
    ...extra
  }

  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2A, 0x00,
    0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57,
    0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00,
    0x00, 0x00
  ])

  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)

  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

async function sticker(img, url = false, packname = '', author = '', categories = [''], extra = {}) {
  const buffer = await getBuffer(img, url)
  const type = await fileTypeFromBuffer(buffer)

  if (!type) {
    throw new Error('Tipo file non rilevato')
  }

  if (!type.mime.startsWith('image/') && !type.mime.startsWith('video/')) {
    throw new Error(`Formato non supportato: ${type.mime}`)
  }

  const webpBuffer = await toWebp(buffer, type.mime)
  return await addExif(webpBuffer, packname, author, categories, extra)
}

const support = {
  ffmpeg: true,
  ffmpegWebp: true,
  convert: false,
  magick: false,
  gm: false,
  find: false
}

export const handler = async () => {}

export {
  sticker,
  addExif,
  support
}