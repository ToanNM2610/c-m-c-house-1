"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 1. Đường cong hữu cơ ngăn cách các section (Mục A2.3)
export function OrganicWaveDivider({
  fill = "var(--mist)",
  flip = false,
}: {
  fill?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none ${
        flip ? "rotate-180" : ""
      }`}
    >
      <svg
        viewBox="0 0 1440 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[36px] w-full md:h-[56px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0 34C240 68 480 0 720 28C960 56 1200 8 1440 34V68H0V34Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// 2. Hoa Hoya sao 5 cánh nét mảnh vẽ dần (Mục A2.4 & A9)
export function HoyaStarIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-[var(--clay)]"
    >
      <path
        d="M20 3L24.8 14.2L37 15.6L27.8 23.6L30.5 35.5L20 29.2L9.5 35.5L12.2 23.6L3 15.6L15.2 14.2L20 3Z"
        style={{
          strokeDasharray: 140,
          strokeDashoffset: 0,
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <circle cx="20" cy="20" r="3.5" />
    </svg>
  );
}

// 3. Thẻ "Tiếp theo" cuối mỗi trang mời sang trang kế (Mục A2 & A7.6)
export function NextPageInvitationCard({
  nextTitle,
  nextHref,
  description,
  imageSrc,
}: {
  nextTitle: string;
  nextHref: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-12">
      <Link
        href={nextHref}
        prefetch={true}
        className="group block rounded-[28px] border border-[var(--line)] bg-[var(--mist)] p-8 transition-all duration-500 hover:shadow-xl lg:p-12"
      >
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="h6-label inline-flex items-center gap-2 rounded-full bg-[var(--cream)] px-4 py-1.5 text-[var(--forest)]">
              <span className="h-2 w-2 rounded-full bg-[var(--clay)]" />
              Hành trình tiếp nối bên bờ suối
            </span>
            <h2 className="h2-morning mt-4 text-[var(--ink)] transition-transform duration-500 group-hover:translate-x-1">
              Tiếp theo:{" "}
              <span className="italic text-[var(--clay)]">{nextTitle}</span> →
            </h2>
            <p className="mt-3 max-w-[56ch] text-[17px] text-[var(--ink-muted)]">
              {description}
            </p>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="arch-frame h-52 w-44 border-4 border-[var(--cream)] shadow-md transition-transform duration-700 group-hover:scale-[1.04]">
              <img
                src={imageSrc}
                alt={nextTitle}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

// 4. Chuyển trang màn sương kem + xanh sương hình vòm <= 0.9s (Mục A2.2 & A9)
const PAGE_NAMES: Record<string, string> = {
  "/": "Cẩm Cù House",
  "/cau-chuyen": "Câu Chuyện Cẩm Cù",
  "/khong-gian": "Không Gian Suối Đá",
  "/thuc-don": "Thực Đơn Mộc Mạc",
  "/lien-he": "Chỉ Đường & Liên Hệ",
};

export function ArchMistPageTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setActive(true);
    const timer = setTimeout(() => setActive(false), 880); // <= 0.9s theo Mục A9
    return () => clearTimeout(timer);
  }, [pathname, firstLoad]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden"
    >
      <div
        className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-t from-[var(--cream)] via-[var(--mist)] to-[var(--cream)]"
        style={{
          borderRadius: "999px 999px 0 0",
          animation: "archMistDome 0.88s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <HoyaStarIcon size={36} />
        <p className="mt-4 font-[var(--font-fraunces)] text-[clamp(32px,5vw,56px)] font-medium text-[var(--forest)]">
          {PAGE_NAMES[pathname] ?? "Cẩm Cù House"}
        </p>
      </div>
    </div>
  );
}
