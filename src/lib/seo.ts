import { Metadata } from 'next';
import { prisma } from './prisma';

export async function getPageSeoMetadata(
  route: string,
  defaultMeta: Partial<Metadata> = {}
): Promise<Metadata> {
  const defaultTitle = (defaultMeta.title as string) || 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng';
  const defaultDesc =
    (defaultMeta.description as string) ||
    'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Không gian suối mát rượi, 18 bàn view suối, cà phê muối Đăk Nông và thảo mộc xanh.';

  try {
    const seo = await prisma.pageSeo.findUnique({
      where: { route },
    });

    if (seo) {
      const canonical = seo.canonicalUrl || `https://camcuhouse.online${route === '/' ? '' : route}`;
      return {
        ...defaultMeta,
        title: seo.metaTitleVi || defaultTitle,
        description: seo.metaDescVi || defaultDesc,
        alternates: {
          canonical,
        },
        openGraph: {
          title: seo.metaTitleVi || defaultTitle,
          description: seo.metaDescVi || defaultDesc,
          url: canonical,
          siteName: 'Cẩm Cù House',
          locale: 'vi_VN',
          type: 'website',
          images: seo.ogImage ? [{ url: seo.ogImage }] : [{ url: 'https://camcuhouse.online/uploads/gallery/fig-01.jpg' }],
        },
        robots: seo.noIndex
          ? { index: false, follow: false }
          : { index: true, follow: true },
      };
    }
  } catch (err) {
    console.warn(`[SEO] Live PageSeo lookup fallback for ${route}:`, err);
  }

  const fallbackCanonical = `https://camcuhouse.online${route === '/' ? '' : route}`;
  return {
    ...defaultMeta,
    title: defaultTitle,
    description: defaultDesc,
    alternates: {
      canonical: fallbackCanonical,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: fallbackCanonical,
      siteName: 'Cẩm Cù House',
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: 'https://camcuhouse.online/uploads/gallery/fig-01.jpg' }],
    },
    robots: { index: true, follow: true },
  };
}
