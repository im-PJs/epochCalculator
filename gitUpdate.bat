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
echo Test your website. After testing, continue to the backup step?
choice /C YN /M "Press Y for Yes, N for No:"
if %ERRORLEVEL%==2 (
    git hstop
    exit
)

echo.
echo +----------------------------------------+
echo ^|               BACKUP STEP              ^|
echo +----------------------------------------+

:: Stop Heroku after testing
git hstop

:: Backup main branch
git checkout main >nul
git branch backup_main >nul
git push origin backup_main >nul

:: Wait for user confirmation
echo.
echo +----------------------------------------+
echo ^|             MERGE CONFIRMATION         ^|
echo +----------------------------------------+
echo Do you want to continue to the merging step?
choice /C YN /M "Press Y for Yes, N for No:"
if %ERRORLEVEL%==2 exit

:: Merge develop into main and deploy
echo.
echo Merging...
git merge develop >nul
git push origin main >nul

echo.
echo +----------------------------------------+
echo ^|          OPERATION COMPLETED           ^|
echo +----------------------------------------+
echo.
echo Starting Heroku site push
git push heroku main


echo +----------------------------------------+
echo ^|          Program Completed            ^|
echo +----------------------------------------+
echo Press any key to exit.
pause >nul
endlocal
