import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thực đơn",
  description: "Danh sách 50 món cà phê mộc, trà, sinh tố và đồ ăn vặt tại Cẩm Cù House.",
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
