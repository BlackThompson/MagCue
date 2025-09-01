#!/bin/bash

echo "Starting MagCue System..."

echo ""
echo "1. Installing frontend dependencies..."
npm install

echo ""
echo "2. Installing backend dependencies..."
cd backend
npm install

echo ""
echo "3. Starting backend server..."
gnome-terminal --title="MagCue Backend" -- bash -c "npm start; exec bash" &
# For macOS, use: open -a Terminal "npm start"

echo ""
echo "4. Starting frontend development server..."
cd ..
gnome-terminal --title="MagCue Frontend" -- bash -c "npm run dev; exec bash" &
# For macOS, use: open -a Terminal "npm run dev"

echo ""
echo "MagCue system is starting up..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Make sure your Arduino is connected and the workingfile-magcue.ino is uploaded!"
