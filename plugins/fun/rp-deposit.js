let handler = async (m, { conn, args, usedPrefix }) => {
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}

    const user = global.db.data.users[m.sender]
    user.bank = Number(user.bank) || 0
    user.limit = Number(user.limit) || 0

    if (!args[0]) {
        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  💰  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝒰𝓈𝒶: *${usedPrefix}deposit <quantità>*
│❍ 𝒪𝓅𝓅𝓊𝓇𝑒: *${usedPrefix}deposit all*
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    if (args[0].toLowerCase() === 'all') {
        const count = Math.floor(user.limit)

        if (count <= 0) {
            return conn.sendMessage(m.chat, {
                text: `╭═━ 〖  💰  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝒩𝑜𝓃 𝒽𝒶𝒾 𝒰𝓃𝒾𝓉𝓎𝒞𝑜𝒾𝓃𝓈 𝓃𝑒𝓁 𝓅𝑜𝓇𝓉𝒶𝒻𝑜𝑔𝓁𝒾𝑜.
╰━━━━━━━━━⪩`
            }, { quoted: m })
        }

        user.limit -= count
        user.bank += count

        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ✅  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝐻𝒶𝒾 𝒹𝑒𝓅𝑜𝓈𝒾𝓉𝒶𝓉𝑜 *${formatNumber(count)} UC*
│❍ 𝒩𝓊𝑜𝓋𝑜 𝓈𝒶𝓁𝒹𝑜 𝒷𝒶𝓃𝒸𝒶: *${formatNumber(user.bank)} UC*
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    if (isNaN(args[0])) {
        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ❌  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝐼𝓃𝓈𝑒𝓇𝒾𝓈𝒸𝒾 𝓊𝓃 𝒾𝓂𝓅𝑜𝓇𝓉𝑜 𝓋𝒶𝓁𝒾𝒹𝑜.
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    const count = Math.floor(Number(args[0]))

    if (count < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ❌  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝐿'𝒾𝓂𝓅𝑜𝓇𝓉𝑜 𝒹𝑒𝓋𝑒 𝑒𝓈𝓈𝑒𝓇𝑒 𝒶𝓁𝓂𝑒𝓃𝑜 1 UC.
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    if (user.limit <= 0) {
        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  💰  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝒩𝑜𝓃 𝒽𝒶𝒾 𝒰𝓃𝒾𝓉𝓎𝒞𝑜𝒾𝓃𝓈 𝒹𝒶 𝒹𝑒𝓅𝑜𝓈𝒾𝓉𝒶𝓇𝑒.
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    if (user.limit < count) {
        return conn.sendMessage(m.chat, {
            text: `╭═━ 〖  ⚠️  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝒩𝑜𝓃 𝒽𝒶𝒾 𝒶𝒷𝒷𝒶𝓈𝓉𝒶𝓃𝓏𝒶 𝒰𝒞.
│❍ 𝒩𝑒 𝒽𝒶𝒾 𝓈𝑜𝓁𝑜 *${formatNumber(user.limit)} UC*
╰━━━━━━━━━⪩`
        }, { quoted: m })
    }

    user.limit -= count
    user.bank += count

    await conn.sendMessage(m.chat, {
        text: `╭═━ 〖  ✅  𝒟𝑒𝓅𝑜𝓈𝒾𝓉𝑜 〗═━⪩
│❍ 𝐷𝑒𝓅𝑜𝓈𝒾𝓉𝒶𝓉𝒾 *${formatNumber(count)} UC*
│❍ 𝒩𝓊𝑜𝓋𝑜 𝓈𝒶𝓁𝒹𝑜 𝒷𝒶𝓃𝒸𝒶: *${formatNumber(user.bank)} UC*
╰━━━━━━━━━⪩`
    }, { quoted: m })
}

handler.help = ['deposit <amount>', 'deposita <amount>', 'deposit all', 'deposita all']
handler.tags = ['economy']
handler.command = ['deposit', 'deposita']
handler.register = true

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}

export default handler