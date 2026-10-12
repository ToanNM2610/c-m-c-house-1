import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TransitionProvider } from "@/context/TransitionContext";
import PublicShell from "@/components/PublicShell";
import "lenis/dist/lenis.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#121A15" },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={`dark ${playfair.variable} ${quicksand.variable} font-sans`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookieMatch = document.cookie.match(/(?:^|;\\s*)camcu_theme=([^;]*)/);
                  var storedTheme = localStorage.getItem('camcu_theme');
                  var theme = (cookieMatch ? cookieMatch[1] : null) || storedTheme;
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
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
      </head>
      <body suppressHydrationWarning className="bg-[var(--bg)] text-[var(--text)] antialiased min-h-screen pb-16 lg:pb-0 selection:bg-[var(--accent-green)] selection:text-white transition-colors duration-200">
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
