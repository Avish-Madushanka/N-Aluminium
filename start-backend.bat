@echo off
echo Starting N-Aluminium Backend Server on port 5003...
cd /d %~dp0Backend
echo Current directory: %CD%
call npm run dev
pause 