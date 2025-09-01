@echo off
echo Starting MagCue System...

echo.
echo 1. Installing frontend dependencies...
cd /d "%~dp0"
call npm install

echo.
echo 2. Installing backend dependencies...
cd backend
call npm install

echo.
echo 3. Starting backend server...
start "MagCue Backend" cmd /k "npm start"

echo.
echo 4. Starting frontend development server...
cd ..
start "MagCue Frontend" cmd /k "npm run dev"

echo.
echo MagCue system is starting up...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Make sure your Arduino is connected and the workingfile-magcue.ino is uploaded!
pause
