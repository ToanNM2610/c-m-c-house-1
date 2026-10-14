"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/context/LanguageContext";
import {
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Navigation,
  Compass,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Share2
} from "lucide-react";
import { getVietnamTime } from "@/lib/openingHours";
import PageDarkHero from "@/components/layout/PageDarkHero";

interface DaySchedule {
  dayId: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  nameVn: string;
  nameEn: string;
  hours: string;
}

const SCHEDULE_DAYS: DaySchedule[] = [
  { dayId: 1, nameVn: "Thứ Hai", nameEn: "Monday", hours: "07:00 – 18:00" },
  { dayId: 2, nameVn: "Thứ Ba", nameEn: "Tuesday", hours: "07:00 – 18:00" },
  { dayId: 3, nameVn: "Thứ Tư", nameEn: "Wednesday", hours: "07:00 – 18:00" },
  { dayId: 4, nameVn: "Thứ Năm", nameEn: "Thursday", hours: "07:00 – 18:00" },
  { dayId: 5, nameVn: "Thứ Sáu", nameEn: "Friday", hours: "07:00 – 22:00" },
  { dayId: 6, nameVn: "Thứ Bảy", nameEn: "Saturday", hours: "07:00 – 22:00" },
  { dayId: 0, nameVn: "Chủ Nhật", nameEn: "Sunday", hours: "07:00 – 22:00" },
];

