const fs = require('fs');
const path = require('path');

// 解析 CSV 文件
function parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = [];
        let currentValue = '';
        let inQuotes = false;

        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        // 添加最后一个值
        values.push(currentValue.trim());

        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                // 移除引号
                row[header.replace(/"/g, '')] = values[index].replace(/"/g, '');
            });
            data.push(row);
        }
    }

    return data;
}

// 将数据转换为嵌套对象结构
function convertToNestedObject(data, locale) {
    const result = {};

    data.forEach(row => {
        const key = row.key;
        const value = row[locale];

        if (key && value) {
            const keys = key.split('.');
            let current = result;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
        }
    });

    return result;
}

// 主编译函数
function compileI18n() {
    const csvPath = path.join(process.cwd(), 'app/locales/translations.csv');
    const outputDir = path.join(process.cwd(), 'app/locales');

    try {
        // 读取 CSV 文件
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const data = parseCSV(csvContent);

        // 获取所有语言（排除 key 列）
        const locales = Object.keys(data[0]).filter(key => key !== 'key');

        console.log('Found locales:', locales);

        // 为每种语言生成 JSON 文件
        locales.forEach(locale => {
            const translations = convertToNestedObject(data, locale);

            // 创建语言目录
            const localeDir = path.join(outputDir, locale);
            if (!fs.existsSync(localeDir)) {
                fs.mkdirSync(localeDir, { recursive: true });
            }

            // 写入 JSON 文件
            const outputPath = path.join(localeDir, 'common.json');
            fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf8');

            console.log(`Generated ${outputPath}`);
        });

        console.log('✅ I18n compilation completed successfully!');

    } catch (error) {
        console.error('❌ Error compiling i18n files:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    compileI18n();
}

module.exports = { compileI18n };