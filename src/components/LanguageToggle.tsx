'use client';

import type { Language } from '@/lib/useLanguage';

type LanguageToggleProps = {
  language: Language;
  setLanguage: (value: Language) => void;
};

export default function LanguageToggle({
  language,
  setLanguage,
}: LanguageToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
          language === 'en'
            ? 'bg-green-700 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage('ur')}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
          language === 'ur'
            ? 'bg-green-700 text-white'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        اردو
      </button>
    </div>
  );
}
