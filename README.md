<div align="center">

# 🌙 Stillpoint New Tab

**A quiet place to begin.**

A calm, customizable new tab page for Chromium browsers with private search, beautiful backgrounds, a focus timer, and quick shortcuts.

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Install-brightgreen?style=flat-square&logo=google-chrome)](REPLACE_WITH_YOUR_CHROME_WEB_STORE_URL)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Manifest](https://img.shields.io/badge/Manifest-V3-purple?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## ✨ Features

### 🔍 Private Search
Choose from six privacy-focused and mainstream search engines:
- DuckDuckGo (default)
- Brave Search
- Google
- Bing
- Startpage
- Ecosia

### 🎨 Beautiful Backgrounds
- 18 bundled backgrounds, from serene landscapes to abstract art
- Upload your own images to personalize the page
- Manage uploads: remove individual images or reset to defaults

### ⏱️ Focus Timer (Pomodoro)
- Built-in Pomodoro timer with customizable durations (15, 25, 30, 45, 60 minutes)
- Fullscreen mode for distraction-free focus
- Audio chime and desktop notifications when sessions complete
- Visual progress ring showing remaining time

### 🔗 Quick Shortcuts
- Default shortcuts to popular sites (YouTube, GitHub, Mail, Spotify, Maps)
- Add, edit, and remove custom shortcuts
- Drag-and-drop reordering
- Automatic favicon fetching

### 🌗 Calm Aesthetic
- Elegant typography (Playfair Display + DM Sans)
- Frosted glass effects
- Smooth animations with reduced-motion support
- Greeting that adapts to time of day

### 🔒 Privacy First
- No accounts required
- No external servers: everything runs locally
- No tracking or analytics
- Settings persist via Chrome's local storage

---

## 📦 Installation

### From the Chrome Web Store (recommended)

1. Go to the [Stillpoint New Tab listing](REPLACE_WITH_YOUR_CHROME_WEB_STORE_URL) on the Chrome Web Store.
2. Click **Add to Chrome**, then confirm by clicking **Add extension** in the popup.
3. Open a new tab. Stillpoint will replace your browser's default new tab page automatically.

No account, sign-up, or configuration is required to get started; the default settings work out of the box, and everything can be customized from the ⚙️ settings icon.

> This extension also works in other Chromium-based browsers (Brave, Edge, Opera, Vivaldi) that support the Chrome Web Store.

### From source (developer mode)

Use this method if you want to try an unreleased change, or if you're contributing to the project.

1. Clone the repository:
   ```bash
   git clone https://github.com/sultanahmmed/stillpoint-newtab.git
   cd stillpoint-newtab
   ```
2. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `stillpoint-newtab` folder.
5. Open a new tab. Stillpoint will replace your default new tab page.

After making changes to the source, return to the extensions page and click the reload button on the Stillpoint card.

---

## 🚀 Usage

| Action | Shortcut |
|---|---|
| Focus search | `/` |
| Clear search / close panels | `Escape` |
| Open settings | Click the ⚙️ icon |
| Start/pause timer | Click the ▶️/⏸️ button |
| Fullscreen timer | Click the ⛶ button |

### Customizing your experience

- **Change search engine:** Settings → Search engine dropdown
- **Change background:** Settings → click any thumbnail
- **Upload a custom background:** Settings → "Upload your own image"
- **Add shortcuts:** Settings → Shortcuts section → fill in name and URL
- **Set focus duration:** Settings → Focus timer → choose duration

---

## 🛠️ Project Structure

```
stillpoint-newtab/
├── manifest.json          # Extension manifest (MV3)
├── index.html             # New tab page markup
├── script.js              # Application logic
├── style.css              # Styling and animations
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── assets/                # Bundled background images
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    └── icon-128.png
```

For details on the storage schema, or how to add a new search engine or background, see [CONTRIBUTING.md](CONTRIBUTING.md#development-notes).

---

## 🤝 Contributing

Contributions are welcome, whether that's fixing bugs, adding features, improving documentation, or suggesting ideas. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, style guidelines, and open ideas to work on.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Sultan Ahmmed**
- GitHub: [@sultanahmmed](https://github.com/sultanahmmed)
- LinkedIn: [sultan-ahmmed](https://www.linkedin.com/in/sultan-ahmmed/)

---

<div align="center">

If Stillpoint helps you find calm, consider sharing it with someone who needs a quieter start.

⭐ Star this repo if you find it useful.

</div>
