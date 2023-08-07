@echo off
setlocal enabledelayedexpansion

cd D:\Coding\epochCalculator\epochCalculator

echo.
echo +----------------------------------------+
echo ^|             UPDATING CODE              ^|
echo +----------------------------------------+
echo.

:: Checkout develop branch
git checkout develop

:: If checkout failed, exit
if errorlevel 1 (
    echo Error switching to develop branch.
    pause
    exit
)

:: Let user input the changes made
set /p commitMsg="Enter your commit message: "
git add .

:: If add failed, exit
if errorlevel 1 (
    echo Error adding changes.
    pause
    exit
)

git commit -m "!commitMsg!" 

:: If commit failed, exit
if errorlevel 1 (
    echo Error committing changes.
    pause
    exit
)

git push origin develop

:: If push failed, exit
if errorlevel 1 (
    echo Error pushing to develop branch.
    pause
    exit
)

echo.
echo +----------------------------------------+
echo ^|            STARTING HEROKU             ^|
echo +----------------------------------------+
echo.

:: Start Heroku for testing
git hstart

:: Provide link to the testing website
echo.
echo Testing Link: https://testing-epochcalculator-ff4cd2c4b56e.herokuapp.com/
echo.

:: Test your website now. We assume this is a manual process.

:: Wait for user confirmation to continue
echo +----------------------------------------+
echo ^|             USER CONFIRMATION          ^|
echo +----------------------------------------+
echo Test your website. After testing, continue?
choice /C YN /M "Press Y for Yes, N for No:"

if %ERRORLEVEL%==2 (
    echo.
    git hstop
    echo +----------------------------------------+
    echo ^|           OPERATION ABORTED           ^|
    echo +----------------------------------------+
    echo.
    pause
    endlocal
    exit
)

echo.
echo +----------------------------------------+
echo ^|               BACKUP STEP              ^|
echo +----------------------------------------+
echo.

:: Stop Heroku after testing
git hstop

:: Backup main branch
git checkout main

:: If checkout failed, exit
if errorlevel 1 (
    echo Error switching to main branch.
    pause
    exit
)

git branch -D backup_main 2>nul
git branch backup_main
git push origin backup_main --force-with-lease

:: Merge develop into main and deploy
echo.
echo Merging...
git merge develop

:: If merge failed, exit
if errorlevel 1 (
    echo Merge failed. Resolve conflicts and try again.
    pause
    exit
)

git push origin main

:: Push to Heroku
echo.
echo Starting Heroku site push...
git push heroku main
echo.
echo Live Site: https://epochcalculator.com/
echo.

echo +----------------------------------------+
echo ^|          OPERATION COMPLETED           ^|
echo +----------------------------------------+
echo.
pause
endlocal
