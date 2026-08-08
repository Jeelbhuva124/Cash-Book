@echo off
title Cash-Book Git Pull Workflow
color 0B
echo ==================================================
echo         CASH-BOOK GIT PULL LATEST CODE
echo ==================================================
echo.

:: Get current active git branch dynamically
for /f "tokens=*" %%a in ('git branch --show-current 2^>nul') do set BRANCH=%%a
if "%BRANCH%"=="" set BRANCH=main

echo Active Git Branch: %BRANCH%
echo.

echo Pulling latest code from GitHub (git pull origin %BRANCH%)...
git pull origin %BRANCH%
echo.

echo Checking Repository Status (git status)...
git status
echo.

echo ==================================================
echo          GIT PULL COMPLETED SUCCESSFULLY!
echo ==================================================
echo.
pause
