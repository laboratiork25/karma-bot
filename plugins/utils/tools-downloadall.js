import axios from 'axios';

const API_BASE = 'https://api.chatunity.it/api/download';

async function downloadMedia(url) {
  const { data } = await axios.post(
    API_BASE + '/all',
    { url, format: 'best' },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000
    }
  );

  if (!data.ok) throw new Error(data.message || 'Download failed');
  return data;
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text || !text.match(/^https?:\/\/[^\s]+$/)) {
      return m.reply(
        `📥 *Download All - ChatUnity*\n\n` +
        `Scarica video e immagini da TikTok, Pinterest, Instagram, Facebook e altri.\n\n` +
        `📝 *Utilizzo:*\n` +
        `${usedPrefix + command} <url>\n\n` +
        `📌 *Esempi:*\n` +
        `${usedPrefix + command} https://tiktok.com/@user/video/... \n` +
        `${usedPrefix + command} https://www.pinterest.com/pin/... \n` +
        `${usedPrefix + command} https://www.instagram.com/reel/... \n` +
        `${usedPrefix + command} https://www.facebook.com/... \n\n` +
        `⚡ *Powered by ChatUnity*`
      );
    }

    const url = text.trim();

    await m.reply('⏳ Download in corso...');

    const result = await downloadMedia(url);

    const baseUrl = 'https://api.chatunity.it';
    const mediaType = result.mediaType || 'file';
    const primaryDownloadUrl = baseUrl + result.downloadUrl;
    const files = Array.isArray(result.files) ? result.files : [];
    const isTikTok = /tiktok\.com/i.test(url);

    // VIDEO: invariato
    if (mediaType === 'video') {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: primaryDownloadUrl },
          caption: '✅ Download completato'
        },
        { quoted: m }
      );
      return;
    }

    // TIKTOK IMMAGINI: CAROUSEL (max 7 card)
    if (mediaType === 'image' && files.length > 1 && isTikTok) {
      const filesToSend = files.slice(0, 7); // max 7
      const total = filesToSend.length;
      const prefix = usedPrefix || '.';

      const cards = filesToSend.map((file, idx) => {
        const index = idx + 1;
        const imageUrl =
          baseUrl +
          `/api/download/file/${encodeURIComponent(file.fileName)}`;

        return {
          image: { url: imageUrl },
          title: `TikTok ${index}/${total}`,
          body: '',
          buttons: [
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: `Immagine ${index}/${total}`,
                // comando "sicuro": ad esempio rimanda al menu principale
                id: `${prefix}menu`
              })
            }
          ]
        };
      });

      const headerText = '📷 Immagini TikTok';

      try {
        await conn.sendMessage(
          m.chat,
          {
            text: headerText,
            footer: '',
            cards
          },
          { quoted: m }
        );
      } catch (e) {
        // fallback: manda almeno la prima immagine
        console.error('Errore invio carousel TikTok:', e.message);
        const first = filesToSend[0];
        const firstUrl =
          baseUrl +
          `/api/download/file/${encodeURIComponent(first.fileName)}`;

        await conn.sendMessage(
          m.chat,
          {
            image: { url: firstUrl },
            caption: '✅ Download completato'
          },
          { quoted: m }
        );
      }

      return;
    }

    // IMMAGINI non TikTok o singola immagine
    if (mediaType === 'image') {
      if (files.length > 1) {
        const filesToSend = files.slice(0, 7);

        for (const file of filesToSend) {
          const imageUrl =
            baseUrl +
            `/api/download/file/${encodeURIComponent(file.fileName)}`;

          await conn.sendMessage(
            m.chat,
            {
              image: { url: imageUrl },
              caption: '✅ Download immagine'
            },
            { quoted: m }
          );
        }
        return;
      }

      await conn.sendMessage(
        m.chat,
        {
          image: { url: primaryDownloadUrl },
          caption: '✅ Download completato'
        },
        { quoted: m }
      );
      return;
    }

    // Fallback generico
    await m.reply('✅ Download completato');
  } catch (e) {
    console.error('Download error:', e);

    const apiMessage =
      e.response?.data?.message ||
      e.response?.data?.error ||
      null;

    const errorMessage = apiMessage || e.message || 'Errore sconosciuto';

    await m.reply(`❌ Errore: ${errorMessage}`);
  }
};

handler.command = /^(download|dl|tutti)$/i;
handler.help = ['download <url>', 'dl <url>', 'tutti <url>'];
handler.tags = ['downloader'];
handler.limit = 5;

export default handler;
