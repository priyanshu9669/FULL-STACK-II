@echo off
title Scalable Read APIs - Unit 2 Experiment 6
color 0b

echo =====================================================================
echo    UNIT 2: EXPERIMENT 6 - SCALABLE READ APIs
echo    Caching, Pagination, Query Optimization ^& JMeter Benchmarking
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Java environment...
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Java is not installed or not in PATH!
    echo Please install JDK 17, 21, or 24 from https://adoptium.net/
    pause
    exit /b 1
)

java -version
echo.

echo [2/3] Starting Spring Boot Application...
echo The Web Dashboard will be available at: http://localhost:8080
echo The H2 Database Console will be at:     http://localhost:8080/h2-console
echo.
echo Press Ctrl+C at any time to stop the application.
echo.

start "" cmd /c "timeout /t 6 >nul && start http://localhost:8080"

call "%~dp0mvnw.cmd" spring-boot:run

pause
