const fs = require('fs');
const path = require('path');
const config = require('../../config');

const CATEGORY_LABELS = {
    general: '⚙️ GENERAL',
    fun: '🎉 FUN',
    anime: '🎴 ANIME & REACTIONS',
    group: '👥 GROUP ADMIN',
    owner: '👑 OWNER',
    converter: '🔄 CONVERTER',
    downloader: '⬇️ DOWNLOADER',
    ai: '🤖 AI',
    tools: '🛠️ TOOLS'
};

module.exports = {
    name: 'menu',
    aliases: ['help', 'commands'],
    category: 'general',
    description: 'Show all available commands',
    execute: async (sock, msg, args, { jid, commands, prefix }) => {
        // Deduplicate (aliases point to the same command object)
        const unique = [...new Set(commands.values())];
        const byCategory = {};
        for (const cmd of unique) {
            byCategory[cmd.category] = byCategory[cmd.category] || [];
            byCategory[cmd.category].push(cmd.name);
        }

        let text = `🇿🇼 *${config.BOT_NAME}*\n_${config.POWERED_BY}_\n\nPrefix: *${prefix}*\nTotal commands: *${unique.length}*\n`;

        for (const [cat, label] of Object.entries(CATEGORY_LABELS)) {
            const cmds = byCategory[cat];
            if (!cmds || cmds.length === 0) continue;
            text += `\n${label} (${cmds.length})\n`;
            text += cmds.sort().map(c => `  • ${prefix}${c}`).join('\n') + '\n';
        }

        text += `\n_Type ${prefix}<command> to use one._`;

        const imagePath = path.join(__dirname, '..', '..', 'public', 'menu.jpg');
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(jid, {
                image: fs.readFileSync(imagePath),
                caption: text
            }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, { text }, { quoted: msg });
        }
    }
};
