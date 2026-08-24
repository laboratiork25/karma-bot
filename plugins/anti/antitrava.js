//credit to death
let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let user = `@${m.sender.split`@`[0]}`
let delet = m.key.participant;
let bang = m.key.id;
  
if (isBotAdmin && m.isGroup) {

if (m.text && (
m.text.toLowerCase().includes("wa.me/settings") ||
m.text.toLowerCase().includes("OhMyBruxo_bot") ||
m.text.toLowerCase().includes("@gutoxtazv9") ||
m.text.toLowerCase().includes("🤨? trava") ||
m.text.toLowerCase().includes("mpk") ||
m.text.toLowerCase().includes("드림 가이") ||
m.text.toLowerCase().includes("𝐂𝐋͢𝐢𝚵𝐍͢𝐓") ||
m.text.toLowerCase().includes("dg_xeon") ||
m.text.toLowerCase().includes("👻 𞋯𝘽ɼ᷐᪷᷂᪹᪱પซٱٱ᷐᪷᷂᪹᪱ііИ›‹›𝗡᷐᪷᷂᪹᪱ﻉɼɗ᷐᪷᷂᪹᪱ 💀") ||
m.text.toLowerCase().includes("ᗷᖇᑘ᙭ᓍᗱᓰᘉᘜᓍᕲ") ||
m.text.toLowerCase().includes("@120363161387074144@g.us") ||
m.text.toLowerCase().includes("🤷🏻‍♂️ - FAZER O QUE SOU FODA - 🤷🏻‍♂️") ||
m.text.toLowerCase().includes("⟠ BRU͢XiiN CLiE͢NT") ||
m.text.toLowerCase().includes("¿ --- 𝐒𝐢𝐗 𝐁𝐮𝐆 --- ?") ||
m.text.toLowerCase().includes("Sr.Bruxo.Mp5") ||
m.text.toLowerCase().includes("𝚂𝚛𝙱𝚛𝚞𝚡𝚘𝙼𝚙𝟻") ||
m.text.toLowerCase().includes("⟠ BRU͢XiiN CLiE͢NT") ||
m.text.toLowerCase().includes("𝆆𝆅🌟𝅿𝅿𝅿𝅿𝆆͟ • ͡ᖲ̡͟᷍Ʀ𝅿⩏ׂ✗ɨ𝅿⩎𝅿𝅿᷍❡͟០ᖱ ͜͡$͜͡ ៣ׂ͟᷍ϦȤ𝅿͟ɨׂ᷍⩎ • 𝅿𝅿𝆅𝆆͟͡🌟𝆅ثث׀") ||
m.text.toLowerCase().includes("@srbruxomp5") ||
m.text.toLowerCase().includes("⵰⃟👑᳞̼ᷘ᷅ᷣ᷁̀ ⃤𝔾𝕦𝕥𝕠̵̺̱᠊ⷮⷵⷨⷠⷯ⃟𝕚̹̹̹ຳ࿆𝕕̸ⷪⷭⷣ𝐳𝐢ᤩ⃝࿆𝐧͢Ｗ̶̸᭄͕࿆ⷼⷱⷳⷧⷡⷦⷹᷙ᳐ᷡ᷁ｅｂ⃢࿆͢⚡️ཽཽ႓⵰̹̹̹̹̹̹̹") ||
m.text.toLowerCase().includes("؂ن؃؄ٽ؂ن؃؄ٽ") ||
m.text.toLowerCase().includes("乙ħιᵃηⒷＵﻮᔕ") ||
m.text.toLowerCase().includes("𐏓꯭. ᬊ͜͡𝑹Σ𝑯𝑴𝑨𝑵ꫂ⃟🇵🇰") ||
m.text.toLowerCase().includes("Ø‚Ù†ØƒØ„Ù½Ø‚Ù†ØƒØ„Ù½") ||
m.text.toLowerCase().includes("ຮ₮ཞศV꙰ศ ๖ມG꙰ཀ͜͡✅⃟╮") ||
m.text.toLowerCase().includes("S̸Y꙰̸S꙰̸T꙰̸E꙰̸M꙰̸"))
||
/[\0\v]/.test(m.text)
||
m.buttonsMessage || 
m.listMessage || 
m.templateMessage ||
m.interactiveMessage
) {

conn.sendMessage(m.chat, { text: `𝐏𝐎𝐒𝐒𝐈𝐁𝐈𝐋𝐄 𝐖𝐀-𝐁𝐔𝐆 𝐑𝐈𝐋𝐄𝐕𝐀𝐓𝐎\n\n𝐖𝐀-𝐁𝐔𝐆 𝐄𝐋𝐋𝐈𝐌𝐈𝐍𝐀𝐓𝐎\n\n\n𝐁𝐘𝐄 𝐁𝐘𝐄: ${user}`, mentions: [m.sender] }, { quoted: fkontak })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
return null
}
}}

export default handler;