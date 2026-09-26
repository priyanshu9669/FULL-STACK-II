@echo off
echo Running Spring Boot Automated Tests (Assignments 1 to 5)...
cd /d %~dp0backend
mvnw.cmd test
pause
