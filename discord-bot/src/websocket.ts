import { WebSocketServer, WebSocket } from 'ws';
import { sendToDiscord } from './discord';

interface GameMessage {
    type: 'CHAT' | 'COMMAND_RESULT' | 'SYSTEM';
    sender: string;
    content: string;
}

let activeClients: Set<WebSocket> = new Set();

export function startWebSocketServer(port: number) {
    const wss = new WebSocketServer({ port });
    console.log(`[WebSocket] Server successfully started on port ${port}`);

    wss.on('connection', (ws: WebSocket) => {
        console.log('[WebSocket] Game client connected.');
        activeClients.add(ws);

        ws.on('message', (message: string) => {
            try {
                const data: GameMessage = JSON.parse(message);
                console.log(`[Game -> Discord] (${data.type}) ${data.sender}: ${data.content}`);
                
                if (data.type === 'CHAT' || data.type === 'SYSTEM') {
                    sendToDiscord(data.sender, data.content);
                }
            } catch (err) {
                console.error('[WebSocket] Failed to parse message from game:', err);
            }
        });

        ws.on('close', () => {
            console.log('[WebSocket] Game client disconnected.');
            activeClients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('[WebSocket] Client error occurred:', error);
        });
    });
}

export function broadcastToGame(sender: string, content: string, isCommand: boolean = false) {
    const payload = JSON.stringify({
        type: isCommand ? 'COMMAND' : 'DISCORD_CHAT',
        sender,
        content
    });

    activeClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}
