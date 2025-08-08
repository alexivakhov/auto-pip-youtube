// Background Service Worker для Auto PiP розширення
class AutoPiPManager {
  constructor() {
    this.isEnabled = true;
    this.lastActiveTabId = null;
    this.youtubeTabs = new Set();
    this.init();
  }

  async init() {
    // Завантажуємо налаштування
    const result = await chrome.storage.sync.get(['autoPipEnabled']);
    this.isEnabled = result.autoPipEnabled !== false; // За замовчуванням увімкнено

    // Відстежуємо зміни активної вкладки
    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    
    // Відстежуємо оновлення вкладок
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    
    // Відстежуємо закриття вкладок
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this));

    // Відстежуємо зміни налаштувань
    chrome.storage.onChanged.addListener(this.handleStorageChanged.bind(this));

    console.log('Auto PiP розширення ініціалізовано');
  }

  async handleTabActivated(activeInfo) {
    if (!this.isEnabled) return;

    const { tabId } = activeInfo;
    
    // Якщо це YouTube вкладка і вона була активною раніше
    if (this.youtubeTabs.has(tabId) && this.lastActiveTabId === tabId) {
      return; // Вже активна YouTube вкладка
    }

    // Якщо попередня активна вкладка була YouTube
    if (this.lastActiveTabId && this.youtubeTabs.has(this.lastActiveTabId)) {
      // Перевіряємо чи вкладка все ще існує
      try {
        const tab = await chrome.tabs.get(this.lastActiveTabId);
        if (tab && this.isYouTubeUrl(tab.url)) {
          console.log(`Активуємо PiP для вкладки ${this.lastActiveTabId} при переході на вкладку ${tabId}`);
          await this.activatePiP(this.lastActiveTabId);
        }
      } catch (error) {
        console.log('Вкладка більше не існує:', this.lastActiveTabId);
        this.lastActiveTabId = null;
      }
    }

    this.lastActiveTabId = tabId;
  }

  // Додаємо відстеження зміни стану PiP
  async handlePiPStateChanged(tabId, isPiPActive) {
    console.log(`PiP стан змінено для вкладки ${tabId}: ${isPiPActive ? 'активний' : 'неактивний'}`);
    
    // Якщо PiP був деактивований, скидаємо стан
    if (!isPiPActive) {
      // Скидаємо lastActiveTabId якщо це була та вкладка
      if (this.lastActiveTabId === tabId) {
        console.log('Скидаємо lastActiveTabId після деактивації PiP');
        this.lastActiveTabId = null;
      }
    }
  }

  async handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      const isYouTube = this.isYouTubeUrl(tab.url);
      
      if (isYouTube) {
        this.youtubeTabs.add(tabId);
      } else {
        this.youtubeTabs.delete(tabId);
      }
    }
  }

  handleTabRemoved(tabId) {
    this.youtubeTabs.delete(tabId);
    if (this.lastActiveTabId === tabId) {
      this.lastActiveTabId = null;
    }
  }

  handleStorageChanged(changes) {
    if (changes.autoPipEnabled) {
      this.isEnabled = changes.autoPipEnabled.newValue;
      console.log('Auto PiP статус змінено:', this.isEnabled);
    }
  }

  isYouTubeUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com';
    } catch {
      return false;
    }
  }

  async activatePiP(tabId) {
    try {
      // Впроваджуємо скрипт для активації PiP
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['injected.js']
      });

      // Відправляємо повідомлення content script
      await chrome.tabs.sendMessage(tabId, {
        action: 'activatePiP'
      });

      console.log(`PiP активовано для вкладки ${tabId}`);
    } catch (error) {
      console.error('Помилка активації PiP:', error);
    }
  }
}

// Ініціалізуємо менеджер при завантаженні розширення
const autoPiPManager = new AutoPiPManager();

// Обробка повідомлень від popup та content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getStatus':
      sendResponse({ 
        isEnabled: autoPiPManager.isEnabled,
        youtubeTabsCount: autoPiPManager.youtubeTabs.size
      });
      break;
      
    case 'toggleStatus':
      autoPiPManager.isEnabled = request.enabled;
      chrome.storage.sync.set({ autoPipEnabled: request.enabled });
      sendResponse({ success: true });
      break;
      
    case 'manualPiP':
      if (sender.tab) {
        autoPiPManager.activatePiP(sender.tab.id);
      }
      sendResponse({ success: true });
      break;
      
    case 'pipStateChanged':
      if (sender.tab) {
        autoPiPManager.handlePiPStateChanged(sender.tab.id, request.isPiPActive);
      }
      sendResponse({ success: true });
      break;
  }
});
