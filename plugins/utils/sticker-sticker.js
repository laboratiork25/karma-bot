import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'

import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
ffmpeg.setFfmpegPath(ffmpegStatic)

let handler = async (m, { conn, args }) => {
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/webp|image|video/g.test(mime)) {
      let img = await q.download?.()
      if (!img) return

      if (!global.support) {
        global.support = {
          ffmpeg: true, ffprobe: true, ffmpegWebp: true,
          convert: true, magick: false, gm: false, find: false
        }
      }

      let pack = global.packname || ''
      let author = global.author || ''

      try {
        stiker = await sticker(img, false, pack, author)
      } catch {
        let out
        try {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)

          if (typeof out !== 'string') out = await uploadImage(img)

          stiker = await sticker(false, out, pack, author)
        } catch {
          stiker = false
        }
      }

    } else if (args[0]) {
      if (isUrl(args[0])) {
        let pack = global.packname || ''
        let author = global.author || ''
        stiker = await sticker(false, args[0], pack, author)
      } else return
    } else return

  } catch {
    stiker = false
  }

  if (stiker) {
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false)
  }
}

handler.help = ['s', 'sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stikergif', 'stickergif']
export default handler

const isUrl = (text) => {
  return text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/gi)
}
