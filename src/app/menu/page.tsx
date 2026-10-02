"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MENU_ITEMS, MENU_CATEGORIES, MenuItem } from "@/data/menu";
import {
  Coffee,
  Sparkles,
  Droplets,
  Sprout,
  UtensilsCrossed,
  PhoneCall,
  Navigation,
  CheckCircle2,
  Plus
} from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return MENU_ITEMS.length;
    return MENU_ITEMS.filter((i) => i.category === catId).length;
  };

  return (
    <div className="bg-[#F9F8F3] min-h-screen text-[#1B281D]">
      <Navbar />

      <main className="pt-20">
        {/* Top Atmospheric Intro Header */}
        <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 pb-12 bg-gradient-to-b from-stone-100/50 to-[#F9F8F3]">
          <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
            {/* Botanical badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-[#3E5C46] text-xs font-semibold shadow-sm mb-5 border border-stone-200">
              <Sprout className="w-4 h-4 text-[#3E5C46]" />
              <span>Ẩm Thực Tự Nhiên &amp; Nông Sản Bản Địa Gia Nghĩa</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3E5C46] font-bold max-w-3xl mb-3 tracking-tight">
              Thực Đơn Mộc Mạc • Thức Uống Xanh &amp; Món Ăn Lành
            </h1>
            <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed mb-6">
              Mỗi món nước hay món ăn đều trọn vẹn hương vị mộc mạc, chế biến từ nông sản Đắk Nông tươi rói, kết hợp cùng không gian tiếng suối róc rách trong trẻo.
            </p>

            {/* Quick Trust Indicators Bento Snippet */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-sm text-xs font-bold text-[#3E5C46]">
                <Droplets className="w-4 h-4 text-[#396663]" />
                <span>Nước Suối Nguồn Mát</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-sm text-xs font-bold text-[#3E5C46]">
                <Sprout className="w-4 h-4 text-[#614633]" />
                <span>Nông Sản Trong Ngày</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-sm text-xs font-bold text-[#3E5C46]">
                <CheckCircle2 className="w-4 h-4 text-[#3E5C46]" />
                <span>Không Phụ Gia Hóa Học</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Dynamic Filter Navigation */}
        <div className="sticky top-20 z-40 w-full bg-[#F9F8F3]/95 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8 border-y border-stone-200/80 shadow-[0_4px_16px_rgba(37,51,38,0.03)]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {MENU_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#3E5C46] text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 border border-stone-200/60"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Menu Grid Layout */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 flex flex-col gap-10">
          {/* Spotlight Story Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-sm">
            <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] relative">
              <img
                src="/images/coffee-drink.png"
                alt="Cà phê muối Đắk Nông"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-serif text-lg font-bold">
                  Signature: Cà Phê Muối Đắk Nông
                </span>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-[#614633] font-bold">
                Món Được Yêu Thích Nhất
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E5C46]">
                Cà Phê Muối Gia Nghĩa &amp; Trà Hoa Đu Đủ Rừng
              </h2>
              <p className="text-base text-stone-700 leading-relaxed">
                Được ủ từ hạt Robusta chín mọng rang than củi, lớp kem muối biển béo ngậy mặn ngọt cân bằng hoàn hảo. Ngoài ra, ấm trà hoa đu đủ đực ngâm mật ong rừng luôn là sự lựa chọn thanh giọng, an lành nhất bên dòng suối mát.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Gọi Hotline Gọi Món: 038 285 1688</span>
                </a>
              </div>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3E5C46]">
                Danh Sách Món ({filteredItems.length} món)
              </h3>
              <span className="text-xs text-stone-500">
                Giá niêm yết đã bao gồm phục vụ tại bàn sát bờ suối
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between py-2.5 border-b border-dotted border-stone-200 group hover:bg-stone-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1B281D] group-hover:text-[#3E5C46] transition-colors">
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#3E5C46] text-[10px] font-bold">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <span className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="font-serif text-sm font-bold text-[#614633]">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                    <a
                      href="tel:0382851688"
                      title="Gọi đặt món"
                      className="w-7 h-7 rounded-full bg-stone-100 text-[#3E5C46] flex items-center justify-center hover:bg-[#3E5C46] hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Commitment & Hotline Banner */}
          <section className="w-full rounded-2xl bg-stone-100/80 p-8 sm:p-10 border border-stone-200/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#3E5C46] font-bold font-serif text-xl">
                <span>🌿</span>
                <span>Cam Kết Từ Bếp &amp; Quầy Bar Cẩm Cù</span>
              </div>
              <p className="text-base text-stone-700 leading-relaxed">
                Nguyên liệu tươi sạch mỗi ngày • Hỗ trợ điều chỉnh độ ngọt và đá theo khẩu vị riêng của quý khách để có trải nghiệm vừa ý nhất.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-semibold text-stone-800">
                <span className="flex items-center gap-1 text-[#3E5C46]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Giảm ngọt theo khẩu vị
                </span>
                <span className="flex items-center gap-1 text-[#3E5C46]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Phục vụ tại bàn sát dòng suối
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:0382851688"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#3E5C46] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D4233] shadow-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Hotline: 038 285 1688</span>
              </a>
              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#3E5C46] text-xs sm:text-sm font-semibold border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Ghé Thăm Trực Tiếp</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
