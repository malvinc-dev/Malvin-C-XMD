module.exports = {
    name: 'runtime',
    aliases: ['uptime'],
    category: 'general',
    description: 'Show how long the bot has been running',
    execute: async (sock, msg, args, { jid }) => {
        const sec = Math.floor(process.uptime());
        const d = Math.floor(sec / 86400);
        const h = Math.floor((sec % 86400) / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        await sock.sendMessage(jid, { text: `⏱️ Runtime: ${d}d ${h}h ${m}m ${s}s` }, { quoted: msg });
    }
};
