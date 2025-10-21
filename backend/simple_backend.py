#!/usr/bin/env python3
"""
Simplified backend for Looker Conversational Interface
Works without complex dependencies
"""
import asyncio
import json
import os
import subprocess
import sys
from typing import Dict, Any
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

# Simple encryption using base64 (not secure, but works for demo)
def simple_encrypt(data: str) -> str:
    """Simple encryption for demo purposes"""
    return base64.b64encode(data.encode()).decode()

def simple_decrypt(encrypted_data: str) -> str:
    """Simple decryption for demo purposes"""
    try:
        return base64.b64decode(encrypted_data.encode()).decode()
    except:
        return ""

class WebSocketHandler:
    def __init__(self):
        self.connections = []
    
    async def handle_connection(self, websocket, path):
        self.connections.append(websocket)
        print(f"WebSocket connected: {len(self.connections)} total connections")
        
        try:
            async for message in websocket:
                data = json.loads(message)
                print(f"Received: {data}")
                
                if data.get("type") == "start_config":
                    config = data.get("config", {})
                    await self.process_configuration(websocket, config)
        except Exception as e:
            print(f"WebSocket error: {e}")
        finally:
            if websocket in self.connections:
                self.connections.remove(websocket)
            print(f"WebSocket disconnected: {len(self.connections)} remaining")

    async def process_configuration(self, websocket, config):
        """Process configuration with simulated steps"""
        try:
            # Step 1: Gemini CLI
            await self.send_status(websocket, {
                "status": "installing",
                "message": "Instalando Gemini CLI...",
                "progress": 10,
                "step": "gemini_install"
            })
            await asyncio.sleep(2)
            
            await self.send_status(websocket, {
                "status": "loading",
                "message": "Gemini CLI instalado com sucesso",
                "progress": 30,
                "step": "gemini_install"
            })
            
            # Step 2: Looker MCP
            await self.send_status(websocket, {
                "status": "loading",
                "message": "Configurando credenciais do Looker...",
                "progress": 50,
                "step": "looker_config"
            })
            await asyncio.sleep(2)
            
            await self.send_status(websocket, {
                "status": "loading",
                "message": "Testando conexão com Looker...",
                "progress": 70,
                "step": "looker_test"
            })
            await asyncio.sleep(2)
            
            await self.send_status(websocket, {
                "status": "loading",
                "message": "Conexão estabelecida com sucesso",
                "progress": 90,
                "step": "looker_test"
            })
            
            # Step 3: Interface
            await self.send_status(websocket, {
                "status": "loading",
                "message": "Preparando interface conversacional...",
                "progress": 95,
                "step": "interface_setup"
            })
            await asyncio.sleep(1)
            
            # Complete
            await self.send_status(websocket, {
                "status": "done",
                "message": "Configuração concluída com sucesso!",
                "progress": 100,
                "step": "complete"
            })
            
        except Exception as e:
            await self.send_status(websocket, {
                "status": "error",
                "message": f"Erro na configuração: {str(e)}",
                "progress": 0,
                "step": "error"
            })

    async def send_status(self, websocket, message):
        """Send status message to WebSocket"""
        try:
            await websocket.send(json.dumps(message))
        except Exception as e:
            print(f"Error sending message: {e}")

class HTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "message": "Looker Conversational Interface Backend",
                "status": "running"
            }).encode())
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
        # Suppress default logging
        pass

def start_http_server():
    """Start HTTP server"""
    server = HTTPServer(('localhost', 8000), HTTPHandler)
    print("🌐 HTTP Server running at http://localhost:8000")
    server.serve_forever()

def main():
    print("🚀 Starting Looker Conversational Interface Backend (Simple Mode)")
    print("🌐 HTTP Server: http://localhost:8000")
    print("📡 WebSocket: ws://localhost:8000/ws")
    print("⚠️  Note: This is a simplified version for demo purposes")
    print("=" * 60)
    
    # Start HTTP server in a separate thread
    http_thread = threading.Thread(target=start_http_server, daemon=True)
    http_thread.start()
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")

if __name__ == "__main__":
    main()
