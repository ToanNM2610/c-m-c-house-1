import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu Chuyện Cẩm Cù House | Tình Yêu Núi Rừng & Dòng Suối",
  description: "Hành trình giữ lại vẻ đẹp nguyên sơ của dòng suối Đắk Nông và tạo nên không gian chữa lành mộc mạc tại Gia Nghĩa.",
  openGraph: {
    title: "Câu Chuyện Cẩm Cù House • Gia Nghĩa Đắk Nông",
    description: "Hành trình giữ lại vẻ đẹp nguyên sơ của dòng suối Đắk Nông và không gian chữa lành mộc mạc.",
    url: "https://camcuhouse.online/about",
    siteName: "Cẩm Cù House",
    type: "article",
    locale: "vi_VN",
    images: [
      {
        url: "/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Câu Chuyện Cẩm Cù House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Câu Chuyện Cẩm Cù House • Gia Nghĩa Đắk Nông",
    description: "Hành trình giữ lại vẻ đẹp nguyên sơ của dòng suối Đắk Nông.",
    images: ["/images/og-about.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
