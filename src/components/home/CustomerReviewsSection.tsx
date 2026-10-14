"use client";

import React, { useState } from "react";

export interface ReviewItem {
  id: string;
  author: string;
  meta: string;
  contentVn: string;
  contentEn: string;
}

// Giữ nguyên văn 100% nội dung đánh giá từ bản gốc (Mục 1, 3, 4)
export const ORIGINAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Minh Anh Nguyễn",
    meta: "Local Guide · Đánh giá trên Google Maps",
    contentVn:
      "Không gian bên suối cực kỳ mát mẻ, tiếng nước chảy nghe rất thư giãn. Đồ uống ngon mà giá bình dân bất ngờ, ngồi cả buổi sáng dưới tán cây rừng nghe tiếng suối đá chảy róc rách thực sự quên hết mệt mỏi nơi phố thị.",
    contentEn:
      "The streamside space is wonderfully cool with soothing water sounds. Drinks are delicious at surprisingly affordable prices; sitting under the forest canopy all morning by the basalt stream truly melts away city fatigue.",
  },
  {
    id: "rev-2",
    author: "Trần Quốc Bảo",
    meta: "Khách du lịch · Đánh giá trên Google Maps",
    contentVn:
      "Đường vào Hẻm 437 Hùng Vương rộng rãi, xe 7 chỗ của gia đình mình vào tận sân đỗ thoải mái. Cà phê đậm vị Tây Nguyên, các bé rất thích khu vực cầu gỗ ngắm dòng suối trong vắt.",
    contentEn:
      "Theconcrete road into Alley 437 Hung Vuong is spacious, our family 7-seater drove right into the free parking yard. Strong Central Highlands coffee, and the kids loved the wooden bridge overlooking the clear stream.",
  },
  {
    id: "rev-3",
    author: "Lê Thu Hương",
    meta: "Gia Nghĩa · Đánh giá trên Google Maps",
    contentVn:
      "Quán giữ được nét mộc mạc tự nhiên, nhiều góc chụp ảnh đẹp bên bờ suối đá bazan, nhân viên nhiệt tình dễ thương. Buổi chiều lên đèn vàng ấm áp nhìn như một thước phim giữa đại ngàn.",
    contentEn:
      "The cafe preserves its natural rustic charm with plenty of scenic photo spots along the basalt stream and warm, friendly staff. In the late afternoon, the warm lights look like a cinematic scene in the highlands.",
  },
  {
    id: "rev-4",
    author: "Hoàng Đình Phong",
    meta: "Local Guide · Đánh giá trên Google Maps",
    contentVn:
      "Một chốn dừng chân đúng nghĩa ở Gia Nghĩa. Ngồi dưới tán cây nghe tiếng suối róc rách, thưởng thức ly cà phê muối và sinh tố bơ sáp Đắk Nông tươi ngon với mức giá chỉ từ 20k đến 45k.",
    contentEn:
      "A true retreat in Gia Nghia. Sitting under the trees listening to the babbling stream while enjoying salted coffee and fresh Dak Nong avocado smoothie priced reasonably from 20k to 45k.",
  },
];

function ReviewCard({
  review,
  lang = "VN",
}: {
  review: ReviewItem;
  lang?: "VN" | "EN";
}) {
  const [expanded, setExpanded] = useState(false);
  const text = lang === "VN" ? review.contentVn : review.contentEn;

  return (
    <blockquote className="chamfer-14 flex w-[380px] shrink-0 flex-col justify-between whitespace-normal border border-[var(--line)] bg-[var(--card)]/95 p-7 backdrop-blur-md transition-colors hover:border-[var(--ember)]">
      <div>
        <div
          className="text-sm tracking-wider text-[var(--gold)]"
          aria-label="5 trên 5 sao"
        >
          ★★★★★
        </div>

        {/* 4. Chữ >= 15px, tối đa 4 dòng mỗi thẻ + nút "Đọc thêm" */}
        <p
          className={`mt-3 text-[15.5px] leading-relaxed text-[var(--ink)] ${
            expanded ? "" : "line-clamp-4"
          }`}
        >
          “{text}”
        </p>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--ember)] underline underline-offset-4 hover:opacity-85"
        >
          {expanded
            ? lang === "VN"
              ? "Thu gọn"
              : "Show less"
            : lang === "VN"
            ? "Đọc thêm"
            : "Read more"}
        </button>
      </div>

      <footer className="mt-5 border-t border-[var(--line)] pt-3.5">
        <cite className="not-italic text-[15.5px] font-semibold text-[var(--ink)]">
          {review.author}
        </cite>
        <p className="text-mono-label mt-1 text-[var(--ink-muted)]">
          {review.meta}
        </p>
      </footer>
    </blockquote>
  );
}

export default function CustomerReviewsSection({
  lang = "VN",
}: {
  lang?: "VN" | "EN";
}) {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--bg-2)] py-20 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            {/* 3. Khôi phục đúng tiêu đề gốc từ commit backup */}
            <p className="text-mono-label text-[var(--ember)]">
              {lang === "VN"
                ? "[05 · ĐÁNH GIÁ TỪ KHÁCH HÀNG]"
                : "[05 · CUSTOMER REVIEWS]"}
            </p>
            <h2 className="text-h2 mt-2">
              {lang === "VN"
                ? "Khách Hàng Nói Gì Về Cẩm Cù House"
                : "What Guests Say About Cẩm Cù House"}
            </h2>

            <div className="mt-4 flex items-baseline gap-6">
              <span className="font-[var(--font-display)] text-[clamp(64px,10vw,136px)] font-extrabold leading-none text-[var(--ember)]">
                4.9
              </span>
              <div>
                <div className="flex gap-1 text-2xl text-[var(--gold)]">
                  ★★★★★
                </div>
                <p className="text-mono-label mt-2 text-[var(--ink-muted)]">
                  {lang === "VN"
                    ? "120+ LƯỢT ĐÁNH GIÁ · 100% ĐỀ XUẤT HÀI LÒNG"
                    : "120+ REVIEWS · 100% SATISFACTION RECOMMENDED"}
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=11.99,107.69"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline chamfer-14"
          >
            <span>
              {lang === "VN"
                ? "Xem tất cả đánh giá trên Google Maps"
                : "View all reviews on Google Maps"}
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Hai hàng thẻ kính mờ chạy ngược chiều, dừng khi rê chuột/chạm */}
      <div className="mt-12 space-y-5 overflow-hidden">
        {[false, true].map((reverse, rowIdx) => (
          <div key={rowIdx} className="flex whitespace-nowrap">
            <div
              className="flex shrink-0 gap-5 px-2.5 hover:[animation-play-state:paused] active:[animation-play-state:paused]"
              style={{
                animation: `${
                  reverse ? "marqueeRight" : "marqueeLeft"
                } 42s linear infinite`,
              }}
            >
              {[...ORIGINAL_REVIEWS, ...ORIGINAL_REVIEWS].map((rev, i) => (
                <ReviewCard key={`${rev.id}-${rowIdx}-${i}`} review={rev} lang={lang} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
