@echo off
echo =====================================================================
echo  Starting Unit 2 Experiment 5: Separate Servers Architecture
echo =====================================================================
echo.
echo [Server 1/2] Starting Backend REST API on http://localhost:8080...
start "Backend REST API (Port 8080)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo [Server 2/2] Starting Frontend Web App on http://localhost:5173...
start "Frontend Web Server (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =====================================================================
echo  SUCCESS: Both servers are now running on separate ports!
echo  1. Backend Server  : http://localhost:8080 (REST APIs with CORS)
echo  2. Frontend Server : http://localhost:5173 (React UI)
echo =====================================================================
echo.
pause
