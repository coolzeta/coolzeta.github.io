const fs = require('fs');
const path = require('path');

// 递归获取所有 tsx 文件
function getAllTsxFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllTsxFiles(filePath, arrayOfFiles);
        } else if (path.extname(file) === '.tsx' && file.includes('page.tsx')) {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

// 从文件内容中提取元信息
function extractMetaInfo(fileContent) {
    const metaRegex = /\/\*\s*meta\s*{([^}]*)}\s*\*\//;
    const match = fileContent.match(metaRegex);
    
    if (match) {
        try {
            const metaString = `{${match[1]}}`;
            const meta = JSON.parse(metaString);
            return meta;
        } catch (error) {
            console.error('Error parsing meta info:', error);
            return null;
        }
    }
    return null;
}

// 主函数
function collectMetaInfo() {
    const blogDir = path.join(process.cwd(), 'app/apps/blog/(blogs)'); // 假设博客文件在 app/blog 目录下
    const outputPath = path.join(process.cwd(), 'app/apps/blog/metainfos.json');

    // 获取所有 tsx 文件
    const files = getAllTsxFiles(blogDir);
    console.log(files);
    // 收集元信息
    const metaInfos = {};
    
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        console.log(content);
        const meta = extractMetaInfo(content);
        console.log(meta);
        if (meta) {
            metaInfos[meta.slug] = {
                ...meta,
            };
        }
    });
    
    // 写入 JSON 文件
    fs.writeFileSync(outputPath, JSON.stringify(metaInfos, null, 2));
    console.log('Meta information has been collected and saved to metainfos.json');
}

// 执行收集
collectMetaInfo(); 