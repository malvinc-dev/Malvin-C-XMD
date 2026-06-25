const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: 'song',
    category: 'downloader',
    description: 'Download a song as a document file: .song <song name>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(jid, { text: `Usage: ${prefix}song <song name>` }, { quoted: msg });

        const { videos } = await yts(query);
        if (!videos?.length) return sock.sendMessage(jid, { text: '❌ No results found.' }, { quoted: msg });
        const video = videos[0];

        try {
            const stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
            const chunks = [];
            for await (const chunk of stream) chunks.push(chunk);
            const buffer = Buffer.concat(chunks);

            await sock.sendMessage(jid, {
                document: buffer,
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`,
                caption: `🎵 ${video.title}`
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: `⚠️ Download failed. Link: ${video.url}` }, { quoted: msg });
        }
    }
};
