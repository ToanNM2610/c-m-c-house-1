import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin đường đi, địa chỉ Google Maps và các kênh mạng xã hội chính thức của Cẩm Cù House.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
