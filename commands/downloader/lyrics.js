const axios = require('axios');

module.exports = {
    name: 'lyrics',
    category: 'downloader',
    description: 'Get song lyrics: .lyrics <artist> - <song>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const query = args.join(' ');
        if (!query.includes('-')) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}lyrics <artist> - <song>` }, { quoted: msg });
        }
        const [artist, ...rest] = query.split('-');
        const title = rest.join('-').trim();

        try {
            const { data } = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist.trim())}/${encodeURIComponent(title)}`, { timeout: 15000 });
            if (!data.lyrics) throw new Error('not found');
            await sock.sendMessage(jid, { text: `🎤 *${title.trim()}* — ${artist.trim()}\n\n${data.lyrics}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Lyrics not found for that song.' }, { quoted: msg });
        }
    }
};
