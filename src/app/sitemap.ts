import type { MetadataRoute } from 'next';

const baseUrl = 'https://mbnpakistan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/how-it-works',
    '/for-families',
    '/for-bureaus',
    '/about',
    '/contact',
    '/submit-profile',
    '/login',
    '/register',
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }));
}
