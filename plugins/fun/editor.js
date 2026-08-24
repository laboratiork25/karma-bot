import { createCanvas, loadImage } from 'canvas'

function getMime(q) {
  return q?.mimetype || q?.msg?.mimetype || ''
}

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function normalizeJidSimple(jid) {
  if (!jid || typeof jid !== 'string') return null
  if (jid.includes('@')) return jid
  const digits = jid.replace(/\D/g, '')
  return digits ? `${digits}@s.whatsapp.net` : null
}

async function resolveMentionToUsableJid(conn, m, jid) {
  if (!jid || typeof jid !== 'string') return null
  const decoded = conn.decodeJid ? conn.decodeJid(jid) : jid
  if (decoded?.endsWith('@s.whatsapp.net')) return decoded

  const getPnById = typeof conn.getPNById === 'function'
    ? conn.getPNById.bind(conn)
    : typeof conn.getPNForLID === 'function'
      ? conn.getPNForLID.bind(conn)
      : null

  if (getPnById) {
    try {
      const pn = await getPnById(decoded)
      const normalized = conn.decodeJid ? conn.decodeJid(pn) : pn
      if (normalized?.endsWith('@s.whatsapp.net')) return normalized
    } catch {}
  }

  const participants = m?.normalizedParticipants || m?.participants || []
  const matched = participants.find(p => {
    const values = [p?.id, p?.jid, p?.lid, p?.phoneNumber, p?.pn, p?.participantPn]
      .map(v => typeof v === 'string' ? (conn.decodeJid ? conn.decodeJid(v) : v) : null)
      .filter(Boolean)
    return values.includes(decoded)
  })

  if (matched) {
    const candidates = [matched.phoneNumber, matched.pn, matched.participantPn, matched.jid, matched.id]
    for (const candidate of candidates) {
      const normalized = normalizeJidSimple(candidate)
      if (normalized?.endsWith('@s.whatsapp.net')) return normalized
    }
  }

  return decoded || null
}

async function getBufferFromUrl(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('download_failed')
  return Buffer.from(await res.arrayBuffer())
}

async function getProfilePhotoBuffer(conn, jid) {
  const usable = normalizeJidSimple(conn.decodeJid ? conn.decodeJid(jid) : jid) || jid
  const ppUrl = await conn.profilePictureUrl(usable, 'image').catch(() => null)
  if (!ppUrl) return null
  return await getBufferFromUrl(ppUrl).catch(() => null)
}

async function resolveTargetBuffer(m, conn) {
  const q = m.quoted
  const mentioned = Array.isArray(m.mentionedJid) ? m.mentionedJid.filter(Boolean) : []

  if (q) {
    const mime = getMime(q)
    if (/^image\/(png|jpe?g|webp)$/i.test(mime)) {
      const buffer = await q.download().catch(() => null)
      if (buffer) return { ok: true, buffer, source: 'quoted_image' }
    }
  }

  if (mentioned.length) {
    const usableMention = await resolveMentionToUsableJid(conn, m, mentioned[0])
    if (usableMention) {
      const buffer = await getProfilePhotoBuffer(conn, usableMention)
      if (buffer) return { ok: true, buffer, source: 'mentioned_profile', jid: usableMention }
    }
  }

  if (q) {
    const targetJid = q.sender || q.participant || q.key?.participant || q.key?.remoteJid
    if (targetJid) {
      const usableReplyJid = await resolveMentionToUsableJid(conn, m, targetJid)
      if (usableReplyJid) {
        const buffer = await getProfilePhotoBuffer(conn, usableReplyJid)
        if (buffer) return { ok: true, buffer, source: 'quoted_profile', jid: usableReplyJid }
      }
      const buffer = await getProfilePhotoBuffer(conn, targetJid)
      if (buffer) return { ok: true, buffer, source: 'quoted_profile', jid: targetJid }
    }
  }

  return { ok: false, reason: 'no_image_or_profile' }
}

function applyInvert(imageData) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i]
    d[i + 1] = 255 - d[i + 1]
    d[i + 2] = 255 - d[i + 2]
  }
  return imageData
}

function applyGrayscale(imageData) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114)
    d[i] = gray
    d[i + 1] = gray
    d[i + 2] = gray
  }
  return imageData
}

function applySepia(imageData) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    d[i] = clamp(r * 0.393 + g * 0.769 + b * 0.189)
    d[i + 1] = clamp(r * 0.349 + g * 0.686 + b * 0.168)
    d[i + 2] = clamp(r * 0.272 + g * 0.534 + b * 0.131)
  }
  return imageData
}

function applyBrightness(imageData, amount = 30) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] + amount)
    d[i + 1] = clamp(d[i + 1] + amount)
    d[i + 2] = clamp(d[i + 2] + amount)
  }
  return imageData
}

function applyContrast(imageData, amount = 40) {
  const d = imageData.data
  const factor = (259 * (amount + 255)) / (255 * (259 - amount))
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(factor * (d[i] - 128) + 128)
    d[i + 1] = clamp(factor * (d[i + 1] - 128) + 128)
    d[i + 2] = clamp(factor * (d[i + 2] - 128) + 128)
  }
  return imageData
}

