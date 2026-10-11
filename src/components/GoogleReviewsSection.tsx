"use client";

import { useState } from "react";
import { Star, ArrowUpRight, CheckCircle, ThumbsUp } from "lucide-react";

export interface GoogleReviewItem {
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

const GOOGLE_REVIEWS_DATA: GoogleReviewItem[] = [
  {
    id: "review-1",
    name: "Minh Tuấn",
    initial: "T",
    avatarBg: "bg-[#1A73E8]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 6",
    badgeTextEn: "Local Guide • Level 6",
    rating: 5,
    timeVi: "2 tuần trước",
    timeEn: "2 weeks ago",
    contentVi:
      "Quán nằm hơi sâu trong hẻm nhưng vào trong thì bất ngờ vì không gian mở sát bờ suối đá mát rượi. Cà phê rang củi đậm vị, ngồi nghe tiếng suối chảy rất thư thái. Nhân viên thân thiện.",
    contentEn:
      "Tucked inside the alley, but once in, you'll be amazed by the open deck right beside the crystal rock stream. Firewood-roasted coffee is rich and robust, murmuring stream water is pure therapy. Friendly staff.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~40.000 đ/người",
    priceEn: "~40,000 VND/person",
    recommendVi: "Cà phê phin, Trà thảo mộc",
    recommendEn: "Phin Coffee, Herbal Tea",
  },
  {
    id: "review-2",
    name: "Thanh Trúc",
    initial: "T",
    avatarBg: "bg-[#EA4335]",
    badgeType: "review_count",
    badgeTextVi: "18 bài đánh giá • 6 ảnh",
    badgeTextEn: "18 reviews • 6 photos",
    rating: 5,
    timeVi: "1 tháng trước",
    timeEn: "1 month ago",
    contentVi:
      "Ghé quán vào sáng sớm cuối tuần, không khí lành lạnh kiểu Đắk Nông cực thích. Nhiều góc chụp ảnh đẹp mộc mạc, các bé nhà mình thích nhất là được lội chân nước suối.",
    contentEn:
      "Visited early on a weekend morning; that crisp cool Dak Nong breeze was delightful. Plenty of rustic photo spots, and our kids absolutely loved dipping their feet in the stream.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~45.000 đ/người",
    priceEn: "~45,000 VND/person",
    recommendVi: "Trà hoa cúc, Sữa chua hạt sen",
    recommendEn: "Chamomile Tea, Lotus Seed Yogurt",
  },
  {
    id: "review-3",
    name: "Hải Đăng",
    initial: "Đ",
    avatarBg: "bg-[#1E8E3E]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 5",
    badgeTextEn: "Local Guide • Level 5",
    rating: 5,
    timeVi: "3 tuần trước",
    timeEn: "3 weeks ago",
    contentVi:
      "Đi phượt Tây Nguyên tạt vào nghỉ chân. Đồ uống giá hợp lý (khoảng 35k-50k), view thiên nhiên cây cối xanh mướt không bị bê tông hóa. 10/10 cho sự bình yên.",
    contentEn:
      "Stopped by during our Central Highlands road trip. Fairly priced drinks (around 35k-50k), natural lush canopy without concrete clutter. 10/10 for pure peacefulness.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~40.000 đ/người",
    priceEn: "~40,000 VND/person",
    recommendVi: "Cà phê muối, Bò kho bánh mì",
    recommendEn: "Salt Coffee, Beef Stew Bread",
  },
  {
    id: "review-4",
    name: "Ngọc Mai",
    initial: "M",
    avatarBg: "bg-[#E37400]",
    badgeType: "review_count",
    badgeTextVi: "12 bài đánh giá",
    badgeTextEn: "12 reviews",
    rating: 5,
    timeVi: "2 tháng trước",
    timeEn: "2 months ago",
    contentVi:
      "Bánh và trà ngon, không gian yên tĩnh thích hợp ngồi đọc sách hoặc trò chuyện cùng bạn bè. Có dịp quay lại Gia Nghĩa chắc chắn sẽ ghé tiếp.",
    contentEn:
      "Delicious tea and treats, peaceful setting ideal for reading or catching up with friends. Will definitely revisit when returning to Gia Nghia.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~35.000 đ/người",
    priceEn: "~35,000 VND/person",
    recommendVi: "Trà hoa đu đủ, Bánh chuối nướng",
    recommendEn: "Papaya Blossom Tea, Baked Banana Cake",
  },
  {
    id: "review-5",
    name: "Hoàng Nam",
    initial: "N",
    avatarBg: "bg-[#1A73E8]",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 7",
    badgeTextEn: "Local Guide • Level 7",
    rating: 5,
    timeVi: "3 tháng trước",
    timeEn: "3 months ago",
    contentVi:
      "Cà phê muối thơm béo, view suối đá tự nhiên cực chill. Không khí trong lành, nhân viên nhiệt tình chỉ đường. Điểm đến đáng trải nghiệm số 1 tại Gia Nghĩa.",
    contentEn:
      "Rich and creamy salt coffee, natural rock stream view is super chill. Clean air, warm staff guidance. Number 1 experience in Gia Nghia.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~50.000 đ/người",
    priceEn: "~50,000 VND/person",
    recommendVi: "Cà phê muối, Robusta rang củi",
    recommendEn: "Salt Coffee, Firewood Robusta",
  },
  {
    id: "review-6",
    name: "Thu Phương",
    initial: "P",
    avatarBg: "bg-[#8E24AA]",
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

  const googleMapsUrl =
    "https://maps.google.com/?q=C%E1%BA%A9m+C%C3%B9+House+Gia+Ngh%C4%A9a+%C4%90%E1%BA%AFk+N%C3%B4ng";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 overflow-hidden">
      {/* 1. Header & Social Proof Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        {/* Pill Badge: [Logo Google 4 màu] Đánh giá được xác minh trên Google Maps */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#1E2B22] border border-stone-200/90 dark:border-stone-700/70 shadow-xs text-xs font-semibold text-stone-700 dark:text-stone-200 mb-4 transition-transform hover:scale-105">
          <GoogleGIcon className="w-4 h-4 shrink-0" />
          <span>
            {isEn
              ? "Verified Reviews on Google Maps"
              : "Đánh giá được xác minh trên Google Maps"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </div>

        {/* Big Rating + Stars */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3">
          <span className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D4233] dark:text-[#F5F4EE] tracking-tight">
            4.9
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center gap-1 text-[#FBBC04]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FBBC04] text-[#FBBC04]" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 mt-1">
              {isEn ? "4.9 / 5.0 Rating" : "4.9 / 5.0 Tuyệt Vời"}
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="font-serif text-2xl sm:text-4xl text-[#2D4233] dark:text-[#F5F4EE] font-bold tracking-tight mb-2">
          {isEn ? "Reflections from Visiting Guests" : "Cảm Nhận Từ Lữ Khách Ghé Chơi"}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
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
            className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1E2B22] hover:bg-stone-50 dark:hover:bg-[#283C2F] text-[#2D4233] dark:text-[#88B795] border border-stone-300/80 dark:border-stone-700/80 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group"
          >
            <GoogleGIcon className="w-4 h-4 shrink-0" />
            <span>
              {isEn
                ? "View all reviews on Google Maps"
                : "Xem tất cả đánh giá trên Google Maps"}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* 2. Marquee Infinite Slider */}
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
              className="w-[320px] sm:w-[380px] shrink-0 bg-white/95 dark:bg-[#18261D]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-700/70 shadow-sm hover:shadow-xl hover:border-[#3E5C46]/40 dark:hover:border-[#88B795]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Header: Avatar, Name, Google Badge */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Google Initial Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full ${review.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs select-none`}
                    >
                      {review.initial}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-bold text-[#1B281D] dark:text-[#F5F4EE] truncate leading-tight group-hover:text-[#3E5C46] dark:group-hover:text-[#88B795] transition-colors">
                        {review.name}
                      </h3>

                      {review.badgeType === "local_guide" ? (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#E37400] dark:text-[#FFA040] mt-0.5 truncate">
                          <LocalGuideStar className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {isEn ? review.badgeTextEn : review.badgeTextVi}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate font-medium">
                          {isEn ? review.badgeTextEn : review.badgeTextVi}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Google small watermarked logo */}
                  <div className="shrink-0 p-1 rounded-full bg-stone-100 dark:bg-stone-800/60">
                    <GoogleGIcon className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </div>

                {/* Rating Stars & Relative Time */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-[#FBBC04]">
                    {[...Array(review.rating)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]" />
                    ))}
                  </div>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    {isEn ? review.timeEn : review.timeVi}
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-stone-700 dark:text-stone-200 text-xs sm:text-[13px] leading-relaxed mb-4 font-sans line-clamp-4">
                  &ldquo;{isEn ? review.contentEn : review.contentVi}&rdquo;
                </p>
              </div>

              {/* Review Meta Tags: Service, Price, Recommendation */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#1E2B22] text-[#2D4233] dark:text-[#88B795] font-semibold">
                    {isEn ? review.dineInEn : review.dineInVi}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span>{isEn ? review.priceEn : review.priceVi}</span>
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-300 truncate">
                  <span className="font-semibold text-stone-500 dark:text-stone-400">
                    {isEn ? "Recommended: " : "Đề xuất: "}
                  </span>
                  <span>{isEn ? review.recommendEn : review.recommendVi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Utility Hint */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-stone-500 dark:text-stone-400">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FBBC04]" />
        <span>
          {isEn
            ? "Continuous stream • Hover or touch to pause review"
            : "Dải trượt tự động • Rê chuột hoặc chạm để dừng đọc"}
        </span>
      </div>
    </section>
  );
}
