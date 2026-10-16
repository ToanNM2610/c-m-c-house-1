"use client";

import { Star, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
    avatarBg: "bg-[var(--pine)] text-[var(--mist)]",
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
    avatarBg: "bg-[var(--ember)] text-[#0A0E0C]",
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
    avatarBg: "bg-[var(--mist)] text-[#0A0E0C]",
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
    avatarBg: "bg-[var(--ember)] text-[#0A0E0C]",
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
    avatarBg: "bg-[var(--pine)] text-[var(--mist)]",
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
    name: "An Nhiên (Gia Đình Nhỏ)",
    initial: "A",
    avatarBg: "bg-[var(--gold)] text-[#0A0E0C]",
    badgeType: "review_count",
    badgeTextVi: "28 bài đánh giá",
    badgeTextEn: "28 reviews",
    rating: 5,
    timeVi: "2 tháng trước",
    timeEn: "2 months ago",
    contentVi:
      "Một nơi trốn bình yên thực sự. Không tiếng còi xe, chỉ có tiếng gió xào xạc và tiếng suối. Menu nhiều món thanh mát, có cả nước ép trái cây tươi cho mẹ và bé. Chắc chắn sẽ quay lại nhiều lần.",
    contentEn:
      "A truly tranquil hideaway. Zero traffic noise, only whispering breezes and singing stream waters. The menu has plenty of wholesome refreshments. We will definitely return often.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 50.000 đ/người",
    priceEn: "30,000 – 50,000 VND/person",
    recommendVi: "Nước ép cóc ổi sơ ri, Cà phê cốt dừa",
    recommendEn: "Tropical Fresh Juices, Coconut Iced Coffee",
  },
];

function ReviewCard({ review, isEn }: { review: GoogleReview; isEn: boolean }) {
  return (
    <div className="shrink-0 w-[350px] sm:w-[420px] bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 p-6 flex flex-col justify-between gap-4 select-none transition-all hover:border-[var(--ember)]/60 hover:shadow-lg">
      <div className="flex flex-col gap-3">
        {/* Header reviewer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-[15px] font-mono shrink-0 ${review.avatarBg}`}
            >
              {review.initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[15px] text-[var(--ink)] truncate">
                {review.name}
              </span>
              <span className="font-mono text-[11px] text-[var(--mist)] truncate">
                {isEn ? review.badgeTextEn : review.badgeTextVi}
              </span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 text-[var(--gold)] shrink-0">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
        </div>

        {/* Nội dung nguyên văn */}
        <p className="text-[14px] sm:text-[15px] text-[var(--ink-muted)] leading-relaxed italic line-clamp-4">
          &ldquo;{isEn ? review.contentEn : review.contentVi}&rdquo;
        </p>
      </div>

      {/* Meta chi tiết: Dùng tại chỗ, Giá, Đề xuất */}
      <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[var(--ink-muted)]">
        <span className="text-[var(--ember)] font-semibold">
          {isEn ? review.dineInEn : review.dineInVi} · {isEn ? review.priceEn : review.priceVi}
        </span>
        <span className="truncate max-w-[200px]">
          ★ {isEn ? review.recommendEn : review.recommendVi}
        </span>
      </div>
    </div>
  );
}

export default function GoogleReviewsSection() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const row1 = [GOOGLE_REVIEWS_DATA[0], GOOGLE_REVIEWS_DATA[1], GOOGLE_REVIEWS_DATA[2]];
  const row2 = [GOOGLE_REVIEWS_DATA[3], GOOGLE_REVIEWS_DATA[4], GOOGLE_REVIEWS_DATA[5]];

  return (
    <section className="w-full py-24 sm:py-32 bg-[var(--bg)] text-[var(--ink)] relative overflow-hidden transition-colors border-t border-b border-[var(--line)]">
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-[var(--ember)]">
              <span>[06] CẢM NHẬN KHÁCH HÀNG</span>
              <span>·</span>
              <span>GOOGLE MAPS 100% THỰC TẾ</span>
            </div>
            <h2 className="font-display font-black text-[clamp(32px,5.5vw,64px)] uppercase tracking-tight text-[var(--ink)] leading-none">
              TRẢI NGHIỆM ĐẠI NGÀN <span className="font-serif italic font-normal text-[var(--ember)] lowercase">từ du khách</span>
            </h2>
          </div>

          {/* Điểm 4.9 khổng lồ + 5 Sao vàng (Section 8.1.7) */}
          <div className="flex items-center gap-5 shrink-0 bg-[var(--card)] border border-[var(--line)] clip-chamfer-14 px-6 py-4">
            <span className="font-display font-black text-[52px] sm:text-[64px] text-[var(--ember)] leading-none">
              4.9
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
                100% ĐỀ XUẤT HÀI LÒNG
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Hàng thẻ kính mờ chạy ngược chiều, dừng khi rê chuột (Section 8.1.7) */}
      <div className="flex flex-col gap-6 overflow-hidden group">
        {/* Hàng 1: Trôi sang trái */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <div className="flex gap-6 shrink-0 pr-6">
            {[...row1, ...row1].map((review, idx) => (
              <ReviewCard key={`r1a-${review.id}-${idx}`} review={review} isEn={isEn} />
            ))}
          </div>
          <div className="flex gap-6 shrink-0 pr-6" aria-hidden="true">
            {[...row1, ...row1].map((review, idx) => (
              <ReviewCard key={`r1b-${review.id}-${idx}`} review={review} isEn={isEn} />
            ))}
          </div>
        </div>

        {/* Hàng 2: Trôi sang phải */}
        <div className="flex w-max animate-marquee-reverse group-hover:[animation-play-state:paused]">
          <div className="flex gap-6 shrink-0 pr-6">
            {[...row2, ...row2].map((review, idx) => (
              <ReviewCard key={`r2a-${review.id}-${idx}`} review={review} isEn={isEn} />
            ))}
          </div>
          <div className="flex gap-6 shrink-0 pr-6" aria-hidden="true">
            {[...row2, ...row2].map((review, idx) => (
              <ReviewCard key={`r2b-${review.id}-${idx}`} review={review} isEn={isEn} />
            ))}
          </div>
        </div>
      </div>

      {/* Nút Xem tất cả đánh giá trên Google Maps (Section 8.1.7) */}
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-10 mt-12 flex justify-center">
        <a
          href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[13px] uppercase font-bold tracking-wider px-6 py-3.5 bg-[var(--card)] border border-[var(--line)] hover:border-[var(--ember)] text-[var(--ink)] clip-chamfer-14 transition-all"
        >
          <span>XEM TẤT CẢ ĐÁNH GIÁ TRÊN GOOGLE MAPS</span>
          <ExternalLink className="w-4 h-4 text-[var(--ember)]" />
        </a>
      </div>
    </section>
  );
}
