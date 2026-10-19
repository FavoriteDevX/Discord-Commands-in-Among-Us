# Among Us ↔️ Discord Chat & Command Bridge

<img width="640" height="480" alt="image" src="https://github.com/user-attachments/assets/a452942f-cdf9-45d0-991b-a5ae30fdcce2" />

<img width="800" height="399" alt="image" src="https://github.com/user-attachments/assets/9b8f325f-6f4e-4cd0-971a-05ca976f3bee" />

A high-performance, asynchronous bridge ecosystem that seamlessly connects an **Among Us** game client with a **Discord Bot** via WebSockets. It enables real-time chat replication and lets users execute Discord commands that output directly inside the in-game chat UI.

## 🚀 Features

- **Bi-directional Chat Sync:** Messages typed in the Among Us chat are sent to Discord, and Discord messages are instantly injected into the game chat.
- **Remote Commands:** Send `!au <command>` from Discord to execute macros or trigger custom alerts directly on the game client.
- **Robust Connection Recovery:** Built-in automatic heartbeat checks and disconnection fault tolerance.
- **Modularity:** Written using TypeScript (Node.js backend) and C# (BepInEx Harmony Patches for Among Us).

---

## 📂 Repository Structure

```text
among-us-discord-bridge/
├── .gitignore
├── LICENSE
├── README.md
├── discord-bot/          # Node.js + TypeScript WebSocket Server & Discord Bot
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── game-mod/             # C# BepInEx Plugin for Among Us (Harmony Patches)
    ├── AmongUsBridge/
    └── AmongUsBridge.sln
```

---

## 🛠️ Setup & Installation

### 1. Backend & Discord Bot (`/discord-bot`)

1. Navigate to the bot directory:
   ```bash
   cd discord-bot
   ```
2. Install the production and development dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of `/discord-bot` using the template below:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CHANNEL_ID=your_target_channel_id
   PORT=8081
   ```
4. Build and start the service:
   ```bash
   npm run start
   ```

### 2. Client Game Mod (`/game-mod`)

1. Ensure you have **BepInEx IL2CPP (v6.0.0-be.668 or higher)** installed in your Among Us directory.
2. Open `AmongUsBridge.sln` using Visual Studio 2022 or Rider.
3. Restore NuGet packages and build the solution under the **Release** configuration.
4. Copy the compiled `AmongUsBridge.dll` from the `bin/Release/net6.0/` folder.
5. Paste it inside your Among Us game files folder under `BepInEx/plugins/`.
6. Launch Among Us. The mod will automatically establish a pipeline connection to `ws://127.0.0.1:8081`.

---

## 🤖 Available Commands

Type these inside your configured Discord text channel:

| Command | Action |
| :--- | :--- |
| `!au help` | Lists all active bridge diagnostics and commands. |
| `!au alert <text>` | Injects a prioritized notification broadcast message to the game chat UI. |

---
