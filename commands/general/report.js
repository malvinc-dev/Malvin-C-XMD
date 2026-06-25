const config = require('../../config');

module.exports = {
    name: 'report',
    aliases: ['support', 'feedback'],
    category: 'general',
    description: 'Send a report or feedback to the bot owner',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const text = args.join(' ');
        if (!text) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}report <your message>` }, { quoted: msg });
        }
        const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
        await sock.sendMessage(ownerJid, { text: `📩 *New report*\nFrom: ${jid}\n\n${text}` });
        await sock.sendMessage(jid, { text: '✅ Your message has been sent to the owner. Thank you!' }, { quoted: msg });
    }
};
