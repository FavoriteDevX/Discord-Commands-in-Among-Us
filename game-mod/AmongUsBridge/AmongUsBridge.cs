using System;
using BepInEx;
using BepInEx.IL2CPP;
using HarmonyLib;
using WebSocketSharp;
using System.Text.Json;

namespace AmongUsBridge
{
    [BepInPlugin("com.bridge.amongus.discord", "AmongUsDiscordBridge", "1.0.0")]
    [BepInProcess("Among Us.exe")]
    public class AmongUsBridgePlugin : BasePlugin
    {
        public static WebSocket ws;
        private static AmongUsBridgePlugin Instance;

        public override void Load()
        {
            Instance = this;
            Log.LogInfo("AmongUsBridge Modern Plugin Loaded Successfully.");

            ConnectWebSocket();

            var harmony = new Harmony("com.bridge.amongus.discord");
            harmony.PatchAll();
        }

        private void ConnectWebSocket()
        {
            try
            {
                ws = new WebSocket("ws://127.0.0.1:8081");
                ws.OnMessage += (sender, e) => {
                    HandleIncomingWebSocketMessage(e.Data);
                };
                ws.Connect();
                Log.LogInfo("Connected to Backend WebSocket Bridge Server.");
            }
            catch (Exception ex)
            {
                Log.LogError($"WebSocket Connection failed: {ex.Message}");
            }
        }

        private void HandleIncomingWebSocketMessage(string rawJson)
        {
            try
            {
                var payload = JsonSerializer.Deserialize<BridgePayload>(rawJson);
                if (payload != null)
                {
                    // Injecting message into the local game client chat interface safely
                    string formattedMessage = $"[{payload.sender}]: {payload.content}";
                    
                    if (HudManager.Instance != null && HudManager.Instance.ChatController != null)
                    {
                        HudManager.Instance.ChatController.AddChatMessage(formattedMessage, Palette.White);
                    }
                }
            }
            catch (Exception ex)
            {
                Log.LogError($"Error processing incoming WS message: {ex.Message}");
            }
        }

        // Intercept Outgoing Chat from local player
        [HarmonyPatch(typeof(ChatController), nameof(ChatController.SendChat))]
        public static class ChatControllerPatch
        {
            public static void Postfix(ChatController __instance)
            {
                if (ws != null && ws.IsAlive)
                {
                    string text = __instance.TextArea.text;
                    if (!string.IsNullOrEmpty(text))
                    {
                        var packet = new BridgePayload
                        {
                            type = "CHAT",
                            sender = PlayerControl.LocalPlayer?.Data?.PlayerName ?? "Unknown Player",
                            content = text
                        };
                        ws.Send(JsonSerializer.Serialize(packet));
                    }
                }
            }
        }

        public class BridgePayload
        {
            public string type { get; set; }
            public string sender { get; set; }
            public string content { get; set; }
        }
    }
}
