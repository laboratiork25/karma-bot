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
                    caption: `Solo ombre nel buio, presto scordate. Il mondo vi ha già dimenticati.`
                }, { quoted: m });

            } catch (e) {
                console.error("Errore GIF:", e);
                await conn.sendMessage(m.chat, {
                    text: `Solo ombre nel buio, presto scordate.`
                }, { quoted: m });
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

handler.command = /^(stalks)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;