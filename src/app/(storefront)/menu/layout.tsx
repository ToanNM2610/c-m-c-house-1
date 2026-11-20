import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thực Đơn Cà Phê Mộc & Món Ăn Lành | Cẩm Cù House",
  description: "Thưởng thức cà phê Robusta rang mộc Đắk Nông, cà phê muối signature, trà thảo mộc hoa đu đủ đực và hơn 50 món đồ uống bản địa thanh mát.",
  openGraph: {
    title: "Thực Đơn Cà Phê Mộc & Món Ăn Lành • Cẩm Cù House",
    description: "Thưởng thức cà phê Robusta rang mộc Đắk Nông, cà phê muối signature và hơn 50 món đồ uống bản địa.",
    url: "https://camcuhouse.online/menu",
    siteName: "Cẩm Cù House",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/images/og-menu.jpg",
        width: 1200,
        height: 630,
        alt: "Thực Đơn Cẩm Cù House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thực Đơn Cà Phê Mộc & Món Ăn Lành • Cẩm Cù House",
    description: "Thưởng thức cà phê Robusta rang mộc Đắk Nông và thực đơn phong phú tại Cẩm Cù House.",
    images: ["/images/og-menu.jpg"],
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
