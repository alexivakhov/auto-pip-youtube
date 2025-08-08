// Скрипт для конвертації SVG іконок в PNG
// Використовує Canvas API для рендерингу SVG в PNG

const fs = require('fs');
const path = require('path');

// Функція для конвертації SVG в PNG через Canvas
async function convertSvgToPng(svgPath, pngPath, size) {
    try {
        // Читаємо SVG файл
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Створюємо Canvas для рендерингу
        const { createCanvas, loadImage } = require('canvas');
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Створюємо Data URL з SVG
        const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');
        
        // Завантажуємо SVG як зображення
        const img = await loadImage(svgDataUrl);
        
        // Рендеримо на Canvas
        ctx.drawImage(img, 0, 0, size, size);
        
        // Зберігаємо як PNG
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(pngPath, buffer);
        
        console.log(`✅ Конвертовано: ${path.basename(svgPath)} → ${path.basename(pngPath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Помилка конвертації ${svgPath}:`, error.message);
        return false;
    }
}

// Альтернативний метод без зовнішніх залежностей
function createSimplePngIcons() {
    const sizes = [16, 32, 48, 128];
    const iconsDir = path.join(__dirname, 'icons');
    
    console.log('🎨 Створюю прості PNG іконки...');
    
    sizes.forEach(size => {
        const pngPath = path.join(iconsDir, `icon${size}.png`);
        
        // Створюємо простий PNG з Canvas (якщо доступний)
        try {
            const { createCanvas } = require('canvas');
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');
            
            // Створюємо градієнтний фон
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#ff6b6b');
            gradient.addColorStop(0.5, '#ee5a24');
            gradient.addColorStop(1, '#ff4757');
            
            // Малюємо фоновий круг
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(size/2, size/2, size*0.45, 0, 2*Math.PI);
            ctx.fill();
            
            // Малюємо TV іконку
            const tvSize = size * 0.5;
            const tvX = (size - tvSize) / 2;
            const tvY = (size - tvSize) / 2;
            
            // TV корпус
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(tvX + tvSize*0.1, tvY + tvSize*0.25, tvSize*0.8, tvSize*0.6);
            
            // TV екран
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(tvX + tvSize*0.2, tvY + tvSize*0.35, tvSize*0.6, tvSize*0.4);
            
            // PiP вікно
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(tvX + tvSize*0.3, tvY + tvSize*0.4, tvSize*0.25, tvSize*0.2);
            
            // Текст PiP
            ctx.fillStyle = 'white';
            ctx.font = `bold ${size*0.12}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('PiP', size/2, size*0.85);
            
            // Зберігаємо PNG
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(pngPath, buffer);
            
            console.log(`✅ Створено: icon${size}.png`);
        } catch (error) {
            console.log(`⚠️ Canvas недоступний, створюю простий PNG для ${size}x${size}...`);
            
            // Створюємо мінімальний PNG без Canvas
            createMinimalPng(size, pngPath);
        }
    });
}

// Створення мінімального PNG без Canvas
function createMinimalPng(size, pngPath) {
    // Створюємо простий PNG з базовою структурою
    const width = size;
    const height = size;
    
    // PNG заголовок та дані
    const pngData = createBasicPngData(width, height);
    
    fs.writeFileSync(pngPath, Buffer.from(pngData));
    console.log(`✅ Створено простий PNG: ${path.basename(pngPath)}`);
}

// Створення базових PNG даних
function createBasicPngData(width, height) {
    // Це дуже спрощена версія PNG для демонстрації
    // В реальності краще використовувати бібліотеки як sharp або canvas
    
    // Створюємо простий градієнтний PNG
    const data = [];
    
    // PNG сигнатура
    data.push(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
    
    // IHDR chunk
    const ihdrData = [
        0x00, 0x00, 0x00, 0x0D, // length
        0x49, 0x48, 0x44, 0x52, // "IHDR"
        (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
        (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
        0x08, // bit depth
        0x02, // color type (RGB)
        0x00, // compression
        0x00, // filter
        0x00  // interlace
    ];
    
    // Додаємо IHDR
    data.push(...ihdrData);
    
    // Простий градієнтний IDAT chunk (спрощено)
    const idatData = createGradientData(width, height);
    data.push(...idatData);
    
    // IEND chunk
    data.push(0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82);
    
    return data;
}

// Створення градієнтних даних
function createGradientData(width, height) {
    const data = [];
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Градієнт від червоного до оранжевого
            const r = Math.floor(255 * (1 - x/width));
            const g = Math.floor(107 * (1 - y/height));
            const b = Math.floor(107 * (1 - x/width));
            
            data.push(r, g, b);
        }
    }
    
    return data;
}

// Основна функція
async function main() {
    const iconsDir = path.join(__dirname, 'icons');
    
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir);
    }
    
    console.log('🎨 Конвертую SVG іконки в PNG...');
    
    const sizes = [16, 32, 48, 128];
    let successCount = 0;
    
    for (const size of sizes) {
        const svgPath = path.join(iconsDir, `icon${size}.svg`);
        const pngPath = path.join(iconsDir, `icon${size}.png`);
        
        if (fs.existsSync(svgPath)) {
            const success = await convertSvgToPng(svgPath, pngPath, size);
            if (success) successCount++;
        } else {
            console.log(`⚠️ SVG файл не знайдено: ${svgPath}`);
        }
    }
    
    if (successCount === 0) {
        console.log('🔄 Спробую створити прості PNG іконки...');
        createSimplePngIcons();
    }
    
    console.log('\n✅ Конвертація завершена!');
    console.log('📁 Перевірте папку icons/ для PNG файлів');
}

// Запускаємо конвертацію
main().catch(console.error);
