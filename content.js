// Bot state
let isRunning = false;
let currentIndex = 0;
let prompts = [];
let delay = 10000;
let randomMode = false;
let loopMode = false;
let intervalId = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startBot(request);
  } else if (request.action === 'stop') {
    stopBot();
  }
});

// Check if bot should resume on page load
chrome.storage.local.get(['isRunning', 'prompts', 'delay', 'randomMode', 'loopMode', 'currentIndex'], (data) => {
  if (data.isRunning) {
    startBot({
      prompts: data.prompts ? data.prompts.split('\n').filter(p => p.trim()) : [],
      delay: data.delay * 1000 || 10000,
      randomMode: data.randomMode || false,
      loopMode: data.loopMode || false
    });
    currentIndex = data.currentIndex || 0;
  }
});

function startBot(config) {
  if (isRunning) return;

  prompts = config.prompts;
  delay = config.delay;
  randomMode = config.randomMode;
  loopMode = config.loopMode;
  isRunning = true;

  console.log('🤖 Meta AI Bot dimulai!');
  console.log('📝 Prompts:', prompts.length);
  console.log('⏱️ Delay:', delay / 1000, 'detik');
  console.log('🎲 Random Mode:', randomMode);
  console.log('🔄 Loop Mode:', loopMode);

  // Start generating
  generateNextImage();
}

function stopBot() {
  isRunning = false;
  if (intervalId) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  console.log('🛑 Meta AI Bot dihentikan!');
}

function generateNextImage() {
  if (!isRunning) return;

  // Get next prompt
  let prompt;
  if (randomMode) {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    prompt = prompts[randomIndex];
  } else {
    prompt = prompts[currentIndex];
    currentIndex++;

    // Check if we've reached the end
    if (currentIndex >= prompts.length) {
      if (loopMode) {
        currentIndex = 0; // Loop back to start
      } else {
        console.log('✅ Semua prompt telah diproses!');
        stopBot();
        chrome.storage.local.set({ isRunning: false });
        return;
      }
    }
  }

  // Save current index
  chrome.storage.local.set({ currentIndex });

  // Send the prompt
  if (prompt && prompt.trim()) {
    sendPrompt(prompt.trim());
  }

  // Schedule next generation
  intervalId = setTimeout(() => {
    generateNextImage();
  }, delay);
}

function sendPrompt(prompt) {
  console.log('🎨 Generating:', prompt);

  // Find the input textarea
  // Meta AI uses different selectors, we'll try multiple approaches
  const selectors = [
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="Message"]',
    'textarea',
    'input[type="text"]',
    '[contenteditable="true"]',
    'div[role="textbox"]'
  ];

  let inputElement = null;
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      // Try to find the main input (usually the largest or most visible one)
      inputElement = Array.from(elements).find(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 100 && rect.height > 20;
      }) || elements[0];

      if (inputElement) {
        console.log('✅ Input found:', selector);
        break;
      }
    }
  }

  if (!inputElement) {
    console.error('❌ Input tidak ditemukan!');
    return;
  }

  // Set the value
  if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
    inputElement.value = prompt;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // For contenteditable divs
    inputElement.textContent = prompt;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Wait a bit for the UI to update
  setTimeout(() => {
    // Find and click the send button
    const buttonSelectors = [
      'button[aria-label*="Send"]',
      'button[aria-label*="submit"]',
      'button[type="submit"]',
      'button:has(svg)',
      '[role="button"]'
    ];

    let sendButton = null;
    for (const selector of buttonSelectors) {
      const buttons = document.querySelectorAll(selector);
      if (buttons.length > 0) {
        // Find button near the input
        sendButton = Array.from(buttons).find(btn => {
          const btnText = btn.textContent.toLowerCase();
          const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
          return btnText.includes('send') ||
                 ariaLabel.includes('send') ||
                 ariaLabel.includes('submit') ||
                 btn.querySelector('svg'); // Button with icon
        });

        if (sendButton) {
          console.log('✅ Send button found:', selector);
          break;
        }
      }
    }

    if (sendButton) {
      sendButton.click();
      console.log('✅ Prompt terkirim!');

      // Increment counter
      chrome.storage.local.get(['imageCount'], (data) => {
        const count = (data.imageCount || 0) + 1;
        chrome.storage.local.set({ imageCount: count });
        console.log('📊 Total gambar:', count);
      });
    } else {
      console.error('❌ Send button tidak ditemukan!');

      // Try to submit with Enter key as fallback
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      inputElement.dispatchEvent(enterEvent);
      console.log('⌨️ Mencoba submit dengan Enter key');
    }
  }, 500);
}

// Add visual indicator that bot is running
function addVisualIndicator() {
  if (document.getElementById('metaAIBotIndicator')) return;

  const indicator = document.createElement('div');
  indicator.id = 'metaAIBotIndicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  indicator.innerHTML = `
    <span style="animation: pulse 2s infinite;">🤖</span>
    <span>Meta AI Bot Active</span>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(indicator);
}

// Update indicator based on running state
setInterval(() => {
  chrome.storage.local.get(['isRunning'], (data) => {
    if (data.isRunning) {
      addVisualIndicator();
    } else {
      const indicator = document.getElementById('metaAIBotIndicator');
      if (indicator) indicator.remove();
    }
  });
}, 1000);
