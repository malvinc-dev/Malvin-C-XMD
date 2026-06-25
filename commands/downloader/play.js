const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'play',
    category: 'downloader',
    description: 'Search YouTube and send back the audio: .play <song name>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const query = args.join(' ');
        if (!query) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}play <song name>` }, { quoted: msg });
        }

        await sock.sendMessage(jid, { react: { text: '🔎', key: msg.key } });

        const { videos } = await yts(query);
        if (!videos || videos.length === 0) {
            return sock.sendMessage(jid, { text: '❌ No results found.' }, { quoted: msg });
        }
        const video = videos[0];

        await sock.sendMessage(jid, {
            text: `🎵 *${video.title}*\n⏱️ ${video.timestamp}  •  👁️ ${video.views.toLocaleString()}\n🔗 ${video.url}\n\n⬇️ Downloading audio...`
        }, { quoted: msg });

        try {
            const stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const buffer = Buffer.concat(chunks);

            await sock.sendMessage(jid, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, {
                text: `⚠️ Couldn't download the audio (YouTube may have changed something on their end). Here's the link instead:\n${video.url}`
            }, { quoted: msg });
        }
    }
};
