"use client";

import { useState } from "react";
import { Star, ExternalLink } from "lucide-react";

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
    avatarBg: "bg-[#1D3226] text-[#9DC183] border border-[#9DC183]/30",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 6 (82 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 6 (82 reviews)",
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
    avatarBg: "bg-[#422216] text-[#CC7755] border border-[#CC7755]/30",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 5 (46 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 5 (46 reviews)",
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
    avatarBg: "bg-[#1D3226] text-[#9DC183] border border-[#9DC183]/30",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 7 (140 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 7 (140 reviews)",
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
    avatarBg: "bg-[#422216] text-[#CC7755] border border-[#CC7755]/30",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 4 (32 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 4 (32 reviews)",
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
    avatarBg: "bg-[#1D3226] text-[#9DC183] border border-[#9DC183]/30",
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
    avatarBg: "bg-[#422216] text-[#CC7755] border border-[#CC7755]/30",
    badgeType: "review_count",
    badgeTextVi: "27 bài đánh giá • 14 ảnh",
    badgeTextEn: "27 reviews • 14 photos",
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

// Official 4-color Google G Icon SVG
function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.37 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.24A7.17 7.17 0 0 1 4.9 12c0-.78.14-1.54.37-2.24V6.61H1.26A11.97 11.97 0 0 0 0 12c0 1.92.46 3.74 1.26 5.39l4.01-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

// Google Local Guide orange star badge
function LocalGuideStar({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#E37400" aria-hidden="true">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  );
}

interface GoogleReviewsSectionProps {
  isEn?: boolean;
}

export default function GoogleReviewsSection({ isEn = false }: GoogleReviewsSectionProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!GOOGLE_REVIEWS_DATA || GOOGLE_REVIEWS_DATA.length === 0) {
    return null;
  }

  const googleMapsUrl =
    "https://maps.google.com/?q=C%E1%BA%A9m+C%C3%B9+House+Gia+Ngh%C4%A9a+%C4%90%E1%BA%AFk+N%C3%B4ng";

  return (
    <section className="container-unified section-unified overflow-hidden">
      {/* 1. Header & Social Proof Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        {/* Pill Badge: [Logo Google 4 màu] Đánh giá được xác minh trên Google Maps */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-green)] mb-4 shadow-sm">
          <GoogleGIcon className="w-4 h-4 shrink-0" />
          <span>
            {isEn
              ? "Verified Reviews on Google Maps"
              : "Đánh giá được xác minh trên Google Maps"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>

        {/* Big Rating 4.9 + Stars: Tương phản cao ở cả sáng & tối */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
          <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] tracking-tight">
            4.9
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center gap-1 text-[#FBBC04]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FBBC04] text-[#FBBC04]" />
              ))}
            </div>
            <span className="text-[14px] font-semibold text-[var(--text-muted)] mt-1">
              {isEn ? "4.9 / 5.0 Rating" : "4.9 / 5.0 Tuyệt Vời"}
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-bold tracking-tight mb-2 max-w-[900px] mx-auto text-balance">
          {isEn ? "Reflections from Visiting Guests" : "Cảm Nhận Từ Lữ Khách Ghé Chơi"}
        </h2>

        {/* Subtitle */}
        <p className="text-[15px] sm:text-[16px] font-medium text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          {isEn
            ? "Based on over 120+ authentic reviews from guests visiting Cẩm Cù House in Gia Nghĩa, Đắk Nông"
            : "Dựa trên hơn 120+ lượt đánh giá từ khách ghé thăm Cẩm Cù House tại Gia Nghĩa, Đắk Nông"}
        </p>

        {/* Top CTA Button */}
        <div className="mt-5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase"
          >
            <span>
              {isEn
                ? "View All Reviews on Google Maps"
                : "Xem tất cả đánh giá trên Google Maps"}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-clay)]" />
          </a>
        </div>
      </div>

      {/* 2. Google Reviews Marquee Track (Auto-slide, pause on hover) */}
      <div
        className="relative w-full overflow-hidden mask-gradient-x"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className="animate-marquee-track flex gap-5 sm:gap-6 pb-6 pt-1"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* Double list for seamless infinite loop */}
          {[...GOOGLE_REVIEWS_DATA, ...GOOGLE_REVIEWS_DATA].map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-[340px] sm:w-[420px] shrink-0 card-unified flex flex-col justify-between group"
            >
              {/* Card Header: Avatar, Name, Google Badge */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Brand Synchronized Initial Avatar */}
                    <div
                      className={`w-11 h-11 rounded-full ${review.avatarBg} font-bold text-base flex items-center justify-center shrink-0 shadow-sm select-none`}
                    >
                      {review.initial}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[17px] sm:text-[18px] font-semibold text-[var(--text)] truncate leading-tight group-hover:text-[var(--accent-clay)] transition-colors">
                        {review.name}
                      </h3>

                      {review.badgeType === "local_guide" ? (
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent-clay)] mt-1 truncate">
                          <LocalGuideStar className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {isEn ? review.badgeTextEn : review.badgeTextVi}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[var(--text-muted)] mt-1 truncate font-medium">
                          {isEn ? review.badgeTextEn : review.badgeTextVi}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Google small logo stamp */}
                  <div className="shrink-0 p-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
                    <GoogleGIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Rating Stars & Relative Time */}
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="flex items-center gap-0.5 text-[#FBBC04]">
                    {[...Array(review.rating)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-[#FBBC04] text-[#FBBC04]" />
                    ))}
                  </div>
                  <span className="text-[var(--text-muted)] font-bold">•</span>
                  <span className="text-[14px] text-[var(--text-muted)] font-medium">
                    {isEn ? review.timeEn : review.timeVi}
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-[var(--text)] text-[15px] sm:text-[16px] font-medium leading-[1.7] mb-5">
                  &ldquo;{isEn ? review.contentEn : review.contentVi}&rdquo;
                </p>
              </div>

              {/* Review Meta Tags: Service, Price, Recommendation */}
              <div className="pt-3.5 border-t border-[var(--border)] flex flex-col gap-2 text-[14px] text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--accent-green)] border border-[var(--border)] font-semibold text-[12px] uppercase tracking-wider">
                    {isEn ? review.dineInEn : review.dineInVi}
                  </span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="font-semibold text-[var(--text)]">
                    {isEn ? review.priceEn : review.priceVi}
                  </span>
                </div>

                <div className="text-[14px] text-[var(--text-muted)] truncate">
                  <span className="font-semibold text-[var(--text-muted)]">
                    {isEn ? "Recommended: " : "Đề xuất: "}
                  </span>
                  <span className="text-[var(--accent-clay)] font-semibold">
                    {isEn ? review.recommendEn : review.recommendVi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Utility Hint */}
      <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] mt-2">
        <span>{isEn ? "Hover or touch cards to pause sliding" : "Rê chuột hoặc chạm vào thẻ để tạm dừng trượt"}</span>
      </div>
    </section>
  );
}
