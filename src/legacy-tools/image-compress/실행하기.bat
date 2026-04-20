@echo off
chcp 65001 > nul
title ImageCompress 실행기

echo ========================================================
echo        🚀 ImageCompress Pro 🚀
echo ========================================================
echo.
echo 1. 초기 설정을 확인하고 필요시 패키지를 설치합니다...
call npm install

echo.
echo 2. 로컬 서버를 가동합니다. 잠시만 기다려주세요...
echo 브라우저가 자동으로 열립니다! (수동 접속: http://localhost:5173/image-compress/)
echo.
echo ========================================================
echo 종료하시려면 이 창을 닫거나 (Ctrl + C)를 누르세요.
echo ========================================================
echo.

call npm run dev
pause
