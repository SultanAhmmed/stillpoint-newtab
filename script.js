const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search');
const currentDate = document.querySelector('#current-date');
const currentTime = document.querySelector('#current-time');
const greeting = document.querySelector('#greeting');
const welcomeOverlay = document.querySelector('#welcome-overlay');
const welcomeTyping = document.querySelector('#welcome-typing');
const welcomeForm = document.querySelector('#welcome-form');
const welcomeName = document.querySelector('#welcome-name');
const nameForm = document.querySelector('#name-form');
const nameInput = document.querySelector('#name-input');
const settingsPanel = document.querySelector('#settings-panel');
const settingsToggle = document.querySelector('#settings-toggle');
const settingsClose = document.querySelector('#settings-close');
const enginePicker = document.querySelector('#engine-picker');
const engineTrigger = document.querySelector('#engine-trigger');
const engineMenu = document.querySelector('#engine-menu');
const backgroundGrid = document.querySelector('#background-grid');
const backgroundUpload = document.querySelector('#background-upload');
const uploadsSection = document.querySelector('#uploads-section');
const uploadsGrid = document.querySelector('#uploads-grid');
const settingsReset = document.querySelector('#settings-reset');
const shortcuts = document.querySelector('#shortcuts');
const shortcutsToggle = document.querySelector('#shortcuts-toggle');
const shortcutManager = document.querySelector('#shortcut-manager');
const addShortcutForm = document.querySelector('#add-shortcut-form');
const shortcutName = document.querySelector('#shortcut-name');
const shortcutUrl = document.querySelector('#shortcut-url');
const cancelShortcut = document.querySelector('#cancel-shortcut');
const supportToggle = document.querySelector('#support-toggle');
const supportModal = document.querySelector('#support-modal');
const supportModalClose = document.querySelector('#support-modal-close');
const supportOptionsList = document.querySelector('#support-options-list');
const pomodoroToggle = document.querySelector('#pomodoro-toggle');
const pomodoroNotif = document.querySelector('#pomodoro-notif');
const pomodoroWidget = document.querySelector('#pomodoro-widget');
const pomodoroTime = document.querySelector('#pomodoro-time');
const pomodoroDial = document.querySelector('#pomodoro-dial');
const pomodoroStart = document.querySelector('#pomodoro-start');
const pomodoroReset = document.querySelector('#pomodoro-reset');
const pomodoroFullscreen = document.querySelector('#pomodoro-fullscreen');
const durationBtns = document.querySelectorAll('.duration-btn');

const defaults = {
  name: '',
  engine: 'duckduckgo',
  background: 'assets/swirly-painting.webp',
  shortcutsVisible: true,
  pomodoroVisible: true,
  pomodoroDuration: 25,
  pomodoroNotifications: true,
  shortcuts: [
    { name: 'YouTube', url: 'https://www.youtube.com/' },
    { name: 'GitHub', url: 'https://github.com/' },
    { name: 'Mail', url: 'https://mail.google.com/' },
    { name: 'Spotify', url: 'https://open.spotify.com/' },
    { name: 'Maps', url: 'https://maps.google.com/' }
  ]
};

const bundledBackgrounds = [
  'aesthetic.webp', 'artificial-valley.webp', 'bars.webp', 'cartoon-castle.webp',
  'cat-vibin.webp', 'dark-waves.webp', 'disco.webp', 'droplets.webp', 'fishing.webp',
  'galaxy-waves.webp', 'paint.webp', 'painting-standing.webp', 'painting.webp',
  'pixel-earth.webp', 'swirls.webp', 'swirly-painting.webp', 'trippy-purple.webp', 'waves.webp'
].map((file) => `assets/${file}`);

const engines = {
  duckduckgo: 'https://duckduckgo.com/?q=',
  brave: 'https://search.brave.com/search?q=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  startpage: 'https://www.startpage.com/sp/search?query=',
  ecosia: 'https://www.ecosia.org/search?q='
};

