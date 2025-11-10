// Helper function to check if extension context is valid
function isExtensionContextValid() {
  try {
    // Try to access chrome.runtime.id
    // If extension is reloaded, this will throw an error
    return chrome.runtime && chrome.runtime.id !== undefined;
  } catch (error) {
    return false;
  }
}

// Safe wrapper for chrome.storage.local.get
function safeStorageGet(keys, callback) {
  if (!isExtensionContextValid()) {
    console.warn('⚠️ Extension context invalidated, skipping storage.get');
    return;
  }

  try {
    chrome.storage.local.get(keys, (data) => {
      if (chrome.runtime.lastError) {
        console.error('Storage get error:', chrome.runtime.lastError.message);
        return;
      }
      callback(data);
    });
  } catch (error) {
    console.error('Storage get failed:', error.message);
  }
}

// Safe wrapper for chrome.storage.local.set
function safeStorageSet(data, callback) {
  if (!isExtensionContextValid()) {
    console.warn('⚠️ Extension context invalidated, skipping storage.set');
    return;
  }

  try {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage set error:', chrome.runtime.lastError.message);
        return;
      }
      if (callback) callback();
    });
  } catch (error) {
    console.error('Storage set failed:', error.message);
  }
}

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
  try {
    if (!isExtensionContextValid()) {
      console.warn('⚠️ Extension context invalidated, stopping bot');
      stopBot();
      return;
    }

    if (request.action === 'start') {
      startBot(request);
    } else if (request.action === 'stop') {
      stopBot();
    }
  } catch (error) {
    console.error('Message listener error:', error.message);
  }
});

// Check if bot should resume on page load
safeStorageGet(['isRunning', 'prompts', 'delay', 'randomMode', 'loopMode', 'currentIndex'], (data) => {
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

  // Check if extension context is still valid
  if (!isExtensionContextValid()) {
    console.warn('⚠️ Extension context invalidated, stopping bot');
    stopBot();
    return;
  }

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
        safeStorageSet({ isRunning: false });
        return;
      }
    }
  }

  // Save current index
  safeStorageSet({ currentIndex });

  // Send the prompt
  if (prompt && prompt.trim()) {
    sendPrompt(prompt.trim());
  }

  // Schedule next generation
  intervalId = setTimeout(() => {
    generateNextImage();
  }, delay);
}

// Helper function to wait for element to appear
function waitForElement(selectors, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkElement = () => {
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          // Try to find the main input (usually the largest or most visible one)
          const element = Array.from(elements).find(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 100 && rect.height > 20;
          }) || elements[0];

          if (element) {
            console.log('✅ Element found with selector:', selector);
            resolve(element);
            return;
          }
        }
      }

      // Check if timeout reached
      if (Date.now() - startTime > timeout) {
        console.error('❌ Timeout: Element tidak ditemukan setelah', timeout, 'ms');
        resolve(null);
        return;
      }

      // Try again after a short delay
      setTimeout(checkElement, 100);
    };

    checkElement();
  });
}

// Trigger React/Vue events properly
function setNativeValue(element, value) {
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(element, 'value') || {};
  const prototype = Object.getPrototypeOf(element);
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
}

// Trigger all necessary events for modern frameworks
function triggerInputEvents(element) {
  // Focus the element first
  element.focus();

  // Trigger multiple events that React/Vue listen to
  const events = [
    new Event('input', { bubbles: true, cancelable: true }),
    new Event('change', { bubbles: true, cancelable: true }),
    new Event('keyup', { bubbles: true, cancelable: true }),
    new Event('keydown', { bubbles: true, cancelable: true }),
    new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText' })
  ];

  events.forEach(event => element.dispatchEvent(event));
}

async function sendPrompt(prompt) {
  console.log('🎨 Generating:', prompt);

  // Find the input textarea with retry mechanism
  const inputSelectors = [
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="Message"]',
    'textarea[placeholder*="ask"]',
    'textarea[placeholder*="message"]',
    'textarea.x1i10hfl', // Meta AI specific class
    'textarea',
    'input[type="text"]',
    '[contenteditable="true"]',
    'div[role="textbox"]'
  ];

  const inputElement = await waitForElement(inputSelectors, 5000);

  if (!inputElement) {
    console.error('❌ Input tidak ditemukan! Mencoba lagi...');
    console.log('💡 Tip: Pastikan Anda berada di halaman Meta AI yang benar');
    return;
  }

  console.log('📝 Memasukkan prompt ke input...');

  // Set the value based on element type
  if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
    // Use native setter for React components
    setNativeValue(inputElement, prompt);
    triggerInputEvents(inputElement);
    console.log('✅ Prompt dimasukkan ke textarea');
  } else {
    // For contenteditable divs
    inputElement.focus();

    // Try different methods for contenteditable
    if (inputElement.textContent !== prompt) {
      inputElement.textContent = prompt;
    }
    if (inputElement.innerText !== prompt) {
      inputElement.innerText = prompt;
    }

    // Trigger events
    triggerInputEvents(inputElement);
    console.log('✅ Prompt dimasukkan ke contenteditable');
  }

  // Wait for UI to update and find send button
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log('🔍 Mencari tombol kirim...');

  // Find and click the send button
  const buttonSelectors = [
    'button[aria-label*="Send"]',
    'button[aria-label*="send"]',
    'button[aria-label*="Submit"]',
    'button[aria-label*="submit"]',
    'button[type="submit"]',
    'button svg[viewBox]', // Button containing SVG icon
    '[role="button"][aria-label*="Send"]',
    '[role="button"][aria-label*="send"]'
  ];

  const sendButton = await waitForElement(buttonSelectors, 3000);

  if (sendButton) {
    console.log('🖱️ Mengklik tombol kirim...');

    // Click the button (or its parent if it's an SVG)
    const clickTarget = sendButton.tagName === 'svg' ? sendButton.closest('button') : sendButton;
    if (clickTarget) {
      clickTarget.click();
      console.log('✅ Prompt terkirim!');

      // Increment counter
      safeStorageGet(['imageCount'], (data) => {
        const count = (data.imageCount || 0) + 1;
        safeStorageSet({ imageCount: count });
        console.log('📊 Total gambar:', count);
      });
    }
  } else {
    console.warn('⚠️ Send button tidak ditemukan, mencoba Enter key...');

    // Try to submit with Enter key as fallback
    inputElement.focus();
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    inputElement.dispatchEvent(enterEvent);

    // Also try keypress
    const keypressEvent = new KeyboardEvent('keypress', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    inputElement.dispatchEvent(keypressEvent);

    console.log('⌨️ Enter key ditekan');
  }
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
  // Check if extension context is valid before accessing storage
  if (!isExtensionContextValid()) {
    // Context invalidated, stop bot and remove indicator
    if (isRunning) {
      console.warn('⚠️ Extension context invalidated, stopping bot');
      isRunning = false;
      if (intervalId) {
        clearTimeout(intervalId);
        intervalId = null;
      }
    }
    const indicator = document.getElementById('metaAIBotIndicator');
    if (indicator) indicator.remove();
    return;
  }

  safeStorageGet(['isRunning'], (data) => {
    if (data.isRunning) {
      addVisualIndicator();
    } else {
      const indicator = document.getElementById('metaAIBotIndicator');
      if (indicator) indicator.remove();
    }
  });
}, 1000);
