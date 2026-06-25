const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'video',
    aliases: ['ytmp4'],
    category: 'downloader',
    description: 'Search YouTube and send back a video: .video <name>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(jid, { text: `Usage: ${prefix}video <video name>` }, { quoted: msg });

        const { videos } = await yts(query);
        if (!videos?.length) return sock.sendMessage(jid, { text: '❌ No results found.' }, { quoted: msg });
        const video = videos[0];

        await sock.sendMessage(jid, { text: `🎬 *${video.title}*\n⏱️ ${video.timestamp}\n\n⬇️ Downloading (this can take a while for longer videos)...` }, { quoted: msg });

        try {
            const stream = ytdl(video.url, { filter: format => format.container === 'mp4' && format.hasAudio && format.hasVideo, quality: 'lowest' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const buffer = Buffer.concat(chunks);

            await sock.sendMessage(jid, { video: buffer, caption: video.title }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: `⚠️ Download failed. Link: ${video.url}` }, { quoted: msg });
        }
    }
};
