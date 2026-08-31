//Kinder torna nel prime?
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.join(process.cwd(), 'storage', 'file-json', 'lastfm_users.json')
const getDB = () => fs.existsSync(databasePath) ? JSON.parse(fs.readFileSync(databasePath, 'utf-8')) : {};

const LASTFM_API_KEY = '00cb7e47126ae708d978bc84d1a6be64';
const BROWSERLESS_KEY = '2VAvmYssH5xvWjr265293018be956680f58272693ee60eb5e';
const DEFAULT_COVER = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';

if (!fs.existsSync(path.dirname(databasePath))) fs.mkdirSync(path.dirname(databasePath), { recursive: true });

async function apiCall(method, params) {
    try {
        const query = new URLSearchParams({ method, api_key: LASTFM_API_KEY, format: 'json', ...params });
        const res = await axios.get(`https://ws.audioscrobbler.com/2.0/?${query}`, { timeout: 10000 });
        return res.data;
    } catch (e) {
        return { error: e.response?.status || 'Unknown', message: e.message };
    }
}

async function fetchCover(lastFmImages, query, isArtist = false) {
    const sizes = ['mega', 'extralarge', 'large', 'medium', 'small'];
    for (const size of sizes) {
        const cover = lastFmImages?.find(i => i.size === size)?.['#text'];
        if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover;
    }
    const method = isArtist ? 'artist.getinfo' : 'track.getinfo';
    const params = isArtist ? { artist: query } : { track: query.split(' ').slice(1).join(' '), artist: query.split(' ')[0] };
    const info = await apiCall(method, params);
    if (info.error) return DEFAULT_COVER;
    const images = isArtist ? info.artist?.image : info.track?.album?.image || info.track?.image;
    if (images) {
        for (const size of sizes) {
            const cover = images.find(i => i.size === size)?.['#text'];
            if (cover && cover.trim() !== '' && !cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) return cover;
        }
    }
    return DEFAULT_COVER;
}

async function retryScreenshot(html, width = 1000, height = 600, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post(`https://production-sfo.browserless.io/screenshot?token=${BROWSERLESS_KEY}`, {
                html, options: { type: 'jpeg', quality: 90 }, viewport: { width, height }
            }, { responseType: 'arraybuffer', timeout: 15000 });
            return Buffer.from(response.data);
        } catch (e) {
            if (e.response?.status !== 429) throw e;
            await new Promise(res => setTimeout(res, 2000 * (i + 1)));
        }
    }
    throw new Error('Screenshot failed');
}

const getHtmlWrapper = (bodyContent, customCss = "") => `
<html><head><style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
    body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #050505; color: #fff; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.1); }
    ${customCss}
</style></head><body>${bodyContent}</body></html>`;

