#!/usr/bin/env python3
"""
WebSocket-enabled backend for Looker Conversational Interface
"""
import asyncio
import json
import os
import sys
import time
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import websockets
import websockets.server

class WebSocketManager:
    def __init__(self):
        self.connections = set()
    
    async def register(self, websocket):
        self.connections.add(websocket)
        print(f"WebSocket connected: {len(self.connections)} total connections")
    
    async def unregister(self, websocket):
        self.connections.discard(websocket)
        print(f"WebSocket disconnected: {len(self.connections)} remaining")
    
    async def send_to_websocket(self, websocket, message):
        try:
            await websocket.send(json.dumps(message))
        except websockets.exceptions.ConnectionClosed:
            await self.unregister(websocket)
        except Exception as e:
            print(f"Error sending message: {e}")
    
    async def process_configuration(self, websocket, config):
        """Process configuration with simulated steps"""
        try:
            # Step 1: Gemini CLI
            await self.send_to_websocket(websocket, {
                "status": "installing",
                "message": "Instalando Gemini CLI...",
                "progress": 10,
                "step": "gemini_install"
            })
            await asyncio.sleep(2)
            
            await self.send_to_websocket(websocket, {
                "status": "loading",
                "message": "Gemini CLI instalado com sucesso",
                "progress": 30,
                "step": "gemini_install"
            })
            
            # Step 2: Looker MCP
            await self.send_to_websocket(websocket, {
                "status": "loading",
                "message": "Configurando credenciais do Looker...",
                "progress": 50,
                "step": "looker_config"
            })
            await asyncio.sleep(2)
            
            await self.send_to_websocket(websocket, {
                "status": "loading",
                "message": "Testando conexão com Looker...",
                "progress": 70,
                "step": "looker_test"
            })
            await asyncio.sleep(2)
            
            await self.send_to_websocket(websocket, {
                "status": "loading",
                "message": "Conexão estabelecida com sucesso",
                "progress": 90,
                "step": "looker_test"
            })
            
            # Step 3: Interface
            await self.send_to_websocket(websocket, {
                "status": "loading",
                "message": "Preparando interface conversacional...",
                "progress": 95,
                "step": "interface_setup"
            })
            await asyncio.sleep(1)
            
            # Complete
            await self.send_to_websocket(websocket, {
                "status": "done",
                "message": "Configuração concluída com sucesso!",
                "progress": 100,
                "step": "complete"
            })
            
        except Exception as e:
            await self.send_to_websocket(websocket, {
                "status": "error",
                "message": f"Erro na configuração: {str(e)}",
                "progress": 0,
                "step": "error"
            })

    async def handle_websocket(self, websocket, path):
        await self.register(websocket)
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    print(f"Received: {data}")
                    
                    if data.get("type") == "start_config":
                        config = data.get("config", {})
                        await self.process_configuration(websocket, config)
                except json.JSONDecodeError:
                    print(f"Invalid JSON received: {message}")
                except Exception as e:
                    print(f"Error processing message: {e}")
        except websockets.exceptions.ConnectionClosed:
            pass
        except Exception as e:
            print(f"WebSocket error: {e}")
        finally:
            await self.unregister(websocket)

# Global WebSocket manager
ws_manager = WebSocketManager()

class HTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "message": "Looker Conversational Interface Backend",
                "status": "running",
                "websocket": "ws://localhost:8000/ws"
            }).encode())
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "healthy",
                "connections": len(ws_manager.connections)
            }).encode())
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
        # Suppress default logging
        pass

def start_http_server():
    """Start HTTP server"""
    server = HTTPServer(('localhost', 8000), HTTPHandler)
    print("🌐 HTTP Server running at http://localhost:8000")
    server.serve_forever()

async def start_websocket_server():
    """Start WebSocket server"""
    print("📡 WebSocket Server starting at ws://localhost:8000/ws")
    async with websockets.server.serve(ws_manager.handle_websocket, "localhost", 8001):
        print("📡 WebSocket Server running at ws://localhost:8001/ws")
        await asyncio.Future()  # Run forever

def main():
    print("🚀 Starting Looker Conversational Interface Backend")
    print("🌐 HTTP Server: http://localhost:8000")
    print("📡 WebSocket Server: ws://localhost:8001/ws")
    print("⚠️  Note: WebSocket runs on port 8001 to avoid conflicts")
    print("=" * 60)
    
    # Start HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server, daemon=True)
    http_thread.start()
    
    # Start WebSocket server
    try:
        asyncio.run(start_websocket_server())
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")

if __name__ == "__main__":
    main()
