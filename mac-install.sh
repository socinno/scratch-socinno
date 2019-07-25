#!/bin/sh
#
# Mac Installation Script
# Scratch3 Extensions of "IoT Smart Remocon" and "IoT Smart Car2WD".
#

echo "Start Installation of SOCINNO Scratch3 Extention!"

# (1) copy extension-manager
mv ../scratch-vm/src/extension-support/extension-manager.js ../scratch-vm/src/extension-support/extension-manager.js.org
cp ./extension-manager.js ../scratch-vm/src/extension-support/extension-manager.js

# (2) copy extensions
cp ./scratch3_iot* ../scratch-vm/src/extensions/

# (3) copy extensions-index
mv ../scratch-gui/src/lib/libraries/extensions/index.jsx ../scratch-gui/src/lib/libraries/extensions/index.jsx.org
cp ./index.jsx ../scratch-gui/src/lib/libraries/extensions/

# (4)
cp ./iot* ../scratch-gui/src/lib/libraries/extensions/

echo "Installation Success!"

