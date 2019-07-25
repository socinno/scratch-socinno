: Windows Installation Bat faile
: Scratch3 Extensions of "IoT Smart Remocon" and "IoT Smart Car2WD".
:

@echo off
cd /d %~dp0

echo "Start Installation of SOCINNO Scratch3 Extention!"

: (1) copy extension-manager
move ..\scratch-vm\src\extension-support\extension-manager.js ..\scratch-vm\src\extension-support\extension-manager.js.org
copy .\extension-manager.js ..\scratch-vm\src\extension-support\extension-manager.js

: (2) copy extensions
xcopy .\scratch3_iot* ..\scratch-vm\src\extensions\ /D /S /R /Y /I /K

: (3) copy extensions-index
move ..\scratch-gui\src\lib\libraries\extensions\index.jsx ..\scratch-gui\src\lib\libraries\extensions\index.jsx.org
copy .\index.jsx ..\scratch-gui\src\lib\libraries\extensions\

: (4)
xcopy .\iot* ..\scratch-gui\src\lib\libraries\extensions\ /D /S /R /Y /I /K

echo "Installation Success!"

exit 0

