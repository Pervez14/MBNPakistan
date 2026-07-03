'use client';

import { useEffect, useState } from 'react';

export type Language = 'en' | 'ur';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('mbn-language');

      if (savedLanguage === 'en' || savedLanguage === 'ur') {
        setLanguageState(savedLanguage);
      }
    } catch {
      setLanguageState('en');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mbn-language', language);
      document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
      document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    } catch {
      // Ignore browser storage errors
    }
  }, [language]);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
  };

  return {
    language,
    setLanguage,
    isUrdu: language === 'ur',
  };
}
