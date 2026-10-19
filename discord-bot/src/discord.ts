import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import { broadcastToGame } from './websocket';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || '';
const COMMAND_PREFIX = '!au';

client.once('ready', () => {
    console.log(`[Discord] Bot logged in successfully as ${client.user?.tag}`);
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    if (message.channelId !== DISCORD_CHANNEL_ID) return;

    // Handle Discord Commands to route into Among Us Chat
    if (message.content.startsWith(COMMAND_PREFIX)) {
        const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase();

        if (!command) return;

        console.log(`[Discord Command] Executing command: ${command} with args:`, args);
        broadcastToGame(message.author.username, `${command} ${args.join(' ')}`, true);
        await message.reply(`─ Sent command \`\${command}\` directly to Among Us chat.`);
        return;
    }

    // Handle standard chat relay
    broadcastToGame(message.author.username, message.content, false);
});

export async function sendToDiscord(sender: string, content: string) {
    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID) as TextChannel;
        if (channel) {
            await channel.send(`**[In-Game] ${sender}**: ${content}`);
        }
    } catch (error) {
        console.error('[Discord] Failed to send message to channel:', error);
    }
}

export function loginDiscord() {
    if (!process.env.DISCORD_TOKEN) {
        console.error('[Discord] Missing DISCORD_TOKEN in environment variables.');
        process.exit(1);
    }
    client.login(process.env.DISCORD_TOKEN);
}
