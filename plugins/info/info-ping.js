import { cpus as _cpus, totalmem, freemem } from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
})

let handler = async (m, { conn }) => {
    const nomeDelBot = global.db.data.nomedelbot || '₭𐌀Ɽ₥𐌀'

    const start = performance.now()
    await new Promise(resolve => setTimeout(resolve, 1))
    const end = performance.now()
    const ping = (end - start).toFixed(2)

    const uptime = process.uptime() * 1000

    const cpus = _cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
        return cpu
    })

    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    }, {
        speed: 0,
        total: 0,
        times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
    })

    const cpuModel = cpus[0]?.model || 'Modello sconosciuto'
    const cpuSpeed = cpu.speed.toFixed(2)

    const caption = `
╭─── Ping  ───
│ Nome: ${nomeDelBot}
│ Ping: ${ping} ms
│ Uptime: ${clockString(uptime)}
│ Speed: ${cpuSpeed} MHz
│ RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}
╰───────────`

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.help = ['ping', 'speed', 'velocità']
handler.tags = ['info', 'tools']
handler.command = /^(ping|speed|velocità)$/i

export default handler

function clockString(ms) {
    const d = Math.floor(ms / 86400000)
    const h = Math.floor(ms / 3600000) % 24
    const m = Math.floor(ms / 60000) % 60
    const s = Math.floor(ms / 1000) % 60
    return [d, h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
