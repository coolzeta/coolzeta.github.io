'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getTranslations, getNestedValue } from '@/app/utils/i18n';

type LocaleContextType = {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
    loading: boolean;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type Translations = {
    [key: string]: any;
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [translations, setTranslations] = useState<Translations>({});
    const [loading, setLoading] = useState(true);

    const getLocaleFromPath = () => {
        const match = pathname.match(/^\/(en|zh)/);
        return match ? match[1] : 'en';
    };

    const [locale, setLocaleState] = useState(getLocaleFromPath());

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                setLoading(true);
                const trans = await getTranslations(locale);
                setTranslations(trans);
            } catch (error) {
                console.error('Error loading translations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTranslations();
    }, [locale]);

    useEffect(() => {
        const newLocale = getLocaleFromPath();
        if (newLocale !== locale) {
            setLocaleState(newLocale);
        }
    }, [pathname]);

    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);

        const currentPath = pathname;
        let newPath;

        if (currentPath === '/') {
            newPath = `/${newLocale}/apps/blog`;
        } else if (currentPath.startsWith('/en') || currentPath.startsWith('/zh')) {
            newPath = currentPath.replace(/^\/(en|zh)/, `/${newLocale}`);
        } else {
            newPath = `/${newLocale}/apps/blog`;
        }

        router.push(newPath);
    };

    const t = (key: string): string => {
        if (loading) {
            return key;
        }

        const value = getNestedValue(translations, key);

        if (value !== null && value !== undefined) {
            return value;
        }

        console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
        return key;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t, loading }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}