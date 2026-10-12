import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉ Đường & Liên Hệ | Cẩm Cù House",
  description: "Chỉ đường Google Maps đến Cẩm Cù House bên dòng suối Đắk Nông tại Gia Nghĩa. Giờ mở cửa, hotline và thông tin liên hệ.",
  openGraph: {
    title: "Chỉ Đường & Liên Hệ • Cẩm Cù House",
    description: "Chỉ đường Google Maps đến Cẩm Cù House bên dòng suối Đắk Nông. Hotline 038 285 1688.",
    url: "https://camcuhouse.online/contact",
    siteName: "Cẩm Cù House",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/images/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Chỉ Đường Đến Cẩm Cù House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chỉ Đường & Liên Hệ • Cẩm Cù House",
    description: "Chỉ đường Google Maps đến Cẩm Cù House bên dòng suối Đắk Nông.",
    images: ["/images/og-contact.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
