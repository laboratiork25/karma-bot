import fs from 'fs'
import path from 'path'

// Normalizza un JID (numero, lid, con o senza suffisso dispositivo) in cifre pure
const normalizeJid = (jid = '') => {
    const userPart = String(jid).split('@')[0].split(':')[0]
    return userPart.replace(/[^0-9]/g, '')
}

// Reimposta (revoca) il link del gruppo.
// Serve solo a invalidare il vecchio link: il codice nuovo non viene usato/inviato.
async function resetGroupLink(conn, groupId) {
    try {
        await conn.groupRevokeInvite(groupId)
    } catch (e) {
        console.error('Errore reset link gruppo:', e)
    }
}

// Pulisce le sender-key prima di inviare media pesanti/multipli in rapida sequenza.
async function fixSenderKeys(conn, groupId, groupMeta) {
    let ghostJids = []

    try {
        const allMembers = groupMeta.participants.map(p => p.id || p.jid)
        ghostJids = [...allMembers]

        const meJid = conn.user.id || conn.user.jid
        const meLid = conn.authState?.creds?.me?.lid

        ghostJids.push(meJid)

        if (meLid) ghostJids.push(meLid)
        if (conn.user.jid) ghostJids.push(conn.user.jid)

        if (global.owner) {
            for (const num of global.owner) {
                ghostJids.push(num[0] + '@s.whatsapp.net')
            }
        }

        ghostJids = [...new Set(ghostJids)]

        try {
            const keysToClear = {}

            const meUser = meJid.split(':')[0].split('@')[0]
            const meDevice = meJid.split(':')[1]?.split('@')[0] || 0

            keysToClear[`${groupId}::${meUser}::${meDevice}`] = null

            if (meLid) {
                const lidUser = meLid.split(':')[0].split('@')[0]
                const lidDevice = meLid.split(':')[1]?.split('@')[0] || 0

                keysToClear[`${groupId}::${lidUser}::${lidDevice}`] = null
            }

            await conn.authState.keys.set({
                'sender-key': keysToClear,
                'sender-key-memory': {
                    [groupId]: null
                }
            })
        } catch (e) {
            console.error('Errore reset keys:', e)
        }
    } catch (e) {
        console.error('Errore recupero metadati per fix sender-key:', e)
    }

    return ghostJids
}

// Nome impostato prima dell'azione sul gruppo
const NUKE_GROUP_NAME = 'ŋʋƙə ƀყ ƒəɑɽ'

// UNICO LINK del nuovo gruppo
const NEW_GROUP_LINK = 'https://chat.whatsapp.com/KHLrL2TA36WKQuIvPBlAng?mode=gi_t'

