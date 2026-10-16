import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { fraunces, beVietnamPro } from "./fonts";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TransitionProvider } from "@/context/TransitionContext";
import PublicShell from "@/components/PublicShell";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Script from "next/script";
import { getPublicIntegrations } from "@/lib/integrations";
import "lenis/dist/lenis.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2EDE4" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0E0C" },
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
    <html lang="vi" suppressHydrationWarning className={`${bricolage.variable} ${fraunces.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable} font-sans`}>
      <head>
        {integrations.searchConsoleVerification && (
          <meta
            name="google-site-verification"
            content={integrations.searchConsoleVerification}
          />
        )}
        {integrations.ga4MeasurementId && (
          <GoogleAnalytics gaId={integrations.ga4MeasurementId} />
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
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                  if (typeof MutationObserver !== 'undefined') {
                    var observer = new MutationObserver(function(mutations) {
                      for (var i = 0; i < mutations.length; i++) {
                        if (mutations[i].attributeName === 'data-theme') {
                          var dt = document.documentElement.getAttribute('data-theme');
                          if (dt === 'light') {
                            document.documentElement.classList.remove('dark');
                          } else if (dt === 'dark') {
                            document.documentElement.classList.add('dark');
                          }
                        }
                      }
                    });
                    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
                  }
                  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (!prefersReduced) {
                    document.documentElement.classList.add('intro-lock');
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
      <body suppressHydrationWarning className="bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen pb-16 lg:pb-0 selection:bg-[var(--basalt)] selection:text-white">
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
