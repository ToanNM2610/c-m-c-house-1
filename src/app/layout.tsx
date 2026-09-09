import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SecurityShield from "@/components/ui/SecurityShield";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";
import UltraIntro from "@/components/intro/UltraIntro";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://camcuhouse.vercel.app"),
  title: {
    default: "Cẩm Cù House | Cà Phê Ven Suối & Trải Nghiệm Đắk Nông",
    template: "%s | Cẩm Cù House",
  },
  description:
    "Cẩm Cù House - Hòa mình vào thiên nhiên bên bờ suối đá Gia Nghĩa, Đắk Nông. Thưởng thức hương vị cà phê rang củi mộc nguyên bản và nông sản Tây Nguyên tươi lành.",
  openGraph: {
    title: "Cẩm Cù House | Cà Phê Ven Suối & Trải Nghiệm Đắk Nông",
    description:
      "Cẩm Cù House - Hòa mình vào thiên nhiên bên bờ suối đá Gia Nghĩa, Đắk Nông. Thưởng thức hương vị cà phê rang củi mộc nguyên bản và nông sản Tây Nguyên tươi lành.",
    url: "https://camcuhouse.vercel.app",
    siteName: "Cẩm Cù House",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cẩm Cù House | Cà Phê Ven Suối & Trải Nghiệm Đắk Nông",
    description: "Cẩm Cù House - Hòa mình vào thiên nhiên bên bờ suối đá Gia Nghĩa, Đắk Nông.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Cẩm Cù House coffee & Food",
  "image": "https://camcuhouse.vercel.app/uploads/gallery/1788250253554-875120458.jpg",
  "@id": "https://camcuhouse.vercel.app",
  "url": "https://camcuhouse.vercel.app",
  "telephone": "0382851688",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hẻm 437 Hùng Vương",
    "addressLocality": "Phường Nghĩa Trung, TP Gia Nghĩa",
    "addressRegion": "Đắk Nông",
    "postalCode": "640000",
    "addressCountry": "VN",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="scroll-smooth max-w-[100vw] w-full overflow-x-hidden touch-pan-y"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${beVietnamPro.variable} antialiased font-sans bg-[#0C0D0B] text-[#FDFBF7] selection:bg-[#C88A4B] selection:text-[#0C0D0B] max-w-[100vw] w-full overflow-x-hidden`}
      >
        <UltraIntro />
        
        {/* Global Canvas Singleton - Vĩnh cửu, không re-mount khi chuyển trang */}
        <GlobalCanvas />

        <SecurityShield>
          <LanguageProvider>
            <SmoothScroll>
              <Header />
              <div className="w-full max-w-[100vw] overflow-x-hidden min-h-screen relative z-10">
                {children}
              </div>
              <Footer />
            </SmoothScroll>
          </LanguageProvider>
        </SecurityShield>
        <Analytics />
        <GoogleAnalytics gaId="G-F1E55KL26P" />
      </body>
    </html>
  );
}
