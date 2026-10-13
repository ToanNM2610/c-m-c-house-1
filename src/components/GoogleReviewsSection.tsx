"use client";

import { useState, useEffect } from "react";
import { Star, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import ContourLines from "@/components/ui/ContourLines";

interface GoogleReview {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  badgeType: "local_guide" | "review_count";
  badgeTextVi: string;
  badgeTextEn: string;
  rating: number;
  timeVi: string;
  timeEn: string;
  contentVi: string;
  contentEn: string;
  dineInVi: string;
  dineInEn: string;
  priceVi: string;
  priceEn: string;
  recommendVi: string;
  recommendEn: string;
}

const GOOGLE_REVIEWS_DATA: GoogleReview[] = [
  {
    id: "rev-1",
    name: "Minh Quân Nguyễn",
    initial: "Q",
    avatarBg: "bg-[#2D4233] text-[#9DBB74]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide · Cấp 6 (82 bài đánh giá)",
    badgeTextEn: "Local Guide · Level 6 (82 reviews)",
    rating: 5,
    timeVi: "2 tuần trước",
    timeEn: "2 weeks ago",
    contentVi:
      "Không gian bên suối siêu mát mẻ, nước chảy róc rách ngồi uống cà phê muối rất thư thái. Đường bê tông xe 7 chỗ vào tận sân quán rộng rãi. Chủ quán nhiệt tình, đồ uống giá chỉ 25k-40k mà vị rất đậm đà.",
    contentEn:
      "The stream atmosphere is amazingly cool and tranquil; sipping salted coffee while listening to babbling water is pure bliss. Concrete road easily accommodates 7-seater cars right into the yard.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 45.000 đ/người",
    priceEn: "30,000 – 45,000 VND/person",
    recommendVi: "Cà phê muối, Trà đào cam sả",
    recommendEn: "Salted Coffee, Peach Lemongrass Tea",
  },
  {
    id: "rev-2",
    name: "Hồng Hạnh (Hanh Leo)",
    initial: "H",
    avatarBg: "bg-[#A8452A] text-white",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide · Cấp 5 (46 bài đánh giá)",
    badgeTextEn: "Local Guide · Level 5 (46 reviews)",
    rating: 5,
    timeVi: "3 tuần trước",
    timeEn: "3 weeks ago",
    contentVi:
      "Gia đình mình đi từ Buôn Ma Thuột về ghé quán ăn sáng uống cà phê. Quán có điểm tâm bò kho bánh mì và mì tôm rất ngon, các bé thích mê lội chân suối nước trong vắt. Rất đáng trải nghiệm khi đến Gia Nghĩa!",
    contentEn:
      "Our family stopped by for breakfast and coffee. The beef stew bread and hot noodles were delicious, and our kids loved dipping their feet into the crystal stream water.",
    dineInVi: "Điểm tâm & Nước",
    dineInEn: "Breakfast & Drinks",
    priceVi: "40.000 – 60.000 đ/người",
    priceEn: "40,000 – 60,000 VND/person",
    recommendVi: "Bò kho bánh mì, Cà phê sữa rang củi",
    recommendEn: "Beef Stew Bread, Wood-fired Milk Coffee",
  },
  {
    id: "rev-3",
    name: "Trần Đức Trọng",
    initial: "T",
    avatarBg: "bg-[#2C5A4A] text-[#7FC2A8]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide · Cấp 7 (140 bài đánh giá)",
    badgeTextEn: "Local Guide · Level 7 (140 reviews)",
    rating: 5,
    timeVi: "1 tháng trước",
    timeEn: "1 month ago",
    contentVi:
      "Một viên ngọc ẩn giữa Gia Nghĩa! Cà phê rang củi mộc chuẩn gu người sành, thơm nồng không hề có bơ hay hương liệu công nghiệp. Ngồi chòi gỗ ngắm đồi xanh ngút ngàn, gió mát rượi không cần máy lạnh.",
    contentEn:
      "A hidden gem in Gia Nghia! Authentic wood-fired roasted coffee with pure robust aroma without artificial additives. Sitting in the wooden hut gazing at misty green hills is therapeutic.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "25.000 – 35.000 đ/người",
    priceEn: "25,000 – 35,000 VND/person",
    recommendVi: "Cà phê đen rang củi, Trà mộc hoa cúc",
    recommendEn: "Wood-fired Black Coffee, Chamomile Tea",
  },
  {
    id: "rev-4",
    name: "Thùy Trang Travel",
    initial: "T",
    avatarBg: "bg-[#E0764F] text-[#1C1612]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide · Cấp 4 (32 bài đánh giá)",
    badgeTextEn: "Local Guide · Level 4 (32 reviews)",
    rating: 5,
    timeVi: "1 tháng trước",
    timeEn: "1 month ago",
    contentVi:
      "Góc check-in bờ suối chụp hình lên thơ mộng dã man. Ánh nắng rọi qua kẽ lá xuống mặt suối lung linh. Nhân viên và cô chú chủ quán dễ thương mộc mạc đúng chất người Đắk Nông.",
    contentEn:
      "Picturesque stream photography spots with golden sunlight filtering through tree canopies. The owners are warmly hospitable with authentic Dak Nong sincerity.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 50.000 đ/người",
    priceEn: "30,000 – 50,000 VND/person",
    recommendVi: "Trà thảo mộc mật ong, Sinh tố bơ Đắk Nông",
    recommendEn: "Wild Honey Herbal Tea, Dak Nong Avocado Smoothie",
  },
  {
    id: "rev-5",
    name: "Lê Văn Thắng",
    initial: "T",
    avatarBg: "bg-[#5E7A3E] text-white",
    badgeType: "review_count",
    badgeTextVi: "19 bài đánh giá",
    badgeTextEn: "19 reviews",
    rating: 5,
    timeVi: "2 tháng trước",
    timeEn: "2 months ago",
    contentVi:
      "Quán có bãi đỗ xe ô tô cực rộng, xe 16 chỗ vào quay đầu êm ru. Thích hợp cho đoàn du lịch nghỉ chân trên cung đường khám phá Đắk Nông. Đồ uống pha chế sạch sẽ, giá cả niêm yết rõ ràng.",
    contentEn:
      "Spacious parking courtyard accommodating up to 16-seater vans comfortably. Perfect rest stop for travelers exploring Dak Nong. Clean prep station and transparent pricing.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 40.000 đ/người",
    priceEn: "30,000 – 40,000 VND/person",
    recommendVi: "Cà phê sữa đá, Nước ép cam nguyên chất",
    recommendEn: "Iced Milk Coffee, Fresh Orange Juice",
  },
  {
    id: "rev-6",
    name: "Thu Phương",
    initial: "P",
    avatarBg: "bg-[#3E2723] text-[#F0C566]",
    badgeType: "review_count",
    badgeTextVi: "27 bài đánh giá · 14 ảnh",
    badgeTextEn: "27 reviews · 14 photos",
    rating: 5,
    timeVi: "1 tháng trước",
    timeEn: "1 month ago",
    contentVi:
      "Quán giữ được nét mộc mạc nguyên bản của Tây Nguyên, rặng cây xanh mướt và tiếng suối róc rách xua tan mệt mỏi đường dài. Rất recommend mọi người ghé qua!",
    contentEn:
      "Preserves the raw charm of the Central Highlands; verdant trees and babbling stream water wash away travel fatigue. Highly recommend!",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~40.000 đ/người",
    priceEn: "~40,000 VND/person",
    recommendVi: "Trà thảo mộc, Bò kho bánh mì",
    recommendEn: "Herbal Tea, Beef Stew Bread",
  },
];

interface GoogleReviewsSectionProps {
  isEn?: boolean;
}

/**
 * Cảm nhận khách (Section 8.1.6):
 * Khối --charcoal: điểm 4.9 + sao vàng khổng lồ;
 * Một trích dẫn lớn (Fraunces 36px) chuyển tự động mỗi 7s;
 * Dải avatar tròn bên dưới để chọn; nút "Xem tất cả đánh giá trên Google Maps".
 */
export default function GoogleReviewsSection({ isEn = false }: GoogleReviewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển quote mỗi 7s (Section 8.1.6)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GOOGLE_REVIEWS_DATA.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeReview = GOOGLE_REVIEWS_DATA[activeIndex];
  const googleMapsUrl =
    "https://maps.google.com/?q=C%E1%BA%A9m+C%C3%B9+House+Gia+Ngh%C4%A9a+%C4%90%E1%BA%AFk+N%C3%B4ng";

  return (
    <section
      className="w-full bg-[#1C1612] text-[#F4ECDD] py-20 lg:py-28 relative overflow-hidden transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Đường đồng mức mờ nền charcoal */}
      <ContourLines opacity={0.08} className="text-[#F4ECDD]" />

      <div className="container-unified relative z-10">
        {/* Điểm 4.9 + Sao vàng khổng lồ (Section 8.1.6) */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A201A] border border-[rgba(244,236,221,0.14)] font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--flower)] mb-6 shadow-xs">
            <span>{isEn ? "VERIFIED GOOGLE MAPS REVIEWS" : "ĐÁNH GIÁ XÁC MINH TRÊN GOOGLE MAPS"}</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F4ECDD] tracking-tight">
              4.9
            </span>
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-1.5 text-[var(--flower)]">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-6 h-6 sm:w-7 sm:h-7 fill-[var(--flower)] text-[var(--flower)]" />
                ))}
              </div>
              <span className="font-mono text-[12px] text-[#C7BBA8] uppercase tracking-wider mt-1">
                {isEn ? "OVERALL EXPERIENCE" : "120+ LƯỢT ĐÁNH GIÁ HÀI LÒNG"}
              </span>
            </div>
          </div>
        </div>

        {/* Trích dẫn lớn Fraunces 36px (Section 8.1.6) */}
        <div className="max-w-4xl mx-auto bg-[#231C17] border border-[rgba(244,236,221,0.14)] rounded-[28px] p-6 sm:p-10 lg:p-12 shadow-2xl relative">
          {/* Controls: Prev / Next */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(244,236,221,0.1)]">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${activeReview.avatarBg} font-serif font-bold text-lg flex items-center justify-center shrink-0 shadow-xs select-none`}>
                {activeReview.initial}
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F4ECDD]">
                  {activeReview.name}
                </h3>
                <p className="font-mono text-xs text-[var(--basalt)] tracking-wider">
                  {isEn ? activeReview.badgeTextEn : activeReview.badgeTextVi}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + GOOGLE_REVIEWS_DATA.length) % GOOGLE_REVIEWS_DATA.length)}
                className="w-10 h-10 rounded-full bg-[#2E241E] border border-[rgba(244,236,221,0.14)] text-[#F4ECDD] hover:bg-[#3D3028] flex items-center justify-center transition-colors"
                aria-label="Đánh giá trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % GOOGLE_REVIEWS_DATA.length)}
                className="w-10 h-10 rounded-full bg-[#2E241E] border border-[rgba(244,236,221,0.14)] text-[#F4ECDD] hover:bg-[#3D3028] flex items-center justify-center transition-colors"
                aria-label="Đánh giá tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nội dung trích dẫn lớn Fraunces 36px */}
          <blockquote className="font-serif text-[22px] sm:text-[30px] lg:text-[36px] font-medium text-[#F4ECDD] leading-[1.3] my-6 transition-opacity duration-500">
            &ldquo;{isEn ? activeReview.contentEn : activeReview.contentVi}&rdquo;
          </blockquote>

          {/* Thông tin kèm theo: Dùng tại chỗ · giá/người · Đề xuất (nguyên văn) */}
          <div className="pt-6 border-t border-[rgba(244,236,221,0.1)] flex flex-wrap items-center justify-between gap-4 font-mono text-[13px] text-[#C7BBA8]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#2E241E] text-[var(--stream)] border border-[rgba(244,236,221,0.1)] uppercase font-semibold">
                {isEn ? activeReview.dineInEn : activeReview.dineInVi}
              </span>
              <span>·</span>
              <span className="text-[#F4ECDD] font-semibold">
                {isEn ? activeReview.priceEn : activeReview.priceVi}
              </span>
            </div>

            <div className="text-[var(--flower)]">
              <span className="text-[#C7BBA8] font-normal">{isEn ? "Recommended: " : "Đề xuất: "}</span>
              <span className="font-semibold">{isEn ? activeReview.recommendEn : activeReview.recommendVi}</span>
            </div>
          </div>
        </div>

        {/* Dải avatar tròn bên dưới để chọn (Section 8.1.6) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8">
          {GOOGLE_REVIEWS_DATA.map((review, idx) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "ring-2 ring-[var(--basalt)] scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Chọn đánh giá của ${review.name}`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${review.avatarBg} font-serif font-bold text-sm flex items-center justify-center select-none shadow-xs`}>
                {review.initial}
              </div>
            </button>
          ))}
        </div>

        {/* Nút "Xem tất cả đánh giá trên Google Maps" (Section 8.1.6) */}
        <div className="flex justify-center mt-10">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-3 px-7 text-[14px] font-semibold inline-flex items-center gap-2 !border-[rgba(244,236,221,0.25)] !text-[#F4ECDD] hover:!bg-[#F4ECDD] hover:!text-[#1C1612]"
          >
            <span>{isEn ? "View all reviews on Google Maps" : "Xem tất cả đánh giá trên Google Maps"}</span>
            <ExternalLink className="w-4 h-4 text-[var(--basalt)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
