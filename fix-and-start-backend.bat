@echo off
echo ===== N-Aluminium Backend Server Setup =====
echo.

:: Change to the script directory
cd /d "%~dp0"
echo Current directory: %CD%

:: Check if .env exists in Backend folder
if not exist "Backend\.env" (
  echo Creating default .env file...
  (
    echo PORT=5003
    echo MONGO_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase
    echo JWT_SECRET=n-aluminium-secret-key-%RANDOM%
    echo JWT_EXPIRE=30d
    echo NODE_ENV=development
  ) > Backend\.env
  echo Created default .env file.
  echo.
  echo IMPORTANT: You need to edit Backend\.env with your actual MongoDB credentials
  echo.
  pause
)

:: Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo ERROR: npm is not installed or not in PATH
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

:: Run the backend server
echo Starting backend server on port 5003...
echo.
echo Press Ctrl+C to stop the server
echo.
cd Backend
call npm run dev

pause 