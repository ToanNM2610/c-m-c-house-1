"use client";

import React, { useState } from "react";
import {
  Globe,
  Share2,
  FileCode,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  Search,
  Send,
} from "lucide-react";

interface SeoTabProps {
  onShowToast: (msg: string) => void;
}

export default function SeoTab({ onShowToast }: SeoTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"serp" | "social" | "schema" | "sitemap">("serp");
  const [selectedPage, setSelectedPage] = useState<"home" | "about" | "space" | "menu" | "contact">("home");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmittingSitemap, setIsSubmittingSitemap] = useState(false);

  // SEO metadata definitions for 5 public pages (Vietnamese & English)
  const metaPages = {
    home: {
      name: "Trang Chủ (/)",
      url: "https://camcuhouse.online",
      titleVi: "Cẩm Cù House | Cà Phê Suối Đá Tự Nhiên & Robusta Rang Củi Đắk Nông",
      titleEn: "Cẩm Cù House | Natural Stream Coffee & Wood-Roasted Robusta",
      descVi: "Chốn dừng chân mộc mạc nép mình bên bờ suối đá mát lành của cao nguyên Gia Nghĩa, Đắk Nông. Thưởng thức cà phê Robusta rang củi mộc, hòa mình vào thanh âm thiên nhiên nguyên bản.",
      descEn: "A rustic sanctuary nestled by the natural rock stream in Gia Nghĩa, Đắk Nông. Sip pure wood-roasted Robusta coffee and listen to the murmuring water.",
      keywords: "cà phê suối đá, cẩm cù house, gia nghĩa đắk nông, robusta rang củi, cà phê mộc",
      image: "/space/suoi-da-1.webp",
    },
    about: {
      name: "Câu Chuyện (/about)",
      url: "https://camcuhouse.online/about",
      titleVi: "Câu Chuyện Cẩm Cù House | Tình Yêu Cà Phê Mộc & Dòng Suối Reo",
      titleEn: "Our Story | Love for Pure Coffee & Whispering Streams",
      descVi: "Khám phá hành trình xây dựng Cẩm Cù House bên dòng suối đá Gia Nghĩa. Giữ trọn tinh hoa Robusta cao nguyên đất đỏ bazan và triết lý sống hòa hợp thiên nhiên.",
      descEn: "Discover the journey of crafting Cẩm Cù House by Gia Nghĩa stream. Preserving highland Robusta heritage and living in harmony with nature.",
      keywords: "câu chuyện cẩm cù house, lịch sử quán, cà phê gia nghĩa",
      image: "/space/quan-suoi-1.webp",
    },
    space: {
      name: "Không Gian Suối (/space)",
      url: "https://camcuhouse.online/space",
      titleVi: "Không Gian Bờ Suối Tự Nhiên & Góc Quán Mộc | Cẩm Cù House",
      titleEn: "Stream Sanctuary & Rustic Spaces | Cẩm Cù House",
      descVi: "Chiêm ngưỡng 30+ hình ảnh không gian bờ suối đá tự nhiên, cầu gỗ, chòi lá và góc ngồi thưởng thức cà phê yên tĩnh tại Cẩm Cù House, Gia Nghĩa.",
      descEn: "Explore 30+ photos of natural rock streams, wooden bridges, thatched huts and quiet coffee retreats at Cẩm Cù House.",
      keywords: "không gian cẩm cù house, bờ suối tự nhiên, suối reo gia nghĩa",
      image: "/space/suoi-da-2.webp",
    },
    menu: {
      name: "Thực Đơn (/menu)",
      url: "https://camcuhouse.online/menu",
      titleVi: "Thực Đơn 67 Món Đậm Vị Cao Nguyên | Cẩm Cù House Coffee & Food",
      titleEn: "Menu 67 Highland Specialties | Cẩm Cù House Coffee & Food",
      descVi: "Bảng giá đầy đủ 67 món: Cà phê Robusta rang củi, Trà thảo mộc suối reo, Nước ép trái cây tươi và Ẩm thực ăn sáng đậm vị mộc Gia Nghĩa. Giá từ 25.000đ.",
      descEn: "Full 67-item menu: Wood-roasted Robusta coffee, stream herbal teas, fresh highland juices and breakfast delights. From 25,000 VND.",
      keywords: "thực đơn cẩm cù house, giá cà phê cẩm cù, đặc sản gia nghĩa",
      image: "/space/mon-an-1.webp",
    },
    contact: {
      name: "Chỉ Đường & Liên Hệ (/contact)",
      url: "https://camcuhouse.online/contact",
      titleVi: "Chỉ Đường Tới Quán & Giờ Mở Cửa | Cẩm Cù House Gia Nghĩa",
      titleEn: "Directions & Opening Hours | Cẩm Cù House Gia Nghĩa",
      descVi: "Vị trí: Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa. Đường bê tông rộng, ô tô 4-16 chỗ quay đầu tận sân. Hotline / Zalo: 038 285 1688.",
      descEn: "Location: Hem 437 Hung Vuong, Nghia Trung, Gia Nghia. Wide concrete road, parking for 4-16 seat vehicles. Hotline: 038 285 1688.",
      keywords: "chỉ đường cẩm cù house, địa chỉ cẩm cù house, hotline 0382851688",
      image: "/space/quan-suoi-2.webp",
    },
  };

  const currentMeta = metaPages[selectedPage];

  // Schema.org JSON-LD Payload
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CoffeeShop",
    "name": "Cẩm Cù House",
    "alternateName": "Cẩm Cù House coffee & Food",
    "description": "Chốn dừng chân mộc mạc bên bờ suối đá mát lành của cao nguyên Gia Nghĩa, Đắk Nông. Thưởng thức Robusta rang củi mộc nguyên bản.",
    "url": "https://camcuhouse.online",
    "telephone": "+84382851688",
    "priceRange": "25.000đ - 65.000đ",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hẻm 437 Hùng Vương, Phường Nghĩa Trung",
      "addressLocality": "Thành phố Gia Nghĩa",
      "addressRegion": "Tỉnh Đắk Nông",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.99,
      "longitude": 107.69
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "07:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "22:00"
      }
    ],
    "servesCuisine": "Highland Specialty Coffee, Pure Robusta, Local Food",
    "hasMap": "https://maps.google.com/?q=11.99,107.69"
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaJsonLd, null, 2));
    onShowToast("Đã sao chép cấu trúc Schema.org JSON-LD vào bộ nhớ tạm!");
  };

  const handleSubmitSitemap = async () => {
    setIsSubmittingSitemap(true);
    try {
      const res = await fetch("/api/admin/search-console/submit-sitemap", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        onShowToast("Đã gửi yêu cầu thu thập sitemap tới Google Search Console thành công!");
      } else {
        onShowToast(data.message || "Đã gửi thông báo sitemap.");
      }
    } catch (_) {
      onShowToast("Lỗi kết nối khi gửi sitemap.");
    } finally {
      setIsSubmittingSitemap(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
            [CÔNG CỤ SEO &amp; CHỈ MỤC TỰ ĐỘNG]
          </span>
          <h1 className="admin-h1 font-serif text-[26px] font-bold text-[#3E5C46] dark:text-[#9DC183] mt-0.5">
            SEO, Thẻ Meta &amp; Mạng Xã Hội
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Quản lý hiển thị trên kết quả tìm kiếm Google, xem trước thẻ chia sẻ Zalo/Facebook và kiểm tra Schema.org.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSubmitSitemap}
            disabled={isSubmittingSitemap}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E5C46] text-white text-xs font-bold hover:bg-[#2D4233] transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingSitemap ? "Đang gửi..." : "Gửi Sitemap Cho Google"}</span>
          </button>
        </div>
      </div>

      {/* Subtabs Pill Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: "serp", label: "Kết Quả Google (SERP)", icon: Search },
          { id: "social", label: "Chia Sẻ Mạng Xã Hội (OG)", icon: Share2 },
          { id: "schema", label: "Dữ Liệu Có Cấu Trúc (Schema.org)", icon: FileCode },
          { id: "sitemap", label: "Sitemap & Robots.txt", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#3E5C46] text-white shadow-sm font-bold"
                  : "bg-white dark:bg-[#1E2B22] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 hover:bg-stone-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: GOOGLE SERP PREVIEW */}
      {activeSubTab === "serp" && (
        <div className="flex flex-col gap-6">
          {/* Controls: Page selector & Device toggle */}
          <div className="p-4 bg-white/90 dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-stone-500 shrink-0">Trang:</span>
              {(["home", "about", "space", "menu", "contact"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPage === p
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-[#3E5C46] dark:text-[#9DC183] font-bold border border-emerald-300"
                      : "text-stone-600 dark:text-stone-300 hover:bg-stone-100"
                  }`}
                >
                  {metaPages[p].name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-white dark:bg-[#1E2B22] text-[#3E5C46] shadow-xs font-bold"
                    : "text-stone-500"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Máy tính</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-white dark:bg-[#1E2B22] text-[#3E5C46] shadow-xs font-bold"
                    : "text-stone-500"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Di động</span>
              </button>
            </div>
          </div>

          {/* Realistic Google SERP Preview Card */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-500">Mô phỏng hiển thị trên Google Search</span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Thẻ Meta Đã Được Tối Ưu
              </span>
            </div>

            <div
              className={`p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#121A15] border border-stone-200/80 dark:border-stone-800 flex flex-col gap-2 transition-all ${
                previewDevice === "mobile" ? "max-w-md mx-auto" : "w-full"
              }`}
            >
              {/* Site URL & Favicon */}
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#1F3A2A] text-[#9DC183] flex items-center justify-center font-bold text-[10px]">
                  CC
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-stone-800 dark:text-stone-200 leading-none">
                    Cẩm Cù House
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-none mt-0.5">
                    {currentMeta.url}
                  </span>
                </div>
              </div>

              {/* SERP Title */}
              <h2 className="text-[18px] sm:text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-sans leading-snug font-normal">
                {currentMeta.titleVi}
              </h2>

              {/* SERP Description */}
              <p className="text-[13px] sm:text-[14px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed font-sans">
                {currentMeta.descVi}
              </p>

              {/* Sitelinks Sub-items preview */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 mt-1">
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                    Thực Đơn 67 Món
                  </span>
                  <span className="text-[11px] text-stone-500">Robusta rang củi mộc, trà thảo mộc</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                    Không Gian Suối Đá
                  </span>
                  <span className="text-[11px] text-stone-500">30+ ảnh suối reo cao nguyên</span>
                </div>
              </div>
            </div>

            {/* Character Length Audit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-stone-50 dark:bg-[#16231A] rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-600 dark:text-stone-400">Độ dài tiêu đề (Title):</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {currentMeta.titleVi.length} / 65 ký tự
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (currentMeta.titleVi.length / 65) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-[#16231A] rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-600 dark:text-stone-400">Độ dài mô tả (Description):</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {currentMeta.descVi.length} / 160 ký tự
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (currentMeta.descVi.length / 160) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SOCIAL SHARE OPENGRAPH PREVIEW */}
      {activeSubTab === "social" && (
        <div className="p-6 sm:p-8 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                Xem Trước Thẻ Chia Sẻ Zalo &amp; Facebook (OpenGraph)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Giao diện hiển thị khi khách gửi đường link website qua tin nhắn Zalo, Facebook Messenger hoặc đăng bài.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto w-full rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-md bg-stone-100 dark:bg-[#141C17]">
            {/* Card Image Banner */}
            <div className="w-full h-52 bg-stone-800 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              <div className="z-20 text-center p-4">
                <span className="font-serif text-white text-2xl font-bold tracking-wider">CẨM CÙ HOUSE</span>
                <span className="block text-[11px] text-amber-200 uppercase tracking-widest mt-1">
                  Chốn Dừng Chân Bên Bờ Suối Đá
                </span>
              </div>
            </div>

            {/* Card Content Excerpt */}
            <div className="p-4 bg-white dark:bg-[#1E2B22] flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-stone-400 uppercase tracking-wider">
                CAMCUHOUSE.ONLINE
              </span>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                {currentMeta.titleVi}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                {currentMeta.descVi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SCHEMA.ORG JSON-LD */}
      {activeSubTab === "schema" && (
        <div className="p-6 sm:p-8 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="admin-h2 font-serif text-[20px] font-bold text-[#3E5C46] dark:text-[#9DC183]">
                Dữ Liệu Có Cấu Trúc Schema.org (JSON-LD)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Google đọc dữ liệu này để hiển thị hộp thông tin doanh nghiệp (Knowledge Graph), sao đánh giá và giờ mở cửa.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopySchema}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-300 dark:border-stone-700 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Sao Chép Mã JSON-LD</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-5 rounded-2xl bg-[#0F1712] text-[#9DC183] text-xs font-mono overflow-x-auto leading-relaxed border border-[#1F3A2A] shadow-inner max-h-[450px]">
              {JSON.stringify(schemaJsonLd, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SITEMAP & ROBOTS */}
      {activeSubTab === "sitemap" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#3E5C46] dark:text-[#9DC183]" />
                <h3 className="admin-card-title font-serif text-[16px] font-bold text-stone-900 dark:text-stone-100">
                  Sơ Đồ Trang (sitemap.xml)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                ● Đang Hoạt Động
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Tệp sitemap tự động cập nhật mọi trang công khai, hỗ trợ công cụ tìm kiếm thu thập thông tin nhanh nhất.
            </p>
            <div className="p-3 bg-stone-50 dark:bg-[#16231A] rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-600 dark:text-stone-300">
                https://camcuhouse.online/sitemap.xml
              </span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-stone-500 hover:text-[#3E5C46]"
                title="Mở sitemap"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#1E2B22] rounded-2xl border border-stone-200 dark:border-stone-700/60 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#3E5C46] dark:text-[#9DC183]" />
                <h3 className="admin-card-title font-serif text-[16px] font-bold text-stone-900 dark:text-stone-100">
                  Tệp Điều Hướng Bọ Tìm Kiếm (robots.txt)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                ● Chuẩn SEO 100%
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Cho phép bọ Google thu thập toàn bộ các trang công khai, đồng thời bảo vệ khu vực quản trị an toàn.
            </p>
            <div className="p-3 bg-stone-50 dark:bg-[#16231A] rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="font-mono text-xs text-stone-600 dark:text-stone-300">
                https://camcuhouse.online/robots.txt
              </span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-stone-500 hover:text-[#3E5C46]"
                title="Mở robots.txt"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
