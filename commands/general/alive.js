const config = require('../../config');

module.exports = {
    name: 'alive',
    aliases: ['status'],
    category: 'general',
    description: 'Check if the bot is online',
    execute: async (sock, msg, args, { jid }) => {
        const uptimeSec = Math.floor(process.uptime());
        const h = Math.floor(uptimeSec / 3600);
        const m = Math.floor((uptimeSec % 3600) / 60);
        const s = uptimeSec % 60;

        await sock.sendMessage(jid, {
            text:
`✅ *${config.BOT_NAME} is alive!*

⏱️ Uptime: ${h}h ${m}m ${s}s
🔧 Prefix: ${config.PREFIX}
🇿🇼 ${config.POWERED_BY}`
        }, { quoted: msg });
    }
};
