// Injected Script для додаткової функціональності PiP
(function() {
  'use strict';

  // Додаткові функції для роботи з YouTube відео
  class YouTubePiPEnhancer {
    constructor() {
      this.videoElement = null;
      this.originalControls = null;
      this.init();
    }

    init() {
      this.findVideoElement();
      this.setupEventListeners();
      this.enhanceVideoControls();
    }

    findVideoElement() {
      const videoSelectors = [
        'video',
        '#movie_player video',
        '.html5-video-player video',
        'ytd-player video'
      ];
      
      for (const selector of videoSelectors) {
        const video = document.querySelector(selector);
        if (video && video.readyState >= 2) {
          this.videoElement = video;
          break;
        }
      }
    }

    setupEventListeners() {
      if (!this.videoElement) return;

      // Відстежуємо зміни стану відео
      this.videoElement.addEventListener('loadeddata', () => {
        console.log('Відео завантажено, готове для PiP');
      });

      // Відстежуємо помилки
      this.videoElement.addEventListener('error', (e) => {
        console.error('Помилка відео:', e);
      });

      // Відстежуємо зміни розміру
      this.videoElement.addEventListener('resize', () => {
        console.log('Розмір відео змінено');
      });
    }

    enhanceVideoControls() {
      if (!this.videoElement) return;

      // Зберігаємо оригінальні контроли
      this.originalControls = this.videoElement.controls;

      // Додаємо додаткові властивості для кращої роботи з PiP
      this.videoElement.setAttribute('playsinline', '');
      this.videoElement.setAttribute('webkit-playsinline', '');
      
      // Додаємо метадані для кращої підтримки PiP
      this.videoElement.setAttribute('data-pip-enabled', 'true');
    }

    // Метод для примусової активації PiP
    async forceActivatePiP() {
      if (!this.videoElement) {
        this.findVideoElement();
      }

      if (!this.videoElement) {
        console.log('Відео елемент не знайдено');
        return false;
      }

      try {
        // Перевіряємо чи відео відтворюється
        if (this.videoElement.paused) {
          await this.videoElement.play();
        }

        // Активуємо PiP
        await this.videoElement.requestPictureInPicture();
        console.log('PiP примусово активовано');
        return true;
      } catch (error) {
        console.error('Помилка примусової активації PiP:', error);
        return false;
      }
    }

    // Метод для відновлення оригінального стану
    restoreOriginalState() {
      if (this.videoElement && this.originalControls !== null) {
        this.videoElement.controls = this.originalControls;
      }
    }
  }

  // Створюємо глобальний об'єкт для доступу з content script
  window.YouTubePiPEnhancer = new YouTubePiPEnhancer();

  // Додаємо глобальні методи для зовнішнього виклику
  window.activateYouTubePiP = () => {
    return window.YouTubePiPEnhancer.forceActivatePiP();
  };

  window.restoreYouTubeState = () => {
    return window.YouTubePiPEnhancer.restoreOriginalState();
  };

  console.log('YouTube PiP Enhancer ініціалізовано');
})();
