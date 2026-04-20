@echo off
echo Starting ClickTools Portal Server on http://192.168.1.21:5555/ ...
cd /d "%~dp0"
call npm run network
pause
