: Windows Installation Bat faile
: Scratch3 Extensions of "IoT Smart Remocon" and "IoT Smart Car2WD".
:

@echo off
cd /d %~dp0

echo Start Installation of SOCINNO Scratch3 Extention!

: (1) copy extension-manager
if not exist ..\scratch-vm\src\extension-support\extension-manager.js.org (
    move ..\scratch-vm\src\extension-support\extension-manager.js ..\scratch-vm\src\extension-support\extension-manager.js.org
) else (
    del ..\scratch-vm\src\extension-support\extension-manager.js
)
copy extension-manager.js ..\scratch-vm\src\extension-support\extension-manager.js


: (2) copy extensions [vm]
if not exist ..\scratch-vm\src\extensions\scratch3_iotcar2wd (
    mkdir ..\scratch-vm\src\extensions\scratch3_iotcar2wd
) else (
    del ..\scratch-vm\src\extensions\scratch3_iotcar2wd\index.js
)
copy scratch3_iotcar2wd\index.js ..\scratch-vm\src\extensions\scratch3_iotcar2wd\index.js

if not exist ..\scratch-vm\src\extensions\scratch3_iotremocon (
    mkdir ..\scratch-vm\src\extensions\scratch3_iotremocon
) else (
    del ..\scratch-vm\src\extensions\scratch3_iotremocon\index.js
)
copy scratch3_iotremocon\index.js ..\scratch-vm\src\extensions\scratch3_iotremocon\index.js


: (3) copy extensions-index
if not exist ..\scratch-gui\src\lib\libraries\extensions\index.jsx.org (
    move ..\scratch-gui\src\lib\libraries\extensions\index.jsx ..\scratch-gui\src\lib\libraries\extensions\index.jsx.org
) else (
    del ..\scratch-gui\src\lib\libraries\extensions\index.jsx
)
copy index.jsx ..\scratch-gui\src\lib\libraries\extensions\index.jsx


: (4) copy extensions [gui]
if not exist ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd (
    mkdir ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd
) else (
    del ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd\iotcar2wd-small.svg
    del ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd\iotcar2wd.png
)
copy iotcar2wd\iotcar2wd-small.svg ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd\iotcar2wd-small.svg
copy iotcar2wd\iotcar2wd.png ..\scratch-gui\src\lib\libraries\extensions\iotcar2wd\iotcar2wd.png

if not exist ..\scratch-gui\src\lib\libraries\extensions\iotremocon (
    mkdir ..\scratch-gui\src\lib\libraries\extensions\iotremocon
) else (
    del ..\scratch-gui\src\lib\libraries\extensions\iotremocon\iotremocon-small.svg
    del ..\scratch-gui\src\lib\libraries\extensions\iotremocon\iotremocon.png
)
copy iotremocon\iotremocon-small.svg ..\scratch-gui\src\lib\libraries\extensions\iotremocon\iotremocon-small.svg
copy iotremocon\iotremocon.png ..\scratch-gui\src\lib\libraries\extensions\iotremocon\iotremocon.png

echo Installation Success!

