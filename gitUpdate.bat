@echo off
setlocal enabledelayedexpansion

:: Go to directory
cd D:\Coding\epochCalculator\epochCalculator

:: Checkout develop branch
git checkout develop

:: Let user input the changes made
set /p commitMsg="Enter your commit message: "
git add .
git commit -m "!commitMsg!"
git push origin develop

:: Start Heroku for testing
git hstart

:: Test your website now. We assume this is a manual process. 

:: Wait for user confirmation to continue
echo.
echo Test your website now. After testing, do you want to continue to the backup step? Press Y for Yes, N for No.
choice /C YN /M "Your choice:"
if %ERRORLEVEL%==2 (
    git hstop
    exit
)

:: Stop Heroku after testing
git hstop

:: Backup main branch
git checkout main
git branch backup_main
git push origin backup_main

:: Wait for user confirmation
echo.
echo Do you want to continue to the merging step? Press Y for Yes, N for No.
choice /C YN /M "Your choice:"
if %ERRORLEVEL%==2 exit

:: Merge develop into main and deploy
git merge develop
git push origin main

echo.
echo Operation completed. Press any key to exit.
pause >nul
endlocal
