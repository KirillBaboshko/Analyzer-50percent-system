@echo off
chcp 65001 >nul
title Dota 2 Analyzer - Launcher
color 0A

echo.
echo  ================================
echo   Dota 2 Analyzer - Starting
echo  ================================
echo.

:: --- Check Go ---
where go >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Go not found! Install Go from https://golang.org
    pause
    exit /b 1
)

:: --- Check Node.js ---
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found! Install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: --- Install Go dependencies ---
echo  [1/4] Checking Go dependencies...
cd dota-analyzer
go mod tidy
if %errorlevel% neq 0 (
    echo  [ERROR] go mod tidy failed
    pause
    exit /b 1
)
cd ..

:: --- Install Node dependencies ---
echo  [2/4] Checking Node dependencies...
cd dota-analyzer-frontend
if not exist "node_modules" (
    echo  node_modules not found, installing...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed
        pause
        exit /b 1
    )
)
cd ..

:: --- Start Backend ---
echo  [3/4] Starting Backend (Go + Echo) on port 8080...
start "Backend - Go/Echo :8080" cmd /k "cd dota-analyzer && go run cmd/main.go"

:: --- Wait for backend to start ---
timeout /t 2 /nobreak >nul

:: --- Start Frontend ---
echo  [4/4] Starting Frontend (React + Vite) on port 5173...
start "Frontend - React/Vite :5173" cmd /k "cd dota-analyzer-frontend && npm run dev"

:: --- Wait for Vite to start ---
timeout /t 3 /nobreak >nul

:: --- Open browser ---
echo.
echo  Opening browser...
start http://localhost:5173

echo.
echo  ================================
echo   Everything is running!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo  ================================
echo.
echo  Close this window or press any key to exit.
echo  (Backend and Frontend will continue running in their windows)
echo.
pause
