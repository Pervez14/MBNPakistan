import type { MetadataRoute } from 'next';

const baseUrl = 'https://mbnpakistan.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/how-it-works',
          '/for-families',
          '/for-bureaus',
          '/about',
          '/contact',
          '/submit-profile',
        ],
        disallow: [
          '/dashboard',
          '/profiles',
          '/search',
          '/settings',
          '/admin',
          '/super-admin',
          '/assigned-profiles',
          '/login',
          '/register',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
