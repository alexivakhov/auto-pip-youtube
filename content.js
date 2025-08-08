// Content Script для YouTube сторінок
class YouTubePiPController {
  constructor() {
    this.videoElement = null;
    this.isPiPActive = false;
    this.observer = null;
    this.init();
  }

  init() {
    // Відстежуємо повідомлення від background script
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    
    // Спостерігаємо за змінами DOM для знаходження відео
    this.observeVideoElement();
    
    // Додаємо кнопку PiP до інтерфейсу YouTube
    this.addPiPButton();
    
    // Відстежуємо події PiP глобально
    this.setupPiPEventListeners();
    
    console.log('YouTube PiP Controller ініціалізовано');
  }

  handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'activatePiP':
        this.activatePiP();
        sendResponse({ success: true });
        break;
        
      case 'deactivatePiP':
        this.deactivatePiP();
        sendResponse({ success: true });
        break;
    }
  }

  observeVideoElement() {
    // Знаходимо відео елемент
    this.findVideoElement();
    
    // Створюємо observer для відстеження змін DOM
    this.observer = new MutationObserver(() => {
      if (!this.videoElement || !document.contains(this.videoElement)) {
        this.findVideoElement();
      }
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  findVideoElement() {
    // Шукаємо відео елемент на YouTube
    const videoSelectors = [
      'video',
      '#movie_player video',
      '.html5-video-player video',
      'ytd-player video'
    ];
    
    for (const selector of videoSelectors) {
      const video = document.querySelector(selector);
      if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA
        this.videoElement = video;
        console.log('Відео елемент знайдено');
        break;
      }
    }
  }

  setupPiPEventListeners() {
    // Відстежуємо вихід з PiP глобально
    document.addEventListener('leavepictureinpicture', () => {
      this.isPiPActive = false;
      console.log('Вихід з PiP (глобальний)');
      
      // Повідомляємо background script про зміну стану
      chrome.runtime.sendMessage({
        action: 'pipStateChanged',
        isPiPActive: false
      });
    });
    
    // Відстежуємо вхід в PiP глобально
    document.addEventListener('enterpictureinpicture', () => {
      this.isPiPActive = true;
      console.log('Вхід в PiP (глобальний)');
      
      // Повідомляємо background script про зміну стану
      chrome.runtime.sendMessage({
        action: 'pipStateChanged',
        isPiPActive: true
      });
    });
  }

  async activatePiP() {
    if (!this.videoElement) {
      console.log('Відео елемент не знайдено');
      return false;
    }

    try {
      // Перевіряємо чи підтримується PiP
      if (!document.pictureInPictureEnabled) {
        console.log('PiP не підтримується в цьому браузері');
        return false;
      }

      // Перевіряємо чи відео готове для PiP
      if (this.videoElement.readyState < 2) {
        console.log('Відео ще не готове для PiP');
        return false;
      }

      // Перевіряємо чи PiP вже активний
      if (document.pictureInPictureElement) {
        console.log('PiP вже активний');
        return true;
      }

      // Активуємо PiP
      await this.videoElement.requestPictureInPicture();
      this.isPiPActive = true;
      
      console.log('PiP активовано успішно');
      
      return true;
    } catch (error) {
      console.error('Помилка активації PiP:', error);
      return false;
    }
  }

  async deactivatePiP() {
    if (this.isPiPActive && document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
        this.isPiPActive = false;
        console.log('PiP деактивовано');
        return true;
      } catch (error) {
        console.error('Помилка деактивації PiP:', error);
        return false;
      }
    }
    return false;
  }

  addPiPButton() {
    // Створюємо кнопку PiP для ручного керування
    const button = document.createElement('button');
    button.innerHTML = '📺 PiP';
    button.className = 'auto-pip-button';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'YouTube Sans', 'Roboto', sans-serif;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 0, 0, 0.8)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(0, 0, 0, 0.8)';
    });
    
    button.addEventListener('click', async () => {
      if (this.isPiPActive) {
        await this.deactivatePiP();
        button.innerHTML = '📺 PiP';
      } else {
        const success = await this.activatePiP();
        if (success) {
          button.innerHTML = '⏹️ Закрити PiP';
        }
      }
    });
    
    // Додаємо кнопку до сторінки
    document.body.appendChild(button);
    
    // Приховуємо кнопку якщо вона вже існує
    const existingButton = document.querySelector('.auto-pip-button');
    if (existingButton && existingButton !== button) {
      existingButton.remove();
    }
  }
}

// Ініціалізуємо контролер при завантаженні сторінки
const pipController = new YouTubePiPController();
