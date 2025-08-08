# Auto PiP for YouTube

🎯 **Automatic Picture-in-Picture for YouTube videos**

A browser extension for Chromium browsers that automatically switches YouTube videos to Picture-in-Picture mode when changing active browser tabs.

## ✨ Features

- 🎬 **Automatic PiP activation** when switching tabs
- 📱 **Support for all Chromium browsers** (Chrome, Edge, Brave, Opera)
- ⚡ **Fast operation** without delays
- 🔧 **Flexible settings** through a convenient interface
- 📊 **Usage statistics** with detailed information
- 🎨 **Modern design** with animations

## 🚀 Installation

### For Developers (from source code)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alexivakhov/auto-pip-youtube.git
   cd auto-pip-youtube
   ```

2. **Open Chrome/Edge browser and go to:**
   ```
   chrome://extensions/
   ```

3. **Enable "Developer mode"** (toggle in the top right corner)

4. **Click "Load unpacked extension"** and select the project folder

5. **Extension is ready to use!** 🎉

### For Users (from Chrome Web Store)

*Extension will be available in Chrome Web Store after publication*

## 📖 How to Use

### Basic Usage

1. **Open YouTube** and start any video
2. **Switch to another tab** - video automatically goes to PiP mode
3. **Return to YouTube** - PiP closes and video returns to normal mode

### Settings

1. **Click on the extension icon** in the toolbar
2. **Enable/disable** automatic PiP with the toggle
3. **Use "Manual PiP activation" button** for testing
4. **View statistics** of usage

### Additional Features

- **Manual PiP activation** - button on YouTube page
- **Statistics** - number of YouTube tabs and activations
- **Settings** - saved between sessions

## 🛠️ Technical Information

### Architecture

```
├── manifest.json          # Extension configuration
├── background.js          # Service Worker (background process)
├── content.js            # Content Script (on YouTube pages)
├── injected.js           # Injected Script (additional functionality)
├── popup.html            # Settings interface
├── popup.css             # Interface styles
├── popup.js              # Interface logic
└── icons/                # Extension icons
```

### Permissions

The extension uses the following permissions:

- `activeTab` - access to active tab
- `tabs` - tab management
- `storage` - settings storage
- `scripting` - script injection

### Supported Browsers

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Opera Browser
- ✅ Chromium-based browsers

## 🔧 Development

### Project Structure

```bash
auto-pip-youtube/
├── manifest.json          # Extension configuration
├── background.js          # Background process
├── content.js            # YouTube script
├── injected.js           # Additional functionality
├── popup.html            # Settings interface
├── popup.css             # Styles
├── popup.js              # Interface logic
├── icons/                # Icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
```

### Local Development

1. **Clone the repository**
2. **Install extension in developer mode**
3. **Make changes to the code**
4. **Click "Update" in chrome://extensions/**
5. **Test changes**

### Debugging

- **Background Script:** Check console in chrome://extensions/
- **Content Script:** Use DevTools on YouTube page
- **Popup:** Open DevTools for popup via context menu

## 🐛 Troubleshooting

### PiP doesn't work

1. **Check browser support:**
   ```javascript
   console.log(document.pictureInPictureEnabled);
   ```

2. **Make sure video is loaded:**
   - Wait for video to fully load
   - Try different YouTube videos

3. **Check extension permissions:**
   - chrome://extensions/
   - Find the extension and check permissions

### PiP doesn't activate repeatedly after "Back to Tab"

**Fixed in version 1.0.1:**
- ✅ Added tracking of `leavepictureinpicture` events
- ✅ Added tracking of `enterpictureinpicture` events
- ✅ Improved logic for resetting `lastActiveTabId`
- ✅ Added tab existence check before PiP activation
- ✅ Improved communication between content and background scripts

### Extension doesn't activate

1. **Check if extension is enabled**
2. **Reload YouTube page**
3. **Check console for errors**

### Performance Issues

- Extension is optimized for fast operation
- Uses minimal resources
- Doesn't affect browser performance

## 🤝 Contributing

We welcome contributions to the project!

### How to Contribute

1. **Fork the repository**
2. **Create feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and commit:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Create Pull Request**

### Code Standards

- Use ES6+ syntax
- Add comments to complex code
- Test changes before submitting
- Follow existing code style

## 📄 License

This project is distributed under the MIT license. See the `LICENSE` file for details.

## 🙏 Acknowledgments

- YouTube for API and capabilities
- Chromium team for extension API
- All project contributors

## 📞 Support

- **GitHub Issues:** [Create issue](https://github.com/alexivakhov/auto-pip-youtube/issues)
- **Email:** support@auto-pip-youtube.com
- **Discord:** [Join server](https://discord.gg/auto-pip-youtube)

---

**Developed with ❤️ for the YouTube user community**
