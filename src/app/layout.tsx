// src/app/layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
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

const siteUrl = 'https://www.mbnpakistan.com';
const siteName = 'Marriage Bureau Network - MBN Pakistan';
const siteDescription =
  'MBN Pakistan connects families with professional marriage bureaus for private profile submission, secure matchmaking coordination, and responsible rishta search across Pakistan.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'marriage bureau Pakistan',
    'rishta Pakistan',
    'matrimonial services Pakistan',
    'professional marriage bureaus',
    'private matrimonial profile',
    'matchmaking Pakistan',
    'MBN Pakistan',
    'Marriage Bureau Network',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'Matrimonial Services',
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
    title: siteName,
    description: siteDescription,
    siteName,
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    images: [
      {
        url: '/mbn-family-hero.png',
        width: 1200,
        height: 630,
        alt: 'Marriage Bureau Network - MBN Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/mbn-family-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  alternateName: ['MBN Pakistan', 'Marriage Bureau Network Pakistan'],
  description: siteDescription,
  inLanguage: ['en-PK', 'ur-PK'],
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  alternateName: 'MBN Pakistan',
  url: siteUrl,
  logo: `${siteUrl}/mbn-logo.png`,
  image: `${siteUrl}/mbn-family-hero.png`,
  description: siteDescription,
  telephone: '+92-303-6684534',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Script
          id="mbn-website-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <Script
          id="mbn-organization-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xr4k78z13b");
            `,
          }}
        />

        <Providers>{children}</Providers>

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
              iconTheme: {
                primary: '#2fa86a',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
