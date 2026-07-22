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
  description:
    "Pakistan's professional network for Marriage Bureau operators, Rishta Consultants, Matchmakers, individuals, and families.",
  keywords:
    'marriage bureau, rishta, Pakistan, matchmaking, nikah, shaadi, MBN Pakistan, marriage bureau network',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Marriage Bureau Network Pakistan',
    description:
      'Connect with verified marriage bureaus across Pakistan and submit your profile privately for professional matchmaking review.',
    siteName: 'MBN Pakistan',
    type: 'website',
    url: 'https://mbnpakistan.com',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'MBN Pakistan',
      },
    ],
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
