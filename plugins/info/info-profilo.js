let handler = async (m, { conn, text, usedPrefix, command }) => {
    console.log('[INFO PLUGIN] Start - Command:', command, 'Text:', text, 'Quoted:', m.quoted?.key?.id)


    try {
        const userId = m.sender
        const groupId = m.chat


        if (!m.isGroup) {
            return conn.sendMessage(m.chat, {
                text: 'Questo comando si usa solo nei gruppi.'
            }, { quoted: m })
        }


        const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : m.sender)
        const who = mention || m.sender


        if (!global.db.data.users[who]) {
            global.db.data.users[who] = {
                money: 0,
                warn: 0,
                muto: false,
                banned: false,
                messaggi: 0,
                blasphemy: 0,
                instagram: null,
                eta: null,
                genere: null
            }
        }


        const user = global.db.data.users[who]


        // Inizializza i pending se non esistono
        global.setanni_pending = global.setanni_pending || {}
        global.setig_pending = global.setig_pending || {}


        // Gestione comandi set
        if (command === 'setanni') {
            const msg = await conn.sendMessage(m.chat, {
                text: `🎂 @${who.split('@')[0]}, rispondi a questo messaggio con la tua età (1-119) entro 60 secondi.`,
                mentions: [who]
            }, { quoted: m })
            
            global.setanni_pending[msg.key.id] = { user: who, timeout: Date.now() + 60000 }
            console.log('[SETANNI] Pending creato per msg:', msg.key.id, 'user:', who)
            
            setTimeout(() => {
                if (global.setanni_pending[msg.key.id]) {
                    console.log('[SETANNI] Timeout per msg:', msg.key.id)
                    delete global.setanni_pending[msg.key.id]
                }
            }, 60000)
            
            return
        }


        if (command === 'setig') {
            const msg = await conn.sendMessage(m.chat, {
                text: `📸 @${who.split('@')[0]}, rispondi a questo messaggio con il tuo username Instagram (senza @) entro 60 secondi.`,
                mentions: [who]
            }, { quoted: m })
            
            global.setig_pending[msg.key.id] = { user: who, timeout: Date.now() + 60000 }
            console.log('[SETIG] Pending creato per msg:', msg.key.id, 'user:', who)
            
            setTimeout(() => {
                if (global.setig_pending[msg.key.id]) {
                    console.log('[SETIG] Timeout per msg:', msg.key.id)
                    delete global.setig_pending[msg.key.id]
                }
            }, 60000)
            
            return
        }


        if (command === 'setgenere') {
            const genere = text?.toLowerCase()
            if (genere === 'maschio' || genere === 'femmina') {
                global.db.data.users[who].genere = genere
                return conn.sendMessage(m.chat, {
                    text: `✅ Genere impostato a *${genere === 'maschio' ? '🚹 Maschio' : '🚺 Femmina'}* per @${who.split('@')[0]}`,
                    mentions: [who]
                }, { quoted: m })
            } else {
                return conn.sendMessage(m.chat, {
                    text: '❌ Usa: .setgenere maschio oppure .setgenere femmina'
                }, { quoted: m })
            }
        }


        const testo = `╭═━ 〖  👤  𝒫𝓇𝑜𝒻𝒾𝓁𝑜 〗═━⪩
│❍ 𝒰𝓉𝑒𝓃𝓉𝑒: @${who.split('@')[0]}
│❍ 𝑀𝑒𝓈𝓈𝒶𝑔𝑔𝒾: *${user.messaggi || 0}*
│❍ 𝒲𝒶𝓇𝓃: *${user.warn || 0}*
│❍ 𝒜𝓃𝓃𝒾: *${user.eta ? user.eta + ' anni' : 'Non impostata'}*
│❍ 𝒢𝑒𝓃𝑒𝓇𝑒: *${user.genere ? (user.genere === 'maschio' ? '🚹 Maschio' : '🚺 Femmina') : 'Non impostato'}*
│❍ 𝐵𝑒𝓈𝓉𝑒𝓂𝓂𝒾𝑒: *${user.blasphemy || 0}*
│❍ 𝐼𝓃𝓈𝓉𝒶𝑔𝓇𝒶𝓂: *${user.instagram ? 'https://instagram.com/' + user.instagram : 'Non impostato'}*
╰━━━━━━━━━⪩`


        console.log('[INFO PLUGIN] Sending message...')


        await conn.sendMessage(m.chat, {
            text: testo,
            footer: '𝒫𝓇𝑜𝒻𝒾𝓁𝑜 𝓊𝓉𝑒𝓃𝓉𝑒',
            buttons: [
                { buttonId: `${usedPrefix}setanni`, buttonText: { displayText: '🎂 Set Anni' }, type: 1 },
                { buttonId: `${usedPrefix}setgenere maschio`, buttonText: { displayText: '🚹 Maschio' }, type: 1 },
                { buttonId: `${usedPrefix}setgenere femmina`, buttonText: { displayText: '🚺 Femmina' }, type: 1 },
                { buttonId: `${usedPrefix}setig`, buttonText: { displayText: '📸 Set IG' }, type: 1 }
            ],
            headerType: 1,
            mentions: [who]
        }, { quoted: m })


        console.log('[INFO PLUGIN] Message sent!')
    } catch (error) {
        console.error('[INFO PLUGIN] Error:', error)
        await conn.sendMessage(m.chat, {
            text: '❌ Errore: ' + error.message
        }, { quoted: m })
    }
}


