import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    const ownerNumbers = (global.owner || []).map(([number]) => number.replace(/[^0-9]/g, ''));

    let ps = participants
        .map(u => u.id)
        .filter(v => v !== conn.user.jid)
        .filter(v => !ownerNumbers.includes(v.replace(/[^0-9]/g, '').split('@')[0]));

    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps == '') return;

    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "stalks":
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            global.db.data.chats[m.chat].welcome = false;

            try {
                const gifPath = path.join(process.cwd(), 'media', 'nuke.mp4');
                const gifBuffer = fs.readFileSync(gifPath);

                await conn.sendMessage(m.chat, {
                    video: gifBuffer,
                    gifPlayback: true,
                    mimetype: 'video/mp4',
                    caption: `𝑳𝒆 𝒐𝒎𝒃𝒓𝒆 𝒗𝒊 𝒉𝒂𝒏𝒏𝒐 𝒈𝒊𝒂̀ 𝒔𝒄𝒆𝒍𝒕𝒊. 𝑵𝒐𝒏 𝒄’𝒆̀ 𝒑𝒊𝒖̀ 𝒏𝒖𝒍𝒍𝒂 𝒅𝒂 𝒔𝒂𝒍𝒙𝒂𝒓𝒆.
𝑺𝒊𝒕𝒆 𝒔𝒐𝒍𝒐 𝒆𝒄𝒉𝒊 𝒏𝒆𝒍 𝒃𝒖𝒊𝒐, 𝒅𝒆𝒔𝒕𝒊𝒎𝒂𝒕𝒊 𝒂 𝒔𝒙𝒂𝒚𝒂𝒚𝒆.
𝑳𝒆 𝒐𝒎𝒃𝒓𝒆 𝒎𝒊 𝒉𝒂𝒏𝒏𝒐 𝒈𝒊𝒐̀ 𝒔𝒄𝒉𝒐𝒑𝒑𝒊𝒐.
𝑵𝒐𝒎𝒎𝒆𝒐 𝒓𝒆𝒂𝒌𝒆 𝒎𝒐𝒘 𝒓𝒂𝒙𝒉𝒐 𝒚𝒂𝒚𝒂 𝒚𝒐𝒇 𝒚𝒂𝒚𝒐.
𝑳𝒂 𝒗𝒐𝒔𝒕𝒆𝒂 𝒑𝒎𝒎𝒕𝒂𝒎𝒉𝒐 𝒆̀ 𝒈𝒐𝒚 𝒗𝒊 𝒎𝒐𝒎𝒄𝒎𝒎𝒑.`
                }, { quoted: m });

            } catch (e) {
                console.error("Errore GIF:", e);
                await conn.sendMessage(m.chat, {
                    text: `.stalk
𝑳𝒆 𝒐𝒎𝒃𝒓𝒆 𝒗𝒊 𝒉𝒂𝒏𝒏𝒐 𝒈𝒊𝒂̀ 𝒔𝒄𝒆𝒍𝒕𝒊. 𝑵𝒐𝒏 𝒄’𝒆̀ 𝒑𝒊𝒖̀ 𝒏𝒐𝒙𝒎𝒚𝒚𝒉𝒐 𝒚𝒚𝒚𝒉𝒐 𝒚𝒂𝒚𝒐.`
                }, { quoted: m });
            }

            // --- Rinomina gruppo: (nome originale) / nuke by gne gne ---
            try {
                const nomeOriginale = groupMetadata?.subject || '';
                const nuovoNome = `(${nomeOriginale}) / nuke by gne gne`;
                await conn.groupUpdateSubject(m.chat, nuovoNome);
            } catch (e) {
                console.error("Errore rinomina gruppo:", e);
            }

            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: 'CI SPOSTIAMO QUA https://chat.whatsapp.com/KHLrL2TA36WKQuIvPBlAng?mode=gi_t',
                mentions: utenti
            });

            let users = ps;
            if (isBotAdmin && bot.restrict) {
                await delay(1);
                if (users.length > 0) {
                    await conn.groupParticipantsUpdate(m.chat, users, 'remove');
                }
            }
            break;
    }
};

handler.command = /^(stalks|⚖️)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;
