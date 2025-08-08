// Скрипт для очищення та підготовки проекту до публікації

const fs = require('fs');
const path = require('path');

console.log('🧹 Очищення проекту...');

// Видаляємо тимчасові файли
const filesToRemove = [
    'generate-icons.js',
    'convert-icons.js',
    'cleanup.js'
];

filesToRemove.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Видалено: ${file}`);
    }
});

// Видаляємо SVG іконки (залишаємо тільки PNG)
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
    const files = fs.readdirSync(iconsDir);
    files.forEach(file => {
        if (file.endsWith('.svg')) {
            const filePath = path.join(iconsDir, file);
            fs.unlinkSync(filePath);
            console.log(`🗑️ Видалено SVG: ${file}`);
        }
    });
}

// Створюємо .gitignore файл
const gitignoreContent = `
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Тимчасові файли
*.tmp
*.temp

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Розширення
*.crx
*.pem
`;

fs.writeFileSync('.gitignore', gitignoreContent.trim());
console.log('📝 Створено .gitignore');

// Створюємо package.json для проекту
const packageJson = {
    "name": "auto-pip-youtube",
    "version": "1.0.0",
    "description": "Автоматичний Picture-in-Picture для YouTube відео",
    "main": "background.js",
    "scripts": {
        "build": "node generate-icons.js && node convert-icons.js",
        "clean": "node cleanup.js"
    },
    "keywords": [
        "chrome-extension",
        "youtube",
        "picture-in-picture",
        "pip",
        "browser-extension"
    ],
    "author": "Auto PiP Team",
    "license": "MIT",
    "devDependencies": {
        "canvas": "^2.11.2"
    }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('📦 Створено package.json');

console.log('\n✅ Очищення завершено!');
console.log('📁 Проект готовий до публікації');
console.log('\n📋 Що було зроблено:');
console.log('✅ Видалено тимчасові файли');
console.log('✅ Видалено SVG іконки (залишили PNG)');
console.log('✅ Створено .gitignore');
console.log('✅ Створено package.json');
console.log('\n🎉 Проект готовий до встановлення в браузері!');
