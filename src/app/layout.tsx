import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Quicksand } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TransitionProvider } from "@/context/TransitionContext";
import SmoothScroll from "@/components/motion/SmoothScroll";
import MobileBottomBar from "@/components/MobileBottomBar";
import Navbar from "@/components/Navbar";
import CamcuIntro from "@/components/CamcuIntro";
import "lenis/dist/lenis.css";

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

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-quicksand",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${playfair.variable} ${beVietnam.variable} ${quicksand.variable}`}>
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
                  var seenIntro = sessionStorage.getItem('cc_intro') === '1';
                  var params = new URLSearchParams(location.search);
                  var hasForce = params.has('intro') || params.has('replay');
                  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if ((!seenIntro || hasForce) && !prefersReduced) {
                    document.documentElement.classList.add('intro-lock');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#F9F8F3] text-[#2D4233] dark:bg-[#121A15] dark:text-[#F5F4EE] antialiased min-h-screen pb-16 lg:pb-0 selection:bg-[#4A6B53] selection:text-white transition-colors duration-200">
        <CamcuIntro />
        <ThemeProvider>
          <LanguageProvider>
            <TransitionProvider>
              <Navbar />
              <SmoothScroll>
                {children}
              </SmoothScroll>
              <MobileBottomBar />
            </TransitionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
