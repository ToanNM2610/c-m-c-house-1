import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không Gian Sinh Thái Suối Đá | Cẩm Cù House",
  description: "Khám phá không gian sàn gỗ bên bờ suối mát lành, thềm sỏi trắng và tán rừng cao nguyên Đắk Nông tại Cẩm Cù House.",
  openGraph: {
    title: "Không Gian Sinh Thái Suối Đá • Cẩm Cù House",
    description: "Khám phá không gian sàn gỗ bên bờ suối mát lành, thềm sỏi trắng và tán rừng cao nguyên Đắk Nông.",
    url: "https://camcuhouse.online/space",
    siteName: "Cẩm Cù House",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/images/og-space.jpg",
        width: 1200,
        height: 630,
        alt: "Không Gian Suối Cẩm Cù House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Không Gian Sinh Thái Suối Đá • Cẩm Cù House",
    description: "Khám phá không gian sàn gỗ bên bờ suối mát lành và tán rừng cao nguyên.",
    images: ["/images/og-space.jpg"],
  },
};

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
