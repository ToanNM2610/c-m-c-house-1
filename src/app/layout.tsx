import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cẩm Cù House coffee & Food | Chốn Dừng Chân Bên Suối Gia Nghĩa",
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
    description: "Chốn dừng chân mộc mạc bên bờ suối đất thiên nhiên.",
    type: "website",
    locale: "vi_VN",
  },
};

import IntroSplashScreen from "@/components/IntroSplashScreen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${beVietnam.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookieMatch = document.cookie.match(/(?:^|;\\s*)camcu_theme=([^;]*)/);
                  var storedTheme = localStorage.getItem('camcu_theme');
                  var theme = (cookieMatch ? cookieMatch[1] : null) || storedTheme;
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#F9F8F3] text-[#2D4233] dark:bg-[#121A15] dark:text-[#F5F4EE] antialiased min-h-screen selection:bg-[#4A6B53] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <IntroSplashScreen />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