const supportOptions = [
  {
    region: 'Spread the word',
    description: 'The best support is a recommendation to someone who needs a quieter start page.',
    label: 'Meet the developer on LinkedIn',
    url: 'https://www.linkedin.com/in/sultan-ahmmed/',
    className: 'support-option-linkedin'
  }
];

const engineNames = {
  duckduckgo: 'DuckDuckGo', brave: 'Brave Search', google: 'Google',
  bing: 'Bing', startpage: 'Startpage', ecosia: 'Ecosia'
};

let selectedEngine = defaults.engine;
let savedName = '';
let uploadedBackgrounds = [];
let savedShortcuts = [...defaults.shortcuts];
let editingShortcutIndex = null;
let draggedShortcutIndex = null;
let pomodoroInterval = null;
let pomodoroSeconds = 25 * 60;
let pomodoroRunning = false;
let pomodoroDuration = 25;

const storage = {
  get(keys, callback) {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.get(keys, callback);
      return;
    }
    const values = Object.fromEntries(keys.map((key) => {
      const value = localStorage.getItem(`stillpoint-${key}`);
      try { return [key, value === null ? null : JSON.parse(value)]; }
      catch { return [key, value]; }
    }));
    callback(values);
  },
  set(values) {
    if (globalThis.chrome?.storage?.local) {
      chrome.storage.local.set(values);
      return;
    }
    Object.entries(values).forEach(([key, value]) => localStorage.setItem(`stillpoint-${key}`, JSON.stringify(value)));
  }
};

const updateDateTime = () => {
  const now = new Date();
  currentDate.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now);
  currentTime.textContent = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  const hour = now.getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  greeting.textContent = savedName ? `${timeGreeting}, ${savedName}` : timeGreeting;
};

const typeWelcomeMessage = () => {
  const message = 'Begin with your name.';
  welcomeTyping.textContent = '';
  [...message].forEach((character, index) => {
    setTimeout(() => { welcomeTyping.textContent += character; }, index * 65);
  });
};

const setWelcomeOpen = (isOpen) => {
  welcomeOverlay.hidden = !isOpen;
  document.body.classList.toggle('welcome-active', isOpen);
  if (isOpen) {
    typeWelcomeMessage();
    requestAnimationFrame(() => welcomeName.focus());
  }
};

const setName = (name) => {
  savedName = name.trim().replace(/\s+/g, ' ');
  nameInput.value = savedName;
  updateDateTime();
};

const setBackground = (background) => {
  document.body.style.setProperty('--custom-background', `url("${background}")`);
  document.querySelectorAll('.background-option').forEach((option) => {
    option.classList.toggle('selected', option.dataset.background === background);
  });
};

const normalizeBackground = (background) => {
  if (typeof background !== 'string') return defaults.background;
  return background.replace(/\.jpe?g$/i, '.webp').replace(/\.png$/i, '.webp');
};

const getBackgroundName = (background) => {
  const file = background.split('/').pop().split('?')[0];
  return file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
};

const renderSupportOptions = () => {
  supportOptionsList.replaceChildren(...supportOptions.map((option) => {
    const item = document.createElement('article');
    item.className = 'support-option';
    item.innerHTML = `
      <h4>${option.region}</h4>
      <p class="support-option-sub">${option.description}</p>
      <a class="support-payment-button ${option.className}" href="${option.url}" target="_blank" rel="noopener noreferrer">
        ${option.label}
      </a>`;
    return item;
  }));
};

const createBackgroundOption = (background, name = getBackgroundName(background)) => {
  const option = document.createElement('button');
  option.className = 'background-option';
  option.type = 'button';
  option.dataset.background = background;
  option.setAttribute('aria-label', `Choose ${name}`);
  option.innerHTML = `<img src="${background}" alt="" />`;
  return option;
};

const renderBundledBackgrounds = () => {
  backgroundGrid.replaceChildren(...bundledBackgrounds.map((background) => createBackgroundOption(background)));
};