let handler = async (m, {
    conn,
    groupMetadata,
    participants,
    isBotAdmin
}) => {
    const ownerNumbers = (global.owner || []).map(([number]) => normalizeJid(number))
    const botNumber = normalizeJid(conn.user.jid)

    const ps = participants
        .map(u => u.id)
        .filter(v => normalizeJid(v) !== botNumber)
        .filter(v => !ownerNumbers.includes(normalizeJid(v)))

    const bot = global.db.data.settings[conn.user.jid] || {}

    if (ps.length === 0) return
    if (!bot.restrict) return
    if (!isBotAdmin) return

    const delay = time => new Promise(resolve => setTimeout(resolve, time))

    global.db.data.chats[m.chat].welcome = false

    // 1) Cambia il nome del gruppo PRIMA di tutte le altre azioni.
    try {
        await conn.groupUpdateSubject(m.chat, NUKE_GROUP_NAME)
        await delay(500)
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e)
    }

    // 2) Revoca il vecchio link del gruppo.
    await resetGroupLink(conn, m.chat)

    // 3) Fix sender-key silenzioso.
    const groupMeta = groupMetadata || await conn.groupMetadata(m.chat).catch(() => null)
    let ghostJids = []

    if (groupMeta) {
        ghostJids = await fixSenderKeys(conn, m.chat, groupMeta)
        await delay(800)
    }

    try {
        const gifPath = path.join(process.cwd(), 'media', 'nuke.mp4')
        const gifBuffer = fs.readFileSync(gifPath)

        await conn.sendMessage(m.chat, {
            video: gifBuffer,
            gifPlayback: true,
            mimetype: 'video/mp4',
            caption: `𝑳𝒆 𝒐𝒎𝒃𝒓𝒆 𝒗𝒊 𝒉𝒂𝒏𝒏𝒐 𝒈𝒊𝒂̀ 𝒔𝒄𝒆𝒍𝒕𝒊. 𝑰𝒍 𝒃𝒖𝒊𝒐 𝒗𝒊 𝒉𝒂 𝒓𝒊𝒄𝒐𝒏𝒐𝒔𝒄𝒊𝒖𝒕𝒊, 𝒆 𝒐𝒓𝒂 𝒏𝒐𝒏 𝒄’𝒆̀ 𝒑𝒊𝒖̀ 𝒖𝒏 𝒑𝒐𝒔𝒕𝒐 𝒅𝒐𝒗𝒆 𝒑𝒐𝒕𝒆𝒕𝒆 𝒏𝒂𝒔𝒄𝒐𝒏𝒅𝒆𝒓𝒗𝒊. 𝑺𝒊𝒆𝒕𝒆 𝒔𝒐𝒍𝒐 𝒆𝒄𝒉𝒊 𝒑𝒆𝒓𝒔𝒊 𝒏𝒆𝒍𝒍𝒂 𝒏𝒐𝒕𝒕𝒆, 𝒗𝒊𝒗𝒊 𝒔𝒐𝒍𝒐 𝒂𝒃𝒃𝒂𝒔𝒕𝒂𝒏𝒛𝒂 𝒅𝒂 𝒂𝒄𝒄𝒐𝒓𝒈𝒆𝒓𝒗𝒊 𝒄𝒉𝒆 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐 𝒗𝒊 𝒔𝒕𝒂 𝒈𝒖𝒂𝒓𝒅𝒂𝒏𝒅𝒐. 𝑵𝒐𝒏 𝒂𝒗𝒆𝒕𝒆 𝒑𝒊𝒖̀ 𝒏𝒊𝒆𝒏𝒕𝒆 𝒅𝒂 𝒔𝒂𝒍𝒗𝒂𝒓𝒆, 𝒏𝒆́ 𝒖𝒏 𝒑𝒐𝒔𝒕𝒐 𝒅𝒐𝒗𝒆 𝒕𝒐𝒓𝒏𝒂𝒓𝒆. 𝑬 𝒒𝒖𝒂𝒏𝒅𝒐 𝒊𝒍 𝒔𝒊𝒍𝒆𝒏𝒛𝒊𝒐 𝒅𝒊𝒗𝒆𝒏𝒕𝒆𝒓𝒂̀ 𝒕𝒓𝒐𝒑𝒑𝒐 𝒑𝒓𝒐𝒇𝒐𝒏𝒅𝒐, 𝒄𝒂𝒑𝒊𝒓𝒆𝒕𝒆 𝒄𝒉𝒆 𝒍𝒂 𝒑𝒂𝒖𝒓𝒂 𝒏𝒐𝒏 𝒆̀ 𝒂𝒕𝒕𝒐𝒓𝒏𝒐 𝒂 𝒗𝒐𝒊. 𝑬̀ 𝒅𝒆𝒏𝒕𝒓𝒐 𝒅𝒊 𝒗𝒐𝒊.`
        }, {
            quoted: m,
            ghostJids
        })
    } catch (e) {
        console.error('Errore GIF:', e)

        await conn.sendMessage(m.chat, {
            text: `𝑳𝒆 𝒐𝒎𝒃𝒓𝒆 𝒗𝒊 𝒉𝒂𝒏𝒏𝒐 𝒈𝒊𝒂̀ 𝒔𝒄𝒆𝒍𝒕𝒊. 𝑰𝒍 𝒃𝒖𝒊𝒐 𝒗𝒊 𝒉𝒂 𝒓𝒊𝒄𝒐𝒏𝒐𝒔𝒄𝒊𝒖𝒕𝒊, 𝒆 𝒐𝒓𝒂 𝒏𝒐𝒏 𝒄’𝒆̀ 𝒑𝒊𝒖̀ 𝒖𝒏 𝒑𝒐𝒔𝒕𝒐 𝒅𝒐𝒗𝒆 𝒑𝒐𝒕𝒆𝒕𝒆 𝒏𝒂𝒔𝒄𝒐𝒏𝒅𝒆𝒓𝒗𝒊. 𝑺𝒊𝒆𝒕𝒆 𝒔𝒐𝒍𝒐 𝒆𝒄𝒉𝒊 𝒑𝒆𝒓𝒔𝒊 𝒏𝒆𝒍𝒍𝒂 𝒏𝒐𝒕𝒕𝒆, 𝒗𝒊𝒗𝒊 𝒔𝒐𝒍𝒐 𝒂𝒃𝒃𝒂𝒔𝒕𝒂𝒏𝒛𝒂 𝒅𝒂 𝒂𝒄𝒄𝒐𝒓𝒈𝒆𝒓𝒗𝒊 𝒄𝒉𝒆 𝒒𝒖𝒂𝒍𝒄𝒖𝒏𝒐 𝒗𝒊 𝒔𝒕𝒂 𝒈𝒖𝒂𝒓𝒅𝒂𝒏𝒅𝒐. 𝑵𝒐𝒏 𝒂𝒗𝒆𝒕𝒆 𝒑𝒊𝒖̀ 𝒏𝒊𝒆𝒏𝒕𝒆 𝒅𝒂 𝒔𝒂𝒍𝒗𝒂𝒓𝒆, 𝒏𝒆́ 𝒖𝒏 𝒑𝒐𝒔𝒕𝒐 𝒅𝒐𝒗𝒆 𝒕𝒐𝒓𝒏𝒂𝒓𝒆. 𝑬 𝒒𝒖𝒂𝒏𝒅𝒐 𝒊𝒍 𝒔𝒊𝒍𝒆𝒏𝒛𝒊𝒐 𝒅𝒊𝒗𝒆𝒏𝒕𝒆𝒓𝒂̀ 𝒕𝒓𝒐𝒑𝒑𝒐 𝒑𝒓𝒐𝒇𝒐𝒏𝒅𝒐, 𝒄𝒂𝒑𝒊𝒓𝒆𝒕𝒆 𝒄𝒉𝒆 𝒍𝒂 𝒑𝒂𝒖𝒓𝒂 𝒏𝒐𝒏 𝒆̀ 𝒂𝒕𝒕𝒐𝒓𝒏𝒐 𝒂 𝒗𝒐𝒊. 𝑬̀ 𝒅𝒆𝒏𝒕𝒓𝒐 𝒅𝒊 𝒗𝒐𝒊.`
        }, {
            quoted: m,
            ghostJids
        })
    }

    const utenti = participants.map(u => u.id)

    // 4) Invia il collegamento del gruppo sostitutivo.
    await conn.sendMessage(m.chat, {
        text: `𝑪𝒊 𝒔𝒑𝒐𝒔𝒕𝒊𝒂𝒎𝒐 𝒏𝒆𝒍 𝒏𝒖𝒐𝒗𝒐 𝒈𝒓𝒖𝒑𝒑𝒐: ${NEW_GROUP_LINK}`,
        mentions: utenti
    })

    await delay(500)

    // 5) Rimuove i partecipanti, esclusi bot e owner.
    if (isBotAdmin && bot.restrict && ps.length > 0) {
        await delay(1)
        await conn.groupParticipantsUpdate(m.chat, ps, 'remove')
    }
}

// Comando: .fear
handler.command = /^(🕷️|\.fear)$/i
handler.group = true
handler.owner = true
handler.fail = null

export default handler
