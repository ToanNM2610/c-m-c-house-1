import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { PreOrderProvider } from '@/context/PreOrderContext';
import { NavigationDirectionProvider } from '@/context/NavigationDirectionContext';
import { getPublicIntegrations } from '@/lib/integrations';
import { getPageSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata('/', {
    metadataBase: new URL('https://camcuhouse.online'),
    title: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
    description: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Không gian suối mát rượi, 18 bàn view suối, cà phê muối Đăk Nông và thảo mộc xanh.',
    keywords: [
      'quán cà phê đẹp Đông Gia Nghĩa Lâm Đồng',
      'cà phê sinh thái bên suối Lâm Đồng',
      'quán ăn vặt gần đây',
      'Cẩm Cù House',
      'cà phê muối Đông Gia Nghĩa',
      'quán cà phê bờ suối Lâm Đồng',
    ],
    authors: [{ name: 'Cẩm Cù House' }],
    openGraph: {
      title: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
      description: 'Xanh sạch, trong lành, hòa mình với thiên nhiên bên bờ suối mát giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
      url: 'https://camcuhouse.online',
      siteName: 'Cẩm Cù House',
      locale: 'vi_VN',
      type: 'website',
    },
  });
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Cẩm Cù House',
  image: 'https://camcuhouse.vn/images/og-cover.jpg',
  telephone: ['+84382851688', '+84774659000'],
  email: 'thuynhu8788@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hẻm 437 Hùng Vương',
    addressLocality: 'Đông Gia Nghĩa',
    addressRegion: 'Lâm Đồng',
    postalCode: '64000',
    addressCountry: 'VN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 11.98634,
    longitude: 107.69421,
  },
  url: 'https://camcuhouse.vn',
  priceRange: '$',
  servesCuisine: ['Vietnamese Coffee', 'Botanical Herbal Teas', 'Fresh Tropical Smoothies', 'Healthy Juices', 'Local Snacks'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '07:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '22:00',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '8',
    bestRating: '5',
    worstRating: '1',
  },
  hasMap: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const rawHost = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const host = rawHost.split(',')[0].trim().split(':')[0].toLowerCase();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminHeader = headersList.get('x-is-admin-host') === '1';
  const isAdmin =
    host.startsWith('admin.') ||
    host === 'admin.camcuhouse.online' ||
    isAdminHeader ||
    pathname.startsWith('/admin');

  const locale = (headersList.get('x-locale') || 'vi') as 'vi' | 'en';
  const isEn = locale === 'en';

  let gscToken = '';
  if (!isAdmin) {
    try {
      const publicIntegrations = await getPublicIntegrations();
      gscToken = publicIntegrations?.searchConsoleVerification || '';
    } catch {
      gscToken = (
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
        process.env.GOOGLE_SITE_VERIFICATION ||
        process.env.SEARCH_CONSOLE_VERIFICATION ||
        ''
      ).trim();
    }
  }

  const dynamicJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Cẩm Cù House',
    alternateName: 'Cam Cu House Botanical Eco-Coffee & Streamside Sanctuary',
    description: isEn
      ? 'Streamside ecological cafe and botanical coffee sanctuary in Dong Gia Nghia, Lam Dong. Natural waterfalls, basalt wood-roasted coffee, and herbal drinks.'
      : 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Không gian suối mát rượi, 18 bàn view suối, cà phê muối Đăk Nông và thảo mộc xanh.',
    image: 'https://camcuhouse.online/uploads/gallery/fig-01.jpg',
    telephone: ['+84-382-851-688', '+84-774-659-000'],
    email: 'thuynhu8788@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hẻm 437 Hùng Vương',
      addressLocality: 'Đông Gia Nghĩa',
      addressRegion: 'Lâm Đồng',
      postalCode: '64000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.98634,
      longitude: 107.69421,
    },
    url: isEn ? 'https://camcuhouse.online/en' : 'https://camcuhouse.online',
    priceRange: '$$',
    currenciesAccepted: 'VND, USD',
    servesCuisine: ['Vietnamese Coffee', 'Botanical Herbal Teas', 'Fresh Tropical Smoothies', 'Healthy Juices', 'Local Snacks'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '22:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '8',
      bestRating: '5',
      worstRating: '1',
    },
    hasMap: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
  };

  return (
    <html
      lang={isEn ? 'en' : 'vi'}
      className="scroll-smooth font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {!isAdmin && (
          <>
            {/* Google Search Console HTML Verification Tag */}
            {gscToken && (
              <meta name="google-site-verification" content={gscToken} />
            )}
            {/* Google Tag (gtm.js) - GTM-M78P32L4 */}
            <script
              async
              src="https://www.googletagmanager.com/gtm.js?id=GTM-M78P32L4"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink-primary selection:bg-accent-botanical selection:text-white">
        <AppProvider initialLanguage={locale}>
          <LanguageProvider initialLocale={locale}>
            <PreOrderProvider>
              <NavigationDirectionProvider>
                {children}
              </NavigationDirectionProvider>
            </PreOrderProvider>
          </LanguageProvider>
        </AppProvider>
      </body>
    </html>
  );
}
