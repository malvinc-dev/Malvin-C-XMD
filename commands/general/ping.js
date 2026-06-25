module.exports = {
    name: 'ping',
    aliases: ['speed'],
    category: 'general',
    description: 'Check the bot\'s response speed',
    execute: async (sock, msg, args, { jid }) => {
        const start = Date.now();
        const sent = await sock.sendMessage(jid, { text: '🏓 Pinging...' }, { quoted: msg });
        const latency = Date.now() - start;
        await sock.sendMessage(jid, {
            text: `🏓 *Pong!*\n⚡ Speed: ${latency}ms\n🇿🇼 Powered by Handsome Tech Zimbabwe`,
            edit: sent.key
        }).catch(async () => {
            // edit not supported on this client, send a fresh message instead
            await sock.sendMessage(jid, { text: `🏓 *Pong!*\n⚡ Speed: ${latency}ms` }, { quoted: msg });
        });
    }
};
