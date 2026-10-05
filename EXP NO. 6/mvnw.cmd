@echo off
setlocal
set "DIR=%~dp0"
if exist "%DIR%.maven\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%DIR%.maven\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        call mvn %*
    ) else (
        echo [ERROR] Maven not found! Please check .maven folder or install Maven.
        exit /b 1
    )
)
