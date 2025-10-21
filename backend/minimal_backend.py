#!/usr/bin/env python3
"""
Minimal backend for testing - no WebSocket, just HTTP
"""
import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading

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
                "note": "WebSocket not available - using fallback mode"
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
        pass

def main():
    print("🚀 Minimal Backend (HTTP only)")
    print("🌐 Server: http://localhost:8000")
    print("⚠️  WebSocket not available - frontend will use fallback mode")
    print("=" * 50)
    
    server = HTTPServer(('localhost', 8000), HTTPHandler)
    print("✅ Server started successfully!")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main()