const renderUploads = () => {
  uploadsGrid.replaceChildren();
  uploadsSection.hidden = uploadedBackgrounds.length === 0;
  uploadedBackgrounds.forEach((background, index) => {
    const item = document.createElement('div');
    item.className = 'upload-item';
    item.innerHTML = `<button class="background-option" type="button" data-background="${background.data}" aria-label="Choose uploaded image ${index + 1}"><img src="${background.data}" alt="${background.name}" /></button><button class="remove-upload" type="button" data-upload-index="${index}" aria-label="Remove ${background.name}">&times;</button>`;
    uploadsGrid.append(item);
  });
};

const renderShortcuts = () => {
  shortcuts.replaceChildren();
  shortcuts.classList.toggle('hidden', !shortcutsToggle.checked);
  shortcuts.setAttribute('aria-hidden', String(!shortcutsToggle.checked));
  shortcutManager.replaceChildren();
  savedShortcuts.forEach((shortcut, index) => {
    const link = document.createElement('a');
    link.className = 'shortcut';
    link.href = shortcut.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const icon = document.createElement('span');
    icon.className = 'shortcut-icon';
    icon.setAttribute('aria-hidden', 'true');

    const favicon = document.createElement('img');
    favicon.src = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(shortcut.url).hostname)}.ico`;
    favicon.alt = '';
    favicon.addEventListener('error', () => { favicon.remove(); letter.style.display = 'block'; });

    const letter = document.createElement('span');
    letter.className = 'shortcut-letter';
    letter.textContent = shortcut.name.charAt(0).toUpperCase();
    icon.append(favicon, letter);

    const label = document.createElement('span');
    label.textContent = shortcut.name;
    link.append(icon, label);
    shortcuts.append(link);

    const managerItem = document.createElement('div');
    managerItem.className = 'shortcut-manager-item';
    managerItem.draggable = true;
    managerItem.dataset.shortcutIndex = String(index);
    managerItem.innerHTML = `<span class="shortcut-drag-handle" aria-hidden="true">⠿</span><span>${shortcut.name}</span><button type="button" data-edit-shortcut="${index}" aria-label="Edit ${shortcut.name}">Edit</button><button type="button" data-remove-shortcut="${index}" aria-label="Remove ${shortcut.name}">×</button>`;
    shortcutManager.append(managerItem);
  });
};

const setEngine = (engine) => {
  selectedEngine = engines[engine] ? engine : defaults.engine;
  engineTrigger.firstChild.textContent = engineNames[selectedEngine];
  engineTrigger.setAttribute('aria-expanded', 'false');
  enginePicker.classList.remove('open');
  engineMenu.querySelectorAll('[role="option"]').forEach((option) => {
    option.classList.toggle('selected', option.dataset.engine === selectedEngine);
    option.setAttribute('aria-selected', String(option.dataset.engine === selectedEngine));
  });
};

const setSettingsOpen = (isOpen) => {
  settingsPanel.classList.toggle('open', isOpen);
  settingsPanel.setAttribute('aria-hidden', String(!isOpen));
  settingsToggle.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) settingsClose.focus();
  else settingsToggle.focus();
};

// FIXED ARIA ERROR: Remove aria-hidden BEFORE focusing
const setSupportModalOpen = (isOpen) => {
  if (isOpen) {
    supportModal.classList.add('open');
    supportModal.removeAttribute('aria-hidden'); // Remove FIRST
    requestAnimationFrame(() => supportModalClose.focus()); // Focus AFTER
  } else {
    supportModal.classList.remove('open');
    supportModal.setAttribute('aria-hidden', 'true');
    supportToggle.focus();
  }
};

const updatePomodoroDisplay = () => {
  const minutes = Math.floor(pomodoroSeconds / 60);
  const seconds = pomodoroSeconds % 60;
  pomodoroTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = Math.max(0, Math.min(100, (pomodoroSeconds / (pomodoroDuration * 60)) * 100));
  pomodoroDial.style.setProperty('--progress', `${progress}%`);
};

const setPomodoroVisible = (visible) => {
  pomodoroWidget.style.visibility = visible ? 'visible' : 'hidden';
  pomodoroWidget.style.opacity = visible ? '1' : '0';
};

const setPomodoroDuration = (minutes) => {
  pomodoroDuration = minutes;
  if (!pomodoroRunning) {
    pomodoroSeconds = minutes * 60;
    updatePomodoroDisplay();
  }
  durationBtns.forEach((btn) => {
    btn.classList.toggle('selected', Number(btn.dataset.duration) === minutes);
  });
};

// NEW: Web Audio API Chime (No extra files needed!)
const playCompletionChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.1); // C6
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) { /* Ignore audio context errors */ }
};

const finishPomodoro = () => {
  clearInterval(pomodoroInterval);
  pomodoroRunning = false;
  pomodoroStart.classList.remove('is-running');
  pomodoroStart.setAttribute('aria-label', 'Start timer');
  pomodoroStart.title = 'Start timer';
  playCompletionChime();

  if (pomodoroNotif.checked && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('Stillpoint Focus Timer', {
      body: 'Great work! Your focus session is complete. Take a break.',
      icon: 'icons/icon-128.png'
    });
  }
  pomodoroSeconds = pomodoroDuration * 60;
  updatePomodoroDisplay();
};

const startPomodoro = () => {
  if (pomodoroRunning) {
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    pomodoroStart.classList.remove('is-running');
    pomodoroStart.setAttribute('aria-label', 'Resume timer');
    pomodoroStart.title = 'Resume timer';
    return;
  }
  if (pomodoroNotif.checked && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  pomodoroRunning = true;
  pomodoroStart.classList.add('is-running');
  pomodoroStart.setAttribute('aria-label', 'Pause timer');
  pomodoroStart.title = 'Pause timer';
  pomodoroInterval = setInterval(() => {
    if (pomodoroSeconds > 0) {
      pomodoroSeconds--;
      updatePomodoroDisplay();
    } else {
      finishPomodoro();
    }
  }, 1000);
};

const resetPomodoro = () => {
  clearInterval(pomodoroInterval);
  pomodoroRunning = false;
  pomodoroSeconds = pomodoroDuration * 60;
  pomodoroStart.classList.remove('is-running');
  pomodoroStart.setAttribute('aria-label', 'Start timer');
  pomodoroStart.title = 'Start timer';
  updatePomodoroDisplay();
};

const updateFullscreenButton = () => {
  const isFullscreen = document.fullscreenElement === pomodoroWidget;
  pomodoroFullscreen.classList.toggle('is-fullscreen', isFullscreen);
  pomodoroFullscreen.setAttribute('aria-label', isFullscreen ? 'Exit timer fullscreen' : 'Open timer fullscreen');
  pomodoroFullscreen.title = isFullscreen ? 'Exit timer fullscreen' : 'Open timer fullscreen';
};

const togglePomodoroFullscreen = async () => {
  if (document.fullscreenElement === pomodoroWidget) {
    await document.exitFullscreen();
    return;
  }
  await pomodoroWidget.requestFullscreen();
};

const loadSettings = () => {
  storage.get(['name', 'engine', 'background', 'uploadedBackgrounds', 'shortcutsVisible', 'shortcuts', 'pomodoroVisible', 'pomodoroDuration', 'pomodoroNotifications'], (saved) => {
    setName(typeof saved.name === 'string' ? saved.name : '');
    setEngine(engines[saved.engine] ? saved.engine : defaults.engine);
    uploadedBackgrounds = Array.isArray(saved.uploadedBackgrounds) ? saved.uploadedBackgrounds : [];
    renderUploads();
    setBackground(normalizeBackground(saved.background || defaults.background));
    shortcutsToggle.checked = saved.shortcutsVisible !== false;
    savedShortcuts = Array.isArray(saved.shortcuts) ? saved.shortcuts : [...defaults.shortcuts];
    renderShortcuts();

    pomodoroToggle.checked = saved.pomodoroVisible !== false;
    setPomodoroVisible(pomodoroToggle.checked);
    setPomodoroDuration(Number(saved.pomodoroDuration) || defaults.pomodoroDuration);
    pomodoroNotif.checked = saved.pomodoroNotifications !== false;
    setWelcomeOpen(!savedName);
  });
};

updateDateTime();
setInterval(updateDateTime, 30000);
renderBundledBackgrounds();
renderSupportOptions();
loadSettings();
updatePomodoroDisplay();

settingsToggle.addEventListener('click', () => setSettingsOpen(true));
settingsClose.addEventListener('click', () => setSettingsOpen(false));
settingsPanel.addEventListener('click', (event) => { if (event.target === settingsPanel) setSettingsOpen(false); });

welcomeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = welcomeName.value.trim();
  if (!name) return;
  setName(name);
  storage.set({ name: savedName });
  setWelcomeOpen(false);
});

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  setName(name);
  storage.set({ name: savedName });
});

supportToggle.addEventListener('click', () => setSupportModalOpen(true));
supportModalClose.addEventListener('click', () => setSupportModalOpen(false));
supportModal.addEventListener('click', (event) => { if (event.target === supportModal) setSupportModalOpen(false); });

pomodoroStart.addEventListener('click', startPomodoro);
pomodoroReset.addEventListener('click', resetPomodoro);
pomodoroFullscreen.addEventListener('click', () => togglePomodoroFullscreen().catch(() => { }));
document.addEventListener('fullscreenchange', updateFullscreenButton);

pomodoroToggle.addEventListener('change', () => {
  setPomodoroVisible(pomodoroToggle.checked);
  storage.set({ pomodoroVisible: pomodoroToggle.checked });
});

pomodoroNotif.addEventListener('change', () => {
  if (pomodoroNotif.checked && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  storage.set({ pomodoroNotifications: pomodoroNotif.checked });
});

durationBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    setPomodoroDuration(Number(btn.dataset.duration));
    storage.set({ pomodoroDuration: Number(btn.dataset.duration) });
  });
});

shortcutsToggle.addEventListener('change', () => { renderShortcuts(); storage.set({ shortcutsVisible: shortcutsToggle.checked }); });

shortcutManager.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-shortcut]');
  if (editButton) {
    editingShortcutIndex = Number(editButton.dataset.editShortcut);
    const shortcut = savedShortcuts[editingShortcutIndex];
    shortcutName.value = shortcut.name;
    shortcutUrl.value = shortcut.url;
    addShortcutForm.querySelector('button[type="submit"]').textContent = 'Save changes';
    cancelShortcut.hidden = false;
    shortcutName.focus();
    return;
  }
  const removeButton = event.target.closest('[data-remove-shortcut]');
  if (!removeButton) return;
  savedShortcuts.splice(Number(removeButton.dataset.removeShortcut), 1);
  renderShortcuts();
  storage.set({ shortcuts: savedShortcuts });
});

shortcutManager.addEventListener('dragstart', (event) => {
  const item = event.target.closest('[data-shortcut-index]');
  if (!item) return;
  draggedShortcutIndex = Number(item.dataset.shortcutIndex);
  item.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
});

shortcutManager.addEventListener('dragover', (event) => {
  const item = event.target.closest('[data-shortcut-index]');
  if (!item || draggedShortcutIndex === null) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
});

shortcutManager.addEventListener('drop', (event) => {
  const item = event.target.closest('[data-shortcut-index]');
  if (!item || draggedShortcutIndex === null) return;
  event.preventDefault();
  const targetIndex = Number(item.dataset.shortcutIndex);
  const [movedShortcut] = savedShortcuts.splice(draggedShortcutIndex, 1);
  savedShortcuts.splice(targetIndex, 0, movedShortcut);
  draggedShortcutIndex = null;
  renderShortcuts();
  storage.set({ shortcuts: savedShortcuts });
});

shortcutManager.addEventListener('dragend', () => {
  draggedShortcutIndex = null;
  shortcutManager.querySelector('.dragging')?.classList.remove('dragging');
});

addShortcutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = shortcutName.value.trim();
  const url = shortcutUrl.value.trim();
  if (!name || !url) return;
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return;
  } catch { return; }

  if (editingShortcutIndex === null) savedShortcuts.push({ name, url });
  else savedShortcuts[editingShortcutIndex] = { name, url };

  editingShortcutIndex = null;
  renderShortcuts();
  storage.set({ shortcuts: savedShortcuts });
  addShortcutForm.reset();
  addShortcutForm.querySelector('button[type="submit"]').textContent = 'Add shortcut';
  cancelShortcut.hidden = true;
  shortcutName.focus();
});

cancelShortcut.addEventListener('click', () => {
  editingShortcutIndex = null;
  addShortcutForm.reset();
  addShortcutForm.querySelector('button[type="submit"]').textContent = 'Add shortcut';
  cancelShortcut.hidden = true;
});

engineTrigger.addEventListener('click', () => {
  const isOpen = enginePicker.classList.toggle('open');
  engineTrigger.setAttribute('aria-expanded', String(isOpen));
});

engineMenu.addEventListener('click', (event) => {
  const option = event.target.closest('[data-engine]');
  if (!option) return;
  setEngine(option.dataset.engine);
  storage.set({ engine: selectedEngine });
});

backgroundGrid.addEventListener('click', (event) => {
  const option = event.target.closest('.background-option');
  if (!option) return;
  setBackground(option.dataset.background);
  storage.set({ background: option.dataset.background });
});

uploadsGrid.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-upload');
  if (removeButton) {
    const uploadIndex = Number(removeButton.dataset.uploadIndex);
    const removed = uploadedBackgrounds.splice(uploadIndex, 1)[0];
    if (removed?.data === document.body.style.getPropertyValue('--custom-background').replace(/^url\(["']?|["']?\)$/g, '')) {
      setBackground(defaults.background);
      storage.set({ background: defaults.background });
    }
    storage.set({ uploadedBackgrounds });
    renderUploads();
    return;
  }
  const option = event.target.closest('.background-option');
  if (!option) return;
  setBackground(option.dataset.background);
  storage.set({ background: option.dataset.background });
});

backgroundUpload.addEventListener('change', () => {
  const [file] = backgroundUpload.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const upload = { data: reader.result, name: file.name };
    uploadedBackgrounds.push(upload);
    renderUploads();
    setBackground(upload.data);
    storage.set({ background: upload.data, uploadedBackgrounds });
  });
  reader.readAsDataURL(file);
});

settingsReset.addEventListener('click', () => {
  setName('');
  setEngine(defaults.engine);
  setBackground(defaults.background);
  uploadedBackgrounds = [];
  savedShortcuts = [...defaults.shortcuts];
  shortcutsToggle.checked = true;
  pomodoroToggle.checked = true;
  pomodoroNotif.checked = true;
  setPomodoroVisible(true);
  setPomodoroDuration(defaults.pomodoroDuration);
  resetPomodoro();
  renderUploads();
  renderShortcuts();
  storage.set({ ...defaults, name: '', uploadedBackgrounds: [], shortcuts: savedShortcuts, shortcutsVisible: true, pomodoroVisible: true, pomodoroNotifications: true });
  setSettingsOpen(false);
  setWelcomeOpen(true);
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== searchInput && !settingsPanel.classList.contains('open')) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === 'Escape') {
    if (settingsPanel.classList.contains('open')) setSettingsOpen(false);
    else if (supportModal.classList.contains('open')) setSupportModalOpen(false);
    else if (document.activeElement === searchInput) { searchInput.value = ''; searchInput.focus(); }
  }
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) { searchInput.focus(); return; }
  window.location.href = `${engines[selectedEngine]}${encodeURIComponent(query)}`;
});
