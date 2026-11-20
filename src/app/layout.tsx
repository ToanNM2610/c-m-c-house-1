import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  Be_Vietnam_Pro,
  Plus_Jakarta_Sans,
  Inter,
  Cormorant_Garamond,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { PreOrderProvider } from '@/context/PreOrderContext';
import { NavigationDirectionProvider } from '@/context/NavigationDirectionContext';
import Navbar from '@/components/common/Navbar';
import CinematicIntro8K from '@/components/motion/CinematicIntro8K';
import LivingNatureCanvas from '@/components/motion/LivingNatureCanvas';
import GalleryLightboxModal from '@/components/modals/GalleryLightboxModal';
import QuickChatWidget from '@/components/common/QuickChatWidget';

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-cormorant',
  display: 'swap',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
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
    url: 'https://camcuhouse.vn',
    siteName: 'Cẩm Cù House',
    locale: 'vi_VN',
    type: 'website',
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`scroll-smooth ${beVietnam.variable} ${jakarta.variable} ${inter.variable} ${cormorant.variable} ${mono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink-primary selection:bg-accent-botanical selection:text-white">
        <AppProvider>
          <PreOrderProvider>
            <NavigationDirectionProvider>
              {/* 120Hz/120fps 8K Cinematic Intro Preloader Overlay (Storefront Only) */}
              <Suspense fallback={null}>
                <CinematicIntro8K />
              </Suspense>
              {/* Living Nature Ambient 120fps Canvas (Light sunlight bokeh / Dark fireflies) */}
              <LivingNatureCanvas />
              <Navbar />
              {children}
              {/* Global Interactive Modals & Quick Chat */}
              <GalleryLightboxModal />
              <QuickChatWidget />
            </NavigationDirectionProvider>
          </PreOrderProvider>
        </AppProvider>
      </body>
    </html>
  );
}
