import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TransitionProvider } from "@/context/TransitionContext";
import PublicShell from "@/components/PublicShell";
import Script from "next/script";
import { getPublicIntegrations } from "@/lib/integrations";
import "lenis/dist/lenis.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6EFE2" },
    { media: "(prefers-color-scheme: dark)", color: "#14110E" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://camcuhouse.online"),
  title: {
    default: "Cẩm Cù House coffee & Food | Chốn Dừng Chân Bên Suối Gia Nghĩa",
    template: "%s | Cẩm Cù House",
  },
  description: "Khu nghỉ dưỡng ẩm thực & cà phê sinh thái bên bờ suối mát lạnh miền cao nguyên Đắk Nông. Thưởng thức cà phê Robusta rang củi mộc và thực đơn 50+ món đặc sản bản địa.",
  keywords: [
    "Cẩm Cù House",
    "cà phê Gia Nghĩa",
    "quán cà phê bờ suối Đắk Nông",
    "cà phê muối Đắk Nông",
    "du lịch Gia Nghĩa"
  ],
  openGraph: {
    title: "Cẩm Cù House coffee & Food • Gia Nghĩa Đắk Nông",
    description: "Chốn dừng chân mộc mạc bên bờ suối thiên nhiên.",
    url: "https://camcuhouse.online",
    siteName: "Cẩm Cù House",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Cẩm Cù House coffee & Food",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cẩm Cù House coffee & Food • Gia Nghĩa Đắk Nông",
    description: "Chốn dừng chân mộc mạc bên bờ suối thiên nhiên.",
    images: ["/images/og-home.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const integrations = await getPublicIntegrations();

  return (
    <html lang="vi" suppressHydrationWarning className={`${fraunces.variable} ${beVietnamPro.variable} ${ibmPlexMono.variable} font-sans`}>
      <head>
        {integrations.searchConsoleVerification && (
          <meta
            name="google-site-verification"
            content={integrations.searchConsoleVerification}
          />
        )}
        {integrations.ga4MeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.ga4MeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${integrations.ga4MeasurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookieMatch = document.cookie.match(/(?:^|;\\s*)camcu_theme=([^;]*)/);
                  var storedTheme = localStorage.getItem('camcu_theme');
                  var theme = (cookieMatch ? cookieMatch[1] : null) || storedTheme;
                  if (theme === 'dark' || (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var seenIntro = sessionStorage.getItem('cc_intro') === '1';
                  var params = new URLSearchParams(location.search);
                  var hasForce = params.has('intro') || params.has('replay');
                  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if ((!seenIntro || hasForce) && !prefersReduced) {
                    document.documentElement.classList.add('intro-lock');
                  } else {
                    document.documentElement.classList.add('intro-seen');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CafeOrCoffeeShop",
              "name": "Cẩm Cù House",
              "image": "https://camcuhouse.online/images/og-home.jpg",
              "@id": "https://camcuhouse.online/#cafe",
              "url": "https://camcuhouse.online",
              "telephone": "+84382851688",
              "priceRange": "25.000 - 55.000 VNĐ",
              "servesCuisine": "Vietnamese Coffee, Breakfast & Local Snacks",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hẻm 437 Hùng Vương",
                "addressLocality": "Phường Nghĩa Trung, TP. Gia Nghĩa",
                "addressRegion": "Đắk Nông",
                "postalCode": "64000",
                "addressCountry": "VN",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 11.99,
                "longitude": 107.69,
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
                  "opens": "07:00",
                  "closes": "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Friday", "Saturday", "Sunday"],
                  "opens": "07:00",
                  "closes": "22:00",
                },
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "6",
              },
              "hasMenu": "https://camcuhouse.online/menu",
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen pb-16 lg:pb-0 selection:bg-[var(--basalt)] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <TransitionProvider>
              <PublicShell>{children}</PublicShell>
            </TransitionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
