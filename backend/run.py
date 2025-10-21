#!/usr/bin/env python3
"""
Script to run the Looker Conversational Interface Backend
"""
import uvicorn
import os
import sys
import subprocess

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import websockets
        import cryptography
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def main():
    print("🚀 Starting Looker Conversational Interface Backend...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Set environment variables
    os.environ.setdefault("ENCRYPTION_KEY", "your-secret-encryption-key-here")
    
    print("🌐 Server will be available at: http://localhost:8000")
    print("📡 WebSocket endpoint: ws://localhost:8000/ws")
    print("📚 API docs: http://localhost:8000/docs")
    print("🔄 Auto-reload enabled")
    print("=" * 50)
    
    try:
        # Run the FastAPI server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
