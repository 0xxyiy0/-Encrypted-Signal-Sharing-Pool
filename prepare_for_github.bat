@echo off
REM 🚀 GitHub Upload Preparation Script (Windows)
REM This script helps prepare the project for GitHub upload

echo 🔍 Checking repository status...

REM Check if git is initialized
if not exist ".git" (
    echo ⚠️  Git repository not initialized. Run 'git init' first.
    exit /b 1
)

echo.
echo 🔒 Checking for sensitive files...

REM Check for sensitive files
git ls-files --error-unmatch .env 2>nul
if %errorlevel% equ 0 (
    echo ❌ FOUND: .env ^(should be in .gitignore^)
    set FOUND_SENSITIVE=1
)

git ls-files --error-unmatch frontend/.env.local 2>nul
if %errorlevel% equ 0 (
    echo ❌ FOUND: frontend/.env.local ^(should be in .gitignore^)
    set FOUND_SENSITIVE=1
)

git ls-files --error-unmatch deployments/ 2>nul
if %errorlevel% equ 0 (
    echo ❌ FOUND: deployments/ ^(should be in .gitignore^)
    set FOUND_SENSITIVE=1
)

if defined FOUND_SENSITIVE (
    echo.
    echo ⚠️  Please remove sensitive files before committing!
    exit /b 1
) else (
    echo ✅ No sensitive files found in staging area
)

echo.
echo 📦 Files that will be committed:
git status --short

echo.
echo ✅ Ready for GitHub upload!
echo.
echo Next steps:
echo   1. Review the files above
echo   2. git add .
echo   3. git commit -m "Initial commit"
echo   4. git push -u origin main