export default function ContactPage() {
  const { locale, dict } = useLanguage();
  const isEn = locale === "en";

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [currentDayId, setCurrentDayId] = useState<number>(1);

  useEffect(() => {
    const vnDate = getVietnamTime();
    setCurrentDayId(vnDate.getDay());
  }, []);

  const handleCopy = (num: string) => {
    const cleanNum = num.replace(/\s+/g, "");
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(cleanNum);
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2200);
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--ink)] font-sans selection:bg-[var(--ember)] selection:text-[#0A0E0C] transition-colors overflow-x-hidden">
      <main className="overflow-x-hidden">
        {/* =========================================================================
            1. ĐẦU TRANG: HERO TỐI (SECTION 8.5.1)
           ========================================================================= */}
        <PageDarkHero
          badges={[
            "[05 · 11.99° N · 107.69° E]",
            "[CAO ĐỘ 800M+]",
          ]}
          h1Main="TỪ GIA NGHĨA, CẨM CÙ HOUSE"
          h1Accent="Chờ Đón Bạn"
          subtitle={dict.common.addressFull}
          backgroundImage="/uploads/gallery/1788250253557-29323827.jpg"
        />

        {/* =========================================================================
            2. BỐ CỤC 2 CỘT: TRÁI BẢN ĐỒ / PHẢI HOTLINE & GIỜ (SECTION 8.5.2)
           ========================================================================= */}
        <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* CỘT TRÁI (7 cols): Bản đồ lớn lọc tối đồng bộ + Nút Mở Google Maps ember */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="p-6 sm:p-8 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 flex flex-col gap-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[var(--bg-2)] border border-[var(--line)] text-[var(--ember)] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ember)] block font-bold">
                        BẢN ĐỒ GOOGLE MAPS
                      </span>
                      <h2 className="contact-card-title uppercase text-[var(--ink)]">
                        ĐỊNH VỊ TRỰC TUYẾN
                      </h2>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--ink-muted)]">
                    GPS: 11.9912, 107.6888
                  </span>
                </div>

                {/* Bản đồ nhúng góc vát chamfer 14px */}
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden clip-chamfer-14 border border-[var(--line)] relative shadow-inner bg-[var(--bg-2)]">
                  <iframe
                    title="Bản đồ Google Maps Cẩm Cù House"
                    src="https://www.google.com/maps?q=11.9912,107.6888&hl=vi&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="map-theme-filter w-full h-full transition-all duration-300"
                  />
                </div>

                {/* Nút "Mở Google Maps" ember */}
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("click_directions")}
                  className="w-full py-4 bg-[var(--ember)] text-[var(--ember-ink)] font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 flex items-center justify-center gap-2 transition-opacity"
                >
                  <Navigation className="w-4 h-4" />
                  <span>MỞ GOOGLE MAPS DẪN ĐƯỜNG</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </a>
              </div>
            </div>

            {/* CỘT PHẢI (5 cols): Hotline số 64px, Giờ mở cửa bảng 7 ngày, Kênh truyền thông */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Card Hotline số 64px (Section 8.5.2) */}
              <div className="p-6 sm:p-8 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 flex flex-col gap-4 shadow-xl">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ember)] font-bold">
                  [HOTLINE ĐÓN TIẾP &amp; HỖ TRỢ ĐƯỜNG ĐI]
                </span>

                <div className="flex flex-col gap-2">
                  <a
                    href="tel:0382851688"
                    onClick={() => trackEvent("click_call")}
                    className="font-display font-black text-[clamp(36px,5vw,56px)] text-[var(--ember)] leading-none tracking-tight hover:underline tabular-nums"
                  >
                    038 285 1688
                  </a>
                  <span className="font-mono text-[12px] text-[var(--ink-muted)]">
                    HOTLINE 1 (HỖ TRỢ ZALO 24/7)
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="tel:0382851688"
                    className="flex-1 py-3 px-3 bg-[var(--ember)] text-[var(--ember-ink)] font-mono text-[12px] font-bold uppercase text-center clip-chamfer-14 hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>GỌI NGAY</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy("038 285 1688")}
                    className="p-3 bg-[var(--bg-2)] border border-[var(--line)] hover:border-[var(--ember)] text-[var(--ink)] clip-chamfer-14 font-mono text-xs flex items-center justify-center gap-1.5"
                    title="Sao chép số điện thoại"
                  >
                    {copiedNumber === "038 285 1688" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href="https://zalo.me/0382851688"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--bg-2)] border border-[var(--line)] hover:border-[var(--ember)] text-[var(--ink)] clip-chamfer-14 font-mono text-xs flex items-center justify-center gap-1.5"
                    title="Nhắn tin qua Zalo"
                  >
                    <MessageCircle className="w-4 h-4 text-[var(--ember)]" />
                  </a>
                </div>

                {/* Hotline 2 */}
                <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] text-[var(--ink-muted)] uppercase">Hotline 2 dự phòng:</span>
                    <a href="tel:0774659000" className="font-mono font-bold text-[17px] text-[var(--ink)] hover:text-[var(--ember)]">
                      077 465 9000
                    </a>
                  </div>

                  <a
                    href="mailto:thuynhu8788@gmail.com"
                    className="font-mono text-[12px] text-[var(--ink-muted)] hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>thuynhu8788@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Card Giờ mở cửa: Bảng 7 ngày kẻ mảnh, hôm nay nền ember 14% + nhãn HÔM NAY (Section 8.5.2) */}
              <div className="p-6 sm:p-8 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[var(--bg-2)] border border-[var(--line)] text-[var(--ember)] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ember)] block font-bold">
                      LỊCH PHỤC VỤ TUẦN
                    </span>
                    <h2 className="font-display font-extrabold text-[20px] uppercase text-[var(--ink)]">
                      GIỜ MỞ CỬA 7 NGÀY
                    </h2>
                  </div>
                </div>

                {/* Bảng 7 ngày kẻ mảnh */}
                <div className="divide-y divide-[var(--line)] pt-2 border-t border-[var(--line)]">
                  {SCHEDULE_DAYS.map((item) => {
                    const isToday = item.dayId === currentDayId;
                    return (
                      <div
                        key={item.dayId}
                        className={`py-2.5 px-3 flex items-center justify-between text-[14px] transition-colors rounded-sm ${
                          isToday
                            ? "bg-[var(--ember)]/15 border border-[var(--ember)] font-bold text-[var(--ink)]"
                            : "text-[var(--ink-muted)]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isToday ? "text-[var(--ink)] font-bold" : ""}>
                            {isEn ? item.nameEn : item.nameVn}
                          </span>
                          {isToday && (
                            <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--ember)] text-[var(--ember-ink)] font-bold uppercase rounded-xs">
                              HÔM NAY
                            </span>
                          )}
                        </div>
                        <span className={`font-mono font-bold ${isToday ? "text-[var(--ink)]" : "text-[var(--ink)]"}`}>
                          {item.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kênh truyền thông: Facebook, TikTok, YouTube (Section 8.5.2) */}
              <div className="p-6 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] text-[var(--ember)] uppercase font-bold block">
                    KÊNH TRUYỀN THÔNG
                  </span>
                  <span className="font-display font-bold text-[18px] uppercase text-[var(--ink)]">
                    KẾT NỐI VỚI QUÁN
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/share/1DVLMySW8H/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] hover:border-[var(--ember)] hover:text-[var(--ember)] flex items-center justify-center font-mono text-[11px] font-bold"
                  >
                    FB
                  </a>
                  <a
                    href="https://www.tiktok.com/@camcuhousedaknong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] hover:border-[var(--ember)] hover:text-[var(--ember)] flex items-center justify-center font-mono text-[11px] font-bold"
                  >
                    TT
                  </a>
                  <a
                    href="https://youtube.com/@Cam_Cu_House"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] hover:border-[var(--ember)] hover:text-[var(--ember)] flex items-center justify-center font-mono text-[11px] font-bold"
                  >
                    YT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. CÁCH ĐẾN QUÁN: CÁC BƯỚC 01–03 NỐI BẰNG ĐƯỜNG NÉT ĐỨT (SECTION 8.5.3)
           ========================================================================= */}
        <section className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 pb-28">
          <div className="p-8 sm:p-14 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14">
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember)] font-bold block mb-2">
                [HƯỚNG DẪN CUNG ĐƯỜNG DI CHUYỂN]
              </span>
              <h2 className="font-display font-black text-[clamp(28px,4vw,44px)] uppercase tracking-tight text-[var(--ink)] leading-tight">
                CÁCH ĐẾN QUÁN TRONG 3 BƯỚC THUẬN TIỆN
              </h2>
            </div>

            {/* Các bước 01-03 nối bằng nét đứt */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-[1px] border-t-2 border-dashed border-[var(--line)] pointer-events-none" />

              {/* Bước 1 */}
              <div className="flex flex-col gap-3 relative z-10">
                <span className="font-display font-black text-[32px] text-[var(--ember)] w-14 h-14 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] flex items-center justify-center">
                  01
                </span>
                <span className="font-mono text-[12px] text-[var(--ember)] uppercase font-bold">
                  TỪ QUỐC LỘ 14
                </span>
                <h3 className="font-bold text-[18px] text-[var(--ink)]">
                  Rẽ vào Hẻm 437 Hùng Vương
                </h3>
                <p className="text-[14px] text-[var(--ink-muted)] leading-relaxed">
                  Trục đường chính thuộc Phường Nghĩa Trung, TP. Gia Nghĩa. Tuyến đường thông thoáng có biển dẫn.
                </p>
              </div>

              {/* Bước 2 */}
              <div className="flex flex-col gap-3 relative z-10">
                <span className="font-display font-black text-[32px] text-[var(--ember)] w-14 h-14 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] flex items-center justify-center">
                  02
                </span>
                <span className="font-mono text-[12px] text-[var(--ember)] uppercase font-bold">
                  300M ĐƯỜNG BÊ TÔNG
                </span>
                <h3 className="font-bold text-[18px] text-[var(--ink)]">
                  Đường Bằng Phẳng Rợp Bóng Mát
                </h3>
                <p className="text-[14px] text-[var(--ink-muted)] leading-relaxed">
                  Đoạn đường bê tông phẳng phiu, rợp bóng cây xanh mát dẫn thẳng đến tận cổng Cẩm Cù House.
                </p>
              </div>

              {/* Bước 3 */}
              <div className="flex flex-col gap-3 relative z-10">
                <span className="font-display font-black text-[32px] text-[var(--ember)] w-14 h-14 rounded-sm border border-[var(--line)] bg-[var(--bg-2)] flex items-center justify-center">
                  03
                </span>
                <span className="font-mono text-[12px] text-[var(--ember)] uppercase font-bold">
                  BÃI ĐỖ RỘNG RÃI
                </span>
                <h3 className="font-bold text-[18px] text-[var(--ink)]">
                  Xe 4–16 Chỗ Vào Tận Sân
                </h3>
                <p className="text-[14px] text-[var(--ink-muted)] leading-relaxed">
                  Sân quay đầu xe ô tô thoải mái, bãi đỗ xe miễn phí có camera an ninh quan sát 24/7.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CTA CUỐI: HẸN GẶP BẠN BÊN BỜ SUỐI (SECTION 8.5.4)
           ========================================================================= */}
        <section className="w-full bg-[#0A0E0C] text-[#F2EDE4] py-24 border-t border-[var(--line)] text-center relative overflow-hidden">
          <div className="w-full max-w-[1000px] mx-auto px-5 sm:px-10 flex flex-col items-center gap-6 relative z-10">
            <span className="font-mono text-[12px] uppercase tracking-widest text-[var(--ember-on-dark,#FF6A2B)] font-bold">
              [LỜI CHÀO TỪ CAO NGUYÊN]
            </span>

            <h2 className="font-display font-black text-[clamp(32px,6vw,72px)] uppercase tracking-tight text-white leading-none">
              HẸN GẶP BẠN BÊN BỜ SUỐI
            </h2>

            <p className="text-[16px] sm:text-[18px] max-w-xl" style={{ color: "var(--ink-muted-on-dark)" }}>
              {dict.common.addressFull}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="tel:0382851688"
                onClick={() => trackEvent("click_call")}
                className="px-8 py-4 bg-[var(--ember-on-dark,#FF6A2B)] text-[#0A0E0C] font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>GỌI HOTLINE 038 285 1688</span>
              </a>

              <a
                href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_directions")}
                className="px-8 py-4 bg-transparent border border-white text-white font-mono text-[13px] font-bold uppercase tracking-wider clip-chamfer-14 hover:bg-white hover:text-[#0A0E0C] transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>CHỈ ĐƯỜNG TỚI QUÁN</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
