@echo off
echo ==============================
echo    UX Research AI Agent
echo ==============================
echo.

echo 1. Backend 서버 시작 중...
cd /d "%~dp003-development\backend"
start cmd /c "npm run dev"

echo 2. 잠시 대기 중... (Backend 서버 시작)
timeout /t 3 > nul

echo 3. Frontend 개발 서버 시작 중...
cd /d "%~dp003-development\frontend\ux-research-app"
start cmd /c "npm run dev"

echo.
echo ==============================
echo 서버가 시작되었습니다!
echo ==============================
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo API 문서: http://localhost:3001/api
echo ==============================
echo.
echo 서버를 중지하려면 각 터미널 창에서 Ctrl+C를 누르세요.

pause