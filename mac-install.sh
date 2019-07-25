#!/bin/sh
#
# Mac Installation Script
# Scratch3 Extensions of "IoT Smart Remocon" and "IoT Smart Car2WD".
#

echo "Start Installation..."

# (1) copy extension-manager
mv -n ../scratch-vm/src/extension-support/extension-manager.js ../scratch-vm/src/extension-support/extension-manager.js.org
if [[ -e ../scratch-vm/src/extension-support/extension-manager.js ]]; then
  rm -f ../scratch-vm/src/extension-support/extension-manager.js
fi
cp -af ./extension-manager.js ../scratch-vm/src/extension-support/extension-manager.js

# (2) copy extensions
cp -af ./scratch3_iot* ../scratch-vm/src/extensions/

# (3) copy extensions-index
mv -n ../scratch-gui/src/lib/libraries/extensions/index.jsx ../scratch-gui/src/lib/libraries/extensions/index.jsx.org
if [[ -e ../scratch-gui/src/lib/libraries/extensions/index.jsx ]]; then
  rm -f ../scratch-gui/src/lib/libraries/extensions/index.jsx
fi
cp -af ./index.jsx ../scratch-gui/src/lib/libraries/extensions/

# (4)
cp -af ./iot* ../scratch-gui/src/lib/libraries/extensions/

echo "Installation Successfully Completed!"

