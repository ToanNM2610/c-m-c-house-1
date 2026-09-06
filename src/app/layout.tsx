import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeEffects from "@/components/layout/ThemeEffects";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/ui/CustomCursor";
import BodyCursorController from "@/components/layout/BodyCursorController";
import SecurityShield from "@/components/ui/SecurityShield";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from '@vercel/analytics/next';

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://camcuhouse.vercel.app'),
  title: {
    default: "Cẩm Cù House | Cinematic Eco-coffee Sanctuary Đắk Nông",
    template: "%s | Cẩm Cù House",
  },
  description: "Không gian sinh thái mộc mạc bên bờ suối Gia Nghĩa, Đắk Nông. Thưởng thức hương vị cà phê rang mộc nguyên bản và nông sản Tây Nguyên.",
  openGraph: {
    title: "Cẩm Cù House | Cinematic Eco-coffee Sanctuary Đắk Nông",
    description: "Không gian sinh thái mộc mạc bên bờ suối Gia Nghĩa, Đắk Nông. Thưởng thức hương vị cà phê rang mộc nguyên bản và nông sản Tây Nguyên.",
    url: 'https://camcuhouse.vercel.app',
    siteName: 'Cẩm Cù House',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cẩm Cù House | Eco-coffee Sanctuary",
    description: "Không gian sinh thái mộc mạc bên bờ suối Gia Nghĩa, Đắk Nông.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Cẩm Cù House",
  "image": "https://camcuhouse.vercel.app/images/hero.jpg",
  "@id": "https://camcuhouse.vercel.app",
  "url": "https://camcuhouse.vercel.app",
  "telephone": "0382851688",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hẻm 437 Hùng Vương",
    "addressLocality": "Phường Nghĩa Trung, TP Gia Nghĩa",
    "addressRegion": "Đắk Nông",
    "postalCode": "640000",
    "addressCountry": "VN"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "07:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday", "Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "22:00"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${cormorant.variable} ${plusJakarta.variable} ${playfair.variable} antialiased font-sans bg-transparent text-[#F4EFEA] select-none`}>
        <SecurityShield>
          <LanguageProvider>
            <BodyCursorController />
            <CustomCursor />
            <IntroLoader />
            <SmoothScroll>
              <ThemeEffects />
              <Header />
              <main className="w-full min-h-screen">
                {children}
              </main>
              <Footer />
            </SmoothScroll>
          </LanguageProvider>
        </SecurityShield>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-F1E55KL26P" />
    </html>
  );
}
