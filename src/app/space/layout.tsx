import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không gian",
  description: "Thư viện ảnh về góc vườn bình yên, hoa cẩm cù và những khoảnh khắc đẹp tại Đắk Nông.",
};

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
