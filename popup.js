// Popup JavaScript для Auto PiP розширення
class PopupController {
  constructor() {
    this.elements = {};
    this.stats = {
      pipActivations: 0
    };
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadInitialState();
    this.updateStats();
  }

  cacheElements() {
    this.elements = {
      statusDot: document.getElementById('statusDot'),
      statusText: document.getElementById('statusText'),
      enableToggle: document.getElementById('enableToggle'),
      youtubeTabsCount: document.getElementById('youtubeTabsCount'),
      pipActivations: document.getElementById('pipActivations'),
      manualPiP: document.getElementById('manualPiP'),
      refreshStats: document.getElementById('refreshStats'),
      helpLink: document.getElementById('helpLink'),
      feedbackLink: document.getElementById('feedbackLink')
    };
  }

  bindEvents() {
    // Toggle перемикач
    this.elements.enableToggle.addEventListener('change', (e) => {
      this.toggleAutoPiP(e.target.checked);
    });

    // Ручна активація PiP
    this.elements.manualPiP.addEventListener('click', () => {
      this.activateManualPiP();
    });

    // Оновлення статистики
    this.elements.refreshStats.addEventListener('click', () => {
      this.updateStats();
    });

    // Посилання
    this.elements.helpLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });

    this.elements.feedbackLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showFeedback();
    });
  }

  async loadInitialState() {
    try {
      // Отримуємо статус від background script
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      
      if (response) {
        this.updateStatus(response.isEnabled);
        this.elements.enableToggle.checked = response.isEnabled;
        this.elements.youtubeTabsCount.textContent = response.youtubeTabsCount || 0;
      }
    } catch (error) {
      console.error('Помилка завантаження стану:', error);
      this.updateStatus(false);
    }
  }

  updateStatus(isEnabled) {
    const statusDot = this.elements.statusDot;
    const statusText = this.elements.statusText;

    if (isEnabled) {
      statusDot.classList.add('active');
      statusText.textContent = 'Активне';
      statusText.style.color = '#4CAF50';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'Неактивне';
      statusText.style.color = '#666';
    }
  }

  async toggleAutoPiP(enabled) {
    try {
      // Відправляємо повідомлення до background script
      await chrome.runtime.sendMessage({
        action: 'toggleStatus',
        enabled: enabled
      });

      this.updateStatus(enabled);
      
      // Показуємо повідомлення про успіх
      this.showNotification(
        enabled ? 'Auto PiP увімкнено!' : 'Auto PiP вимкнено!',
        'success'
      );
    } catch (error) {
      console.error('Помилка зміни статусу:', error);
      this.showNotification('Помилка зміни налаштувань', 'error');
      
      // Відновлюємо попередній стан
      this.elements.enableToggle.checked = !enabled;
    }
  }

  async activateManualPiP() {
    try {
      // Отримуємо активну вкладку
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        this.showNotification('Не вдалося знайти активну вкладку', 'error');
        return;
      }

      // Перевіряємо чи це YouTube вкладка
      if (!this.isYouTubeUrl(tab.url)) {
        this.showNotification('Ця функція працює тільки на YouTube', 'warning');
        return;
      }

      // Відправляємо повідомлення для активації PiP
      await chrome.runtime.sendMessage({ action: 'manualPiP' });
      
      this.showNotification('PiP активовано!', 'success');
      
      // Оновлюємо статистику
      this.stats.pipActivations++;
      this.elements.pipActivations.textContent = this.stats.pipActivations;
      
    } catch (error) {
      console.error('Помилка ручної активації PiP:', error);
      this.showNotification('Помилка активації PiP', 'error');
    }
  }

  async updateStats() {
    try {
      // Отримуємо оновлену статистику
      const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
      
      if (response) {
        this.elements.youtubeTabsCount.textContent = response.youtubeTabsCount || 0;
      }

      // Оновлюємо статистику активацій
      this.elements.pipActivations.textContent = this.stats.pipActivations;
      
      this.showNotification('Статистика оновлена', 'success');
    } catch (error) {
      console.error('Помилка оновлення статистики:', error);
      this.showNotification('Помилка оновлення статистики', 'error');
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

  showNotification(message, type = 'info') {
    // Створюємо повідомлення
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стилі для повідомлення
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
    `;

    // Кольори залежно від типу
    switch (type) {
      case 'success':
        notification.style.background = '#4CAF50';
        break;
      case 'error':
        notification.style.background = '#f44336';
        break;
      case 'warning':
        notification.style.background = '#ff9800';
        break;
      default:
        notification.style.background = '#2196F3';
    }

    // Додаємо до DOM
    document.body.appendChild(notification);

    // Видаляємо через 3 секунди
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showHelp() {
    const helpText = `
Auto PiP для YouTube - Довідка

🎯 Як працює:
• Розширення автоматично активує Picture-in-Picture для YouTube відео
• Коли ви змінюєте активну вкладку, відео переходить в PiP режим
• Працює тільки з YouTube відео

⚙️ Налаштування:
• Увімкніть/вимкніть автоматичний PiP перемикачем
• Використовуйте кнопку "Ручна активація PiP" для тестування
• Статистика показує кількість YouTube вкладок та активацій

🔧 Вирішення проблем:
• Переконайтеся, що браузер підтримує PiP
• Відео має бути завантажене для активації PiP
• Перевірте дозволи розширення в налаштуваннях браузера
    `;
    
    alert(helpText);
  }

  showFeedback() {
    const feedbackUrl = 'https://github.com/your-repo/auto-pip-youtube/issues';
    chrome.tabs.create({ url: feedbackUrl });
  }
}

// Додаємо CSS анімації для повідомлень
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// Ініціалізуємо контролер при завантаженні popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
