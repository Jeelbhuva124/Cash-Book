@echo off
title CASH-BOOK FULL DEPLOYMENT
color 0E
:: Elevate to Administrator if not already
net session >nul 2>&1
if %errorLevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)
:: Run the combined PowerShell deployment script
"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -ExecutionPolicy Bypass -File "%~dp0Deploy-All.ps1"
pause
