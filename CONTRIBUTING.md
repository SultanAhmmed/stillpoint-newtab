# Contributing to Stillpoint New Tab

Thanks for considering a contribution. This guide covers how to report issues, propose changes, and get a development environment running.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Notes](#development-notes)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

- Be respectful: disagreements happen, but keep it professional.
- Be welcoming: new contributors are always welcome.
- Be constructive: provide helpful, specific feedback.
- Be patient: maintainers are volunteers.

---

## How Can I Contribute?

### Reporting bugs
Check existing issues first to avoid duplicates. Include:
- Browser name and version
- Operating system
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or a screen recording, if applicable
- Any console errors (F12 → Console tab)

### Suggesting features
Open an issue with the `enhancement` label. Describe the feature, its use case, and why it would benefit users.

### Contributing backgrounds
1. Use an image you own the rights to, or that is genuinely royalty-free.
2. Format: `.webp` preferred, under 500 KB, at least 1920x1080.
3. Name it descriptively (e.g., `mountain-sunset.webp`) and add it to `assets/`.
4. Add the filename to the `bundledBackgrounds` array in `script.js`.

### Improving documentation
Fixing typos, clarifying instructions, and adding translations are all welcome.

### Code contributions
See Development Setup below.

---

## Development Setup

### Prerequisites
- A Chromium-based browser (Chrome, Brave, Edge, etc.)
- A code editor
- Basic knowledge of HTML, CSS, and JavaScript

### Getting started

1. Fork and clone:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stillpoint-newtab.git
   cd stillpoint-newtab
   ```
2. Load it in your browser: open `chrome://extensions`, enable Developer Mode, click "Load unpacked," and select the project folder.
3. Edit files, then click the reload button on the extensions page to see changes. Open a new tab to view the result.

### Testing checklist

Before submitting a PR, verify:
- [ ] Extension loads without errors
- [ ] Search works with all engines
- [ ] Settings persist after browser restart
- [ ] Background upload/remove works
- [ ] Shortcuts can be added, edited, removed, and reordered
- [ ] Timer starts, pauses, resets, and completes
- [ ] Fullscreen mode works
- [ ] Notifications appear (if enabled)
- [ ] Keyboard shortcuts work (`/` and `Escape`)
- [ ] Layout is responsive on different screen sizes

---

## Development Notes

### Storage schema

Settings are stored using `chrome.storage.local`:

```javascript
{
  engine: 'duckduckgo',           // Selected search engine
  background: 'assets/...',       // Current background URL
  uploadedBackgrounds: [],        // Array of { data, name }
  shortcutsVisible: true,         // Show/hide shortcuts
  shortcuts: [],                  // Array of { name, url }
  pomodoroVisible: true,          // Show/hide timer
  pomodoroDuration: 25,           // Timer duration in minutes
  pomodoroNotifications: true     // Desktop notifications
}
```

### Adding a new search engine

1. Add it to the `engines` object in `script.js`:
   ```javascript
   const engines = {
     // ...existing engines
     yourEngine: 'https://yourengine.com/search?q='
   };
   ```
2. Add a matching entry to `engineNames`:
   ```javascript
   const engineNames = {
     // ...existing names
     yourEngine: 'Your Engine'
   };
   ```
3. Add a button in the engine menu in `index.html`:
   ```html
   <button role="option" data-engine="yourEngine" aria-selected="false">Your Engine</button>
   ```

### Adding a new background

1. Add the image to `assets/` (recommended: `.webp`, max 500 KB).
2. Add the filename to the `bundledBackgrounds` array in `script.js`.

---

## Style Guidelines

### JavaScript
```javascript
// Use const/let, not var
const element = document.querySelector('.selector');

// Use arrow functions for callbacks
items.forEach((item) => {
  // ...
});

// Use template literals
const message = `Hello, ${name}!`;

// Use early returns
function process(data) {
  if (!data) return;
  // ...
}
```

### CSS
```css
/* Use CSS custom properties for theming */
:root {
  --text: #fff9f8;
  --muted: rgba(255, 249, 248, 0.68);
}

/* Use logical properties */
.element {
  margin-inline: auto;
  padding-block: 1rem;
}
```

### HTML
```html
<!-- Use semantic elements and accessible attributes -->
<main>
  <header>...</header>
  <section>...</section>
</main>

<button aria-label="Close settings" aria-expanded="false">×</button>
```

---

## Commit Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>
```

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

Examples:
```
feat: add support for Perplexity search engine
fix: resolve timer not resetting after completion
docs: update installation instructions for Edge
```

---

## Pull Request Process

1. Update documentation if you're changing functionality.
2. Test in at least one Chromium browser.
3. Fill out the PR template completely.
4. Link related issues (e.g., "Closes #123").
5. Request review from a maintainer.

Use the same format as commit messages for the PR title, e.g., `feat: add dark mode toggle`.

---

Thank you for contributing.
