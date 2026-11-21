"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquarePlus, ArrowRight } from "lucide-react";
import { GuestComment } from "@/types";

export interface CustomerReviewsSectionProps {
  comments?: GuestComment[];
  lang?: "VN" | "EN";
}

function ReviewCard({
  comment,
  lang = "VN",
}: {
  comment: GuestComment;
  lang?: "VN" | "EN";
}) {
  const [expanded, setExpanded] = useState(false);
  const text = comment.content;
  const rating = comment.rating || 5;

  return (
    <blockquote className="chamfer-14 flex flex-col justify-between whitespace-normal border border-[var(--line)] bg-[var(--card)] p-7 transition-colors hover:border-[var(--ember)] h-full">
      <div>
        <div
          className="flex items-center gap-1 text-sm tracking-wider text-[var(--gold)]"
          aria-label={`${rating} trên 5 sao`}
        >
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
          ))}
        </div>

        {/* Chữ >= 15px, tối đa 4 dòng mỗi thẻ + nút "Đọc thêm" */}
        <p
          className={`mt-3 text-[15.5px] leading-relaxed text-[var(--ink)] ${
            expanded ? "" : "line-clamp-4"
          }`}
        >
          “{text}”
        </p>

        {text.length > 150 && (
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
        )}
      </div>

      <div className="mt-5 border-t border-[var(--line)] pt-3.5 flex items-center justify-between">
        <div>
          <cite className="not-italic text-[15.5px] font-semibold text-[var(--ink)] block">
            {comment.authorName}
          </cite>
          <p className="text-mono-label mt-1 text-[var(--ink-muted)]">
            {comment.visitDate || (lang === "VN" ? "Ghé thăm gần đây" : "Recent visit")}
          </p>
        </div>
        <span className="text-mono-label text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          {lang === "VN" ? "Xác thực" : "Verified"}
        </span>
      </div>
    </blockquote>
  );
}

export default function CustomerReviewsSection({
  comments: initialComments,
  lang = "VN",
}: CustomerReviewsSectionProps) {
  const [comments, setComments] = useState<GuestComment[]>(initialComments || []);
  const [loading, setLoading] = useState<boolean>(!initialComments);

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
      return;
    }
    let isMounted = true;
    async function fetchReviews() {
      try {
        const res = await fetch("/api/comments");
        if (res.ok) {
          const json = await res.json();
          const list: GuestComment[] = Array.isArray(json) ? json : json.data || [];
          if (isMounted) setComments(list);
        }
      } catch (err) {
        console.error("Failed to fetch customer reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [initialComments]);

  // Only render real approved reviews (status === "APPROVED")
  const approved = (comments || []).filter((c) => c.status === "APPROVED");
  const approvedCount = approved.length;
  const recommendedCount = approved.filter((c) => (c.rating ?? 5) >= 4).length;
  const recommendedPercent = approvedCount > 0 ? Math.round((recommendedCount / approvedCount) * 100) : 0;
  const avgRating = approvedCount > 0
    ? (approved.reduce((acc, c) => acc + (c.rating ?? 5), 0) / approvedCount).toFixed(1)
    : "5.0";

  return (
    <section className="border-y border-[var(--line)] bg-[var(--bg-2)] py-20 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
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

            {/* Dynamic Rating Badge: strictly hidden when approvedCount === 0 */}
            {approvedCount > 0 && (
              <div className="mt-4 flex items-baseline gap-6">
                <span className="font-[var(--font-display)] text-[clamp(64px,10vw,136px)] font-extrabold leading-none text-[var(--ember)]">
                  {avgRating}
                </span>
                <div>
                  <div className="flex gap-1 text-2xl text-[var(--gold)]">
                    {[...Array(Math.min(5, Math.max(1, Math.round(Number(avgRating)))))].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                  </div>
                  <p className="text-mono-label mt-2 text-[var(--ink-muted)]">
                    {lang === "VN"
                      ? `${approvedCount} LƯỢT ĐÁNH GIÁ · ${recommendedPercent}% ĐỀ XUẤT HÀI LÒNG`
                      : `${approvedCount} REVIEWS · ${recommendedPercent}% SATISFACTION RECOMMENDED`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/khach-hang#feedback-form"
              className="btn-outline chamfer-14 inline-flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4 text-[var(--ember)]" />
              <span>
                {lang === "VN" ? "Gửi cảm nhận của bạn" : "Submit your review"}
              </span>
            </Link>

            <a
              href="https://maps.google.com/?q=11.99,107.69"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline chamfer-14 inline-flex items-center gap-2"
            >
              <span>
                {lang === "VN"
                  ? "Xem tất cả trên Google Maps"
                  : "View all on Google Maps"}
              </span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Dynamic Reviews Container */}
        {loading ? (
          <div className="mt-12 py-12 text-center text-xs font-mono text-[var(--ink-muted)]">
            {lang === "VN" ? "Đang tải đánh giá thực khách..." : "Loading customer reviews..."}
          </div>
        ) : approvedCount === 0 ? (
          /* Dynamic Empty State: Genuine Invitation */
          <div className="mt-12 p-8 sm:p-12 text-center rounded-3xl border border-[var(--line)] bg-[var(--card)] max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[var(--ember)] flex items-center justify-center mx-auto">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <p className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                {lang === "VN"
                  ? "Chưa có đánh giá nào từ thực khách — Hãy là người đầu tiên chia sẻ trải nghiệm thực tế của bạn bên dưới!"
                  : "No reviews from guests yet — Be the first to share your authentic experience below!"}
              </p>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md mx-auto">
                {lang === "VN"
                  ? "Mỗi lời đóng góp chân thực từ bạn giúp Cẩm Cù House hoàn thiện không gian sinh thái bên bờ suối."
                  : "Every genuine thought from our guests helps nurture our streamside botanical sanctuary."}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/khach-hang#feedback-form"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--ember)] text-white font-mono text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <span>{lang === "VN" ? "Chia sẻ trải nghiệm ngay" : "Share Your Experience"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : approvedCount === 1 ? (
          /* 1 Review Clean Layout: Centered without duplicate cards */
          <div className="mt-12 max-w-lg mx-auto">
            <ReviewCard comment={approved[0]} lang={lang} />
          </div>
        ) : approvedCount === 2 ? (
          /* 2 Reviews Clean Layout: 2-column without duplicate cards */
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 items-stretch">
            {approved.map((rev) => (
              <ReviewCard key={rev.id} comment={rev} lang={lang} />
            ))}
          </div>
        ) : (
          /* >= 3 Reviews: 3-card horizontal layout without duplicate cards */
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {approved.slice(0, 3).map((rev) => (
              <ReviewCard key={rev.id} comment={rev} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
