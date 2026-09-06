@echo off
cd /d "%~dp0"
echo Starting Birthday Website...
echo Opening Chrome at http://localhost:8000
timeout /t 2
start http://localhost:8000
python -m http.server 8000
pause