function applyThreshold(imageData, limit = 128) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114
    const v = gray >= limit ? 255 : 0
    d[i] = v
    d[i + 1] = v
    d[i + 2] = v
  }
  return imageData
}

function applyPosterize(imageData, levels = 6) {
  const d = imageData.data
  const step = 255 / (levels - 1)
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(Math.round(d[i] / step) * step)
    d[i + 1] = clamp(Math.round(d[i + 1] / step) * step)
    d[i + 2] = clamp(Math.round(d[i + 2] / step) * step)
  }
  return imageData
}

function applySolarize(imageData) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i] > 127 ? 255 - d[i] : d[i]
    d[i + 1] = d[i + 1] > 127 ? 255 - d[i + 1] : d[i + 1]
    d[i + 2] = d[i + 2] > 127 ? 255 - d[i + 2] : d[i + 2]
  }
  return imageData
}

function applyVintage(imageData) {
  applySepia(imageData)
  applyContrast(imageData, 18)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] + 8)
    d[i + 1] = clamp(d[i + 1] + 4)
    d[i + 2] = clamp(d[i + 2] - 10)
  }
  return imageData
}

function applyDuotone(imageData) {
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255
    d[i] = clamp(35 + gray * 190)
    d[i + 1] = clamp(15 + gray * 80)
    d[i + 2] = clamp(95 + gray * 150)
  }
  return imageData
}

function convolve(imageData, width, height, kernel, divisor = 1, bias = 0) {
  const src = imageData.data
  const out = new Uint8ClampedArray(src.length)
  const side = Math.round(Math.sqrt(kernel.length))
  const half = Math.floor(side / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0
      let g = 0
      let b = 0
      const dstOff = (y * width + x) * 4

      for (let ky = 0; ky < side; ky++) {
        for (let kx = 0; kx < side; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx - half))
          const py = Math.min(height - 1, Math.max(0, y + ky - half))
          const srcOff = (py * width + px) * 4
          const wt = kernel[ky * side + kx]
          r += src[srcOff] * wt
          g += src[srcOff + 1] * wt
          b += src[srcOff + 2] * wt
        }
      }

      out[dstOff] = clamp(r / divisor + bias)
      out[dstOff + 1] = clamp(g / divisor + bias)
      out[dstOff + 2] = clamp(b / divisor + bias)
      out[dstOff + 3] = src[dstOff + 3]
    }
  }

  imageData.data.set(out)
  return imageData
}

function applySharpen(imageData, width, height) {
  return convolve(imageData, width, height, [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ])
}

function applyEdge(imageData, width, height) {
  return convolve(imageData, width, height, [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ], 1, 128)
}

function applyPixelate(ctx, width, height, size = 14) {
  const temp = createCanvas(width, height)
  const tctx = temp.getContext('2d')
  const sw = Math.max(1, Math.floor(width / size))
  const sh = Math.max(1, Math.floor(height / size))
  tctx.imageSmoothingEnabled = false
  tctx.drawImage(ctx.canvas, 0, 0, sw, sh)
  ctx.clearRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(temp, 0, 0, sw, sh, 0, 0, width, height)
}

function drawCircle(img) {
  const size = Math.min(img.width, img.height)
  const out = createCanvas(size, size)
  const octx = out.getContext('2d')
  const sx = (img.width - size) / 2
  const sy = (img.height - size) / 2
  octx.beginPath()
  octx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  octx.closePath()
  octx.clip()
  octx.drawImage(img, sx, sy, size, size, 0, 0, size, size)
  return out.toBuffer('image/png')
}

function drawLgbtOverlay(ctx, width, height) {
  const colors = [
    'rgba(228, 3, 3, 0.22)',
    'rgba(255, 140, 0, 0.20)',
    'rgba(255, 237, 0, 0.18)',
    'rgba(0, 128, 38, 0.18)',
    'rgba(0, 77, 255, 0.20)',
    'rgba(117, 7, 135, 0.22)'
  ]
  const stripeHeight = height / colors.length
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i]
    ctx.fillRect(0, i * stripeHeight, width, stripeHeight + 1)
  }
}

function drawScanlines(ctx, width, height) {
  for (let y = 0; y < height; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.10)'
    ctx.fillRect(0, y, width, 1)
  }
}

function drawGlitch(ctx, img, width, height) {
  ctx.drawImage(img, 0, 0, width, height)
  for (let i = 0; i < 12; i++) {
    const sliceY = Math.floor(Math.random() * height)
    const sliceH = Math.max(4, Math.floor(Math.random() * 30))
    const offset = Math.floor((Math.random() - 0.5) * 40)
    ctx.drawImage(ctx.canvas, 0, sliceY, width, sliceH, offset, sliceY, width, sliceH)
  }
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = 0.25
  ctx.drawImage(img, -6, 0, width, height)
  ctx.fillStyle = 'rgba(255,0,0,0.08)'
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 0.18
  ctx.drawImage(img, 6, 0, width, height)
  ctx.fillStyle = 'rgba(0,255,255,0.08)'
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  drawScanlines(ctx, width, height)
}

