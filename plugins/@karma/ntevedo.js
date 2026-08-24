

let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!m.isGroup) return;

  if (!isAdmin && !isOwner) return conn.reply(m.chat, "『 ❌ 』 `Errore:` Solo gli admin possono usare questo comando.", m);

  const groupId = m.chat;
  let ghostJids = [];

  try {
    const groupMeta = await conn.groupMetadata(groupId).catch(() => null);
    if (groupMeta) {
      const allMembers = groupMeta.participants.map(p => p.id || p.jid);
      ghostJids = [...allMembers];

      const meJid = conn.user.id;
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
    }
  } catch (e) {
    console.error('Errore recupero metadati:', e);
  }

  const testo = "*bradar ora mi dovresti vedere!*";

  return conn.sendMessage(m.chat, { 
    text: testo 
  }, { 
    quoted: m, 
    ghostJids 
  });
};

handler.command = ['ntevedo']
handler.tags = ['gruppo']
handler.help = ['guardami']
handler.group = true
handler.admin = true

export default handler