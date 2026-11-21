import { Metadata } from 'next';
import { headers } from 'next/headers';
import { prisma } from './prisma';

const VI_TO_EN_ROUTE_MAP: Record<string, string> = {
  '/': '',
  '/gioi-thieu': '/about',
  '/khong-gian': '/space',
  '/thuc-don': '/menu',
  '/khach-hang': '/reviews',
  '/tin-tuc': '/news',
  '/su-kien': '/events',
  '/lien-he': '/contact',
};

const EN_DEFAULTS: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'Cẩm Cù House — Botanical Eco-Coffee & Streamside Sanctuary Gia Nghia',
    desc: 'Streamside ecological cafe and botanical coffee sanctuary in Dong Gia Nghia, Lam Dong. Natural waterfalls, basalt wood-roasted coffee, and herbal drinks.',
  },
  '/gioi-thieu': {
    title: 'About Us — Cẩm Cù House | Journey & Team',
    desc: 'Discover our streamside heritage, eco-botanical philosophy, and dedicated team at Cẩm Cù House in Dong Gia Nghia.',
  },
  '/khong-gian': {
    title: 'Streamside Sanctuary — Cẩm Cù House | 30 Spatial Plates',
    desc: 'Explore 30 serene spatial plates alongside running mountain streams, lush rainforest canopies, and basalt rock terraces.',
  },
  '/thuc-don': {
    title: 'Botanical Menu — Cẩm Cù House | Wood-Roasted Coffee & Herbal Drinks',
    desc: 'Crafted botanical herbal teas, authentic wood-roasted Dak Nong basalt coffee, fresh mountain fruit smoothies, and wholesome snacks.',
  },
  '/khach-hang': {
    title: 'Guest Stories & Reviews — Cẩm Cù House',
    desc: 'Verified guest feedback and heartfelt memories by the stream at Cẩm Cù House.',
  },
  '/tin-tuc': {
    title: 'News & Community Stories — Cẩm Cù House',
    desc: 'The latest stories, botanical updates, and acoustic weekend rhythms at Cẩm Cù House.',
  },
  '/su-kien': {
    title: 'Events & FAQ — Cẩm Cù House',
    desc: 'Upcoming acoustic music nights, botanical workshops, and frequently asked visitor questions.',
  },
  '/lien-he': {
    title: 'Contact & Directions — Cẩm Cù House | Alley 437 Hung Vuong',
    desc: 'Visit Cẩm Cù House at Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong. Direct hotlines and Google Maps directions.',
  },
};

export async function getPageSeoMetadata(
  route: string,
  defaultMeta: Partial<Metadata> = {},
  explicitLocale?: 'vi' | 'en'
): Promise<Metadata> {
  let locale = explicitLocale;
  if (!locale) {
    try {
      const headersList = headers();
      locale = (headersList.get('x-locale') || 'vi') as 'vi' | 'en';
    } catch {
      locale = 'vi';
    }
  }
  const isEn = locale === 'en';

  const defaultViTitle =
    (defaultMeta.title as string) ||
    'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng';
  const defaultViDesc =
    (defaultMeta.description as string) ||
    'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Không gian suối mát rượi, 18 bàn view suối, cà phê muối Đăk Nông và thảo mộc xanh.';

  const defaultTitle = isEn
    ? EN_DEFAULTS[route]?.title || (defaultMeta.title as string) || defaultViTitle
    : defaultViTitle;
  const defaultDesc = isEn
    ? EN_DEFAULTS[route]?.desc || (defaultMeta.description as string) || defaultViDesc
    : defaultViDesc;

  // Compute canonical and language alternate URLs
  const viPath = route === '/' ? '' : route;
  const enSubpath = VI_TO_EN_ROUTE_MAP[route] !== undefined ? VI_TO_EN_ROUTE_MAP[route] : viPath;
  const viCanonical = `https://camcuhouse.online${viPath || '/'}`;
  const enCanonical = `https://camcuhouse.online/en${enSubpath}`;
  const currentCanonical = isEn ? enCanonical : viCanonical;

  try {
    const seo = await prisma.pageSeo.findUnique({
      where: { route },
    });

    if (seo) {
      const resolvedTitle = isEn
        ? seo.metaTitleEn || seo.metaTitleVi || defaultTitle
        : seo.metaTitleVi || defaultTitle;
      const resolvedDesc = isEn
        ? seo.metaDescEn || seo.metaDescVi || defaultDesc
        : seo.metaDescVi || defaultDesc;

      return {
        ...defaultMeta,
        title: resolvedTitle,
        description: resolvedDesc,
        alternates: {
          canonical: currentCanonical,
          languages: {
            'vi-VN': viCanonical,
            'en-US': enCanonical,
            'x-default': viCanonical,
          },
        },
        openGraph: {
          title: resolvedTitle,
          description: resolvedDesc,
          url: currentCanonical,
          siteName: 'Cẩm Cù House',
          locale: isEn ? 'en_US' : 'vi_VN',
          type: 'website',
          images: seo.ogImage
            ? [{ url: seo.ogImage }]
            : [{ url: 'https://camcuhouse.online/uploads/gallery/fig-01.jpg' }],
        },
        robots: seo.noIndex
          ? { index: false, follow: false }
          : { index: true, follow: true },
      };
    }
  } catch (err) {
    console.warn(`[SEO] Live PageSeo lookup fallback for ${route}:`, err);
  }

  return {
    ...defaultMeta,
    title: defaultTitle,
    description: defaultDesc,
    alternates: {
      canonical: currentCanonical,
      languages: {
        'vi-VN': viCanonical,
        'en-US': enCanonical,
        'x-default': viCanonical,
      },
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: currentCanonical,
      siteName: 'Cẩm Cù House',
      locale: isEn ? 'en_US' : 'vi_VN',
      type: 'website',
      images: [{ url: 'https://camcuhouse.online/uploads/gallery/fig-01.jpg' }],
    },
    robots: { index: true, follow: true },
  };
}
