function getWarnMap(user, fallbackChatId = null) {
    const warns = user?.warns;
    const hasWarnsObject = warns && typeof warns === 'object' && !Array.isArray(warns);
    const normalized = hasWarnsObject
        ? Object.fromEntries(
            Object.entries(warns).map(([chatId, count]) => [chatId, Number(count || 0)])
        )
        : {};

    if (fallbackChatId) {
        if (Number(normalized[fallbackChatId] || 0) > 0) {
            return normalized;
        }

        if (Object.keys(normalized).length === 0 && Number(user?.warn || 0) > 0) {
            normalized[fallbackChatId] = Number(user.warn || 0);
            return normalized;
        }

        if (!(fallbackChatId in normalized) && Number(user?.warn || 0) > 0) {
            normalized[fallbackChatId] = Number(user.warn || 0);
            return normalized;
        }
    }

    if (Object.keys(normalized).length > 0) return normalized;

    if (Number(user?.warn || 0) > 0) {
        return fallbackChatId
            ? { [fallbackChatId]: Number(user.warn || 0) }
            : { global: Number(user.warn || 0) };
    }

    return {};
}

let handler = async (m, { conn, isOwner }) => {
    const userId = m.sender;
    const groupId = m.chat;

    if (!m.isGroup && !isOwner) {
        return conn.reply(m.chat, global.t('listawarnOwnerOnly', userId, groupId), m);
    }

    let groupMembers = [];
    let groupName = '';

    if (m.isGroup) {
        const groupMeta = await conn.groupMetadata(m.chat);
        groupMembers = groupMeta.participants.map(p => p.id);
        groupName = groupMeta.subject;
    } else {
        groupName = global.t('listawarnAllUsers', userId, groupId);
    }

    const allUsers = global.db?.data?.users || {};

    let adv = Object.entries(allUsers).filter(([jid, user]) => {
        const warnMap = getWarnMap(user, m.isGroup ? m.chat : null);

        if (m.isGroup) {
            return groupMembers.includes(jid) && Number(warnMap[m.chat] || 0) > 0;
        }

        return Object.values(warnMap).some(warnCount => Number(warnCount || 0) > 0);
    });

    let userList = '';
    if (adv.length > 0) {
        for (let i = 0; i < adv.length; i++) {
            let [jid, user] = adv[i];
            const warnMap = getWarnMap(user, m.isGroup ? m.chat : null);
            let userGroupInfo = '';

            if (!m.isGroup && isOwner) {
                let userGroupsWithWarns = [];
                try {
                    for (let [warnChatId, warnCount] of Object.entries(warnMap)) {
                        if (Number(warnCount || 0) > 0) {
                            try {
                                let groupMeta = await conn.groupMetadata(warnChatId);
                                userGroupsWithWarns.push(`${groupMeta.subject} (${warnCount}/3)`);
                            } catch {
                                userGroupsWithWarns.push(`Gruppo ${warnChatId.split('@')[0]} (${warnCount}/3)`);
                            }
                        }
                    }

                    if (userGroupsWithWarns.length > 0) {
                        userGroupInfo = `\n┊ 『 👥 』 ${global.t('listawarnGroups', userId, groupId)} ${userGroupsWithWarns.join(', ')}`;
                    } else {
                        userGroupInfo = `\n┊ 『 👥 』 ${global.t('listawarnGroups', userId, groupId)} ${global.t('listawarnNoActiveWarns', userId, groupId)}`;
                    }
                } catch {
                    userGroupInfo = `\n┊ 『 👥 』 ${global.t('listawarnGroups', userId, groupId)} ${global.t('listawarnErrorRetrieving', userId, groupId)}`;
                }
            }

            let warnCount = 0;
            if (m.isGroup) {
                warnCount = Number(warnMap[m.chat] || 0);
            } else {
                warnCount = Object.values(warnMap).reduce((sum, w) => sum + Number(w || 0), 0);
            }

            userList += `┊ 『 ⚠️ 』 ${global.t('listawarnUserNumber', userId, groupId, { index: i + 1 })} ${conn.getName(jid) || global.t('listawarnUnknownUser', userId, groupId)} ${m.isGroup ? `(${warnCount}/3)` : `(${global.t('listawarnTotalWarns', userId, groupId, { count: warnCount })})`}
┊ 『 📱 』 ${global.t('listawarnTag', userId, groupId)} ${isOwner ? '@' + jid.split('@')[0] : jid.split('@')[0]}${userGroupInfo}
┊
`;
        }
    } else {
        userList = `┊ 『 ✅ 』 ${global.t('listawarnNoWarns', userId, groupId)}\n┊\n`;
    }

    const nomeDelBot = conn.user?.name || global.db?.data?.nomedelbot || '₭𐌀Ɽ₥𐌀-𐌱𐍉𐍄';
    let caption = `╭★────★────★
┊ㅤㅤ${global.t('listawarnTitle', userId, groupId)}
┊
┊ 『 📋 』 ${m.isGroup ? global.t('listawarnGroup', userId, groupId) : global.t('listawarnMode', userId, groupId)}: ${groupName}
┊ 『 👥 』 ${global.t('listawarnTotal', userId, groupId, { count: adv.length })}
┊
${userList}╰★────★────★`;

    await conn.sendMessage(m.chat, {
        text: caption,
        mentions: await conn.parseMention(caption),
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: nomeDelBot
            }
        }
    }, { quoted: m });
};

handler.help = ['avvertimenti','warns','listawarn','warnlist'];
handler.tags = ['gruppo'];
handler.command = /^(avvertimenti|listav|warns|listawarn|listavvertiti|listaavvertiti|warnlist|listwarn|avvertiti|avisos|advertencias|avisos_pt|advertências|warnungen|avertissements|предупреждения|تحذيرات|चेतावनी|ostrzeżenia)$/i;

export default handler;
