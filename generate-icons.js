// Скрипт для генерації іконок розширення
// Цей скрипт створює красиві SVG іконки для розширення

const fs = require('fs');
const path = require('path');

// Покращений SVG шаблон для іконки
const iconTemplate = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ee5a24;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff4757;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="tvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:0.9" />
    </linearGradient>
    
    <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#34495e;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="pipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45a049;stop-opacity:1" />
    </linearGradient>
    
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Фоновий круг з тінню -->
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.45}" fill="url(#bgGradient)" filter="url(#shadow)"/>
  
  <!-- TV корпус -->
  <g transform="translate(${size * 0.25}, ${size * 0.25}) scale(${size * 0.5 / 24})">
    <!-- TV корпус з градієнтом -->
    <rect x="2" y="6" width="20" height="14" rx="3" fill="url(#tvGradient)" stroke="#e9ecef" stroke-width="0.5"/>
    
    <!-- TV екран з градієнтом -->
    <rect x="4" y="8" width="16" height="10" fill="url(#screenGradient)" rx="1"/>
    
    <!-- TV підставка -->
    <rect x="9" y="20" width="6" height="2" fill="url(#tvGradient)" stroke="#e9ecef" stroke-width="0.3"/>
    
    <!-- PiP вікно з градієнтом -->
    <rect x="6" y="10" width="6" height="4" fill="url(#pipGradient)" rx="1" opacity="0.9"/>
    <rect x="6.5" y="10.5" width="5" height="3" fill="url(#pipGradient)" rx="0.5"/>
    
    <!-- Додаткові деталі TV -->
    <circle cx="7" cy="7" r="0.8" fill="#4CAF50" opacity="0.8"/>
    <rect x="15" y="7" width="2" height="1" fill="#4CAF50" opacity="0.6" rx="0.5"/>
  </g>
  
  <!-- Текст PiP з тінню -->
  <text x="${size * 0.5}" y="${size * 0.85}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white"
        filter="url(#shadow)">PiP</text>
  
  <!-- Додаткові декоративні елементи -->
  <circle cx="${size * 0.25}" cy="${size * 0.25}" r="${size * 0.03}" fill="white" opacity="0.3"/>
  <circle cx="${size * 0.75}" cy="${size * 0.25}" r="${size * 0.02}" fill="white" opacity="0.2"/>
  <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.02}" fill="white" opacity="0.2"/>
</svg>
`;

// Розміри іконок
const iconSizes = [16, 32, 48, 128];

// Створюємо папку icons якщо її немає
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Генеруємо іконки
iconSizes.forEach(size => {
    const svg = iconTemplate(size);
    const filename = path.join(iconsDir, `icon${size}.svg`);
    
    fs.writeFileSync(filename, svg);
    console.log(`Створено іконку: icon${size}.svg`);
});

console.log('\n✅ Всі іконки створено успішно!');
console.log('📁 Перевірте папку icons/');
console.log('\n💡 Для конвертації в PNG використовуйте онлайн інструменти або ImageMagick:');
console.log('   convert icon128.svg icon128.png');
console.log('   convert icon48.svg icon48.png');
console.log('   convert icon32.svg icon32.png');
console.log('   convert icon16.svg icon16.png');
