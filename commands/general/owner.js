const config = require('../../config');

module.exports = {
    name: 'owner',
    aliases: ['creator'],
    category: 'general',
    description: 'Show owner contact card',
    execute: async (sock, msg, args, { jid }) => {
        const vcard =
`BEGIN:VCARD
VERSION:3.0
FN:${config.OWNER_NAME}
ORG:Handsome Tech Zimbabwe;
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:+${config.OWNER_NUMBER}
END:VCARD`;

        await sock.sendMessage(jid, {
            contacts: { displayName: config.OWNER_NAME, contacts: [{ vcard }] }
        }, { quoted: msg });
    }
};
