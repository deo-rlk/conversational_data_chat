#!/usr/bin/env python3
"""
Backend completo para teste com simulação realista
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
        print(f"✅ WebSocket conectado: {len(self.connections)} conexões ativas")
    
    async def unregister(self, websocket):
        self.connections.discard(websocket)
        print(f"❌ WebSocket desconectado: {len(self.connections)} conexões restantes")
    
    async def send_message(self, websocket, message):
        try:
            await websocket.send(json.dumps(message))
            print(f"📤 Enviado: {message['message']} ({message['progress']}%)")
        except Exception as e:
            print(f"❌ Erro ao enviar mensagem: {e}")
    
    async def process_configuration(self, websocket, config):
        """Simula processo completo de configuração"""
        print(f"🔧 Iniciando configuração para: {config.get('url', 'Demo')}")
        
        # Etapa 1: Instalação Gemini CLI (2-3 minutos)
        await self.send_message(websocket, {
            "status": "installing",
            "message": "Iniciando instalação do Gemini CLI...",
            "progress": 5,
            "step": "gemini_start"
        })
        await asyncio.sleep(3)
        
        await self.send_message(websocket, {
            "status": "installing", 
            "message": "Baixando dependências do Gemini CLI...",
            "progress": 15,
            "step": "gemini_download"
        })
        await asyncio.sleep(4)
        
        await self.send_message(websocket, {
            "status": "installing",
            "message": "Configurando ambiente Python...",
            "progress": 25,
            "step": "gemini_python"
        })
        await asyncio.sleep(3)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Gemini CLI instalado com sucesso!",
            "progress": 35,
            "step": "gemini_complete"
        })
        await asyncio.sleep(2)
        
        # Etapa 2: Configuração Looker MCP (1-2 minutos)
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Configurando credenciais do Looker MCP...",
            "progress": 45,
            "step": "looker_start"
        })
        await asyncio.sleep(2)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Validando credenciais do Looker...",
            "progress": 55,
            "step": "looker_validate"
        })
        await asyncio.sleep(3)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Testando conexão com Looker...",
            "progress": 65,
            "step": "looker_test"
        })
        await asyncio.sleep(4)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Conexão estabelecida com sucesso!",
            "progress": 75,
            "step": "looker_connected"
        })
        await asyncio.sleep(2)
        
        # Etapa 3: Configuração MCP (1 minuto)
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Configurando Model Context Protocol...",
            "progress": 80,
            "step": "mcp_config"
        })
        await asyncio.sleep(3)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Inicializando servidor MCP...",
            "progress": 85,
            "step": "mcp_server"
        })
        await asyncio.sleep(2)
        
        # Etapa 4: Preparação da Interface (30 segundos)
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Preparando interface conversacional...",
            "progress": 90,
            "step": "interface_prep"
        })
        await asyncio.sleep(2)
        
        await self.send_message(websocket, {
            "status": "loading",
            "message": "Configurando modelos de IA...",
            "progress": 95,
            "step": "ai_models"
        })
        await asyncio.sleep(2)
        
        # Conclusão
        await self.send_message(websocket, {
            "status": "done",
            "message": "🎉 Configuração concluída com sucesso! Tudo pronto para conversar com seus dados.",
            "progress": 100,
            "step": "complete"
        })
        
        print("✅ Configuração finalizada com sucesso!")

    async def handle_websocket(self, websocket, path):
        await self.register(websocket)
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    print(f"📨 Recebido: {data}")
                    
                    if data.get("type") == "start_config":
                        config = data.get("config", {})
                        await self.process_configuration(websocket, config)
                        
                except json.JSONDecodeError:
                    print(f"❌ JSON inválido: {message}")
                except Exception as e:
                    print(f"❌ Erro: {e}")
                    
        except websockets.exceptions.ConnectionClosed:
            print("🔌 Conexão fechada pelo cliente")
        except Exception as e:
            print(f"❌ Erro WebSocket: {e}")
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
                "connections": len(ws_manager.connections),
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(response).encode())
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
        pass

def start_http():
    """Inicia servidor HTTP"""
    server = HTTPServer(('localhost', 8000), HTTPHandler)
    print("🌐 Servidor HTTP: http://localhost:8000")
    server.serve_forever()

async def start_websocket():
    """Inicia servidor WebSocket"""
    print("📡 Servidor WebSocket: ws://localhost:8001/ws")
    async with websockets.server.serve(ws_manager.handle_websocket, "localhost", 8001):
        print("✅ WebSocket ativo e aguardando conexões...")
        await asyncio.Future()  # Executa para sempre

def main():
    print("🚀 Looker Conversational Interface - Backend Completo")
    print("=" * 60)
    print("🌐 HTTP Server: http://localhost:8000")
    print("📡 WebSocket: ws://localhost:8001/ws")
    print("⏱️  Tempo estimado de configuração: 5-8 minutos")
    print("=" * 60)
    
    # Inicia HTTP em thread separada
    http_thread = threading.Thread(target=start_http, daemon=True)
    http_thread.start()
    
    # Inicia WebSocket
    try:
        asyncio.run(start_websocket())
    except KeyboardInterrupt:
        print("\n👋 Servidor parado pelo usuário")

if __name__ == "__main__":
    main()
