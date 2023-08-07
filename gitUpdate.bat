@echo off
setlocal enabledelayedexpansion

cd D:\Coding\epochCalculator\epochCalculator
echo Changed directory to %CD%
echo +----------------------------------------+
echo ^|             UPDATING CODE              ^|
echo +----------------------------------------+
echo.

:: Checkout develop branch
git checkout develop >nul

:: Let user input the changes made
set /p commitMsg="Enter your commit message: "
git add . >nul
git commit -m "!commitMsg!" 
git push origin develop >nul

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
    echo Stopping testing environment...
    git hstop
    echo.
    echo +----------------------------------------+
    echo ^|           OPERATION ABORTED           ^|
    echo +----------------------------------------+
    echo.
    echo Press any key to exit.
    pause >nul
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
git checkout main >nul
git branch -D backup_main >nul 2>nul
git branch backup_main
git push -f origin backup_main >nul

:: Merge develop into main and deploy
echo.
echo Merging...
git merge develop >nul
git push origin main >nul

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
echo Press any key to exit.
pause >nul
endlocal
