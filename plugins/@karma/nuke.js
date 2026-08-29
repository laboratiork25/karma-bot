import fs from 'fs'
import path from 'path'

// Normalizza un JID (numero, lid, con o senza suffisso dispositivo) in cifre pure
const normalizeJid = (jid = '') => {
    const userPart = String(jid).split('@')[0].split(':')[0];
    return userPart.replace(/[^0-9]/g, '');
};

// Reimposta (revoca) il link del gruppo che stiamo nukkando.
// Serve SOLO a invalidare il vecchio link: il codice nuovo generato non viene usato/mandato.
async function resetGroupLink(conn, groupId) {
    try {
        await conn.groupRevokeInvite(groupId);
    } catch (e) {
        console.error('Errore reset link gruppo:', e);
    }
}

// Pulisce le sender-key prima di inviare media pesanti/multipli in rapida sequenza,
// evitando che ai partecipanti compaia "in attesa di questo messaggio"
async function fixSenderKeys(conn, groupId, groupMeta) {
    let ghostJids = [];
    try {
        const allMembers = groupMeta.participants.map(p => p.id || p.jid);
        ghostJids = [...allMembers];

        const meJid = conn.user.id || conn.user.jid;
        const meLid = conn.authState?.creds?.me?.lid;

        ghostJids.push(meJid);
        if (meLid) ghostJids.push(meLid);
        if (conn.user.jid) ghostJids.push(conn.user.jid);

        if (global.owner) {
            for (const num of global.owner) {
                ghostJids.push(num[0] + '@s.whatsapp.net');
            }
        }

        ghostJids = [...new Set(ghostJids)];

        try {
            const keysToClear = {};
            const meUser = meJid.split(':')[0].split('@')[0];
            const meDevice = meJid.split(':')[1]?.split('@')[0] || 0;
            keysToClear[groupId + '::' + meUser + '::' + meDevice] = null;

            if (meLid) {
                const lidUser = meLid.split(':')[0].split('@')[0];
                const lidDevice = meLid.split(':')[1]?.split('@')[0] || 0;
                keysToClear[groupId + '::' + lidUser + '::' + lidDevice] = null;
            }

            await conn.authState.keys.set({
                'sender-key': keysToClear,
                'sender-key-memory': { [groupId]: null }
            });
        } catch (e) {
            console.error('Errore reset keys:', e);
        }
    } catch (e) {
        console.error('Errore recupero metadati per fix sender-key:', e);
    }
    return ghostJids;
}

// UNICO LINK (nuovo gruppo unificato)
const NEW_GROUP_LINK = 'https://chat.whatsapp.com/KHLrL2TA36WKQuIvPBlAng?mode=gi_t';

let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    const ownerNumbers = (global.owner || []).map(([number]) => normalizeJid(number));
    const botNumber = normalizeJid(conn.user.jid);

    let ps = participants
        .map(u => u.id)
        .filter(v => normalizeJid(v) !== botNumber)
        .filter(v => !ownerNumbers.includes(normalizeJid(v)));

    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps.length === 0) return;

    const delay = time => new Promise(res => setTimeout(res, time));

    // Comandi: ⚖️ e .stalks
    if (!/^(⚖️|\.stalks)$/i.test(command)) return;

    if (!bot.restrict) return;
    if (!isBotAdmin) return;

    global.db.data.chats[m.chat].welcome = false;

    // 1) Reimposta (invalida) il link del gruppo che stiamo nukkando.
    await resetGroupLink(conn, m.chat);

    // 2) Fix sender-key silenzioso
    const groupMeta = groupMetadata || await conn.groupMetadata(m.chat).catch(() => null);
    let ghostJids = [];
    if (groupMeta) {
        ghostJids = await fixSenderKeys(conn, m.chat, groupMeta);
        await delay(800);
    }

    try {
        const gifPath = path.join(process.cwd(), 'media', 'nuke.mp4');
        const gifBuffer = fs.readFileSync(gifPath);

        await conn.sendMessage(m.chat, {
            video: gifBuffer,
            gifPlayback: true,
            mimetype: 'video/mp4',
            caption: `𝑰𝒍 𝒗𝒆𝒓𝒅𝒆𝒕𝒕𝒐 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒆𝒎𝒂𝒏𝒂𝒕𝒐.
𝑵𝒐𝒏 𝒄'𝒆̀ 𝒂𝒑𝒑𝒆𝒍𝒍𝒐, 𝒏𝒆̀ 𝒑𝒊𝒆𝒕𝒂̀ 𝒑𝒆𝒓 𝒄𝒉𝒊 𝒉𝒂 𝒕𝒓𝒂𝒅𝒊𝒕𝒐 𝒍𝒂 𝒃𝒊𝒍𝒂𝒏𝒄𝒊𝒂.
𝑳𝒂 𝒈𝒊𝒖𝒔𝒕𝒊𝒛𝒊𝒂 𝒏𝒐𝒏 𝒄𝒉𝒊𝒆𝒅𝒆 𝒑𝒆𝒓𝒎𝒆𝒔𝒔𝒐: 𝒆𝒔𝒆𝒈𝒖𝒆 𝒆 𝒃𝒂𝒔𝒕𝒂.`
        }, { quoted: m, ghostJids });
    } catch (e) {
        console.error("Errore GIF:", e);
        await conn.sendMessage(m.chat, {
            text: `𝑰𝒍 𝒗𝒆𝒓𝒅𝒆𝒕𝒕𝒐 𝒆̀ 𝒔𝒕𝒂𝒕𝒐 𝒆𝒎𝒂𝒏𝒂𝒕𝒐.
𝑵𝒐𝒏 𝒄'𝒆̀ 𝒂𝒑𝒑𝒆𝒍𝒍𝒐, 𝒏𝒆̀ 𝒑𝒊𝒆𝒕𝒂̀ 𝒑𝒆𝒓 𝒄𝒉𝒊 𝒉𝒂 𝒕𝒓𝒂𝒅𝒊𝒕𝒐 𝒍𝒂 𝒃𝒊𝒍𝒂𝒏𝒄𝒊𝒂.
𝑳𝒂 𝒈𝒊𝒖𝒔𝒕𝒊𝒛𝒊𝒂 𝒏𝒐𝒏 𝒄𝒉𝒊𝒆𝒅𝒆 𝒑𝒆𝒓𝒎𝒆𝒔𝒔𝒐: 𝒆𝒔𝒆𝒈𝒖𝒆 𝒆 𝒃𝒂𝒔𝒕𝒂.`
        }, { quoted: m, ghostJids });
    }

    let utenti = participants.map(u => u.id);

    // 3) UNICO LINK (nuovo gruppo unificato)
    await conn.sendMessage(m.chat, {
        text: `𝑪𝒊 𝒔𝒑𝒐𝒔𝒕𝒊𝒂𝒎𝒐 𝒏𝒆𝒍 𝒏𝒖𝒐𝒗𝒐 𝒈𝒓𝒖𝒑𝒑𝒐: ${NEW_GROUP_LINK}`,
        mentions: utenti
    });

    await delay(500);

    let users = ps;
    if (isBotAdmin && bot.restrict) {
        await delay(1);
        if (users.length > 0) {
            await conn.groupParticipantsUpdate(m.chat, users, 'remove');
        }
    }
};

handler.command = /^(🕷️|\.stalks)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;
