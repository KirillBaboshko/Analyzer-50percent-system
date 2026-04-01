@echo off
title Dota 2 Analyzer — Остановка
color 0C

echo.
echo  Останавливаем процессы...
echo.

:: Убиваем Go процессы
taskkill /f /im "main.exe" >nul 2>&1
taskkill /f /im "__debug_bin.exe" >nul 2>&1

:: Убиваем Node/Vite процессы
taskkill /f /im "node.exe" >nul 2>&1

echo  [OK] Backend остановлен
echo  [OK] Frontend остановлен
echo.
pause
