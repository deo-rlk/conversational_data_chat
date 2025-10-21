#!/usr/bin/env python3
"""
Test backend - simple HTTP server
"""
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {"message": "Backend is working!", "status": "ok"}
        self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    print("🚀 Starting test backend on port 8000")
    server = HTTPServer(('localhost', 8000), TestHandler)
    print("✅ Server started! Test with: curl http://localhost:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