function drawMirror(ctx, img, width, height) {
  ctx.drawImage(img, 0, 0, width / 2, height, 0, 0, width / 2, height)
  ctx.save()
  ctx.scale(-1, 1)
  ctx.drawImage(img, 0, 0, width / 2, height, -width, 0, width / 2, height)
  ctx.restore()
}

function drawFlip(ctx, img, width, height) {
  ctx.save()
  ctx.scale(1, -1)
  ctx.drawImage(img, 0, -height, width, height)
  ctx.restore()
}

async function renderEffect(buffer, effect) {
  const img = await loadImage(buffer)
  const width = img.width
  const height = img.height
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  if (effect === 'circle') return drawCircle(img)

  if (effect === 'blur') {
    ctx.filter = 'blur(6px)'
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toBuffer('image/png')
  }

  if (effect === 'mirror') {
    drawMirror(ctx, img, width, height)
    return canvas.toBuffer('image/png')
  }

  if (effect === 'flip') {
    drawFlip(ctx, img, width, height)
    return canvas.toBuffer('image/png')
  }

  if (effect === 'glitch') {
    drawGlitch(ctx, img, width, height)
    return canvas.toBuffer('image/png')
  }

  ctx.drawImage(img, 0, 0, width, height)

  if (effect === 'pixelate') {
    applyPixelate(ctx, width, height, 14)
    return canvas.toBuffer('image/png')
  }

  if (effect === 'lgbt') {
    drawLgbtOverlay(ctx, width, height)
    return canvas.toBuffer('image/png')
  }

  if (effect === 'scanline') {
    drawScanlines(ctx, width, height)
    return canvas.toBuffer('image/png')
  }

  let imageData = ctx.getImageData(0, 0, width, height)

  if (effect === 'invert') imageData = applyInvert(imageData)
  if (effect === 'grayscale') imageData = applyGrayscale(imageData)
  if (effect === 'sepia') imageData = applySepia(imageData)
  if (effect === 'brightness') imageData = applyBrightness(imageData, 35)
  if (effect === 'contrast') imageData = applyContrast(imageData, 45)
  if (effect === 'threshold') imageData = applyThreshold(imageData, 128)
  if (effect === 'posterize') imageData = applyPosterize(imageData, 5)
  if (effect === 'solarize') imageData = applySolarize(imageData)
  if (effect === 'duotone') imageData = applyDuotone(imageData)
  if (effect === 'vintage') imageData = applyVintage(imageData)
  if (effect === 'sharpen') imageData = applySharpen(imageData, width, height)
  if (effect === 'edge') imageData = applyEdge(imageData, width, height)

  ctx.putImageData(imageData, 0, 0)
  return canvas.toBuffer('image/png')
}

const EFFECTS = {
  invert: 'invert',
  gray: 'grayscale',
  grey: 'grayscale',
  grayscale: 'grayscale',
  sepia: 'sepia',
  blur: 'blur',
  pixelate: 'pixelate',
  circle: 'circle',
  lgbt: 'lgbt',
  pride: 'lgbt',
  rainbow: 'lgbt',
  brightness: 'brightness',
  contrast: 'contrast',
  threshold: 'threshold',
  posterize: 'posterize',
  solarize: 'solarize',
  duotone: 'duotone',
  glitch: 'glitch',
  scanline: 'scanline',
  mirror: 'mirror',
  flip: 'flip',
  vintage: 'vintage',
  sharpen: 'sharpen',
  edge: 'edge'
}

let handler = async (m, { conn, command }) => {
  const effect = EFFECTS[command.toLowerCase()]
  if (!effect) throw 'Effetto non supportato'

  const target = await resolveTargetBuffer(m, conn)

  if (!target.ok) {
    throw 'Usa il comando rispondendo a una foto, rispondendo a un messaggio di un utente con foto profilo, oppure con .comando @utente'
  }

  const out = await renderEffect(target.buffer, effect)

  await conn.sendMessage(m.chat, {
    image: out,
    caption: `Effetto ${effect}`
  }, {
    quoted: m,
    mentions: target.jid ? [target.jid] : []
  })
}

handler.help = [
  'invert @utente',
  'grayscale @utente',
  'sepia @utente',
  'blur @utente',
  'pixelate @utente',
  'circle @utente',
  'lgbt @utente',
  'brightness @utente',
  'contrast @utente',
  'threshold @utente',
  'posterize @utente',
  'solarize @utente',
  'duotone @utente',
  'glitch @utente',
  'scanline @utente',
  'mirror @utente',
  'flip @utente',
  'vintage @utente',
  'sharpen @utente',
  'edge @utente'
]
handler.tags = ['fun', 'image']
handler.command = /^(invert|gray|grey|grayscale|sepia|blur|pixelate|circle|lgbt|pride|rainbow|brightness|contrast|threshold|posterize|solarize|duotone|glitch|scanline|mirror|flip|vintage|sharpen|edge)$/i

export default handler