handler.before = async (m, { conn, usedPrefix }) => {
    if (!m || !m.chat) return


    const chat = m.chat
    const quotedCandidates = [
        m?.quoted?.key?.id,
        m?.quoted?.id,
        m?.quoted?.stanzaId,
        m?.quoted?.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo?.stanzaId
    ].filter(Boolean)
    const quotedId = quotedCandidates[0]


    // Inizializza pending
    global.setanni_pending = global.setanni_pending || {}
    global.setig_pending = global.setig_pending || {}


    const getPendingFromQuote = (pendingMap) => {
        if (!quotedId) return null
        return pendingMap[quotedId] || null
    }


    // Gestione risposta per setanni
    const pendingEta = getPendingFromQuote(global.setanni_pending)
    if (pendingEta) {
        if (m.sender !== pendingEta.user && m.sender !== pendingEta.user?.split('@')[0]?.replace(/\D/g, '') + '@s.whatsapp.net') {
            return
        }


        const eta = parseInt((m.text || '').trim())


        global.db.data.users[pendingEta.user] = global.db.data.users[pendingEta.user] || {
            money: 0,
            warn: 0,
            muto: false,
            banned: false,
            messaggi: 0,
            blasphemy: 0,
            instagram: null,
            eta: null,
            genere: null
        }


        if (!isNaN(eta) && eta > 0 && eta < 120) {
            global.db.data.users[pendingEta.user].eta = eta
            delete global.setanni_pending[quotedId]


            await conn.sendMessage(chat, {
                text: `✅ Età¹¹ impostata a *${eta} anni* per @${pendingEta.user.split('@')[0]}`,
                mentions: [pendingEta.user]
            }, { quoted: m })
        } else {
            delete global.setanni_pending[quotedId]
            await conn.sendMessage(chat, {
                text: '❌ Età¹¹ non valida. Invia un numero tra 1 e 119.'
            }, { quoted: m })
        }
        return
    }


    // Gestione risposta per setig
    const pendingIg = getPendingFromQuote(global.setig_pending)
    if (pendingIg) {
        if (m.sender !== pendingIg.user && m.sender !== pendingIg.user?.split('@')[0]?.replace(/\D/g, '') + '@s.whatsapp.net') {
            return
        }


        const ig = (m.text || '').replace(/^@/, '').trim()


        global.db.data.users[pendingIg.user] = global.db.data.users[pendingIg.user] || {
            money: 0,
            warn: 0,
            muto: false,
            banned: false,
            messaggi: 0,
            blasphemy: 0,
            instagram: null,
            eta: null,
            genere: null
        }


        if (ig && ig.length >= 1 && ig.length <= 30) {
            global.db.data.users[pendingIg.user].instagram = ig
            delete global.setig_pending[quotedId]


            await conn.sendMessage(chat, {
                text: `✅ Instagram impostato a *https://instagram.com/${ig}* per @${pendingIg.user.split('@')[0]}`,
                mentions: [pendingIg.user]
            }, { quoted: m })
        } else {
            delete global.setig_pending[quotedId]
            await conn.sendMessage(chat, {
                text: '❌ Instagram non valido. Invia un username tra 1 e 30 caratteri.'
            }, { quoted: m })
        }
        return
    }
}


handler.help = ['info', 'profilo', 'setanni', 'setig', 'setgenere']
handler.tags = ['group']
handler.command = /^(info|profilo|setanni|setig|setgenere)$/i


export default handler