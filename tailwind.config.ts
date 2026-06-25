// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Deep Islamic Green
        green: {
          50: '#f0faf4',
          100: '#dcf5e7',
          200: '#bcebd1',
          300: '#8ddab1',
          400: '#57c288',
          500: '#2fa86a',
          600: '#1a8a55',
          700: '#166e46', // Primary brand green
          800: '#145939',
          900: '#124a30',
          950: '#092a1b',
        },
        // Accent — Warm Gold
        gold: {
          50: '#fdf9ec',
          100: '#fbf1cc',
          200: '#f7e295',
          300: '#f2cd5a',
          400: '#edb82e',
          500: '#c8a84b', // Primary gold
          600: '#b08534',
          700: '#8f642a',
          800: '#764f28',
          900: '#634126',
          950: '#3a2113',
        },
        // Neutrals
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
