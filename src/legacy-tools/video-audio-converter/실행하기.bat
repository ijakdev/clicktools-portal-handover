@echo off
setlocal
cd /d "%~dp0"

echo [1/1] Launching Unified Conversion Server & UI...
start "FFmpeg Master Server" cmd /c "cd server && npm install && node app.js"

echo.
echo ======================================================
echo  WORLD CLASS FULL-STACK CONVERTER [MASTER] is running!
echo  - Unified Access: http://127.0.0.1:7773/index.html
echo.
echo  ※ 중요: 'FFmpeg Master Server' 검은색 창이 켜져 있어야 합니다.
echo ======================================================
echo.
echo  ※ 중요: 'FFmpeg Server' 검은색 창이 계속 켜져 있어야 합니다.
echo ======================================================
echo.
pause
