const axios = require('axios');

module.exports = {
    name: 'tiktok',
    aliases: ['tt'],
    category: 'downloader',
    description: 'Download a TikTok video without watermark: .tiktok <link>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const url = args[0];
        if (!url || !url.includes('tiktok.com')) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}tiktok <tiktok video link>` }, { quoted: msg });
        }
        try {
            const { data } = await axios.get('https://www.tikwm.com/api/', { params: { url }, timeout: 15000 });
            if (!data?.data?.play) {
                return sock.sendMessage(jid, { text: '❌ Could not fetch that TikTok video.' }, { quoted: msg });
            }
            await sock.sendMessage(jid, {
                video: { url: data.data.play },
                caption: `🎵 ${data.data.title || 'TikTok video'}\n👤 ${data.data.author?.nickname || ''}`
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '⚠️ TikTok download failed. The link may be invalid or private.' }, { quoted: msg });
        }
    }
};
