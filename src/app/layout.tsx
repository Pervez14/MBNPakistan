// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Marriage Bureau Network Pakistan',
  description: 'Pakistan\'s largest B2B network for Marriage Bureau operators, Rishta Consultants, and Matchmakers.',
  keywords: 'marriage bureau, rishta, Pakistan, matchmaking, nikah, shaadi',
  openGraph: {
    title: 'Marriage Bureau Network Pakistan',
    description: 'Connect with 10,000+ verified marriage bureaus across Pakistan.',
    siteName: 'MBN Pakistan',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased">
  <Providers>
    {children}
  </Providers>
  <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#2fa86a', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
