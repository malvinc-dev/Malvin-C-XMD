const { isSenderAdmin } = require('../../lib/helpers');

const enabledGroups = new Set();
const LINK_REGEX = /(chat\.whatsapp\.com|https?:\/\/)/i;

module.exports = {
    name: 'antilink',
    category: 'group',
    description: 'Auto-delete links sent by non-admins: .antilink on / .antilink off',
    execute: async (sock, msg, args, { jid, prefix }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const mode = (args[0] || '').toLowerCase();
        if (mode !== 'on' && mode !== 'off') {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}antilink on  |  ${prefix}antilink off` }, { quoted: msg });
        }
        if (mode === 'on') enabledGroups.add(jid); else enabledGroups.delete(jid);
        await sock.sendMessage(jid, { text: `✅ Antilink turned ${mode.toUpperCase()}.` });
    },

    // Called on every non-command group message by lib/whatsapp.js
    checkMessage: async (sock, msg, text, { jid }) => {
        if (!enabledGroups.has(jid)) return;
        if (!LINK_REGEX.test(text)) return;

        const sender = msg.key.participant || msg.key.remoteJid;
        if (await isSenderAdmin(sock, jid, sender)) return; // admins are exempt

        await sock.sendMessage(jid, { delete: msg.key });
        await sock.sendMessage(jid, { text: `🚫 Link removed — @${sender.split('@')[0]}, links aren't allowed here.`, mentions: [sender] });
    }
};
