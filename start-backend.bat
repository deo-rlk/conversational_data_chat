@echo off
echo ========================================
echo Looker Conversational Interface Backend
echo ========================================
echo.
echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo.
echo Installing websockets dependency...
pip install websockets
if %errorlevel% neq 0 (
    echo WARNING: Failed to install websockets, trying without it...
)

echo.
echo Starting backend with WebSocket support...
echo HTTP Server: http://localhost:8000
echo WebSocket: ws://localhost:8001/ws
cd backend
python simple_ws_backend.py
pause
