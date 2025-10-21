@echo off
echo ========================================
echo Teste Completo - Frontend + Backend
echo ========================================
echo.
echo 1. Instalando websockets...
pip install websockets
echo.
echo 2. Iniciando backend de teste...
echo    HTTP: http://localhost:8000
echo    WebSocket: ws://localhost:8001/ws
echo    Tempo estimado: 5-8 minutos
echo.
cd backend
python test_backend_complete.py
pause
