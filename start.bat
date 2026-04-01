@echo off
title Dota 2 Analyzer — Launcher
color 0A

echo.
echo  ================================
echo   Dota 2 Analyzer — Запуск
echo  ================================
echo.

:: --- Проверка Go ---
where go >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ОШИБКА] Go не найден! Установи Go с https://golang.org
    pause
    exit /b 1
)

:: --- Проверка Node.js ---
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ОШИБКА] Node.js не найден! Установи Node.js с https://nodejs.org
    pause
    exit /b 1
)

:: --- Установка зависимостей Go (если нужно) ---
echo  [1/4] Проверяем Go зависимости...
cd dota-analyzer
go mod tidy
if %errorlevel% neq 0 (
    echo  [ОШИБКА] go mod tidy завершился с ошибкой
    pause
    exit /b 1
)
cd ..

:: --- Установка зависимостей Node (если нужно) ---
echo  [2/4] Проверяем Node зависимости...
cd dota-analyzer-frontend
if not exist "node_modules" (
    echo  Папка node_modules не найдена, устанавливаем...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ОШИБКА] npm install завершился с ошибкой
        pause
        exit /b 1
    )
)
cd ..

:: --- Запуск Backend ---
echo  [3/4] Запускаем Backend (Go + Echo) на порту 8080...
start "Backend — Go/Echo :8080" cmd /k "cd dota-analyzer && go run cmd/main.go"

:: --- Небольшая пауза чтобы бэкенд успел стартовать ---
timeout /t 2 /nobreak >nul

:: --- Запуск Frontend ---
echo  [4/4] Запускаем Frontend (React + Vite) на порту 5173...
start "Frontend — React/Vite :5173" cmd /k "cd dota-analyzer-frontend && npm run dev"

:: --- Пауза чтобы Vite успел стартовать ---
timeout /t 3 /nobreak >nul

:: --- Открываем браузер ---
echo.
echo  Открываем браузер...
start http://localhost:5173

echo.
echo  ================================
echo   Всё запущено!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo  ================================
echo.
echo  Закрой это окно или нажми любую клавишу для выхода.
echo  (Backend и Frontend продолжат работать в своих окнах)
echo.
pause
