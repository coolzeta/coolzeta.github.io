import { cache } from 'react';

type Translations = {
    [key: string]: any;
};

// 缓存翻译数据以避免重复加载
const getTranslations = cache(async (locale: string): Promise<Translations> => {
    try {
        const translations = await import(`../locales/${locale}/common.json`);
        return translations.default || translations;
    } catch (error) {
        console.error(`Failed to load translations for locale: ${locale}`, error);
        // 回退到英语
        if (locale !== 'en') {
            return getTranslations('en');
        }
        return {};
    }
});

// 根据 key 路径获取翻译文本
export function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// 主要的翻译函数 - 仅用于服务器端组件
export async function t(key: string, locale: string = 'en'): Promise<string> {
    const translations = await getTranslations(locale);
    const value = getNestedValue(translations, key);

    if (value !== null && value !== undefined) {
        return value;
    }

    // 如果在当前语言中找不到，尝试英语
    if (locale !== 'en') {
        const enTranslations = await getTranslations('en');
        const enValue = getNestedValue(enTranslations, key);
        if (enValue !== null && enValue !== undefined) {
            return enValue;
        }
    }

    // 如果都找不到，返回 key
    console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
    return key;
}

// 导出 getTranslations 以供 LocaleProvider 使用
export { getTranslations };