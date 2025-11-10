// Elements
const promptListInput = document.getElementById('promptList');
const delayInput = document.getElementById('delay');
const randomModeCheckbox = document.getElementById('randomMode');
const loopModeCheckbox = document.getElementById('loopMode');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const imageCount = document.getElementById('imageCount');

// Load saved settings
chrome.storage.local.get(['prompts', 'delay', 'randomMode', 'loopMode', 'imageCount'], (data) => {
  if (data.prompts) promptListInput.value = data.prompts;
  if (data.delay) delayInput.value = data.delay;
  if (data.randomMode !== undefined) randomModeCheckbox.checked = data.randomMode;
  if (data.loopMode !== undefined) loopModeCheckbox.checked = data.loopMode;
  if (data.imageCount) imageCount.textContent = data.imageCount;
});

// Check bot status
chrome.storage.local.get(['isRunning'], (data) => {
  updateStatus(data.isRunning || false);
});

// Auto-update status
setInterval(() => {
  chrome.storage.local.get(['isRunning', 'imageCount'], (data) => {
    updateStatus(data.isRunning || false);
    if (data.imageCount !== undefined) {
      imageCount.textContent = data.imageCount;
    }
  });
}, 1000);

// Save settings on change
promptListInput.addEventListener('input', saveSettings);
delayInput.addEventListener('change', saveSettings);
randomModeCheckbox.addEventListener('change', saveSettings);
loopModeCheckbox.addEventListener('change', saveSettings);

function saveSettings() {
  chrome.storage.local.set({
    prompts: promptListInput.value,
    delay: parseInt(delayInput.value),
    randomMode: randomModeCheckbox.checked,
    loopMode: loopModeCheckbox.checked
  });
}

// Start button
startBtn.addEventListener('click', async () => {
  const prompts = promptListInput.value.trim();
  const delay = parseInt(delayInput.value);

  if (!prompts) {
    alert('Mohon masukkan minimal satu prompt!');
    return;
  }

  if (delay < 5 || delay > 300) {
    alert('Jeda waktu harus antara 5-300 detik!');
    return;
  }

  // Save settings
  saveSettings();

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes('meta.ai')) {
    alert('Mohon buka halaman Meta AI terlebih dahulu!\n\nBuka: https://www.meta.ai');
    return;
  }

  // Start the bot
  chrome.storage.local.set({ isRunning: true }, () => {
    chrome.tabs.sendMessage(tab.id, {
      action: 'start',
      prompts: prompts.split('\n').filter(p => p.trim()),
      delay: delay * 1000,
      randomMode: randomModeCheckbox.checked,
      loopMode: loopModeCheckbox.checked
    });
    updateStatus(true);
  });
});

// Stop button
stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.local.set({ isRunning: false }, () => {
    if (tab.url.includes('meta.ai')) {
      chrome.tabs.sendMessage(tab.id, { action: 'stop' });
    }
    updateStatus(false);
  });
});

// Reset button
resetBtn.addEventListener('click', () => {
  if (confirm('Reset counter gambar ke 0?')) {
    chrome.storage.local.set({ imageCount: 0 }, () => {
      imageCount.textContent = '0';
    });
  }
});

// Update status UI
function updateStatus(isRunning) {
  if (isRunning) {
    statusDot.className = 'status-dot running';
    statusText.textContent = 'Aktif';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    promptListInput.disabled = true;
    delayInput.disabled = true;
  } else {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Tidak Aktif';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    promptListInput.disabled = false;
    delayInput.disabled = false;
  }
}
