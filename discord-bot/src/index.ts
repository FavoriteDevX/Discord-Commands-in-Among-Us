import { startWebSocketServer } from './websocket';
import { loginDiscord } from './discord';

const PORT = parseInt(process.env.PORT || '8081', 10);

console.log('[System] Initializing Among Us Discord Bridge Ecosystem...');

// Initialize components
startWebSocketServer(PORT);
loginDiscord();
