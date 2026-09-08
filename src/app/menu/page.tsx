"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Coffee, Sparkles, CheckCircle2, Leaf, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MenuItem {
  id: string;
  category: "Cà Phê" | "Trà & Nước Ép" | "Món Ăn Chính" | "Đồ Ăn Vặt & Tráng Miệng";
  name: string;
  price: string;
  tag: "Best-seller" | "Organic" | "Signature" | "Đặc sản";
  desc: string;
  image: string;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  // 1. CÀ PHÊ
  {
    id: "cf-1",
    category: "Cà Phê",
    name: "Cà Phê Rang Củi Truyền Thống",
    price: "35.000đ",
    tag: "Signature",
    desc: "100% Robusta Đắk Nông hạt chọn chín đỏ, rang mộc thủ công trên than củi gỗ cà phê già thơm nồng khói gỗ.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
  {
    id: "cf-2",
    category: "Cà Phê",
    name: "Cà Phê Muối Kem Béo Mịn",
    price: "38.000đ",
    tag: "Best-seller",
    desc: "Lớp kem muối béo nhẹ mằn mặn đánh bông tươi mới, hòa quyện với cốt cà phê phin rang củi đậm đà.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },
  {
    id: "cf-3",
    category: "Cà Phê",
    name: "Cà Phê Sữa Mộc Đắk Nông",
    price: "35.000đ",
    tag: "Best-seller",
    desc: "Hương vị cà phê phin truyền thống thơm bùi kết hợp sữa đặc dịu ngọt mộc mạc hoài niệm.",
    image: "/uploads/gallery/1788250253560-200373033.jpg",
  },
  {
    id: "cf-4",
    category: "Cà Phê",
    name: "Cold Brew Suối Nguồn 24H",
    price: "45.000đ",
    tag: "Signature",
    desc: "Ủ lạnh 24 giờ cùng nước suối thượng nguồn trong vắt, bật lên nốt hương cam rừng và mật mía dịu êm.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
  {
    id: "cf-5",
    category: "Cà Phê",
    name: "Cà Phê Cốt Dừa Béo Bùi",
    price: "42.000đ",
    tag: "Organic",
    desc: "Cốt dừa tươi ép tay đá xay mịn màng rót lên lớp cà phê đen mộc sánh đậm sảng khoái.",
    image: "/uploads/gallery/1788250253566-618481408.jpg",
  },
  {
    id: "cf-6",
    category: "Cà Phê",
    name: "Bạc Xỉu Suối Đá Ba Tầng",
    price: "38.000đ",
    tag: "Best-seller",
    desc: "Tách bạc xỉu phân tầng đẹp mắt với sữa đặc, sữa tươi thanh trùng và lớp bọt cà phê bồng bềnh.",
    image: "/uploads/gallery/1788250253554-875120458.jpg",
  },

  // 2. TRÀ & NƯỚC ÉP
  {
    id: "tr-1",
    category: "Trà & Nước Ép",
    name: "Trà Thảo Mộc Hoa Cẩm Cù",
    price: "42.000đ",
    tag: "Signature",
    desc: "Hoa cẩm cù sấy lạnh kết hợp hoa cúc rừng Tây Nguyên và cỏ ngọt tự nhiên thanh lọc cơ thể.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
  },
  {
    id: "tr-2",
    category: "Trà & Nước Ép",
    name: "Sinh Tố Bơ Sáp Đắk Nông",
    price: "45.000đ",
    tag: "Best-seller",
    desc: "Bơ sáp dẻo quánh đặc sản đất đỏ bazan béo thơm tự nhiên, xay cùng sữa tươi thanh trùng mát lành.",
    image: "/uploads/gallery/1788250253570-358232239.jpg",
  },
  {
    id: "tr-3",
    category: "Trà & Nước Ép",
    name: "Nước Ép Chanh Dây Đồi",
    price: "35.000đ",
    tag: "Organic",
    desc: "Chanh dây tươi hái trực tiếp từ triền đồi Gia Nghĩa, chua ngọt thanh mát và giàu vitamin C.",
    image: "/uploads/gallery/1788250253564-115851131.jpg",
  },
  {
    id: "tr-4",
    category: "Trà & Nước Ép",
    name: "Trà Gừng Mật Ong Rừng",
    price: "35.000đ",
    tag: "Organic",
    desc: "Gừng sẻ tươi đập dập thơm nồng hòa cùng mật ong rừng Gia Nghĩa sưởi ấm tâm hồn ngày se lạnh.",
    image: "/uploads/gallery/1788250253557-29323827.jpg",
  },
  {
    id: "tr-5",
    category: "Trà & Nước Ép",
    name: "Nước Ép Cóc Ổi Hồng Ép Chậm",
    price: "38.000đ",
    tag: "Organic",
    desc: "Ổi hồng đượm hương cùng cóc non chua dịu ép chậm nguyên chất, không pha thêm đường ngọt gắt.",
    image: "/uploads/gallery/1788250253572-915114239.jpg",
  },
  {
    id: "tr-6",
    category: "Trà & Nước Ép",
    name: "Trà Hoa Lài Cổ Thụ Mộc",
    price: "35.000đ",
    tag: "Organic",
    desc: "Búp trà xanh Shan tuyết cổ thụ ướp hoa lài tươi sớm mai, vị chát nhẹ hậu ngọt thanh tao.",
    image: "/uploads/gallery/1788250253562-580915883.jpg",
  },

  // 3. MÓN ĂN CHÍNH
  {
    id: "fn-1",
    category: "Món Ăn Chính",
    name: "Bún Riêu Cua Đồng Suối Đá",
    price: "45.000đ",
    tag: "Signature",
    desc: "Cua đồng giã tay nấu nước dùng thanh ngọt, riêu cua béo mềm ăn kèm rau rừng hoa chuối tươi mát.",
    image: "/uploads/gallery/1788250253578-396525469.jpg",
  },
  {
    id: "fn-2",
    category: "Món Ăn Chính",
    name: "Mì Quảng Gà Đồi Đắk Nông",
    price: "48.000đ",
    tag: "Best-seller",
    desc: "Thịt gà đồi thả vườn săn chắc om nghệ đậm đà, sợi mì gạo dẻo dai kèm bánh tráng mè giòn rụm.",
    image: "/uploads/gallery/1788250253579-355700743.jpg",
  },
  {
    id: "fn-3",
    category: "Món Ăn Chính",
    name: "Cơm Tấm Sườn Nướng Than Củi",
    price: "50.000đ",
    tag: "Best-seller",
    desc: "Miếng sườn cốt lết ướp sả mật ong nướng xém cạnh trên than củi gỗ cà phê, ăn cùng chả trứng nóng hổi.",
    image: "/uploads/gallery/1788250253581-551654423.jpg",
  },
  {
    id: "fn-4",
    category: "Món Ăn Chính",
    name: "Bò Kho Sả Ớt & Bánh Mì Giòn",
    price: "55.000đ",
    tag: "Signature",
    desc: "Bắp bò mềm mọng ninh nhừ cùng sả đồi và cà rốt thảo mộc, chấm cùng bánh mì nướng giòn rụm.",
    image: "/uploads/gallery/1788250253583-466696218.jpg",
  },
  {
    id: "fn-5",
    category: "Món Ăn Chính",
    name: "Bánh Canh Cá Lóc Đồng Suối",
    price: "45.000đ",
    tag: "Organic",
    desc: "Cá lóc đồng luộc gỡ thịt ướp tiêu củ nén cay thơm, nước dùng ninh xương ngọt tự nhiên.",
    image: "/uploads/gallery/1788250253585-162974099.jpg",
  },
  {
    id: "fn-6",
    category: "Món Ăn Chính",
    name: "Cơm Chiên Muối É Rừng",
    price: "45.000đ",
    tag: "Đặc sản",
    desc: "Hạt cơm đảo tơi vàng giòn quyện cùng hương lá é rừng the mát và muối ớt Tây Nguyên cay dịu.",
    image: "/uploads/gallery/1788250253587-81750666.jpg",
  },

  // 4. ĐỒ ĂN VẶT & TRÁNG MIỆNG
  {
    id: "sn-1",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Khoai Lang Mật Nướng Than Củi",
    price: "25.000đ",
    tag: "Organic",
    desc: "Khoai lang mật Đắk Glong nướng chậm trên than hồng, tươm mật vàng óng thơm lừng bùi béo.",
    image: "/uploads/gallery/1788250253590-409844081.jpg",
  },
  {
    id: "sn-2",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Bánh Chuối Nướng Cốt Dừa",
    price: "30.000đ",
    tag: "Best-seller",
    desc: "Chuối sứ chín rục nướng cùng cốt dừa béo ngậy và vừng rang thơm, giòn viền mềm giữa.",
    image: "/uploads/gallery/1788250253592-73071293.jpg",
  },
  {
    id: "sn-3",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Hạt Macca Sấy Nứt Vỏ Gia Nghĩa",
    price: "40.000đ",
    tag: "Đặc sản",
    desc: "Hạt macca tươi bản địa nứt vỏ tự nhiên, bùi béo giòn tan, nhâm nhi hoàn hảo cùng tách cà phê.",
    image: "/uploads/gallery/1788250253595-367274421.jpg",
  },
  {
    id: "sn-4",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Yaourt Phô Mai Thủ Công Cẩm Cù",
    price: "28.000đ",
    tag: "Best-seller",
    desc: "Sữa chua lên men tự nhiên với lớp váng phô mai béo dẻo phủ trên, chua ngọt vừa vặn thanh mát.",
    image: "/uploads/gallery/1788250253597-677832947.jpg",
  },
  {
    id: "sn-5",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Bánh Quy Bơ Hạt Điều Rang Muối",
    price: "30.000đ",
    tag: "Organic",
    desc: "Bánh quy nướng thơm mùi bơ Pháp kết hợp hạt điều béo ngậy mằn mặn đặc sản cao nguyên.",
    image: "/uploads/gallery/1788250253600-584656525.jpg",
  },
  {
    id: "sn-6",
    category: "Đồ Ăn Vặt & Tráng Miệng",
    name: "Chè Hạt Sen Long Nhãn Suối Nguồn",
    price: "35.000đ",
    tag: "Signature",
    desc: "Hạt sen bùi bở bọc trong cùi nhãn ngọt giòn, nấu cùng đường phèn thanh nhẹ ướp hoa nhài.",
    image: "/uploads/gallery/1788250253602-486743244.jpg",
  },
];

type MenuCategory =
  | "Cà Phê"
  | "Trà & Nước Ép"
  | "Món Ăn Chính"
  | "Đồ Ăn Vặt & Tráng Miệng";

const CATEGORIES: MenuCategory[] = [
  "Cà Phê",
  "Trà & Nước Ép",
  "Món Ăn Chính",
  "Đồ Ăn Vặt & Tráng Miệng",
];

export default function MenuPage() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Cà Phê");

  const filteredItems = ALL_MENU_ITEMS.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 1. BANNER: THỰC ĐƠN TƯƠI NGON & MỘC MẠC                   */}
      {/* ========================================================= */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 flex items-center justify-center text-center overflow-hidden border-b border-[#EAE6DF]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/gallery/1788250253560-200373033.jpg"
            alt="Thực đơn cà phê và ẩm thực mộc Cẩm Cù House"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/92 via-[#FDFBF7]/85 to-[#FDFBF7]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Coffee size={14} className="text-[#C88A4B]" />
            <span>NGUYÊN LIỆU MỘC &amp; TƯƠI LÀNH</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Thực Đơn Tươi Ngon &amp; Mộc Mạc
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Tuyển chọn cà phê rang củi Đắk Nông, trà hoa thảo mộc và ẩm thực bản
            địa được chuẩn bị tươi mới mỗi ngày bên hiên nhà.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THANH PHÂN LOẠI DANH MỤC (CATEGORY TABS)               */}
      {/* ========================================================= */}
      <section className="py-8 px-6 sm:px-12 max-w-7xl mx-auto flex justify-center sticky top-20 z-30 bg-[#FDFBF7]/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-full bg-[#EAE6DF]/60 border border-[#EAE6DF]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#2D4A3E] text-white shadow-xs font-semibold"
                  : "text-[#222222]/70 hover:text-[#2D4A3E]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. DANH SÁCH MÓN ĂN (GRID CARD LAYOUT)                    */}
      {/* ========================================================= */}
      <section className="pb-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card-warm overflow-hidden flex flex-col p-4 bg-white group"
            >
              {/* Ảnh vuông sắc nét tỉ lệ 1:1 */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-[#FDFBF7]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Thẻ tag nổi bật (Best-seller, Organic, Signature, Đặc sản) */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-sm ${
                    item.tag === "Signature"
                      ? "bg-[#C88A4B] text-white"
                      : item.tag === "Organic"
                      ? "bg-[#2D4A3E] text-white"
                      : "bg-[#222222] text-white"
                  }`}
                >
                  {item.tag}
                </span>
              </div>

              {/* Thông tin món */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#2D4A3E] group-hover:text-[#C88A4B] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-[#C88A4B] shrink-0 pt-0.5">
                      {item.price}
                    </span>
                  </div>

                  {/* Mô tả nguyên liệu */}
                  <p className="text-xs font-light text-[#222222]/75 leading-relaxed mt-2 line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE6DF]/60 flex items-center justify-between text-xs text-[#2D4A3E]/70 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-[#C88A4B]" />
                    <span>Tươi mới mỗi ngày</span>
                  </span>
                  <span className="text-[11px] text-[#222222]/50">
                    Phục vụ tại bàn
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. GHI CHÚ ĐẶC BIỆT (KHUNG THÔNG TIN CHÂN TRANG)         */}
      {/* ========================================================= */}
      <section className="pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              <Leaf size={14} />
              <span>LƯU Ý THỰC ĐƠN • SPECIAL NOTES</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2D4A3E]">
              Khẩu Vị Riêng Của Bạn Được Ưu Tiên
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#222222]/80 leading-relaxed list-disc list-inside">
              <li>
                <strong>Tùy chỉnh độ ngọt &amp; lượng đá:</strong> Quý khách có
                thể dặn barista giảm ngọt, dùng đường ăn kiêng hoặc uống nóng.
              </li>
              <li>
                <strong>Hỗ trợ món chay:</strong> Chúng tôi sẵn sàng điều chỉnh
                các món ăn sang phong cách thuần chay thanh tịnh theo yêu cầu.
              </li>
              <li>
                <strong>Pha chế tươi mới:</strong> Cà phê được xay hạt và pha tại
                chỗ ngay khi nhận order để giữ trọn vẹn hương vị tinh túy.
              </li>
            </ul>
          </div>

          <div className="shrink-0 p-6 rounded-2xl bg-[#FDFBF7] border border-[#EAE6DF] text-center space-y-2 max-w-xs">
            <HeartHandshake size={28} className="text-[#2D4A3E] mx-auto" />
            <p className="font-serif font-bold text-sm text-[#2D4A3E]">
              Phục vụ bằng sự chân thành
            </p>
            <p className="text-[11px] text-[#222222]/70">
              Hãy chia sẻ với nhân viên nếu bạn có bất kỳ dị ứng hay kiêng cữ nào nhé!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