async function getGroupMembers(conn, groupJid) {
    try {
        const groupMetadata = await conn.groupMetadata(groupJid);
        return groupMetadata.participants.map(p => p.jid).filter(Boolean);
    } catch (e) {
        console.error("Errore nel recupero membri del gruppo:", e);
        return [];
    }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
    let db = getDB();
    const user = db[m.sender];
    if (!user) return m.reply(`⚠️ Devi registrare il tuo username Last.fm con: *${usedPrefix}setuser <username>*`);

    await conn.sendPresenceUpdate('composing', m.chat);
    let html = '';
    let viewport = { w: 1000, h: 600 };
    let caption = '';

    try {
        switch (command) {
            case 'comuni': {
                if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply(`Uso: *${usedPrefix}comuni @utente*`);

                const user2Jid = m.mentionedJid[0];
                const user2 = db[user2Jid];
                if (!user2) return m.reply("L'utente taggato non ha registrato il suo account Last.fm nel bot.");

                const getFullStats = async (username) => {
                    const topArtRes = await apiCall('user.gettopartists', { user: username, limit: 1000, period: 'overall' });
                    const topTracksRes = await apiCall('user.gettoptracks', { user: username, limit: 1000, period: 'overall' });
                    
                    let stats = {};
                    if (topArtRes.topartists?.artist) {
                        topArtRes.topartists.artist.forEach(a => {
                            stats[a.name.toLowerCase()] = { name: a.name, playcount: parseInt(a.playcount) || 0 };
                        });
                    }
                    if (topTracksRes.toptracks?.track) {
                        topTracksRes.toptracks.track.forEach(t => {
                            const trackPlays = parseInt(t.playcount) || 0;
                            const match = t.name.match(/\((?:feat|ft|featuring)\.?\s+([^)]+)\)/i) || t.name.match(/(?:feat|ft|featuring)\.?\s+(.+)/i);
                            if (match) {
                                const feats = match[1].replace(/\)/g, '').split(/,|\&/).map(s => s.trim());
                                feats.forEach(f => {
                                    if (f) {
                                        const key = f.toLowerCase();
                                        if (stats[key]) {
                                            stats[key].playcount += trackPlays;
                                        } else {
                                            stats[key] = { name: f.charAt(0).toUpperCase() + f.slice(1), playcount: trackPlays };
                                        }
                                    }
                                });
                            }
                        });
                    }
                    return stats;
                };

                const stats1 = await getFullStats(user);
                const stats2 = await getFullStats(user2);

                let common = [];
                for (let key in stats2) {
                    if (stats1[key]) {
                        common.push({
                            name: stats1[key].name,
                            p1: stats1[key].playcount,
                            p2: stats2[key].playcount,
                            total: stats1[key].playcount + stats2[key].playcount
                        });
                    }
                }

                if (common.length === 0) return m.reply(`Nessun artista in comune trovato...`);

                common.sort((a, b) => b.total - a.total);
                common = common.slice(0, 100); 

                let responseText = `Artisti in comune tra ${user} e ${user2}\n(Inclusi i featuring)\n\n`;
                common.forEach((c, index) => {
                    responseText += `${index + 1}. *${c.name}*\n${user}: ${c.p1} ascolti\n${user2}: ${c.p2} ascolti\n\n`;
                });

                return conn.sendMessage(m.chat, { text: responseText.trim() }, { quoted: m });
            }

            case 'crown': {
                const topArt = await apiCall('user.gettopartists', { user, limit: 1, period: 'overall' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Nessun artista trovato nelle tue statistiche.");

                const topArtistName = topArt.topartists.artist[0].name;
                const playcount = parseInt(topArt.topartists.artist[0].playcount) || 0;

                const artistInfo = await apiCall('artist.getinfo', { artist: topArtistName, username: user });
                if (artistInfo.error) throw new Error("Errore nel recupero dettagli artista.");

                const artistData = artistInfo.artist;
                const isGold = playcount >= 1000;

                const cover = await fetchCover(artistData.image, artistData.name, true);

                html = getHtmlWrapper(`
                    <div class="background-blur" style="background-image: url('${cover}')"></div>
                    <div class="color-overlay"></div>
                    <div class="card glass ${isGold ? 'gold' : 'silver'}">
                        <img src="${cover}" class="cover">
                        <div class="info">
                            <h1 style="margin:0; font-size: 55px; text-shadow: 0 4px 15px rgba(0,0,0,0.8);">${artistData.name}</h1>
                            <p style="color: ${isGold ? '#ffd700' : '#e0e0e0'}; font-size: 26px; font-weight: 800; margin-top:10px; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">CERTIFICATO ${isGold ? 'ORO' : 'FAN'}</p>
                            <p style="font-size: 22px; margin-top: auto; color: rgba(255,255,255,0.9);">Ascolti totali: <span style="font-size:40px; font-weight:800; color:#fff;">${playcount}</span></p>
                            <p style="font-size: 16px; opacity: 0.7; font-weight: 600;">Intestato a: @${user}</p>
                        </div>
                    </div>
                `, `
                    .background-blur { position: absolute; top: -50px; left: -50px; right: -50px; bottom: -50px; background-size: cover; background-position: center; filter: blur(35px) brightness(0.4); z-index: -2; }
                    .color-overlay { position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%); z-index: -1; }
                    .card { width: 850px; height: 450px; border-radius: 35px; display: flex; padding: 40px; box-sizing: border-box; gap: 40px; position: relative; overflow: hidden; background: rgba(20, 20, 20, 0.4); backdrop-filter: blur(40px); }
                    .gold { box-shadow: 0 30px 80px rgba(255, 215, 0, 0.3), inset 0 0 40px rgba(255, 215, 0, 0.1); border: 2px solid rgba(255,215,0,0.6); }
                    .silver { box-shadow: 0 30px 80px rgba(255, 255, 255, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.05); border: 2px solid rgba(255,255,255,0.3); }
                    .cover { width: 370px; height: 370px; border-radius: 20px; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
                    .info { display: flex; flex-direction: column; flex: 1; }
                `);
                caption = `🏆 *Il tuo Certificato d'Ossessione*\nUtente: ${user}\nArtista principale: ${artistData.name}\n> by kinder`;
                break;
            }
            case 'topartists':
            case 'topartisti': {
                const limit = 6;
                const topArtRes = await apiCall('user.gettopartists', { user, limit: 1000, period: 'overall' });
                const topTracksRes = await apiCall('user.gettoptracks', { user, limit: 1000, period: 'overall' });
                
                if (topArtRes.error || !topArtRes.topartists?.artist?.length) {
                    throw new Error("Non hai abbastanza dati per generare la classifica.");
                }

                let stats = {};
                topArtRes.topartists.artist.forEach(a => {
                    stats[a.name.toLowerCase()] = { name: a.name, playcount: parseInt(a.playcount) || 0, image: a.image };
                });

                if (topTracksRes.toptracks?.track) {
                    topTracksRes.toptracks.track.forEach(t => {
                        const trackPlays = parseInt(t.playcount) || 0;
                        const match = t.name.match(/\((?:feat|ft|featuring)\.?\s+([^)]+)\)/i) || t.name.match(/(?:feat|ft|featuring)\.?\s+(.+)/i);
                        if (match) {
                            const feats = match[1].replace(/\)/g, '').split(/,|\&/).map(s => s.trim());
                            feats.forEach(f => {
                                if (f) {
                                    const key = f.toLowerCase();
                                    if (stats[key]) {
                                        stats[key].playcount += trackPlays;
                                    } else {
                                        stats[key] = { name: f.charAt(0).toUpperCase() + f.slice(1), playcount: trackPlays };
                                    }
                                }
                            });
                        }
                    });
                }

                const artists = Object.values(stats).sort((a, b) => b.playcount - a.playcount).slice(0, limit);
                const topOne = artists[0];
                const maxPlays = topOne.playcount;
                
                const mainCover = await fetchCover(topOne.image, topOne.name, true);

                let artistListHtml = '';
                artists.forEach((art, i) => {
                    const percentage = Math.max((art.playcount / maxPlays) * 100, 8);
                    artistListHtml += `
                        <div class="art-row">
                            <div class="art-rank">${i + 1}</div>
                            <div class="art-info">
                                <div class="art-name-row">
                                    <span class="art-name">${art.name}</span>
                                    <span class="art-count">${art.playcount.toLocaleString('it-IT')}</span>
                                </div>
                                <div class="art-bar-bg">
                                    <div class="art-bar-fill" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                viewport = { w: 800, h: 800 };
                html = getHtmlWrapper(`
                    <div class="bg-image" style="background-image: url('${mainCover}')"></div>
                    <div class="overlay"></div>
                    <div class="content-box glass">
                        <div class="header">
                            <p class="subtitle">STATISTICHE DI SEMPRE</p>
                            <h1 class="title">TOP ARTISTI</h1>
                            <div class="user-badge">@${user.toUpperCase()}</div>
                        </div>
                        <div class="list-container">
                            ${artistListHtml}
                        </div>
                        <div class="footer-msg">Basato sui dati del tuo account Last.fm (inclusi i featuring)</div>
                    </div>
                `, `
                    .bg-image { position: absolute; width: 110%; height: 110%; top: -5%; left: -5%; background-size: cover; background-position: center; filter: blur(30px) brightness(0.2); z-index: -2; }
                    .overlay { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.8)); z-index: -1; }
                    .content-box { width: 700px; padding: 50px; border-radius: 40px; display: flex; flex-direction: column; gap: 40px; }
                    .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 30px; }
                    .subtitle { font-size: 14px; letter-spacing: 5px; color: #0a84ff; font-weight: 800; margin: 0; }
                    .title { font-size: 60px; font-weight: 900; margin: 10px 0; letter-spacing: -2px; }
                    .user-badge { display: inline-block; background: #fff; color: #000; padding: 5px 20px; border-radius: 50px; font-weight: 800; font-size: 16px; }
                    .list-container { display: flex; flex-direction: column; gap: 25px; }
                    .art-row { display: flex; align-items: center; gap: 25px; }
                    .art-rank { font-size: 35px; font-weight: 900; color: rgba(255,255,255,0.2); width: 40px; font-style: italic; }
                    .art-info { flex: 1; display: flex; flex-direction: column; gap: 10px; }
                    .art-name-row { display: flex; justify-content: space-between; align-items: flex-end; }
                    .art-name { font-size: 24px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
                    .art-count { font-size: 18px; font-weight: 800; opacity: 0.9; color: #0a84ff; }
                    .art-bar-bg { width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
                    .art-bar-fill { height: 100%; background: linear-gradient(90deg, #0a84ff, #00d2ff); border-radius: 10px; box-shadow: 0 0 15px rgba(10,132,255,0.4); }
                    .footer-msg { text-align: center; font-size: 14px; opacity: 0.4; font-weight: 600; margin-top: 10px; }
                `);
                caption = `La tua Hall of Fame Musicale\nQuesti sono gli artisti che hai ascoltato di più!\n> by kinder`;
                break;
            }
            
            case 'curaura': {
                const topArt = await apiCall('user.gettopartists', { user, limit: 10, period: '1month' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Errore recupero artisti.");

                const totalPlays = topArt.topartists.artist.reduce((acc, art) => acc + parseInt(art.playcount), 0);
                
                const auras = [
                    { name: "Oscura & Misteriosa", colors: ['#4B0082', '#000000', '#2F4F4F'] },
                    { name: "Eclettica & Vibrante", colors: ['#8A2BE2', '#FF4500', '#1E90FF'] },
                    { name: "Calma & Eterea", colors: ['#A4C639', '#87CEFA', '#E0FFFF'] },
                    { name: "Fuoco & Passione", colors: ['#FF0000', '#FF8C00', '#FF1493'] },
                    { name: "Malinconica & Profonda", colors: ['#000080', '#4682B4', '#708090'] },
                    { name: "Energetica & Caotica", colors: ['#FF1493', '#00FF00', '#FFFF00'] },
                    { name: "Celestiale & Pura", colors: ['#FFFFFF', '#87CEEB', '#E6E6FA'] }
                ];
                
                const selectedAura = auras[totalPlays % auras.length];

                let tagsStr = `<div style="z-index: 10; text-align: center;">
                    <h2 style="font-size: 24px; opacity:0.9; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">La tua Aura Musicale</h2>
                    <h1 style="font-size: 60px; font-family: 'Playfair Display', serif; margin: 10px 0; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">${selectedAura.name}</h1>
                    <p style="font-size: 20px; opacity:0.8; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">@${user}</p>
                </div>`;

                html = getHtmlWrapper(`
                    <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
                    ${tagsStr}
                `, `
                    body { background: #020202; }
                    .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.8; mix-blend-mode: screen; z-index: 1; }
                    .b1 { width: 600px; height: 600px; background: ${selectedAura.colors[0]}; top: -100px; left: -100px; }
                    .b2 { width: 500px; height: 500px; background: ${selectedAura.colors[1]}; bottom: -50px; right: 50px; }
                    .b3 { width: 400px; height: 400px; background: ${selectedAura.colors[2]}; top: 50%; left: 50%; transform: translate(-50%, -50%); }
                `);
                caption = `✨ *La tua Music Aura mensile*\n@${user} - ${selectedAura.name}\n> by kinder`;
                break;
            }

            case 'curvs': {
                if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply(`Uso: *${usedPrefix}vs @utente <artista>*`);

                const user2Jid = m.mentionedJid[0];
                const user2 = db[user2Jid];
                if (!user2) return m.reply("L'utente taggato non ha registrato il suo account Last.fm nel bot.");

                const artistName = text.replace(/@\d+/g, '').trim();
                if (!artistName) return m.reply(`Devi specificare un artista! Esempio: *${usedPrefix}vs @utente The Weeknd*`);
                
                const searchName = artistName.toLowerCase();

                const getRealScore = async (username) => {
                    const info = await apiCall('artist.getinfo', { artist: artistName, username });
                    let baseScore = parseInt(info.artist?.stats?.userplaycount) || 0;
                    
                    const tracksRes = await apiCall('user.gettoptracks', { user: username, limit: 1000, period: 'overall' });
                    let extraScore = 0;
                    if (tracksRes.toptracks?.track) {
                        tracksRes.toptracks.track.forEach(t => {
                            if (t.artist.name.toLowerCase() !== searchName && t.name.toLowerCase().includes(searchName)) {
                                extraScore += parseInt(t.playcount) || 0;
                            }
                        });
                    }
                    return { info, score: baseScore + extraScore };
                };

                const [res1, res2] = await Promise.all([getRealScore(user), getRealScore(user2)]);
                if (res1.info.error || res2.info.error) throw new Error("Errore API. Sicuro che l'artista esista su Last.fm?");

                const score1 = res1.score;
                const score2 = res2.score;
                const total = score1 + score2 || 1;
                const w1 = (score1 / total) * 100;
                const w2 = (score2 / total) * 100;
                const cover = await fetchCover(res1.info.artist?.image, res1.info.artist?.name, true);

                html = getHtmlWrapper(`
                    <div class="battle-title">BATTLE: ${res1.info.artist.name}</div>
                    <div class="side left" style="width: ${w1}%">
                        <img src="${cover}" class="bg-img">
                        <div class="overlay"></div>
                        <div class="content">
                            <h2 style="font-size: 35px; color: #fff; margin-bottom: 5px;">@${user}</h2>
                            <p class="score">${score1}</p>
                        </div>
                    </div>
                    <div class="side right" style="width: ${w2}%">
                        <img src="${cover}" class="bg-img">
                        <div class="overlay"></div>
                        <div class="content">
                            <h2 style="font-size: 35px; color: #fff; margin-bottom: 5px;">@${user2}</h2>
                            <p class="score">${score2}</p>
                        </div>
                    </div>
                    <div class="vs-badge">VS</div>
                `, `
                    .battle-title { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); font-size: 45px; font-weight: 800; z-index: 30; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 4px 20px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.2); }
                    .side { height: 100%; position: relative; display: flex; flex-direction: column; justify-content: center; overflow: hidden; transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1); }
                    .left { background: linear-gradient(135deg, rgba(0, 30, 100, 0.95), rgba(0, 180, 255, 0.85)); align-items: flex-start; padding-left: 60px; border-right: 6px solid rgba(255,255,255,0.9); box-shadow: inset -30px 0 60px rgba(0,0,0,0.6); }
                    .right { background: linear-gradient(135deg, rgba(130, 0, 0, 0.95), rgba(255, 70, 0, 0.85)); align-items: flex-end; padding-right: 60px; box-shadow: inset 30px 0 60px rgba(0,0,0,0.6); }
                    .bg-img { position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3; z-index: -1; mix-blend-mode: overlay; filter: grayscale(50%); }
                    .content { z-index: 10; text-shadow: 0 4px 15px rgba(0,0,0,0.8); }
                    .score { font-size: 90px; font-weight: 800; margin: 0; line-height: 1; text-shadow: 0 5px 25px rgba(0,0,0,0.7); }
                    .vs-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90px; height: 90px; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 35px; font-style: italic; font-weight: 800; box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 -5px 15px rgba(0,0,0,0.2); z-index: 20; border: 4px solid #111; }
                `);
                caption = `ARTIST BATTLE\n${user} [${score1}] VS ${user2} [${score2}]\nArtista: ${res1.info.artist.name}\n> by kinder`;
                break;
            }


            case 'mosaic': {
                viewport = { w: 900, h: 900 }; 
                const albums = await apiCall('user.gettopalbums', { user, limit: 9, period: '1month' });
                if (albums.error) throw new Error("Errore recupero album.");

                const top9 = albums.topalbums.album.slice(0, 9);
                let gridHtml = '';
                let listText = `🧩 *Music Mosaic (Top 9 del Mese)*\nUtente: @${user}\n\n`;

                for (let i = 0; i < top9.length; i++) {
                    const al = top9[i];
                    const cover = await fetchCover(al.image, `${al.artist.name} ${al.name}`);
                    gridHtml += `<div class="album" style="background-image: url('${cover}')"></div>`;
                    listText += `${i + 1}. ${al.artist.name} - ${al.name}\n`;
                }

                html = getHtmlWrapper(`
                    <div class="mesh-bg"></div>
                    <div class="grid">${gridHtml}</div>
                    <div class="watermark">@${user} - Top 9 Mese</div>
                `, `
                    .mesh-bg { position: absolute; width: 100%; height: 100%; background: radial-gradient(at 20% 20%, rgba(40,40,40,1) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(20,20,20,1) 0px, transparent 50%); background-color: #050505; z-index: -1; }
                    .grid { display: grid; grid-template-columns: repeat(3, 1fr); width: 840px; height: 840px; gap: 15px; padding: 30px; box-sizing: border-box; }
                    .album { background-size: cover; background-position: center; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.6); transition: transform 0.3s; }
                    .watermark { position: absolute; bottom: 35px; right: 35px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 12px 25px; border-radius: 25px; font-weight: 800; font-size: 18px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
                `);
                caption = listText.trim() + '\n> by kinder';
                break;
            }

            case 'goal': {
                const info = await apiCall('user.getinfo', { user });
                if (info.error) throw new Error("Impossibile recuperare info utente.");

                const total = parseInt(info.user.playcount);
                const milestone = Math.ceil((total + 1) / 10000) * 10000;
                const remaining = milestone - total;
                const percentage = ((total % 10000) / 10000) * 100;

                const topArtRes = await apiCall('user.gettopartists', { user, limit: 1, period: 'overall' });
                let bgCover = DEFAULT_COVER;
                if (!topArtRes.error && topArtRes.topartists?.artist?.length > 0) {
                    bgCover = await fetchCover(topArtRes.topartists.artist[0].image, topArtRes.topartists.artist[0].name, true);
                }

                html = getHtmlWrapper(`
                    <div class="background-blur" style="background-image: url('${bgCover}')"></div>
                    <div class="color-overlay"></div>
                    <div class="card glass">
                        <h2 style="font-size: 24px; color: rgba(255,255,255,0.7); margin-top:0; letter-spacing: 2px;">MILESTONE TRACKER</h2>
                        <h1 style="font-size: 48px; margin: 10px 0;">Mancano <span style="color:#0a84ff">${remaining.toLocaleString()}</span> ascolti</h1>
                        <p style="font-size: 20px; margin-bottom: 40px; color: rgba(255,255,255,0.9);">al traguardo dei ${milestone.toLocaleString()} scrobble totali!</p>
                        
                        <div class="progress-bg">
                            <div class="progress-bar" style="width: ${percentage}%"></div>
                        </div>
                        <div style="display:flex; justify-content: space-between; margin-top:15px; font-weight: 600; font-size: 18px; color: rgba(255,255,255,0.6);">
                            <span>${(milestone - 10000).toLocaleString()}</span>
                            <span>${milestone.toLocaleString()}</span>
                        </div>
                    </div>
                `, `
                    .background-blur { position: absolute; top: -50px; left: -50px; right: -50px; bottom: -50px; background-size: cover; background-position: center; filter: blur(40px) brightness(0.5); z-index: -2; }
                    .color-overlay { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at top right, rgba(10,132,255,0.3), transparent 50%), radial-gradient(circle at bottom left, rgba(255,59,48,0.2), transparent 50%); z-index: -1; }
                    .card { width: 800px; padding: 50px; border-radius: 30px; text-align: center; background: rgba(0, 0, 0, 0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                    .progress-bg { width: 100%; height: 30px; background: rgba(255,255,255,0.1); border-radius: 15px; overflow: hidden; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
                    .progress-bar { height: 100%; background: linear-gradient(90deg, #0a84ff, #00d2ff); border-radius: 15px; box-shadow: 0 0 20px rgba(10,132,255,0.5); }
                `);
                caption = `📅 *Traguardo in avvicinamento per @${user}*\n> by kinder`;
                break;
            }
            case 'receipt': {
                const topTracksRes = await apiCall('user.gettoptracks', { user, limit: 10, period: '1month' });
                if (topTracksRes.error || !topTracksRes.toptracks?.track?.length) throw new Error("Errore recupero brani.");

                const tracks = topTracksRes.toptracks.track;
                let totalScrobbles = 0;
                let itemsHtml = '';

                tracks.forEach((t, i) => {
                    const playcount = parseInt(t.playcount);
                    totalScrobbles += playcount;
                    let title = t.name.length > 20 ? t.name.substring(0, 18) + '..' : t.name;
                    let artist = t.artist.name.length > 15 ? t.artist.name.substring(0, 13) + '..' : t.artist.name;
                    itemsHtml += `
                        <div class="receipt-item">
                            <span>${(i+1).toString().padStart(2, '0')}. ${title} - ${artist}</span>
                            <span>${playcount}</span>
                        </div>
                    `;
                });

                const today = new Date().toLocaleDateString('it-IT');
                const orderNum = Math.floor(Math.random() * 90000) + 10000;

                let barcodeHtml = '';
                for(let j=0; j<35; j++) {
                    let w = Math.floor(Math.random() * 4) + 1; 
                    let mR = Math.floor(Math.random() * 2);    
                    barcodeHtml += `<div style="width: ${w}px; height: 50px; background: #000; margin-right: ${mR}px;"></div>`;
                }

                viewport = { w: 500, h: 800 };
                html = getHtmlWrapper(`
                    <div class="receipt-container">
                        <div class="receipt">
                            <div class="receipt-header">
                                <h2>LAST.FM RECORDS</h2>
                                <p>SCONTRINO MUSICALE</p>
                                <p>-------------------------</p>
                                <p>CLIENTE: @${user.toUpperCase()}</p>
                                <p>DATA: ${today}</p>
                                <p>ORDINE: #${orderNum}</p>
                                <p>-------------------------</p>
                            </div>
                            <div class="receipt-body">
                                <div class="receipt-item" style="font-weight: bold; margin-bottom: 10px;">
                                    <span>BRANO</span>
                                    <span>SCROBBLE</span>
                                </div>
                                ${itemsHtml}
                            </div>
                            <div class="receipt-footer">
                                <p>-------------------------</p>
                                <div class="receipt-item" style="font-size: 20px; font-weight: bold;">
                                    <span>TOTALE MESE:</span>
                                    <span>${totalScrobbles}</span>
                                </div>
                                <p>-------------------------</p>
                                <p>GRAZIE E ARRIVEDERCI</p>
                                <div style="display: flex; justify-content: center; margin-top: 20px;">
                                    ${barcodeHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
                    body { background: #1a1a1a; font-family: 'Space Mono', monospace; color: #000; }
                    .receipt-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; padding: 20px; }
                    .receipt { background: #f4f4f0; width: 400px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; filter: drop-shadow(0px 5px 15px rgba(0,0,0,0.5)); }
                    .receipt::before, .receipt::after { content: ''; position: absolute; left: 0; right: 0; height: 10px; background-size: 20px 20px; }
                    .receipt::before { top: -10px; background-image: linear-gradient(-45deg, transparent 33.33%, #f4f4f0 33.33%, #f4f4f0 66.66%, transparent 66.66%), linear-gradient(45deg, transparent 33.33%, #f4f4f0 33.33%, #f4f4f0 66.66%, transparent 66.66%); }
                    .receipt::after { bottom: -10px; background-image: linear-gradient(-45deg, #f4f4f0 33.33%, transparent 33.33%, transparent 66.66%, #f4f4f0 66.66%), linear-gradient(45deg, #f4f4f0 33.33%, transparent 33.33%, transparent 66.66%, #f4f4f0 66.66%); }
                    .receipt-header, .receipt-footer { text-align: center; }
                    .receipt-header h2 { margin: 0; font-size: 28px; letter-spacing: -1px; }
                    .receipt-header p, .receipt-footer p { margin: 5px 0; font-size: 14px; }
                    .receipt-body { margin: 20px 0; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                `);
                caption = `🧾 *Il tuo scontrino musicale dell'ultimo mese*\nUtente: @${user}\n> by kinder`;
                break;
            }

            case 'throwback': {
                const oneYearAgoUnix = Math.floor(Date.now() / 1000) - 31536000;
                const res = await apiCall('user.getrecenttracks', { 
                    user, 
                    from: oneYearAgoUnix - 43200, 
                    to: oneYearAgoUnix + 43200,   
                    limit: 1 
                });

                const tracks = res.recenttracks?.track;
                if (!tracks || tracks.length === 0) return m.reply("🕰️ Esattamente un anno fa non stavi ascoltando nulla (o non usavi Last.fm)!");

                const track = Array.isArray(tracks) ? tracks[0] : tracks;
                const cover = await fetchCover(track.image, `${track.artist['#text']} ${track.name}`);
                const dateStr = new Date((oneYearAgoUnix) * 1000).toLocaleDateString('it-IT');

                viewport = { w: 600, h: 750 };
                html = getHtmlWrapper(`
                    <div class="polaroid">
                        <img src="${cover}" class="photo">
                        <div class="caption">
                            <p class="track-name">${track.name}</p>
                            <p class="artist-name">${track.artist['#text']}</p>
                            <p class="date">${dateStr}</p>
                        </div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
                    body { background: url('https://www.transparenttextures.com/patterns/cork-board.png') #4a3b32; }
                    .polaroid { background: #fff; width: 450px; padding: 25px 25px 60px 25px; box-shadow: 0 15px 40px rgba(0,0,0,0.6), inset 0 0 10px rgba(0,0,0,0.1); transform: rotate(-3deg); position: relative; }
                    .photo { width: 100%; height: 400px; object-fit: cover; background: #000; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); filter: contrast(1.1) sepia(0.2); }
                    .caption { text-align: center; color: #111; font-family: 'Caveat', cursive; margin-top: 25px; line-height: 1.2; }
                    .track-name { font-size: 40px; margin: 0; font-weight: bold; }
                    .artist-name { font-size: 30px; margin: 5px 0 15px 0; color: #555; }
                    .date { font-size: 24px; position: absolute; bottom: 20px; right: 30px; color: #888; transform: rotate(2deg); }
                `);
                caption = `🕰️ *Un anno fa...*\nEsattamente un anno fa eri in fissa con questo pezzo. Ricordi?\n> by kinder`;
                break;
            }

            case 'leaderboard': {
                const groupMembers = await getGroupMembers(conn, m.chat);
                const validJids = Object.keys(db).filter(jid => groupMembers.includes(jid));
                
                if (validJids.length < 2) return m.reply(`❌ Non ci sono abbastanza utenti registrati in questo gruppo. Trovati: ${validJids.length}`);

                await m.reply("📊 Sto calcolando la classifica del gruppo... ci vorrà qualche secondo!");

                const targetJids = validJids.slice(0, 15);
                const promises = targetJids.map(async (jid) => {
                    const lfUser = db[jid];
                    const info = await apiCall('user.getinfo', { user: lfUser });
                    if (info.error) return null;
                    return { user: lfUser, plays: parseInt(info.user.playcount) };
                });

                let results = (await Promise.all(promises)).filter(r => r !== null);
                results.sort((a, b) => b.plays - a.plays);

                if (results.length === 0) throw new Error("Impossibile generare la classifica.");

                const top3 = results.slice(0, 3);
                const others = results.slice(3, 8);
                let podiumHtml = `
                    <div class="podium-container">
                        ${top3[1] ? `<div class="podium p2"><div class="rank">2</div><div class="p-user">@${top3[1].user}</div><div class="p-score">${top3[1].plays}</div></div>` : ''}
                        <div class="podium p1"><div class="crown">👑</div><div class="rank">1</div><div class="p-user">@${top3[0].user}</div><div class="p-score">${top3[0].plays}</div></div>
                        ${top3[2] ? `<div class="podium p3"><div class="rank">3</div><div class="p-user">@${top3[2].user}</div><div class="p-score">${top3[2].plays}</div></div>` : ''}
                    </div>
                `;

                let listHtml = others.map((u, i) => `
                    <div class="list-item">
                        <span class="l-rank">${i+4}</span>
                        <span class="l-user">@${u.user}</span>
                        <span class="l-score">${u.plays.toLocaleString()}</span>
                    </div>
                `).join('');

                viewport = { w: 800, h: listHtml ? 900 : 600 };
                html = getHtmlWrapper(`
                    <div class="lb-wrapper">
                        <h1 class="lb-title">GLOBAL LEADERBOARD</h1>
                        ${podiumHtml}
                        <div class="lb-list">${listHtml}</div>
                    </div>
                `, `
                    body { background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); }
                    .lb-wrapper { width: 700px; padding: 40px; background: rgba(0,0,0,0.5); border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
                    .lb-title { text-align: center; font-size: 35px; letter-spacing: 4px; margin-bottom: 50px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                    .podium-container { display: flex; align-items: flex-end; justify-content: center; gap: 20px; height: 250px; margin-bottom: 40px; }
                    .podium { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 140px; border-radius: 20px 20px 0 0; position: relative; padding-bottom: 20px; box-shadow: inset 0 5px 15px rgba(255,255,255,0.2); }
                    .p1 { height: 100%; background: linear-gradient(to top, #ffd700, #ffb300); color: #000; z-index: 10; }
                    .p2 { height: 75%; background: linear-gradient(to top, #e0e0e0, #9e9e9e); color: #000; }
                    .p3 { height: 60%; background: linear-gradient(to top, #cd7f32, #a0522d); color: #fff; }
                    .crown { position: absolute; top: -50px; font-size: 40px; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5)); }
                    .rank { font-size: 40px; font-weight: 900; margin-bottom: 10px; }
                    .p-user { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
                    .p-score { font-size: 14px; font-weight: bold; opacity: 0.8; }
                    .list-item { display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 15px 25px; border-radius: 15px; margin-bottom: 10px; font-size: 20px; }
                    .l-rank { font-weight: 800; width: 50px; color: #888; }
                    .l-user { flex: 1; font-weight: 600; }
                    .l-score { font-weight: 800; color: #0a84ff; }
                `);
                caption = `📈 *LA CLASSIFICA DEL GRUPPO*\nIl malato di musica numero uno è *${top3[0].user}*!\n> by kinder`;
                break;
            }
            case 'artistmap': {
                const artistName = text.trim();
                if (!artistName) return m.reply(`❌ Uso: *${usedPrefix}artistmap <nome artista>*`);

                const simRes = await apiCall('artist.getsimilar', { artist: artistName, limit: 4 });
                if (simRes.error || !simRes.similarartists?.artist?.length) throw new Error("Artista non trovato o nessun artista simile.");

                const mainArtist = simRes.similarartists['@attr'].artist;
                const similars = simRes.similarartists.artist;

                const promises = [
                    apiCall('artist.getinfo', { artist: mainArtist, username: user }).then(info => 
                        fetchCover(info.artist?.image, mainArtist, true)
                    )
                ];

                similars.forEach(s => {
                    promises.push(
                        apiCall('artist.getinfo', { artist: s.name, username: user }).then(info => 
                            fetchCover(info.artist?.image, s.name, true)
                        )
                    );
                });

                const covers = await Promise.all(promises);

                const positions = [
                    { top: '10%', left: '50%', name: similars[0].name },
                    { top: '50%', left: '90%', name: similars[1].name },
                    { top: '90%', left: '50%', name: similars[2]?.name || '' },
                    { top: '50%', left: '10%', name: similars[3]?.name || '' }
                ];

                let nodesHtml = '';
                let linesHtml = `
                    <div class="line" style="top: 30%; left: 50%; height: 20%; width: 2px;"></div>
                    <div class="line" style="top: 50%; left: 70%; height: 2px; width: 20%;"></div>
                    <div class="line" style="top: 70%; left: 50%; height: 20%; width: 2px;"></div>
                    <div class="line" style="top: 50%; left: 10%; height: 2px; width: 20%;"></div>
                `;

                for(let i=0; i<4; i++) {
                    if(!similars[i]) continue;
                    nodesHtml += `
                        <div class="node sim-node" style="top: ${positions[i].top}; left: ${positions[i].left};">
                            <img src="${covers[i+1]}">
                            <p>${positions[i].name}</p>
                        </div>
                    `;
                }

                viewport = { w: 900, h: 900 };
                html = getHtmlWrapper(`
                    <div class="map-container">
                        ${linesHtml}
                        <div class="node main-node" style="top: 50%; left: 50%;">
                            <img src="${covers[0]}">
                            <p>${mainArtist}</p>
                        </div>
                        ${nodesHtml}
                    </div>
                `, `
                    body { background: #080a10; }
                    .map-container { width: 100%; height: 100%; position: relative; }
                    .node { position: absolute; transform: translate(-50%, -50%); text-align: center; z-index: 10; display: flex; flex-direction: column; align-items: center; }
                    .node img { object-fit: cover; border-radius: 50%; box-shadow: 0 0 30px rgba(0, 255, 255, 0.3); border: 3px solid rgba(255,255,255,0.2); }
                    .node p { background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px); }
                    .main-node img { width: 220px; height: 220px; border-color: #00ffff; box-shadow: 0 0 50px rgba(0, 255, 255, 0.6); }
                    .main-node p { font-size: 22px; color: #00ffff; }
                    .sim-node img { width: 140px; height: 140px; }
                    .sim-node p { font-size: 16px; }
                    .line { position: absolute; background: linear-gradient(90deg, transparent, #00ffff, transparent); box-shadow: 0 0 10px #00ffff; opacity: 0.5; z-index: 1; }
                    .line[style*="width: 2px"] { background: linear-gradient(180deg, transparent, #00ffff, transparent); }
                `);
                caption = `🗺️ *Mappa delle Connessioni per ${mainArtist}*\n> by kinder`;
                break;
            }
            case 'magazine': {
                const topArt = await apiCall('user.gettopartists', { user, limit: 1, period: '1month' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Non hai abbastanza ascolti questo mese.");
                const artist = topArt.topartists.artist[0];
                const artistInfo = await apiCall('artist.getinfo', { artist: artist.name, username: user });

                const topTrack = await apiCall('user.gettoptracks', { user, limit: 1, period: '1month' });
                const trackName = topTrack.toptracks?.track?.[0]?.name || 'Musica e Segreti';

                const cover = await fetchCover(artistInfo.artist?.image, artist.name, true);

                viewport = { w: 800, h: 1050 };
                html = getHtmlWrapper(`
                    <div class="magazine-bg" style="background-image: url('${cover}')"></div>
                    <div class="magazine-overlay"></div>
                    <div class="magazine-container">
                        <h1 class="magazine-title">SOUND</h1>
                        
                        <div class="headlines">
                            <div class="headline-left">
                                <span class="hl-tag">ESCLUSIVA</span>
                                <h2>Il fenomeno<br><span style="color:#ff3b30">${artist.name}</span></h2>
                                <p>Perché @${user} non riesce a smettere di ascoltarlo?</p>
                            </div>
                            
                            <div class="headline-right">
                                <h3>Hit del Mese</h3>
                                <p>"${trackName}"</p>
                                <hr>
                                <h3>Scrobble totali</h3>
                                <p style="font-size: 24px; font-weight: 800;">${artist.playcount}</p>
                            </div>
                        </div>
                        
                        <div class="barcode-area">
                            <div class="barcode">||| | || ||| || | || |</div>
                            <p>ISSUE #01 • ${new Date().toLocaleDateString('it-IT').toUpperCase()}</p>
                        </div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;900&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                    .magazine-bg { position: absolute; top:0; left:0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: -2; filter: contrast(1.1) saturate(1.2); }
                    .magazine-overlay { position: absolute; top:0; left:0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%); z-index: -1; }
                    .magazine-container { width: 100%; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
                    .magazine-title { font-family: 'Anton', sans-serif; font-size: 180px; margin: 0; color: #fff; text-align: center; letter-spacing: -2px; line-height: 0.8; text-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10; }
                    .headlines { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-bottom: 40px; }
                    .headline-left { max-width: 400px; }
                    .hl-tag { background: #ff3b30; color: #fff; padding: 5px 10px; font-weight: 900; font-size: 14px; letter-spacing: 2px; }
                    .headline-left h2 { font-size: 65px; margin: 10px 0; font-weight: 900; line-height: 1; text-shadow: 0 4px 15px rgba(0,0,0,0.8); }
                    .headline-left p { font-size: 20px; font-weight: 700; color: #ddd; }
                    .                    .headline-right { text-align: right; text-shadow: 0 4px 10px rgba(0,0,0,0.8); }
                    .headline-right h3 { font-size: 20px; color: #ff3b30; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 900; }
                    .headline-right p { font-size: 26px; margin: 0 0 15px 0; font-weight: 700; }
                    .headline-right hr { border-color: rgba(255,255,255,0.3); margin: 15px 0; }
                    .barcode-area { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #fff; padding-top: 15px; }
                    .barcode { font-family: 'Courier New', Courier, monospace; font-size: 30px; letter-spacing: -2px; font-weight: 900; }
                    .barcode-area p { font-size: 14px; font-weight: 700; letter-spacing: 1px; margin: 0; }
                `);
                caption = `📸 *Sulla copertina di questo mese c'è @${user}!*\nArtista in evidenza: ${artist.name}\n> by kinder`;
                break;
            }
            case 'ticket': {
                const res = await apiCall('user.getrecenttracks', { user, limit: 1 });
                const track = res.recenttracks?.track?.[0];
                if (!track) throw new Error("Non hai nessun ascolto recente.");

                const artistName = track.artist['#text'];
                const trackName = track.name;
                const albumName = track.album['#text'] || 'Exclusive Tour';
                const cover = await fetchCover(track.image, `${artistName} ${trackName}`);

                const date = new Date();
                const dateStr = date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
                const timeStr = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
                const randomSeat = `SEC ${Math.floor(Math.random() * 9) + 1} • FILA ${String.fromCharCode(65 + Math.floor(Math.random() * 10))} • POSTO ${Math.floor(Math.random() * 50) + 1}`;

                viewport = { w: 900, h: 400 };
                html = getHtmlWrapper(`
                    <div class="ticket-wrapper">
                        <div class="ticket-main">
                            <img src="${cover}" class="bg-blur">
                            <div class="ticket-content">
                                <p class="tour-name">${albumName} WORLD TOUR</p>
                                <h1 class="artist">${artistName}</h1>
                                <h2 class="song">🎵 ${trackName}</h2>
                                <div class="details">
                                    <div>
                                        <p class="label">DATA</p>
                                        <p class="val">${dateStr}</p>
                                    </div>
                                    <div>
                                        <p class="label">ORA</p>
                                        <p class="val">${timeStr}</p>
                                    </div>
                                    <div>
                                        <p class="label">VIP GUEST</p>
                                        <p class="val">@${user.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ticket-stub">
                            <div class="stub-content">
                                <h3>${artistName.substring(0, 15)}</h3>
                                <p class="seat">${randomSeat}</p>
                                <div class="barcode-vertical"></div>
                            </div>
                        </div>
                    </div>
                `, `
                    body { background: #111; }
                    .ticket-wrapper { display: flex; width: 800px; height: 300px; background: #fff; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.8); overflow: hidden; color: #000; position: relative; }
                    .ticket-main { flex: 1; position: relative; padding: 30px; display: flex; flex-direction: column; justify-content: center; }
                    .bg-blur { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.15; z-index: 0; filter: grayscale(50%); }
                    .ticket-content { position: relative; z-index: 1; }
                    .tour-name { font-size: 14px; font-weight: 800; letter-spacing: 3px; color: #ff3b30; margin: 0 0 10px 0; }
                    .artist { font-size: 55px; font-weight: 900; margin: 0; text-transform: uppercase; line-height: 1; letter-spacing: -1px; }
                    .song { font-size: 22px; font-weight: 700; color: #444; margin: 10px 0 30px 0; }
                    .details { display: flex; gap: 40px; }
                    .label { font-size: 12px; color: #888; margin: 0 0 5px 0; font-weight: 700; letter-spacing: 1px; }
                    .val { font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase; }
                    .ticket-stub { width: 200px; background: #f4f4f4; border-left: 4px dashed #ccc; padding: 30px; position: relative; display: flex; align-items: center; justify-content: center; }
                    .ticket-stub::before, .ticket-stub::after { content: ''; position: absolute; left: -20px; width: 40px; height: 40px; background: #111; border-radius: 50%; }
                    .ticket-stub::before { top: -20px; }
                    .ticket-stub::after { bottom: -20px; }
                    .stub-content { text-align: center; transform: rotate(90deg); white-space: nowrap; width: 250px; }
                    .stub-content h3 { font-size: 24px; margin: 0 0 5px 0; text-transform: uppercase; }
                    .seat { font-size: 16px; font-weight: bold; color: #666; margin: 0 0 15px 0; }
                    .barcode-vertical { height: 40px; width: 100%; background: repeating-linear-gradient(90deg, #000, #000 3px, transparent 3px, transparent 6px, #000 6px, #000 8px, transparent 8px, transparent 12px); }
                `);
                caption = `🎫 *Il tuo Pass VIP*\nIn riproduzione: ${trackName} di ${artistName}\n> by kinder`;
                break;
            }
            case 'identity': {
                const userInfo = await apiCall('user.getinfo', { user });
                if (userInfo.error) throw new Error("Impossibile recuperare i dati utente.");
                const uData = userInfo.user;

                const topArt = await apiCall('user.gettopartists', { user, limit: 1, period: 'overall' });
                const topArtist = topArt.topartists?.artist?.[0];
                const artistName = topArtist ? topArtist.name : 'Sconosciuto';

                let cover = DEFAULT_COVER;
                if (topArtist) {
                    const artistInfo = await apiCall('artist.getinfo', { artist: artistName, username: user });
                    cover = await fetchCover(artistInfo.artist?.image, artistName, true);
                }

                const registeredYear = new Date(uData.registered.unixtime * 1000).getFullYear();
                const totalPlays = parseInt(uData.playcount);
                
                let userStatus = "LISTENER";
                if (totalPlays > 25000) userStatus = "ENTHUSIAST";
                if (totalPlays > 50000) userStatus = "ADDICT";
                if (totalPlays > 100000) userStatus = "MELOMANE";
                if (totalPlays > 200000) userStatus = "LEGEND";

                const bgColors = {
                    "LISTENER": "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
                    "ENTHUSIAST": "linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)",
                    "ADDICT": "linear-gradient(135deg, #ffe0b2 0%, #ffb74d 100%)",
                    "MELOMANE": "linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)",
                    "LEGEND": "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)"
                };
                const cardBg = bgColors[userStatus] || bgColors["LISTENER"];
                const textColor = (userStatus === "LEGEND") ? "#222" : "#102a43";

                viewport = { w: 700, h: 450 };
                html = getHtmlWrapper(`
                    <div class="id-card" style="background: ${cardBg}; color: ${textColor};">
                        <div class="id-header">
                            <div class="logo">LAST.FM <span>ID</span></div>
                            <div class="country">REPUBLIC OF MUSIC</div>
                        </div>
                        <div class="id-body">
                            <div class="photo-area">
                                <img src="${cover}" class="profile-pic">
                                <div class="css-chip"></div>
                            </div>
                            <div class="info-area">
                                <div class="field">
                                    <span class="label" style="color: ${textColor}; opacity: 0.7;">USERNAME / NOME</span>
                                    <span class="value">@${user.toUpperCase()}</span>
                                </div>
                                <div class="field-row">
                                    <div class="field">
                                        <span class="label" style="color: ${textColor}; opacity: 0.7;">SCROBBLES</span>
                                        <span class="value">${totalPlays.toLocaleString('it-IT')}</span>
                                    </div>
                                    <div class="field">
                                        <span class="label" style="color: ${textColor}; opacity: 0.7;">STATUS</span>
                                        <span class="value">${userStatus}</span>
                                    </div>
                                </div>
                                <div class="field">
                                    <span class="label" style="color: ${textColor}; opacity: 0.7;">ARTISTA PRINCIPALE</span>
                                    <span class="value" style="color: #0a84ff; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${artistName.toUpperCase()}</span>
                                </div>
                                <div class="mrz">P&lt;LFM${user.substring(0,10).toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>${totalPlays}M${registeredYear}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02</div>
                            </div>
                        </div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
                    body { background: transparent; display: flex; justify-content: center; align-items: center; }
                    .id-card { width: 600px; height: 380px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.5); padding: 25px; box-sizing: border-box; position: relative; overflow: hidden; }
                    .id-card::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px); z-index: 0; pointer-events: none; opacity: 0.5; }
                    .id-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(0,0,0,0.2); padding-bottom: 10px; margin-bottom: 20px; position: relative; z-index: 1; }
                    .logo { font-size: 24px; font-weight: 900; color: #d64541; letter-spacing: -1px; text-shadow: 0 1px 2px rgba(255,255,255,0.5); }
                    .logo span { font-weight: 400; color: inherit; }
                    .country { font-size: 12px; font-weight: 700; letter-spacing: 2px; opacity: 0.8; }
                    .id-body { display: flex; gap: 25px; position: relative; z-index: 1; }
                    .photo-area { display: flex; flex-direction: column; align-items: center; gap: 15px; }
                    .profile-pic { width: 140px; height: 180px; object-fit: cover; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); filter: contrast(1.1) grayscale(20%); border: 3px solid #fff; }
                    
                    .css-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #d4af37, #f3e5ab); border-radius: 6px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 1px solid #b89020; overflow: hidden; }
                    .css-chip::before { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #b89020; }
                    .css-chip::after { content: ''; position: absolute; left: 50%; top: 0; height: 100%; width: 1px; background: #b89020; }
                    
                    .info-area { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
                    .field { display: flex; flex-direction: column; margin-bottom: 15px; }
                    .field-row { display: flex; gap: 30px; }
                    .label { font-size: 11px; font-weight: 800; margin-bottom: 2px; letter-spacing: 1px;}
                    .value { font-size: 20px; font-weight: 900; letter-spacing: 1px; }
                    .mrz { font-family: 'Share Tech Mono', monospace; font-size: 14px; letter-spacing: 2px; line-height: 1.5; margin-top: auto; opacity: 0.8; }
                `);
                caption = `🪪 *Carta d'Identità Musicale*\nRichiesta da: @${user}\n> by kinder`;
                break;
            }
            case 'festival': {
                const limit = 12;
                const topArt = await apiCall('user.gettopartists', { user, limit, period: '1month' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Errore nel recupero degli artisti. Ascolta più musica!");

                const artists = topArt.topartists.artist.map(a => a.name);
                while (artists.length < limit) artists.push("Special Guest");

                const topCover = await fetchCover(topArt.topartists.artist[0]?.image, artists[0], true);

                viewport = { w: 600, h: 800 };
                html = getHtmlWrapper(`
                    <div class="festival-bg" style="background-image: url('${topCover}')"></div>
                    <div class="festival-overlay"></div>
                    <div class="poster">
                        <div class="dates">15-16-17 AGOSTO 2026</div>
                        <h1 class="fest-title">SOUND<br>FEST</h1>
                        <div class="presented-by">CURATED BY @${user.toUpperCase()}</div>
                        
                        <div class="lineup">
                            <h2 class="headliners"><span>${artists[0]}</span><br><span>${artists[1]}</span></h2>
                            <h3 class="mid-tier">${artists[2]} • ${artists[3]}<br>${artists[4]} • ${artists[5]}</h3>
                            <div class="undercard-box">
                                <p class="undercard">${artists.slice(6, 12).join(' • ').toUpperCase()}</p>
                            </div>
                        </div>
                        
                        <div class="ticket-info">TICKETS AVAILABLE NOW • VIP PASSES SOLD OUT</div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700&display=swap');
                    body { font-family: 'Inter', sans-serif; background: #000; }
                    .festival-bg { position: absolute; width: 100%; height: 100%; background-size: cover; background-position: center; filter: blur(3px) brightness(0.7); z-index: -2; }
                    .festival-overlay { position: absolute; width: 100%; height: 100%; background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%); z-index: -1; }
                    .poster { width: 100%; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; color: #fff; border: 12px solid #fff; }
                    
                    .dates { font-size: 14px; letter-spacing: 4px; font-weight: 700; margin-bottom: 5px; color: #ff3b30; }
                    .fest-title { font-family: 'Bebas Neue', sans-serif; font-size: 110px; line-height: 0.85; margin: 0; color: #fff; }
                    .presented-by { font-size: 12px; letter-spacing: 3px; margin-top: 15px; border-top: 1px solid #fff; border-bottom: 1px solid #fff; padding: 5px 0; width: 80%; font-weight: 700; }
                    
                    .lineup { margin-top: auto; margin-bottom: auto; width: 100%; display: flex; flex-direction: column; gap: 20px; }
                    .headliners { font-family: 'Bebas Neue', sans-serif; font-size: 65px; margin: 0; line-height: 1; color: #ffd700; display: flex; flex-direction: column; text-shadow: 2px 2px 0 #000; }
                    .mid-tier { font-family: 'Bebas Neue', sans-serif; font-size: 38px; margin: 0; color: #fff; line-height: 1.1; letter-spacing: 1px; }
                    
                    .undercard-box { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px); }
                    .undercard { font-size: 15px; font-weight: 700; margin: 0; line-height: 1.6; color: #ddd; letter-spacing: 1px; }
                    
                    .ticket-info { font-size: 12px; letter-spacing: 2px; font-weight: 700; color: #aaa; margin-top: 20px; }
                `);
                caption = `🎪 *La tua Lineup Ideale*\nEcco il festival curato da @${user}\n> by kinder`;
                break;
            }
            case 'roast': {
                const topArt = await apiCall('user.gettopartists', { user, limit: 1, period: '1month' });
                if (topArt.error || !topArt.topartists?.artist?.length) throw new Error("Non hai ascoltato abbastanza musica per essere preso in giro.");

                const artist = topArt.topartists.artist[0];
                const playcount = parseInt(artist.playcount);
                const cover = await fetchCover(artist.image, artist.name, true);

                const roasts = [
                    "Sospettato di non toccare erba dal 2021.",
                    "Pericolo pubblico: monopolizza il cavo Aux.",
                    "Richiesto supporto psicologico immediato.",
                    "Colpevole di avere gusti musicali discutibili.",
                    "Sintomi di grave ossessione musicale rilevati."
                ];
                const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

                viewport = { w: 600, h: 750 };
                html = getHtmlWrapper(`
                    <div class="wanted-poster">
                        <h1 class="wanted-title">WANTED</h1>
                        <h2 class="reward">DEAD OR ALIVE</h2>
                        <div class="mugshot-container">
                            <img src="${cover}" class="mugshot">
                            <div class="bars"></div>
                        </div>
                        <div class="details">
                            <p class="alias">ALIAS: @${user.toUpperCase()}</p>
                            <p class="crime">CRIMINE: Ascolto compulsivo di <strong>${artist.name.toUpperCase()}</strong></p>
                            <p class="evidence">PROVE: ${playcount} riproduzioni in soli 30 giorni.</p>
                            <p class="note">NOTA: ${randomRoast}</p>
                        </div>
                        <div class="stamp">EXPOSED</div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Rye&family=Special+Elite&display=swap');
                    body { background: url('https://www.transparenttextures.com/patterns/aged-paper.png') #d4c5b0; display: flex; justify-content: center; align-items: center; }
                    .wanted-poster { width: 500px; padding: 40px; border: 8px solid #3e2723; background: transparent; text-align: center; color: #3e2723; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                    .wanted-title { font-family: 'Rye', serif; font-size: 80px; margin: 0; letter-spacing: 5px; }
                    .reward { font-family: 'Rye', serif; font-size: 30px; margin: -10px 0 20px 0; }
                    .mugshot-container { width: 100%; height: 300px; position: relative; border: 5px solid #3e2723; box-sizing: border-box; overflow: hidden; }
                    .mugshot { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.8) contrast(1.5) grayscale(0.5); }
                    .bars { position: absolute; top:0; left:0; width:100%; height:100%; background: repeating-linear-gradient(90deg, transparent, transparent 40px, #111 40px, #111 50px); opacity: 0.8; }
                    .details { font-family: 'Special Elite', monospace; text-align: left; margin-top: 25px; font-size: 18px; line-height: 1.5; font-weight: bold; }
                    .alias { font-size: 24px; text-decoration: underline; }
                    .stamp { position: absolute; bottom: 30px; right: 20px; font-family: 'Rye', serif; font-size: 50px; color: #c62828; border: 5px solid #c62828; padding: 5px 15px; transform: rotate(-15deg); opacity: 0.7; border-radius: 10px; }
                `);
                caption = `🚨 *SEGNALAZIONE UTENTE*\nAttenzione a @${user}, il suo ultimo mese musicale è preoccupante.\n> by kinder`;
                break;
            }
            case 'topartist':
            case 'topartista': {
                const artistQuery = text.trim();
                if (!artistQuery) return m.reply(`Uso: *${usedPrefix}${command} <nome artista>*\nEsempio: *${usedPrefix}${command} The Weeknd*`);

                const artistInfo = await apiCall('artist.getinfo', { artist: artistQuery, username: user });
                if (artistInfo.error || !artistInfo.artist) throw new Error("Artista non trovato su Last.fm.");

                const realArtistName = artistInfo.artist.name;
                const totalArtistPlays = parseInt(artistInfo.artist.stats?.userplaycount) || 0;
                const cover = await fetchCover(artistInfo.artist.image, realArtistName, true);

                if (totalArtistPlays === 0) return m.reply(`Non hai mai ascoltato ${realArtistName} sul tuo account Last.fm.`);

                const topTracksRes = await apiCall('user.gettoptracks', { user, limit: 1000, period: 'overall' });
                if (topTracksRes.error) throw new Error("Errore nel recupero delle tue statistiche.");

                const searchName = realArtistName.toLowerCase();
                let artistTracks = (topTracksRes.toptracks?.track || []).filter(t => 
                    t.artist.name.toLowerCase().includes(searchName) || 
                    t.name.toLowerCase().includes(searchName)
                );

                if (artistTracks.length === 0) return m.reply(`${realArtistName} ha ${totalArtistPlays} ascolti, ma i suoi brani (o i suoi featuring) non rientrano nella tua Top 1000 assoluta.`);

                const top5 = artistTracks.slice(0, 5);
                const maxPlays = parseInt(top5[0].playcount); 

                let tracksHtml = '';
                top5.forEach((t, i) => {
                    const plays = parseInt(t.playcount);
                    const percentage = Math.max((plays / maxPlays) * 100, 5); 
                    tracksHtml += `
                        <div class="track-row">
                            <div class="track-rank">${i + 1}</div>
                            <div class="track-data">
                                <div class="track-name">${t.name}</div>
                                <div class="progress-bg">
                                    <div class="progress-fill" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                            <div class="track-plays">${plays}</div>
                        </div>
                    `;
                });

                viewport = { w: 850, h: 650 };
                html = getHtmlWrapper(`
                    <div class="background-blur" style="background-image: url('${cover}')"></div>
                    <div class="color-overlay"></div>
                    <div class="card glass">
                        <div class="header">
                            <img src="${cover}" class="artist-img">
                            <div class="header-info">
                                <h2>TOP TRACKS</h2>
                                <h1>${realArtistName}</h1>
                                <p class="user-tag">@${user.toUpperCase()} • ${totalArtistPlays.toLocaleString('it-IT')} SCROBBLES TOTALI</p>
                            </div>
                        </div>
                        <div class="tracks-container">
                            ${tracksHtml}
                        </div>
                    </div>
                `, `
                    .background-blur { position: absolute; top: -50px; left: -50px; right: -50px; bottom: -50px; background-size: cover; background-position: center; filter: blur(40px) brightness(0.3); z-index: -2; }
                    .color-overlay { position: absolute; width: 100%; height: 100%; background: linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.9)); z-index: -1; }
                    .card { width: 750px; padding: 40px; display: flex; flex-direction: column; gap: 30px; border-radius: 30px; background: rgba(20, 20, 20, 0.4); box-shadow: 0 20px 60px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); }
                    .header { display: flex; align-items: center; gap: 30px; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 30px; }
                    .artist-img { width: 150px; height: 150px; border-radius: 20px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
                    .header-info h2 { margin: 0; font-size: 18px; color: #0a84ff; letter-spacing: 4px; font-weight: 800; }
                    .header-info h1 { margin: 5px 0 10px 0; font-size: 55px; line-height: 1; text-transform: uppercase; text-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                    .user-tag { margin: 0; font-size: 16px; opacity: 0.8; font-weight: 600; letter-spacing: 1px; }
                    
                    .tracks-container { display: flex; flex-direction: column; gap: 15px; }
                    .track-row { display: flex; align-items: center; gap: 20px; }
                    .track-rank { font-size: 30px; font-weight: 800; color: rgba(255,255,255,0.3); width: 40px; text-align: center; font-style: italic; }
                    .track-data { flex: 1; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
                    .track-name { font-size: 22px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 480px; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
                    .progress-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
                    .progress-fill { height: 100%; background: linear-gradient(90deg, #0a84ff, #00d2ff); border-radius: 4px; box-shadow: 0 0 10px rgba(10,132,255,0.5); }
                    .track-plays { font-size: 24px; font-weight: 900; width: 60px; text-align: right; }
                `);
                caption = `*Le tue Top Tracks di ${realArtistName}*\nRichiesto da: @${user}\n> by kinder`;
                break;
            }

            case 'soulmate': {
                if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply(`❌ Uso: *${usedPrefix}soulmate @utente*`);
                const user2Jid = m.mentionedJid[0];
                const user2 = db[user2Jid];
                if (!user2) return m.reply("⚠️ L'utente taggato non ha registrato il suo account Last.fm.");

                const limit = 50;
                const top1 = await apiCall('user.gettopartists', { user, limit, period: 'overall' });
                const top2 = await apiCall('user.gettopartists', { user: user2, limit, period: 'overall' });

                if (top1.error || top2.error) throw new Error("Errore API durante il calcolo dell'affinità.");

                const artists1 = top1.topartists.artist.map(a => a.name.toLowerCase());
                const artists2 = top2.topartists.artist.map(a => a.name.toLowerCase());

                let shared = 0;
                artists1.forEach(a => { if (artists2.includes(a)) shared++; });

                let matchPercent = Math.min(Math.round((shared / 25) * 100), 100);
                
                let status = "Nemici Giurati 💔";
                let heartColor = "#ff3b30";
                if (matchPercent > 20) { status = "Conoscenti Musicali 🎵"; heartColor = "#ff9500"; }
                if (matchPercent > 50) { status = "Compagni di Cuffiette 🎧"; heartColor = "#4cd964"; }
                if (matchPercent > 80) { status = "Anime Gemelle ✨"; heartColor = "#ff2d55"; }

                viewport = { w: 800, h: 500 };
                html = getHtmlWrapper(`
                    <div class="soul-container">
                        <h2 class="title">COMPATIBILITÀ LAST.FM</h2>
                        <div class="users">
                            <div class="user-pill">@${user}</div>
                            <div class="user-pill">@${user2}</div>
                        </div>
                        <div class="percentage" style="color: ${heartColor}; text-shadow: 0 0 20px ${heartColor};">${matchPercent}%</div>
                        <div class="status">${status}</div>
                        <div class="shared-count">Artisti in comune (Top 50): ${shared}</div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;800;900&display=swap');
                    body { background: #0f0c29; background: linear-gradient(to right, #24243e, #302b63, #0f0c29); font-family: 'Montserrat', sans-serif; }
                    .soul-container { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; z-index: 10; }
                    .title { color: #fff; font-size: 24px; letter-spacing: 5px; opacity: 0.8; margin-bottom: 40px; }
                    .users { display: flex; gap: 30px; margin-bottom: 20px; }
                    .user-pill { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 15px 30px; border-radius: 30px; font-size: 22px; font-weight: 800; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
                    .percentage { font-size: 130px; font-weight: 900; line-height: 1; margin: 10px 0; }
                    .status { font-size: 28px; font-weight: 800; color: #fff; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; }
                    .shared-count { margin-top: 20px; font-size: 16px; color: #aaa; }
                `);
                caption = `💖 *Test di Compatibilità*\n@${user} e @${user2} sono affini al ${matchPercent}%!\n> by kinder`;
                break;
            }
            case 'vinyl': {
                const res = await apiCall('user.getrecenttracks', { user, limit: 1 });
                const track = res.recenttracks?.track?.[0];
                if (!track) throw new Error("Non hai nessun ascolto recente.");

                const artistName = track.artist['#text'] || track.artist?.name;
                const trackName = track.name;
                const cover = await fetchCover(track.image, `${artistName} ${trackName}`);

                viewport = { w: 700, h: 700 };
                html = getHtmlWrapper(`
                    <div class="turntable-base">
                        <div class="platter">
                            <div class="vinyl">
                                <div class="label" style="background-image: url('${cover}')">
                                    <div class="hole"></div>
                                </div>
                            </div>
                        </div>
                        <div class="tonearm-base"></div>
                        <div class="tonearm"></div>
                        <div class="stylus"></div>
                    </div>
                    <div class="info-box">
                        <div class="song-text">${trackName}</div>
                        <div class="artist-text">${artistName}</div>
                        <div class="user-tag">SPINNING BY @${user.toUpperCase()}</div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@500;700&display=swap');
                    body { background: #1a1a1a; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Jost', sans-serif; }
                    .turntable-base { position: relative; width: 650px; height: 500px; background: #e0e0e0; border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 5px 15px #fff; border: 2px solid #ccc; display: flex; align-items: center; padding-left: 40px; }
                    .platter { width: 440px; height: 440px; background: #888; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 20px rgba(0,0,0,0.5), inset 0 0 10px #555; }
                    .vinyl { width: 420px; height: 420px; border-radius: 50%; background: #111; box-shadow: inset 0 0 0 8px #222; display: flex; justify-content: center; align-items: center; position: relative; background-image: repeating-radial-gradient(circle, #111, #111 4px, #1a1a1a 5px, #111 6px); }
                    .vinyl::before { content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1) 15deg, transparent 30deg, transparent 180deg, rgba(255,255,255,0.1) 195deg, transparent 210deg); pointer-events: none; }
                    .label { width: 160px; height: 160px; border-radius: 50%; background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 0 4px #000; position: relative; }
                    .hole { width: 12px; height: 12px; background: #e0e0e0; border-radius: 50%; box-shadow: inset 0 2px 5px rgba(0,0,0,0.8); position: absolute; }
                    
                    .tonearm-base { position: absolute; right: 80px; top: 100px; width: 60px; height: 60px; background: #333; border-radius: 50%; box-shadow: 0 5px 10px rgba(0,0,0,0.5), inset 0 2px 5px #777; }
                    .tonearm { position: absolute; right: 105px; top: 130px; width: 12px; height: 280px; background: linear-gradient(90deg, #aaa, #ddd, #aaa); transform-origin: top center; transform: rotate(25deg); border-radius: 6px; box-shadow: -5px 10px 15px rgba(0,0,0,0.4); }
                    .stylus { position: absolute; right: 235px; bottom: 100px; width: 25px; height: 40px; background: #222; transform: rotate(25deg); border-radius: 5px; box-shadow: -2px 5px 5px rgba(0,0,0,0.5); }

                    .info-box { background: rgba(20, 20, 20, 0.9); margin-top: -30px; z-index: 10; padding: 20px 40px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1); width: 80%; box-shadow: 0 10px 30px rgba(0,0,0,0.9); backdrop-filter: blur(10px); }
                    .song-text { font-size: 28px; font-weight: 700; color: #fff; margin: 0; text-shadow: 0 2px 5px rgba(0,0,0,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .artist-text { font-size: 18px; font-weight: 500; color: #bbb; margin-top: 5px; }
                    .user-tag { font-size: 12px; color: #888; letter-spacing: 4px; margin-top: 15px; font-weight: 700; }
                `);
                caption = `📀 *Sul giradischi di @${user}...*\nIn riproduzione: ${trackName} - ${artistName}\n> by kinder`;
                break;
            }
            case 'wrapped':
            case 'recap': {
                const [topArt, topTrack, topAlbum] = await Promise.all([
                    apiCall('user.gettopartists', { user, limit: 1, period: '7day' }),
                    apiCall('user.gettoptracks', { user, limit: 1, period: '7day' }),
                    apiCall('user.gettopalbums', { user, limit: 1, period: '7day' })
                ]);

                if (topArt.error || topTrack.error) throw new Error("Statistiche insufficienti per generare il recap settimanale.");

                const artist = topArt.topartists?.artist?.[0] || { name: 'N/A', playcount: 0 };
                const track = topTrack.toptracks?.track?.[0] || { name: 'N/A', artist: { name: '' }, playcount: 0 };
                const album = topAlbum.topalbums?.album?.[0] || { name: 'N/A', playcount: 0 };

                viewport = { w: 600, h: 900 };
                html = getHtmlWrapper(`
                    <div class="wrap-bg">
                        <div class="shape circle"></div>
                        <div class="shape square"></div>
                    </div>
                    <div class="wrap-content">
                        <div class="header">Il tuo<br>Recap</div>
                        
                        <div class="blocks-container">
                            <div class="stat-block">
                                <p class="label">Top Artista</p>
                                <h1 class="value text-green">${artist.name}</h1>
                                <p class="sub">${artist.playcount} ascolti</p>
                            </div>

                            <div class="stat-block">
                                <p class="label">Top Brano</p>
                                <h1 class="value text-pink">${track.name}</h1>
                                <p class="sub">${track.artist.name}</p>
                            </div>

                            <div class="stat-block">
                                <p class="label">Top Album</p>
                                <h1 class="value text-yellow">${album.name}</h1>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="username">@${user}</div>
                            <div class="logo">LAST.FM</div>
                        </div>
                    </div>
                `, `
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@500;700&display=swap');
                    body { font-family: 'Inter', sans-serif; color: #fff; background: #4a00e0; overflow: hidden; }
                    
                    .wrap-bg { position: absolute; width: 100%; height: 100%; z-index: -1; }
                    .shape { position: absolute; filter: blur(40px); opacity: 0.8; }
                    .circle { width: 400px; height: 400px; background: #ff007f; border-radius: 50%; top: -100px; right: -100px; }
                    .square { width: 500px; height: 500px; background: #1db954; top: 60%; left: -150px; transform: rotate(45deg); }

                    .wrap-content { width: 100%; height: 100%; padding: 50px; box-sizing: border-box; display: flex; flex-direction: column; position: relative; z-index: 10; }
                    .header { font-family: 'Montserrat', sans-serif; font-size: 60px; line-height: 0.9; margin-bottom: 60px; text-transform: uppercase; letter-spacing: -2px; }
                    
                    .blocks-container { display: flex; flex-direction: column; gap: 40px; }
                    .stat-block { display: flex; flex-direction: column; align-items: flex-start; }
                    .label { font-size: 18px; font-weight: 700; background: #fff; color: #000; padding: 5px 15px; border-radius: 20px; margin: 0 0 10px 0; text-transform: uppercase; }
                    .value { font-family: 'Montserrat', sans-serif; font-size: 55px; margin: 0; line-height: 1; word-wrap: break-word; text-transform: uppercase; letter-spacing: -1px; }
                    
                    .text-green { color: #1db954; text-shadow: 2px 2px 0px #000; }
                    .text-pink { color: #ff6b6b; text-shadow: 2px 2px 0px #000; }
                    .text-yellow { color: #feca57; text-shadow: 2px 2px 0px #000; }

                    .sub { font-size: 18px; font-weight: 500; margin: 5px 0 0 0; opacity: 0.9; }
                    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; border-top: 3px solid rgba(255,255,255,0.3); padding-top: 20px; }
                    .username { font-size: 26px; font-weight: 700; background: #000; padding: 5px 15px; border-radius: 10px; }
                    .logo { font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 900; }
                `);
                caption = `📆 *Il Recap della tua settimana!*\nEcco cos'hai ascoltato di più negli ultimi 7 giorni.\n> by kinder`;
                break;
            }
            case 'topcanzone':
            case 'topcanzoni': {
                let period = 'overall';
                let periodLabel = 'DI SEMPRE';
                let is24h = false;

                const input = text ? text.toLowerCase().trim() : '';
                if (['giorno', '24h', 'oggi'].includes(input)) { 
                    is24h = true; 
                    periodLabel = 'NELLE ULTIME 24 ORE'; 
                } else if (['settimana', '7g', '7day'].includes(input)) { 
                    period = '7day'; 
                    periodLabel = 'DELLA SETTIMANA'; 
                } else if (['mese', '30g', '1month'].includes(input)) { 
                    period = '1month'; 
                    periodLabel = 'DEL MESE'; 
                } else if (['3mesi', '3month'].includes(input)) { 
                    period = '3month'; 
                    periodLabel = 'DEGLI ULTIMI 3 MESI'; 
                } else if (['6mesi', '6month'].includes(input)) { 
                    period = '6month'; 
                    periodLabel = 'DEGLI ULTIMI 6 MESI'; 
                } else if (['anno', '12mesi', '12month', '365g'].includes(input)) { 
                    period = '12month'; 
                    periodLabel = "DELL'ANNO"; 
                } else if (input !== '') {
                return m.reply(`⚠️ Periodo non valido. Usa: giorno, settimana, mese, anno, oppure manda il comando vuoto per le statistiche di sempre.`);
                }

                let tracks = [];

                if (is24h) {
                    const yesterday = Math.floor(Date.now() / 1000) - 86400;
                    const recentRes = await apiCall('user.getrecenttracks', { user, limit: 200, from: yesterday });
                    if (recentRes.error) throw new Error("Errore nel recupero degli ascolti recenti.");
                    
                    let recentTracks = recentRes.recenttracks?.track || [];
                    if (!Array.isArray(recentTracks)) recentTracks = [recentTracks];
                    
                    recentTracks = recentTracks.filter(t => !t['@attr']?.nowplaying);
                    
                    let trackMap = {};
                    recentTracks.forEach(t => {
                        const artistName = t.artist['#text'] || t.artist.name;
                        const key = `${t.name}|||${artistName}`;
                        if (!trackMap[key]) {
                            trackMap[key] = {
                                name: t.name,
                                artist: { name: artistName },
                                playcount: 0,
                                image: t.image
                            };
                        }
                        trackMap[key].playcount++;
                    });
                    
                    tracks = Object.values(trackMap).sort((a, b) => b.playcount - a.playcount).slice(0, 6);
                } else {
                    const topTracksRes = await apiCall('user.gettoptracks', { user, limit: 6, period });
                    if (topTracksRes.error) {
                        throw new Error("Errore nel recupero delle tue statistiche.");
                    }
                    tracks = topTracksRes.toptracks?.track || [];
                }

                if (tracks.length === 0) {
                    throw new Error(`Nessun brano trovato ${periodLabel.toLowerCase()}.`);
                }

                const topOne = tracks[0];
                const maxPlays = parseInt(topOne.playcount);
                
                const mainCover = await fetchCover(topOne.image, `${topOne.artist.name} ${topOne.name}`);

                let trackListHtml = '';
                tracks.forEach((t, i) => {
                    const plays = parseInt(t.playcount);
                    const percentage = Math.max((plays / maxPlays) * 100, 8); 
                    
                    trackListHtml += `
                        <div class="track-row">
                            <div class="track-rank">${i + 1}</div>
                            <div class="track-info">
                                <div class="track-name-row">
                                    <div class="track-titles">
                                        <span class="track-name">${t.name}</span>
                                        <span class="track-artist">${t.artist.name}</span>
                                    </div>
                                    <span class="track-count">${plays.toLocaleString('it-IT')}</span>
                                </div>
                                <div class="track-bar-bg">
                                    <div class="track-bar-fill" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                viewport = { w: 800, h: 800 };
                html = getHtmlWrapper(`
                    <div class="bg-image" style="background-image: url('${mainCover}')"></div>
                    <div class="overlay"></div>
                    <div class="content-box glass">
                        <div class="header">
                            <p class="subtitle">STATISTICHE ${periodLabel}</p>
                            <h1 class="title">TOP BRANI</h1>
                            <div class="user-badge">@${user.toUpperCase()}</div>
                        </div>
                        <div class="list-container">
                            ${trackListHtml}
                        </div>
                        <div class="footer-msg">Basato sui dati del tuo account Last.fm</div>
                    </div>
                `, `
                    .bg-image { position: absolute; width: 110%; height: 110%; top: -5%; left: -5%; background-size: cover; background-position: center; filter: blur(30px) brightness(0.25); z-index: -2; }
                    .overlay { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.85)); z-index: -1; }
                    .content-box { width: 700px; padding: 50px; border-radius: 40px; display: flex; flex-direction: column; gap: 40px; }
                    .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 30px; }
                    .subtitle { font-size: 14px; letter-spacing: 5px; color: #ff2a5f; font-weight: 800; margin: 0; }
                    .title { font-size: 60px; font-weight: 900; margin: 10px 0; letter-spacing: -2px; }
                    .user-badge { display: inline-block; background: #fff; color: #000; padding: 5px 20px; border-radius: 50px; font-weight: 800; font-size: 16px; }
                    
                    .list-container { display: flex; flex-direction: column; gap: 25px; }
                    .track-row { display: flex; align-items: center; gap: 25px; }
                    .track-rank { font-size: 35px; font-weight: 900; color: rgba(255,255,255,0.2); width: 40px; font-style: italic; }
                    .track-info { flex: 1; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
                    .track-name-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 15px; }
                    .track-titles { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
                    .track-name { font-size: 24px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .track-artist { font-size: 16px; font-weight: 600; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .track-count { font-size: 18px; font-weight: 800; opacity: 0.9; color: #ff2a5f; padding-bottom: 2px; }
                    .track-bar-bg { width: 100%; height: 10px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
                    .track-bar-fill { height: 100%; background: linear-gradient(90deg, #ff2a5f, #ff7e67); border-radius: 10px; box-shadow: 0 0 15px rgba(255,42,95,0.4); }
                    .footer-msg { text-align: center; font-size: 14px; opacity: 0.4; font-weight: 600; margin-top: 10px; }
                `);
                
                caption = `🎵 *I tuoi brani più ascoltati (${periodLabel.toLowerCase()})*\nRichiesto da: @${user}\n> by kinder`;
                break;
            }
            
            case 'whosplaying': {
    const groupMembers = await getGroupMembers(conn, m.chat);
    const users = Object.keys(db).filter(jid => groupMembers.includes(jid));
    
    let playingUsers = [];
    let seenLastFmUsers = new Set();
    const checkLimit = users;
    playingUsers = playingUsers.slice(0, 8);

    for (let u of checkLimit) {
        const lfUser = db[u];
        
        if (seenLastFmUsers.has(lfUser)) continue;
        seenLastFmUsers.add(lfUser);

        try {
            const rt = await apiCall('user.getrecenttracks', { user: lfUser, limit: 1, extended: 1 });
            const track = rt.recenttracks?.track?.[0];
            
            const isNowPlaying = track && track['@attr']?.nowplaying === 'true';
            
            if (isNowPlaying) {

                let cover = DEFAULT_COVER;
                if (track.image && track.image.length > 0) {
                    const largeImage = track.image.find(img => img.size === 'large' || img.size === 'extralarge');
                    cover = largeImage?.['#text'] || track.image[2]?.['#text'] || DEFAULT_COVER;
                } else if (track.album?.image) {
                    const albumImage = track.album.image.find(img => img.size === 'large');
                    cover = albumImage?.['#text'] || DEFAULT_COVER;
                }
                
                playingUsers.push({ 
                    wpId: u, 
                    lfId: lfUser, 
                    track: track.name || 'Sconosciuto', 
                    artist: track.artist?.['#text'] || track.artist?.name || 'Sconosciuto', 
                    cover: cover
                });
            }
        } catch (e) { 
            continue; 
        }
    }

    if (playingUsers.length === 0) return m.reply("📻 Nessuno sta ascoltando musica in questo momento.");

    let cardsHtml = playingUsers.map(pu => `
        <div class="user-card glass">
            <img src="${pu.cover}">
            <div class="meta">
                <div class="user-name">@${pu.lfId}</div>
                <div class="track-name">${pu.track}</div>
                <div class="artist-name">${pu.artist}</div>
            </div>
            <div class="live-dot"></div>
        </div>
    `).join('');

    html = getHtmlWrapper(`
        <div class="mesh-bg"></div>
        <div class="container">
            <h1 style="text-align:center; font-size: 40px; margin: 0 0 20px 0; text-shadow: 0 4px 15px rgba(0,0,0,0.5);">📻 In Onda Ora</h1>
            <div class="grid">${cardsHtml}</div>
        </div>
    `, `
        .mesh-bg { position: absolute; width: 100%; height: 100%; background: radial-gradient(at 10% 10%, rgba(30, 20, 80, 0.7) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(80, 20, 40, 0.7) 0px, transparent 50%); background-color: #0a0a0a; z-index: -1; }
        .container { width: 900px; height: auto; min-height: 550px; padding: 40px; box-sizing: border-box; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; width: 100%; }
        .user-card { width: 100%; height: 110px; overflow: hidden; background: rgba(255,255,255,0.05); border-radius: 20px; padding: 15px; display: flex; align-items: center; gap: 20px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); box-sizing: border-box; }
        .user-card img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .meta { 
    display: flex; 
    flex-direction: column; 
    justify-content: center;
    flex: 1; 
    min-width: 0;
}
        .user-name { font-size: 13px; color: #0a84ff; font-weight: 800; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;}
        .track-name { 
    font-size: 18px; 
    font-weight: 800; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.artist-name { 
    font-size: 15px; 
    color: #bbb; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
        .live-dot { position: absolute; top: 15px; right: 15px; width: 12px; height: 12px; background: #ff3b30; border-radius: 50%; box-shadow: 0 0 12px #ff3b30; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    `);
    caption = `📻 *Radio di Gruppo*\nCi sono ${playingUsers.length} persone in ascolto adesso!\n> by kinder`;
    break;
}

            default:
                return m.reply("Comando non riconosciuto nel visual hub.");
        }

        const buffer = await retryScreenshot(html, viewport.w, viewport.h);
        await conn.sendMessage(m.chat, { image: buffer, caption: caption, footer: 'Origin' }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply(`❌ Si è verificato un errore: ${e.message}`);
    } finally {
        await conn.sendPresenceUpdate('paused', m.chat);
    }
};

handler.help = ['crown', 'aura', 'vs', 'mosaic', 'goal', 'whosplaying', 'comuni', 'receipt', 'throwback', 'leaderboard', 'magazine', 'ticket', 'identity', 'artistmap', 'festival', 'roast', 'soulmate', 'vinyl', 'wrapped'];
handler.command = ['crown', 'topcanzoni', 'topcanzone', 'curaura', 'curvs', 'mosaic', 'goal', 'whosplaying', 'comuni', 'receipt', 'throwback', 'leaderboard', 'magazine', 'ticket', 'identity', 'artistmap', 'festival', 'roast', 'soulmate', 'vinyl', 'wrapped', 'topartista', 'topartisti', 'topartists', 'topartist', 'recap'];
handler.group = true; 

export default handler;            
