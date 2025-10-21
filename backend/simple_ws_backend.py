#!/usr/bin/env python3
"""
Ultra-simple backend with WebSocket support
Uses only Python standard library + websockets
"""
import asyncio
import json
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import websockets
import websockets.server

class WebSocketManager:
    def __init__(self):
        self.connections = set()
    
    async def register(self, websocket):
        self.connections.add(websocket)
        print(f"✅ WebSocket connected: {len(self.connections)} total")
    
    async def unregister(self, websocket):
        self.connections.discard(websocket)
        print(f"❌ WebSocket disconnected: {len(self.connections)} remaining")
    
    async def send_message(self, websocket, message):
        try:
            await websocket.send(json.dumps(message))
        except Exception as e:
            print(f"❌ Error sending message: {e}")
    
    async def process_config(self, websocket, config):
        """Simulate configuration process"""
        print(f"🔧 Processing config: {config}")
        
        steps = [
            (10, "installing", "Instalando Gemini CLI...", "gemini_install"),
            (30, "loading", "Gemini CLI instalado com sucesso", "gemini_install"),
            (50, "loading", "Configurando credenciais do Looker...", "looker_config"),
            (70, "loading", "Testando conexão com Looker...", "looker_test"),
            (90, "loading", "Conexão estabelecida com sucesso", "looker_test"),
            (95, "loading", "Preparando interface conversacional...", "interface_setup"),
            (100, "done", "Configuração concluída com sucesso!", "complete")
        ]
        
        for progress, status, message, step in steps:
            await self.send_message(websocket, {
                "status": status,
                "message": message,
                "progress": progress,
                "step": step
            })
            await asyncio.sleep(1)  # Simulate processing time
    
    async def handle_websocket(self, websocket, path):
        await self.register(websocket)
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    print(f"📨 Received: {data}")
                    
                    if data.get("type") == "start_config":
                        config = data.get("config", {})
                        await self.process_config(websocket, config)
                        
                except json.JSONDecodeError:
                    print(f"❌ Invalid JSON: {message}")
                except Exception as e:
                    print(f"❌ Error: {e}")
                    
        except websockets.exceptions.ConnectionClosed:
            print("🔌 Connection closed")
        except Exception as e:
            print(f"❌ WebSocket error: {e}")
        finally:
            await self.unregister(websocket)

# Global manager
ws_manager = WebSocketManager()

class HTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "message": "Looker Conversational Interface Backend",
                "status": "running",
                "websocket": "ws://localhost:8001/ws",
                "connections": len(ws_manager.connections)
            }
            self.wfile.write(json.dumps(response).encode())
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy"}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress logs

def start_http():
    """Start HTTP server"""
    server = HTTPServer(('localhost', 8000), HTTPHandler)
    print("🌐 HTTP Server: http://localhost:8000")
    server.serve_forever()

async def start_websocket():
    """Start WebSocket server"""
    print("📡 WebSocket Server: ws://localhost:8001/ws")
    async with websockets.server.serve(ws_manager.handle_websocket, "localhost", 8001):
        await asyncio.Future()  # Run forever

def main():
    print("🚀 Looker Conversational Interface Backend")
    print("=" * 50)
    
    # Start HTTP in thread
    http_thread = threading.Thread(target=start_http, daemon=True)
    http_thread.start()
    
    # Start WebSocket
    try:
        asyncio.run(start_websocket())
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main()
