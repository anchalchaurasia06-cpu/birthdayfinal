@echo off
color 0A
title Birthday Website Launcher
echo.
echo ========================================
echo    Birthday Website Launcher
echo ========================================
echo.
echo Starting your Birthday Website...
echo.

cd /d "%~dp0"

REM Try Chrome first
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo Opening in Chrome...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
    goto end
)

REM Try Chrome (32-bit)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo Opening in Chrome...
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
    goto end
)

REM Try Edge
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    echo Opening in Microsoft Edge...
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" "%~dp0index.html"
    goto end
)

REM Fallback - open with default browser
echo Opening with default browser...
start "" "%~dp0index.html"

:end
echo.
echo ✨ Website opened! Passcode is: 792026
echo.
pause
