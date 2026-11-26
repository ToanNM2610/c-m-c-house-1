import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://camcuhouse.online';

  const routePairs = [
    { vi: '', en: '', priority: 1.0, freq: 'daily' as const },
    { vi: '/gioi-thieu', en: '/about', priority: 0.9, freq: 'weekly' as const },
    { vi: '/khong-gian', en: '/space', priority: 0.9, freq: 'weekly' as const },
    { vi: '/thuc-don', en: '/menu', priority: 0.9, freq: 'daily' as const },
    { vi: '/khach-hang', en: '/reviews', priority: 0.8, freq: 'weekly' as const },
    { vi: '/su-kien', en: '/events', priority: 0.8, freq: 'daily' as const },
    { vi: '/tin-tuc', en: '/news', priority: 0.8, freq: 'daily' as const },
    { vi: '/lien-he', en: '/contact', priority: 0.8, freq: 'monthly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const pair of routePairs) {
    const viUrl = `${baseUrl}${pair.vi || '/'}`;
    const enUrl = `${baseUrl}/en${pair.en}`;

    // VI entry
    sitemapEntries.push({
      url: viUrl,
      lastModified: new Date(),
      changeFrequency: pair.freq,
      priority: pair.priority,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });

    // EN entry
    sitemapEntries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: pair.freq,
      priority: pair.priority,
      alternates: {
        languages: {
          vi: viUrl,
          en: enUrl,
          'x-default': viUrl,
        },
      },
    });
  }

  // Dynamic CMS-managed Legal Pages & Blog Posts
  try {
    const [pages, legalPages, posts] = await Promise.all([
      prisma.staticPage.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }).catch(() => []),
      prisma.legalPage.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }).catch(() => []),
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }).catch(() => []),
    ]);

    for (const lp of legalPages) {
      const viUrl = `${baseUrl}/phap-ly/${lp.slug}`;
      const enUrl = `${baseUrl}/en/phap-ly/${lp.slug}`;
      sitemapEntries.push({
        url: viUrl,
        lastModified: lp.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: { vi: viUrl, en: enUrl, 'x-default': viUrl } },
      });
    }

    for (const post of posts) {
      const viUrl = `${baseUrl}/tin-tuc/${post.slug}`;
      const enUrl = `${baseUrl}/en/news/${post.slug}`;
      sitemapEntries.push({
        url: viUrl,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { vi: viUrl, en: enUrl, 'x-default': viUrl } },
      });
      sitemapEntries.push({
        url: enUrl,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { vi: viUrl, en: enUrl, 'x-default': viUrl } },
      });
    }

    for (const p of pages) {
      const viUrl = `${baseUrl}/p/${p.slug}`;
      const enUrl = `${baseUrl}/en/p/${p.slug}`;

      sitemapEntries.push({
        url: viUrl,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            vi: viUrl,
            en: enUrl,
            'x-default': viUrl,
          },
        },
      });

      sitemapEntries.push({
        url: enUrl,
        lastModified: p.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            vi: viUrl,
            en: enUrl,
            'x-default': viUrl,
          },
        },
      });
    }
  } catch {
    console.error('[Sitemap] Unable to load CMS pages; returning static routes.');
  }

  return sitemapEntries;
}
