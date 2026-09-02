import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Câu chuyện mộc mạc về không gian sinh thái bên bờ suối Đắk Nông tại Cẩm Cù House.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
