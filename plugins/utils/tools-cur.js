// plugin by vare + .fire by axtral
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// JSON nella root del progetto
const databasePath = path.join(process.cwd(), 'storage', 'file-json', 'lastfm_users.json')
const databaseDir = path.dirname(databasePath)

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true })
}

const getDB = () => {
  try {
    if (!fs.existsSync(databasePath)) return {}
    return JSON.parse(fs.readFileSync(databasePath, 'utf-8'))
  } catch (e) {
    console.error('Errore lettura DB:', e)
    return {}
  }
}

const saveDB = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2))
}

const LASTFM_API_KEY = 'ec57ba14a3e88ccaaadec22295f7a39a'
const BROWSERLESS_KEY = '2VAvmYssH5xvWjr265293018be956680f58272693ee60eb5e'
const DEFAULT_COVER = path.join(process.cwd(), 'media', 'unimmagine.jpg')

async function apiCall(method, params = {}) {
  try {
    const query = new URLSearchParams({
      method,
      api_key: LASTFM_API_KEY,
      format: 'json',
      ...params
    })

    const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?${query}`, {
      timeout: 10000
    })

    return res.data
  } catch (e) {
    console.error('LastFM API Error:', e.response?.status, e.message)
    return {
      error: e.response?.status || 'Unknown',
      message: e.response?.data?.message || e.message
    }
  }
}

function fileToDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const mime =
    ext === '.png' ? 'image/png'
      : ext === '.webp' ? 'image/webp'
        : 'image/jpeg'

  const buffer = fs.readFileSync(filePath)
  return `data:${mime};base64,${buffer.toString('base64')}`
}

function getDefaultCover() {
  if (fs.existsSync(DEFAULT_COVER)) {
    return fileToDataUri(DEFAULT_COVER)
  }

  const fallbackPath = path.join(process.cwd(), 'baguette.jpg')
  if (fs.existsSync(fallbackPath)) {
    return fileToDataUri(fallbackPath)
  }

  return 'https://placehold.co/600x600/png'
}

async function fetchCover(lastFmImages, query, isArtist = false) {
  const sizes = ['mega', 'extralarge', 'large', 'medium', 'small']

  for (const size of sizes) {
    const cover = lastFmImages?.find(i => i.size === size)?.['#text']
    if (
      cover &&
      cover.trim() !== '' &&
      !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')
    ) return cover
  }

  if (!lastFmImages || lastFmImages.length === 0) {
    const method = isArtist ? 'artist.getinfo' : 'track.getinfo'
    const params = isArtist
      ? { artist: query }
      : {
        track: query.split(' ').slice(1).join(' '),
        artist: query.split(' ')[0]
      }

    const info = await apiCall(method, params)
    if (info.error) return getDefaultCover()

    const images = isArtist
      ? info.artist?.image
      : info.track?.album?.image || info.track?.image

    if (images) {
      for (const size of sizes) {
        const cover = images.find(i => i.size === size)?.['#text']
        if (
          cover &&
          cover.trim() !== '' &&
          !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')
        ) return cover
      }
    }
  }

  return getDefaultCover()
}

async function retryScreenshot(html, retries = 3, delay = 2000) {
  const endpoints = [
    'https://production-sfo.browserless.io/screenshot',
    'https://production-lon.browserless.io/screenshot',
    'https://chrome.browserless.io/screenshot'
  ]

  let lastError = null

  for (const endpoint of endpoints) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.post(
          `${endpoint}?token=${BROWSERLESS_KEY}`,
          {
            html,
            options: {
              type: 'png',
              fullPage: true
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            responseType: 'arraybuffer',
            timeout: 20000,
            validateStatus: () => true
          }
        )

        if (response.status === 200) {
          return Buffer.from(response.data)
        }

        const errorText = Buffer.isBuffer(response.data)
          ? response.data.toString('utf8')
          : String(response.data || '')

        console.error('Browserless endpoint:', endpoint)
        console.error('Browserless status:', response.status)
        console.error('Browserless body:', errorText)

        if (response.status === 403) {
          throw new Error(`403 Browserless: token non valido o non autorizzato su ${endpoint}`)
        }

        if (response.status === 404) {
          lastError = new Error(`404 Browserless su ${endpoint}: ${errorText}`)
          break
        }

        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2
          continue
        }

        if (response.status >= 400) {
          throw new Error(`Browserless error ${response.status}: ${errorText}`)
        }
      } catch (e) {
        lastError = e
        console.error('Screenshot Error:', endpoint, e.message)

        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2
          continue
        }
      }
    }
  }

  throw lastError || new Error('Impossibile generare screenshot con Browserless')
}

function esc(text = '') {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const validPeriodsMap = {
  sempre: 'overall',
  settimana: '7day',
  mese: '1month',
  '3mesi': '3month',
  '6mesi': '6month',
  anno: '12month'
}

function handleFire(targetJid, senderJid, trackName, conn, m) {
  if (targetJid === senderJid) {
    conn.sendMessage(m.chat, { text: '❌ Non puoi metterti 🔥 da solo' }, { quoted: m })
    return false
  }

  if (!global.db.data.users[targetJid]) {
    global.db.data.users[targetJid] = {}
  }

  global.db.data.users[targetJid].fuochi =
    (global.db.data.users[targetJid].fuochi || 0) + 1

  conn.sendMessage(m.chat, {
    text: `🔥 @${senderJid.split('@')[0]} ha messo 🔥 a *"${trackName}"* di @${targetJid.split('@')[0]}\n❤️ Like totali: *${global.db.data.users[targetJid].fuochi}*`,
    mentions: [senderJid, targetJid]
  }, { quoted: m })

  return true
}

function handleFireTop(conn, m) {
  const users = Object.entries(global.db.data.users || {})
    .filter(([, user]) => Number(user.fuochi) > 0)
    .sort(([, userA], [, userB]) => Number(userB.fuochi) - Number(userA.fuochi))
    .slice(0, 10)

  if (!users.length) {
    return m.reply('❌ Nessuno ha ancora ricevuto like.')
  }

  const medals = ['🥇', '🥈', '🥉']
  const lines = users.map(([jid, user], index) => {
    const position = medals[index] || `${index + 1}.`
    return `${position} @${jid.split('@')[0]} — *${Number(user.fuochi)} like*`
  })

  return conn.sendMessage(m.chat, {
    text: `🏆 *Classifica Like / Cur*\n\n${lines.join('\n')}`,
    mentions: users.map(([jid]) => jid)
  }, { quoted: m })
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
    let db = getDB();

    if (['topfire', 'classificafuoco', 'classificafire', 'toplike', 'topcur'].includes(command)) {
        return handleFireTop(conn, m);
    }
    
    if (command === 'fire') {
        const [target, track] = text.split('|').map(t => t?.trim());
        
        if (!target || !track) {
            return m.reply(`❌ Uso: ${usedPrefix}fire @utente|nome brano`);
        }
        
        const targetJid = target.includes('@') ? target : target + '@s.whatsapp.net';
        handleFire(targetJid, m.sender, track, conn, m);
        return;
    }
    
    if (['setuser', 'impostauser', 'lastfmset'].includes(command)) {
        const username = text.trim();
        if (!username) return m.reply(`❌ Uso: ${usedPrefix}${command} <username>`);
        db[m.sender] = username;
        saveDB(db);
        return m.reply(`✅ Username *${username}* collegato al tuo account!`);
    }

    let targetUser = m.sender;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetUser = m.mentionedJid[0];
    }

    const user = db[targetUser];
    if (!user && !['taste', 'compare', 'compatibilita', 'commonartists'].includes(command)) {
        return m.reply(`⚠️ ${targetUser === m.sender ? 'Registrati' : 'L\'utente taggato non ha registrato il suo username'} con: *${usedPrefix}setuser <username>*`);
    }

    if (!LASTFM_API_KEY) return m.reply('❌ Errore: API Key Last.fm mancante nel config.js');
    if (!BROWSERLESS_KEY) return m.reply('❌ Errore: API Key Browserless mancante nel config.js');

    const globalErrore = global.errore || '❌ Si è verificato un errore. Riprova più tardi.';

    if (['cur', 'attuale', 'nowplaying', 'ciccione'].includes(command)) {
  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    const res = await apiCall('user.getrecenttracks', { user, limit: 1 })
    if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`)

    const track = res.recenttracks?.track?.[0]
    if (!track) return m.reply('❌ Nessun brano trovato.')

    const info = await apiCall('track.getInfo', {
      artist: track.artist['#text'],
      track: track.name,
      username: user
    })

    if (info.error) return m.reply(`❌ Errore Last.fm: ${info.message}`)

    const trackData = info.track || {}
    const queryName = `${track.artist['#text']} ${track.name}`
    const cover = await fetchCover(track.image, queryName)
    const finalCover = cover || getDefaultCover()
    const isNowPlaying = track['@attr']?.nowplaying === 'true'

    const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            width: 1000px;
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #000;
            overflow: hidden;
          }
          .background {
            position: absolute;
            inset: 0;
            background-image: url("${finalCover}");
            background-position: center;
            background-size: cover;
            filter: blur(30px) brightness(0.55);
            transform: scale(1.12);
            opacity: 0.8;
          }
          .glass-card {
            position: relative;
            width: 880px;
            height: 480px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 42px;
            display: flex;
            align-items: center;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          }
          .album-art {
            width: 340px;
            height: 340px;
            border-radius: 28px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            object-fit: cover;
            background: rgba(255,255,255,0.08);
          }
          .details {
            flex: 1;
            margin-left: 42px;
            color: white;
            min-width: 0;
          }
          .status {
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: ${isNowPlaying ? '#32d74b' : '#ff3b30'};
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .dot {
            width: 10px;
            height: 10px;
            background: currentColor;
            border-radius: 50%;
            box-shadow: 0 0 10px currentColor;
          }
          .track-name {
            font-size: 42px;
            font-weight: 800;
            line-height: 1.05;
            margin-bottom: 10px;
            letter-spacing: -1.4px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .artist-name {
            font-size: 25px;
            color: rgba(255,255,255,0.72);
            font-weight: 600;
            margin-bottom: 26px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .stat-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.06);
          }
          .stat-label {
            font-size: 10px;
            color: rgba(255,255,255,0.42);
            text-transform: uppercase;
            font-weight: 800;
            margin-bottom: 4px;
          }
          .stat-value {
            font-size: 19px;
            font-weight: 700;
            color: #fff;
          }
          .accent {
            color: #0a84ff;
          }
        </style>
      </head>
      <body>
        <div class="background"></div>
        <div class="glass-card">
          <img src="${finalCover}" class="album-art" />
          <div class="details">
            <div class="status">
              <span class="dot"></span>
              ${isNowPlaying ? 'In Riproduzione' : 'Ultimo Ascoltato'}
            </div>
            <div class="track-name">${esc(track.name)}</div>
            <div class="artist-name">${esc(track.artist['#text'])}</div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">I tuoi ascolti</div>
                <div class="stat-value">${esc(trackData.userplaycount || 0)}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Ascolti globali</div>
                <div class="stat-value">${parseInt(trackData.playcount || 0).toLocaleString('it-IT')}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Utente</div>
                <div class="stat-value accent">@${esc(user)}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Ascoltatori</div>
                <div class="stat-value">${parseInt(trackData.listeners || 0).toLocaleString('it-IT')}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`

    const buffer = await retryScreenshot(html)

    const caption = `🎧 *@${user} sta ascoltando:*\n🎵 *${track.name}*\n👤 *${track.artist['#text']}*`

    const iosButtons = [
      { buttonId: `${usedPrefix}fire ${targetUser}|${track.name}`, buttonText: { displayText: '🔥' }, type: 1 },
      { buttonId: `${usedPrefix}playaud ${track.name} ${track.artist['#text']}`, buttonText: { displayText: '🎵 Audio' }, type: 1 },
      { buttonId: `${usedPrefix}playvid ${track.name} ${track.artist['#text']}`, buttonText: { displayText: '📽️ Video' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption,
      footer: '',
      buttons: iosButtons,
      headerType: 4
    }, { quoted: m })
  } catch (e) {
    console.error('CUR ERROR:', e)
    return m.reply(`❌ Errore cur: ${e.message}`)
  } finally {
    await conn.sendPresenceUpdate('paused', m.chat)
  }
}
    if (['lastfm', 'profilolastfm', 'lfmprofile'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const res = await apiCall('user.getinfo', { user });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const userInfo = res.user || {};
            const cover = await fetchCover(userInfo.image, user);
            const registered = new Date(parseInt(userInfo.registered.unixtime) * 1000).toLocaleDateString('it-IT');
            const age = userInfo.age > 0 ? userInfo.age : 'N/A';
            const gender = userInfo.gender === 'm' ? 'Maschio' : userInfo.gender === 'f' ? 'Femmina' : 'N/A';
            const subscriber = userInfo.subscriber === '1' ? 'Sì' : 'No';
            const realname = userInfo.realname || userInfo.name;
            const country = userInfo.country || 'N/A';
            const playcount = parseInt(userInfo.playcount || 0).toLocaleString();
            const playlists = userInfo.playlists || 0;
            const html = `
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                    body { margin: 0; padding: 0; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; background: #000; overflow: hidden; }
                    .background { position: absolute; width: 100%; height: 100%; background: url('${cover}') center/cover; filter: blur(30px) brightness(0.7); opacity: 0.7; }
                    .glass-card { position: relative; width: 880px; height: 480px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50px; display: flex; align-items: center; padding: 45px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
                    .album-art { width: 340px; height: 340px; border-radius: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); object-fit: cover; }
                    .details { flex: 1; margin-left: 50px; color: white; }
                    .status { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #0a84ff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
                    .track-name { font-size: 44px; font-weight: 800; line-height: 1.1; margin-bottom: 10px; letter-spacing: -1.5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 400px; }
                    .artist-name { font-size: 26px; color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 30px; }
                    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .stat-item { background: rgba(255, 255, 255, 0.04); padding: 15px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); }
                    .stat-label { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
                    .stat-value { font-size: 20px; font-weight: 700; color: #fff; }
                </style>
            </head>
            <body>
                <div class="background"></div>
                <div class="glass-card">
                    <img src="${cover}" class="album-art" />
                    <div class="details">
                        <div class="status"><span style="width:10px; height:10px; background:currentColor; border-radius:50%; box-shadow: 0 0 1px currentColor;"></span>Profilo Utente</div>
                        <div class="track-name">${userInfo.name}</div>
                        <div class="artist-name">${realname}</div>
                        <div class="stats-grid">
                            <div class="stat-item"><div class="stat-label">Paese</div><div class="stat-value">${country}</div></div>
                            <div class="stat-item"><div class="stat-label">Età</div><div class="stat-value">${age}</div></div>
                            <div class="stat-item"><div class="stat-label">Genere</div><div class="stat-value">${gender}</div></div>
                            <div class="stat-item"><div class="stat-label">Iscritto Dal</div><div class="stat-value">${registered}</div></div>
                            <div class="stat-item"><div class="stat-label">Ascolti Totali</div><div class="stat-value">${playcount}</div></div>
                            <div class="stat-item"><div class="stat-label">Subscriber</div><div class="stat-value">${subscriber}</div></div>
                            <div class="stat-item"><div class="stat-label">Playlists</div><div class="stat-value">${playlists}</div></div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
            const buffer = await retryScreenshot(html);

            const caption = `👤 *Profilo di @${user}*\n👤 *Nome:* ${userInfo.name}\n🌍 *Paese:* ${country}`;

            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: caption,
                footer: '',
            }, { quoted: m });
        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    const sendListResponse = async (header, cardsData) => {
        let listText = `${header}\n\n`;
        cardsData.forEach((item, index) => {
            listText += `*${index + 1}.* ${item.title.replace(/^\d+\.\s/, '')}\n`;
            if(item.body) listText += `_ ${item.body}_\n`;
            listText += `\n`;
        });
        const image = cardsData[0]?.image || { url: DEFAULT_COVER };
        
        await conn.sendMessage(m.chat, {
            image: image,
            caption: listText.trim(),
            footer: ""
        }, { quoted: m });
    };

    if (['recent', 'recenti', 'lasttracks'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const limit = 10;
            const res = await apiCall('user.getrecenttracks', { user, limit });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const tracks = res.recenttracks?.track || [];
            if (!tracks.length) return m.reply('❌ Nessuna traccia recente trovata.');
            
            const cards = await Promise.all(tracks.map(async (track, index) => {
                const queryName = `${track.artist['#text']} ${track.name}`;
                const cover = await fetchCover(track.image, queryName);
                const isNowPlaying = track['@attr']?.nowplaying === 'true' ? ' (In Riproduzione)' : '';
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${track.name.substring(0, 50)}${track.name.length > 50 ? '...' : ''}${isNowPlaying}`,
                    body: `👤 ${track.artist['#text']}`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: track.url }) }]
                };
            }));

            await sendListResponse(`🎵 *Tracce Recenti per @${user}*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['lovedtracks', 'preferiti', 'favorites'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const res = await apiCall('user.getlovedtracks', { user, limit: 10 });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const tracks = res.lovedtracks?.track || [];
            if (!tracks.length) return m.reply('❌ Nessuna traccia preferita trovata.');
            
            const cards = await Promise.all(tracks.map(async (track, index) => {
                const queryName = `${track.artist.name} ${track.name}`;
                const cover = await fetchCover(track.image, queryName);
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${track.name.substring(0, 50)}${track.name.length > 50 ? '...' : ''}`,
                    body: `👤 ${track.artist.name}`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: track.url }) }]
                };
            }));

            await sendListResponse(`❤️ *Tracce Preferite per @${user}*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['friends', 'amici', 'lfmfriends'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const res = await apiCall('user.getfriends', { user, limit: 10 });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const friends = res.friends?.user || [];
            if (!friends.length) return m.reply('❌ Nessun amico trovato.');
            
            const cards = await Promise.all(friends.map(async (friend, index) => {
                const cover = await fetchCover(friend.image, friend.name);
                const registered = new Date(parseInt(friend.registered.unixtime) * 1000).toLocaleDateString('it-IT');
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${friend.name.substring(0, 50)}`,
                    body: `Iscritto dal: ${registered}`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: friend.url }) }]
                };
            }));

            await sendListResponse(`👥 *Amici di @${user}*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['toptags', 'topgenres'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const res = await apiCall('user.gettoptags', { user, limit: 10 });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const tags = res.toptags?.tag || [];
            if (!tags.length) return m.reply('❌ Nessun tag trovato.');
            
            const cards = tags.map((tag, index) => {
                const cover = DEFAULT_COVER;
                const count = parseInt(tag.count || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${tag.name.substring(0, 50)}`,
                    body: `Conteggio: ${count}`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: tag.url }) }]
                };
            });

            await sendListResponse(`🏷️ *Top Tag per @${user}*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['personaltags'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const [tag, type] = text.trim().toLowerCase().split(' ');
            if (!tag || !type) return m.reply(`❌ Uso: ${usedPrefix}${command} <tag> <artist|album|track>`);
            const taggingtype = type;
            if (!['artist', 'album', 'track'].includes(taggingtype)) return m.reply('❌ Tipo non valido: artist, album, track');
            const res = await apiCall('user.getpersonaltags', { user, tag, taggingtype, limit: 10 });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const items = res.taggings?.[`${taggingtype}s`]?.[taggingtype] || [];
            if (!items.length) return m.reply('❌ Nessun elemento trovato.');
            
            const cards = await Promise.all(items.map(async (item, index) => {
                const isArtist = taggingtype === 'artist';
                const queryName = isArtist ? item.name : `${item.artist.name} ${item.name}`;
                const cover = await fetchCover(item.image, queryName, isArtist);
                const body = isArtist ? '' : `👤 ${item.artist.name}`;
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${item.name.substring(0, 50)}${item.name.length > 50 ? '...' : ''}`,
                    body,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: item.url }) }]
                };
            }));

            await sendListResponse(`🏷️ *${tag.charAt(0).toUpperCase() + tag.slice(1)} ${taggingtype.charAt(0).toUpperCase() + taggingtype.slice(1)} per @${user}*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['weeklyartists', 'weeklyartisti'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const chartRes = await apiCall('user.getweeklychartlist', { user });
            if (chartRes.error) return m.reply(`❌ Errore Last.fm: ${chartRes.message}`);
            const charts = chartRes.weeklychartlist?.chart || [];
            if (!charts.length) return m.reply('❌ Nessuna chart settimanale trovata.');
            const latest = charts[charts.length - 1];
            const from = parseInt(latest.from);
            const to = parseInt(latest.to);
            const fromDate = new Date(from * 1000).toLocaleDateString('it-IT');
            const toDate = new Date(to * 1000).toLocaleDateString('it-IT');
            const res = await apiCall('user.getweeklyartistchart', { user, from, to });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const artists = res.weeklyartistchart?.artist || [];
            if (!artists.length) return m.reply('❌ Nessun artista trovato.');
            
            const cards = await Promise.all(artists.map(async (artist, index) => {
                const cover = await fetchCover(artist.image, artist.name, true);
                const playcount = parseInt(artist.playcount || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${artist.name.substring(0, 50)}`,
                    body: `▶️ ${playcount} ascolti`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: artist.url }) }]
                };
            }));

            await sendListResponse(`🎤 *Top Artisti Settimanali per @${user} (${fromDate} - ${toDate})*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['weeklyalbums'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const chartRes = await apiCall('user.getweeklychartlist', { user });
            if (chartRes.error) return m.reply(`❌ Errore Last.fm: ${chartRes.message}`);
            const charts = chartRes.weeklychartlist?.chart || [];
            if (!charts.length) return m.reply('❌ Nessuna chart settimanale trovata.');
            const latest = charts[charts.length - 1];
            const from = parseInt(latest.from);
            const to = parseInt(latest.to);
            const fromDate = new Date(from * 1000).toLocaleDateString('it-IT');
            const toDate = new Date(to * 1000).toLocaleDateString('it-IT');
            const res = await apiCall('user.getweeklyalbumchart', { user, from, to });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const albums = res.weeklyalbumchart?.album || [];
            if (!albums.length) return m.reply('❌ Nessun album trovato.');
            
            const cards = await Promise.all(albums.map(async (album, index) => {
                const queryName = `${album.artist['#text']} ${album.name}`;
                const cover = await fetchCover(album.image, queryName);
                const playcount = parseInt(album.playcount || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${album.name.substring(0, 50)}${album.name.length > 50 ? '...' : ''}`,
                    body: `👤 ${album.artist['#text']}\n▶️ ${playcount} ascolti`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: album.url }) }]
                };
            }));

            await sendListResponse(`📀 *Top Album Settimanali per @${user} (${fromDate} - ${toDate})*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['weeklytracks', 'weeklycanzoni'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const chartRes = await apiCall('user.getweeklychartlist', { user });
            if (chartRes.error) return m.reply(`❌ Errore Last.fm: ${chartRes.message}`);
            const charts = chartRes.weeklychartlist?.chart || [];
            if (!charts.length) return m.reply('❌ Nessuna chart settimanale trovata.');
            const latest = charts[charts.length - 1];
            const from = parseInt(latest.from);
            const to = parseInt(latest.to);
            const fromDate = new Date(from * 1000).toLocaleDateString('it-IT');
            const toDate = new Date(to * 1000).toLocaleDateString('it-IT');
            const res = await apiCall('user.getweeklytrackchart', { user, from, to });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const tracks = res.weeklytrackchart?.track || [];
            if (!tracks.length) return m.reply('❌ Nessuna canzone trovata.');
            
            const cards = await Promise.all(tracks.map(async (track, index) => {
                const queryName = `${track.artist['#text']} ${track.name}`;
                const cover = await fetchCover(track.image, queryName);
                const playcount = parseInt(track.playcount || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${track.name.substring(0, 50)}${track.name.length > 50 ? '...' : ''}`,
                    body: `👤 ${track.artist['#text']}\n▶️ ${playcount} ascolti`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: track.url }) }]
                };
            }));

            await sendListResponse(`🎵 *Top Canzoni Settimanali per @${user} (${fromDate} - ${toDate})*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['topalbums', 'topalbum'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const periodInput = text.trim().toLowerCase() || 'mese';
            const period = validPeriodsMap[periodInput];
            if (!period) return m.reply(`❌ Periodo non valido. Usa: ${Object.keys(validPeriodsMap).join(', ')}`);
            const res = await apiCall('user.gettopalbums', { user, limit: 10, period });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const albums = res.topalbums?.album || [];
            if (!albums.length) return m.reply('❌ Nessun album trovato.');
            
            const cards = await Promise.all(albums.map(async (album, index) => {
                const queryName = `${album.artist.name} ${album.name}`; 
                const cover = await fetchCover(album.image, queryName);
                const playcount = parseInt(album.playcount || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${album.name.substring(0, 50)}${album.name.length > 50 ? '...' : ''}`,
                    body: `👤 ${album.artist.name}\n▶️ ${playcount} ascolti`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: album.url }) }]
                };
            }));

            await sendListResponse(`📀 *Top Album per @${user} (${periodInput})*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['toptracks', 'topcanzoni2'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            const periodInput = text.trim().toLowerCase() || 'mese';
            const period = validPeriodsMap[periodInput];
            if (!period) return m.reply(`❌ Periodo non valido. Usa: ${Object.keys(validPeriodsMap).join(', ')}`);
            const res = await apiCall('user.gettoptracks', { user, limit: 10, period });
            if (res.error) return m.reply(`❌ Errore Last.fm: ${res.message}`);
            const tracks = res.toptracks?.track || [];
            if (!tracks.length) return m.reply('❌ Nessuna canzone trovata.');
            
            const cards = await Promise.all(tracks.map(async (track, index) => {
                const queryName = `${track.artist.name} ${track.name}`;
                const cover = await fetchCover(track.image, queryName);
                const playcount = parseInt(track.playcount || 0).toLocaleString();
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${track.name.substring(0, 50)}${track.name.length > 50 ? '...' : ''}`,
                    body: `👤 ${track.artist.name}\n▶️ ${playcount} ascolti`,
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url: track.url }) }]
                };
            }));

            await sendListResponse(`🎵 *Top Canzoni per @${user} (${periodInput})*`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['taste', 'compare', 'compatibilita'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            let user1 = user || text.trim().split(' ')[0];
            let user2;
            if (m.mentionedJid && m.mentionedJid.length > 0) {
                const secondaryTarget = m.mentionedJid[0];
                user2 = db[secondaryTarget];
                if (!user2) return m.reply('⚠️ L\'utente taggato non ha registrato il suo username Last.fm.');
            } else if (text.trim().split(' ').length > 1) {
                user2 = text.trim().split(' ')[1];
            } else if (text.trim()) {
                user2 = text.trim();
            } else {
                return m.reply(`❌ Uso: ${usedPrefix}${command} <username2> o tagga un utente registrato. (Il tuo username è user1 per default)`);
            }

            const period = 'overall';
            const limit = 50;
            const res1 = await apiCall('user.gettopartists', { user: user1, limit, period });
            if (res1.error) return m.reply(`❌ Errore Last.fm per ${user1}: ${res1.message}`);
            const res2 = await apiCall('user.gettopartists', { user: user2, limit, period });
            if (res2.error) return m.reply(`❌ Errore Last.fm per ${user2}: ${res2.message}`);

            const artistMap1 = new Map(res1.topartists?.artist.map(a => [a.name.toLowerCase(), {name: a.name, playcount: parseInt(a.playcount) || 0}]));
            const artistMap2 = new Map(res2.topartists?.artist.map(a => [a.name.toLowerCase(), {name: a.name, playcount: parseInt(a.playcount) || 0}]));

            const allLowerArtists = new Set([...artistMap1.keys(), ...artistMap2.keys()]);
            const vec1 = [];
            const vec2 = [];
            for (let lowerName of allLowerArtists) {
                vec1.push(artistMap1.get(lowerName)?.playcount || 0);
                vec2.push(artistMap2.get(lowerName)?.playcount || 0);
            }

            const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
            const norm1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
            const norm2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
            let score = (norm1 === 0 || norm2 === 0) ? 0 : (dot / (norm1 * norm2) * 100);

            const lowerCommon = [...artistMap1.keys()].filter(key => artistMap2.has(key));
            lowerCommon.sort((a, b) => {
                const minA = Math.min(artistMap1.get(a).playcount, artistMap2.get(a).playcount);
                const minB = Math.min(artistMap1.get(b).playcount, artistMap2.get(b).playcount);
                return minB - minA;
            });
            const artists = lowerCommon.slice(0, 10).map(lowerName => ({
                name: artistMap1.get(lowerName).name,
                play1: artistMap1.get(lowerName).playcount,
                play2: artistMap2.get(lowerName).playcount
            }));

            let compatibilityLevel, statusColor;
            if (score > 80) {
                compatibilityLevel = 'Alta';
                statusColor = '#32d74b';
            } else if (score > 50) {
                compatibilityLevel = 'Media';
                statusColor = '#ffcc00';
            } else {
                compatibilityLevel = 'Bassa';
                statusColor = '#ff3b30';
            }

            const html = `
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                    body { margin: 0; padding: 0; width: 1000px; height: 600px; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; background: #000; overflow: hidden; }
                    .background { position: absolute; width: 100%; height: 100%; background: linear-gradient(to right, #0a84ff, #ff3b30); filter: blur(30px) brightness(0.7); opacity: 0.7; }
                    .glass-card { position: relative; width: 880px; height: 480px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50px; display: flex; align-items: center; padding: 45px; box-sizing: border-box; box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
                    .details { flex: 1; color: white; text-align: center; }
                    .status { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: ${statusColor}; margin-bottom: 15px; }
                    .track-name { font-size: 44px; font-weight: 800; line-height: 1.1; margin-bottom: 10px; letter-spacing: -1.5px; }
                    .artist-name { font-size: 26px; color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 30px; }
                    .stats-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
                    .stat-item { background: rgba(255, 255, 255, 0.04); padding: 15px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); }
                    .stat-label { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
                    .stat-value { font-size: 20px; font-weight: 700; color: #fff; }
                </style>
            </head>
            <body>
                <div class="background"></div>
                <div class="glass-card">
                    <div class="details">
                        <div class="status">Compatibilità Musicale</div>
                        <div class="track-name">${score.toFixed(2)}%</div>
                        <div class="artist-name">Tra @${user1} e @${user2}</div>
                        <div class="stats-grid">
                            <div class="stat-item"><div class="stat-label">Livello</div><div class="stat-value">${compatibilityLevel}</div></div>
                            <div class="stat-item"><div class="stat-label">Artisti Condivisi</div><div class="stat-value">${artists.length}</div></div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`;
            const buffer = await retryScreenshot(html);

            const caption = `🔍 *Compatibilità tra @${user1} e @${user2}: ${score.toFixed(2)}%*\n📊 *Livello:* ${compatibilityLevel}\n🤝 *Artisti Condivisi:* ${artists.length}`;

            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: caption,
                footer: ''
            }, { quoted: m });
        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }

    if (['commonartists'].includes(command)) {
        try {
            await conn.sendPresenceUpdate('composing', m.chat);
            let user1 = user;
            let user2;
            if (m.mentionedJid && m.mentionedJid.length > 0) {
                const secondaryTarget = m.mentionedJid[0];
                user2 = db[secondaryTarget];
                if (!user2) return m.reply('⚠️ L\'utente taggato non ha registrato il suo username Last.fm.');
            } else if (text.trim()) {
                user2 = text.trim();
            } else {
                return m.reply(`❌ Uso: ${usedPrefix}${command} <username2> o tagga un utente registrato.`);
            }
            const period = 'overall';
            const res1 = await apiCall('user.gettopartists', { user: user1, limit: 50, period });
            if (res1.error) return m.reply(`❌ Errore Last.fm per ${user1}: ${res1.message}`);
            const res2 = await apiCall('user.gettopartists', { user: user2, limit: 50, period });
            if (res2.error) return m.reply(`❌ Errore Last.fm per ${user2}: ${res2.message}`);
            const artistMap1 = new Map(res1.topartists?.artist.map(a => [a.name.toLowerCase(), {name: a.name, playcount: parseInt(a.playcount) || 0}]));
            const artistMap2 = new Map(res2.topartists?.artist.map(a => [a.name.toLowerCase(), {name: a.name, playcount: parseInt(a.playcount) || 0}]));
            const lowerCommon = [...artistMap1.keys()].filter(key => artistMap2.has(key));
            if (!lowerCommon.length) return m.reply('❌ Nessun artista in comune trovato.');
            lowerCommon.sort((a, b) => {
                const sumA = artistMap1.get(a).playcount + artistMap2.get(a).playcount;
                const sumB = artistMap1.get(b).playcount + artistMap2.get(b).playcount;
                return sumB - sumA;
            });
            const commonArtists = lowerCommon.slice(0, 10).map(lowerName => artistMap1.get(lowerName).name);
            
            const cards = await Promise.all(commonArtists.map(async (artistName, index) => {
                const artistInfo = await apiCall('artist.getinfo', { artist: artistName });
                let cover = DEFAULT_COVER;
                let url = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;
                if (!artistInfo.error) {
                    cover = await fetchCover(artistInfo.artist?.image, artistName, true);
                    url = artistInfo.artist?.url || url;
                }
                return {
                    image: { url: cover },
                    title: `${index + 1}. ${artistName}`,
                    body: '',
                    footer: '',
                    buttons: [{ name: "cta_url", buttonParamsJson: JSON.stringify({ display_text: "Vedi su Last.fm", url }) }]
                };
            }));

            await sendListResponse(`🎤 *Artisti in Comune tra @${user1} e @${user2}* (Top 10)`, cards);

        } catch (e) {
            console.error(e);
            return m.reply(globalErrore);
        } finally {
            await conn.sendPresenceUpdate('paused', m.chat);
        }
    }
};

handler.help = [
    'setuser','cur',
    'lastfm', 'recenti', 'preferiti', 'lfmfriends',
    'toptags','weeklyartisti',
    'weeklyalbums',
    'weeklytracks',
    'topalbums',
    'topartists',
    'toptracks', 'compare',
    'commonartists', 'fire', 'topfire'
]
handler.command = [
    'setuser', 'impostauser', 'lastfmset',
    'cur', 'attuale', 'nowplaying', 'ciccione',
    'lastfm', 'profilolastfm', 'lfmprofile',
    'recent', 'recenti', 'lasttracks',
    'lovedtracks', 'preferiti', 'favorites',
    'friends', 'amici', 'lfmfriends',
    'toptags', 'topgenres',
    'personaltags',
    'weeklyartists', 'weeklyartisti',
    'weeklyalbums',
    'weeklytracks', 'weeklycanzoni',
    'topalbums', 'topalbum',
    'toptracks', 'topcanzoni',
    'taste', 'compare', 'compatibilita',
    'commonartists', 'fire', 'topfire', 'classificafuoco', 'classificafire', 'toplike', 'topcur'
]
handler.group = true
handler.register = true

export default handler;