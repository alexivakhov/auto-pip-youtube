# 📋 Changelog for Auto PiP for YouTube

## [1.0.1] - 2024-01-XX

### 🔧 Fixes
- **Fixed issue with repeated PiP activation** after "Back to Tab"
- Added tracking of `leavepictureinpicture` and `enterpictureinpicture` events
- Improved logic for resetting `lastActiveTabId` when PiP is deactivated
- Added tab existence check before PiP activation
- Improved communication between content and background scripts

### 🎯 Improvements
- Added detailed logging for debugging
- Improved error handling during PiP activation
- Added PiP state check before activation

### 📝 Technical Changes
- Updated `background.js` with new state tracking logic
- Updated `content.js` with global PiP event tracking
- Added new test file `test-pip-fix.html`

---

## [1.0.0] - 2024-01-XX

### ✨ Initial Release
- **Automatic PiP activation** when switching tabs
- **Manual control** through popup interface
- **Modern design** with animations
- **Usage statistics**
- **Support for all Chromium browsers**

### 🎨 Features
- Beautiful icon with gradient design
- Adaptive settings interface
- Settings saved between sessions
- Detailed documentation and instructions

### 📁 Files
- `manifest.json` - extension configuration
- `background.js` - Service Worker
- `content.js` - Content Script for YouTube
- `injected.js` - additional functionality
- `popup.html/css/js` - settings interface
- `icons/` - PNG icons of various sizes
- `test.html` - test file
- `README.md` - documentation
- `INSTALL.md` - installation instructions

---

## Future Plans

### 🔮 Version 1.1.0
- [ ] Add activation delay settings
- [ ] Add support for other video platforms
- [ ] Add hotkeys
- [ ] Improve usage statistics

### 🔮 Version 1.2.0
- [ ] Add settings synchronization between devices
- [ ] Add dark theme for popup
- [ ] Add more configuration options
- [ ] Improve performance

---

**Developed with ❤️ for the YouTube user community**
