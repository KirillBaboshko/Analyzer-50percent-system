@echo off
chcp 65001 >nul
title Dota 2 Analyzer - Stop
color 0C

echo.
echo  ================================
echo   Dota 2 Analyzer - Stopping
echo  ================================
echo.

:: Kill Go processes
echo  Stopping Backend...
taskkill /f /im "main.exe" 2>nul
taskkill /f /im "__debug_bin.exe" 2>nul
taskkill /f /im "analyzer.exe" 2>nul
taskkill /f /im "go.exe" 2>nul

:: Kill processes on port 5173 (Frontend)
echo  Stopping Frontend...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" 2^>nul') do (
    taskkill /f /pid %%a 2>nul
)

:: Kill processes on port 8080 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" 2^>nul') do (
    taskkill /f /pid %%a 2>nul
)

:: Close Backend and Frontend windows
taskkill /fi "WINDOWTITLE eq Backend*" /f 2>nul
taskkill /fi "WINDOWTITLE eq Frontend*" /f 2>nul

echo.
echo  [OK] All processes stopped
echo.
pause
