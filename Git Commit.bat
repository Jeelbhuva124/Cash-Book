@echo off
title Cash-Book Git Commit Workflow
color 0A
echo ==================================================
echo         CASH-BOOK GIT AUTOMATED COMMIT
echo ==================================================
echo.

:: Get current active git branch dynamically
for /f "tokens=*" %%a in ('git branch --show-current 2^>nul') do set BRANCH=%%a
if "%BRANCH%"=="" set BRANCH=main

echo Active Git Branch: %BRANCH%
echo.

:: 1. Stage all changed files
echo [1/5] Staging all files (git add .)...
git add .
echo.

:: 2. Ask for Commit Message
set /p msg="Enter Commit Message (Press ENTER for auto-timestamp): "
if "%msg%"=="" set msg=Auto Update %date% %time%

:: 3. Step 1: Commit
echo.
echo [2/5] Step 1: Committing changes (git commit)...
git commit -m "%msg%"
echo.

:: 4. Step 2: Pull
echo [3/5] Step 2: Pulling remote changes (git pull origin %BRANCH%)...
git pull origin %BRANCH%
echo.

:: 5. Step 3: Push
echo [4/5] Step 3: Pushing changes to GitHub (git push origin %BRANCH%)...
git push origin %BRANCH%
echo.

:: 6. Step 4: Final Sync Pull
echo [5/5] Step 4: Final Sync Pull (git pull origin %BRANCH%)...
git pull origin %BRANCH%
echo.

echo ==================================================
echo      GIT WORKFLOW COMPLETED SUCCESSFULLY!
echo ==================================================
echo.
pause
