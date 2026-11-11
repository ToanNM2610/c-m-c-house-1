"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import { useLanguage } from "@/context/LanguageContext";
import { usePreOrder } from "@/context/PreOrderContext";
import { trackCustomerAction, saveReservation } from "@/lib/cmsStore";
import {
  MapPin,
  Navigation,
  PhoneCall,
  Mail,
  Clock,
  Calendar,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
  TreePine,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

export default function ContactDirectionsPage() {
  const { locale } = useLanguage();
  const isVi = locale !== "en";
  const { items: preOrderItems, updateQuantity, removeItem, clearTray, totalItems, totalEstimatedAmount } = usePreOrder();

  // Form states
  const [serviceType, setServiceType] = useState<"outdoor" | "takeaway">("outdoor");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("09:00");
  const [specialNote, setSpecialNote] = useState("");
  const [copiedNote, setCopiedNote] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState(false);

  const handleSendReservation = () => {
    if (!customerPhone && !customerName) {
      alert("Vui lòng nhập ít nhất số điện thoại hoặc họ tên để quán xác nhận đặt chỗ.");
      return;
    }

    saveReservation({
      customerName: customerName.trim() || "Khách ghé thăm",
      customerPhone: customerPhone.trim() || "Chưa để lại SĐT",
      guestCount,
      visitDate: visitDate || new Date().toISOString().split("T")[0],
      visitTime: visitTime || "09:00",
      serviceType,
      specialNote: specialNote.trim(),
      preOrderItems: preOrderItems.map((i) => ({
        code: i.code,
        name: i.name,
        variant: i.variant,
        quantity: i.quantity,
        price: i.price ?? 0,
      })),
      totalEstimatedAmount,
    });

    trackCustomerAction("click_call");
    setSubmittedReservation(true);
    setTimeout(() => setSubmittedReservation(false), 5000);
  };

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setVisitDate(today);
  }, []);

  // Validation giờ mở cửa: T2-T5 (7h-18h), T6-CN (7h-22h)
  const hoursValidation = React.useMemo(() => {
    if (!visitDate || !visitTime) return { valid: true, message: "" };

    const dateObj = new Date(visitDate);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const isWeekendHours = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat, Sun

    const [hoursStr, minutesStr] = visitTime.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const totalMinutes = hours * 60 + minutes;

    const openMinutes = 7 * 60; // 07:00
    const closeMinutes = isWeekendHours ? 22 * 60 : 18 * 60; // 22:00 vs 18:00

    if (totalMinutes < openMinutes) {
      return {
        valid: false,
        message: `Quán mở cửa từ 07:00 sáng. Giờ bạn chọn (${visitTime}) chưa tới giờ phục vụ.`,
      };
    }
    if (totalMinutes > closeMinutes) {
      const closingStr = isWeekendHours ? "22:00" : "18:00";
      return {
        valid: false,
        message: `Giờ đóng cửa là ${closingStr}. Giờ bạn chọn (${visitTime}) đã quá giờ hoạt động.`,
      };
    }

    return {
      valid: true,
      message: `Thời gian đến hợp lệ (${isWeekendHours ? "Thứ 6–CN mở đến 22:00" : "Thứ 2–5 mở đến 18:00"}).`,
    };
  }, [visitDate, visitTime]);

  // Soạn sẵn tin nhắn đặt chỗ / đặt món
  const generatedSummary = React.useMemo(() => {
    const typeLabel = serviceType === "outdoor" ? "Ngồi ngoài trời bên suối" : "Đặt mang về (Takeaway)";
    const itemsText =
      preOrderItems.length > 0
        ? preOrderItems
            .map((i) => `- ${i.name} ${i.variant ? `(${i.variant})` : ""} x${i.quantity}`)
            .join("\n")
        : "Chưa chọn món trước (gọi món tại quán)";

    return `Kính gửi Cẩm Cù House,
Tôi muốn đặt chỗ:
- Hình thức: ${typeLabel}
- Khách hàng: ${customerName || "Khách ghé thăm"} (${customerPhone || "Chưa nhập SĐT"})
- Số lượng: ${guestCount} người
- Thời gian đến: ${visitTime} ngày ${visitDate}
- Món đã chọn:
${itemsText}
${specialNote ? `- Ghi chú thêm: ${specialNote}` : ""}
Xin cảm ơn!`;
  }, [serviceType, customerName, customerPhone, guestCount, visitDate, visitTime, preOrderItems, specialNote]);

  const handleCopySummary = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(generatedSummary);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen font-sans selection:bg-[#E86C3A] selection:text-white transition-colors pb-24">
      <main className="w-full">
        {/* MASTHEAD HEADER */}
        <section className="relative w-full py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[#0E100F] text-[#F3F1EC]">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#E86C3A] font-bold">
                [05] CHỈ ĐƯỜNG & LIÊN HỆ · NAVIGATION & ASSISTANT
              </span>
              <span className="text-white/40 font-mono text-xs">·</span>
              <span className="text-white/60 font-mono text-xs">
                {CAM_CU_HOUSE_INFO.address.fullAddress}
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(32px,5.5vw,68px)] uppercase tracking-tight text-[#F3F1EC] leading-[1.25] sm:leading-snug mb-2">
              {isVi ? "CHỈ ĐƯỜNG BẢN ĐỒ & TRỢ LÝ ĐẶT CHỖ" : "DIRECTIONS & RESERVATION ASSISTANT"}
            </h1>

            <p className="font-serif italic text-[20px] sm:text-[24px] text-[#E86C3A] max-w-3xl leading-relaxed">
              {isVi
                ? "Dễ dàng tìm đường đến Cẩm Cù House và chuẩn bị thông tin đặt chỗ nhanh chóng không mất thời gian chờ đợi."
                : "Navigate easily to our sanctuary in lane 437 and prepare your reservation or takeaway order."}
            </p>

            {/* QUICK CONTACT BADGES */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
              <a
                href={CAM_CU_HOUSE_INFO.contacts.primaryTel}
                onClick={() => trackCustomerAction("click_call")}
                className="px-4 py-2 rounded-full bg-[#E86C3A] text-white font-bold inline-flex items-center gap-2 hover:opacity-90"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>HOTLINE 1: 0382 851 688</span>
              </a>

              <a
                href={CAM_CU_HOUSE_INFO.contacts.secondaryTel}
                onClick={() => trackCustomerAction("click_call")}
                className="px-4 py-2 rounded-full bg-white/10 text-white font-bold inline-flex items-center gap-2 hover:bg-white/20"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>HOTLINE 2: 0774 659 000</span>
              </a>

              <a
                href="mailto:thuynhu8788@gmail.com"
                className="px-4 py-2 rounded-full bg-white/10 text-white inline-flex items-center gap-2 hover:bg-white/20"
              >
                <Mail className="w-3.5 h-3.5 text-[#E86C3A]" />
                <span>thuynhu8788@gmail.com</span>
              </a>
            </div>
          </div>
        </section>

        {/* 2 CỘT CHÍNH: KHU VỰC CHỈ ĐƯỜNG (BẢN ĐỒ) & FORM ĐẶT CHỖ TRƯỚC */}
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* CỘT TRÁI (5 CỘT): BẢN ĐỒ & THÔNG TIN CHỈ ĐƯỜNG */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E86C3A]/10 text-[#E86C3A] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold block">
                    ĐỊA CHỈ THỰC TẾ
                  </span>
                  <h2 className="font-display font-extrabold text-[20px] text-[var(--text-primary)]">
                    Cẩm Cù House
                  </h2>
                </div>
              </div>

              <div className="text-[15px] text-[var(--text-secondary)] leading-relaxed space-y-2">
                <p className="font-medium text-[var(--text-primary)]">
                  {CAM_CU_HOUSE_INFO.address.fullAddress}
                </p>
                <p className="text-sm">
                  Tọa độ địa lý: <span className="font-mono text-[#E86C3A]">{CAM_CU_HOUSE_INFO.coordinates.display}</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Chỉ dẫn: Từ đường lớn Hùng Vương, rẽ vào Hẻm 437 đi thẳng khoảng 150m theo biển chỉ dẫn ven suối mát.
                </p>
              </div>

              {/* NÚT MỞ GOOGLE MAPS TRỰC TIẾP */}
              <a
                href={CAM_CU_HOUSE_INFO.socials.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCustomerAction("click_directions")}
                className="w-full py-4 bg-[#E86C3A] text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
              >
                <Navigation className="w-4 h-4" />
                <span>Mở Bản Đồ Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Khung bản đồ trực quan */}
              <div className="w-full h-[280px] rounded-xl overflow-hidden border border-[var(--border-subtle)] relative bg-black/10">
                <iframe
                  title="Google Maps Cẩm Cù House"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.791557008899!2d107.687815!3d11.990000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU5JzI0LjAiTiAxMDfCsDQxJzI0LjAiRQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter contrast-105"
                />
              </div>

              {/* Giờ mở cửa */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2 font-mono text-xs">
                <span className="text-[#E86C3A] font-bold uppercase">LỊCH MỞ CỬA HÀNG TUẦN:</span>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Thứ Hai – Thứ Năm:</span>
                  <span className="font-bold text-[var(--text-primary)]">07:00 – 18:00</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Thứ Sáu – Chủ Nhật:</span>
                  <span className="font-bold text-[#E86C3A]">07:00 – 22:00</span>
                </div>
              </div>
            </div>

            {/* MẠNG XÃ HỘI CHÍNH THỨC */}
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-4">
              <span className="font-mono text-xs uppercase text-[#E86C3A] font-bold tracking-wider">
                KẾT NỐI MẠNG XÃ HỘI
              </span>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={CAM_CU_HOUSE_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[#E86C3A] text-center font-mono text-xs font-bold transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={CAM_CU_HOUSE_INFO.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[#E86C3A] text-center font-mono text-xs font-bold transition-colors"
                >
                  TikTok
                </a>
                <a
                  href={CAM_CU_HOUSE_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[#E86C3A] text-center font-mono text-xs font-bold transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7 CỘT): FORM ĐẶT BÀN TRƯỚC / ĐẶT MANG VỀ */}
          <div id="dat-ban-form" className="lg:col-span-7 flex flex-col gap-8">
            <div className="p-8 sm:p-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-8 shadow-sm">
              <div>
                <span className="font-mono text-xs text-[#E86C3A] uppercase font-bold tracking-widest block">
                  TRỢ LÝ ĐẶT CHỖ & CHUẨN BỊ MÓN
                </span>
                <h2 className="font-display font-black text-[28px] sm:text-[34px] uppercase tracking-tight text-[var(--text-primary)] mt-1">
                  Đặt Chỗ / Đặt Mang Về Nhanh Chóng
                </h2>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                  Chọn hình thức, ngày giờ ghé quán và kiểm tra lại danh sách món đã chọn từ Thực đơn.
                </p>
              </div>

              {/* 1. Chọn hình thức: Ngồi ngoài trời / Mang về */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                  1. Hình Thức Phục Vụ
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType("outdoor")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      serviceType === "outdoor"
                        ? "border-[#E86C3A] bg-[#E86C3A]/10 text-[#E86C3A]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[#E86C3A]/40"
                    }`}
                  >
                    <TreePine className="w-5 h-5 shrink-0" />
                    <div className="text-left">
                      <span className="font-bold text-sm block">Ngồi ngoài trời bên suối</span>
                      <span className="text-xs opacity-75">View thoáng mát, ngắm thiên nhiên</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType("takeaway")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      serviceType === "takeaway"
                        ? "border-[#E86C3A] bg-[#E86C3A]/10 text-[#E86C3A]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[#E86C3A]/40"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 shrink-0" />
                    <div className="text-left">
                      <span className="font-bold text-sm block">Đặt mang về (Takeaway)</span>
                      <span className="text-xs opacity-75">Đóng gói sẵn, ghé lấy nhanh</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Thông tin khách & Số lượng người */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                    Tên Quý Khách
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[#E86C3A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[#E86C3A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                    Số Lượng Khách
                  </label>
                  <div className="flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      className="px-3 py-3 hover:bg-[var(--border-subtle)] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-mono font-bold text-sm">
                      {guestCount} người
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((g) => g + 1)}
                      className="px-3 py-3 hover:bg-[var(--border-subtle)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Ngày giờ đến & Validate giờ mở cửa */}
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                  2. Ngày & Giờ Đến (Validate Theo Giờ Mở Cửa)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                    <Calendar className="w-4 h-4 text-[#E86C3A]" />
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="bg-transparent text-sm w-full focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                    <Clock className="w-4 h-4 text-[#E86C3A]" />
                    <input
                      type="time"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="bg-transparent text-sm w-full focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Thông báo hợp lệ / cảnh báo ngoài giờ */}
                <div
                  className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                    hoursValidation.valid
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                  }`}
                >
                  {hoursValidation.valid ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{hoursValidation.message}</span>
                </div>
              </div>

              {/* 4. Danh sách món đã chọn từ trang Thực đơn */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                    3. Món Đã Chọn Từ Thực Đơn ({totalItems} món)
                  </label>
                  <Link
                    href="/thuc-don"
                    className="text-xs font-mono text-[#E86C3A] hover:underline flex items-center gap-1"
                  >
                    <span>+ Thêm món khác</span>
                  </Link>
                </div>

                {preOrderItems.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Bạn chưa chọn món nào vào khay. Bạn có thể ghé gọi món trực tiếp tại quán hoặc xem thực đơn.
                    </p>
                    <Link
                      href="/thuc-don"
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E86C3A] text-white font-mono text-xs font-bold"
                    >
                      <span>Xem Thực Đơn 67 Món</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)] p-2">
                      {preOrderItems.map((item) => (
                        <div key={`${item.code}-${item.variant || ""}`} className="py-2.5 px-2 flex items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-[var(--text-primary)]">
                              {item.name} {item.variant && <span className="text-xs text-[#E86C3A]">({item.variant})</span>}
                            </span>
                            <span className="font-mono text-xs text-[var(--text-secondary)]">
                              {new Intl.NumberFormat("vi-VN").format(item.price || 0)} đ / phần
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-[var(--border-subtle)]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.code, item.quantity - 1, item.variant)}
                                className="p-1.5 hover:bg-[var(--border-subtle)]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-mono text-xs font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.code, item.quantity + 1, item.variant)}
                                className="p-1.5 hover:bg-[var(--border-subtle)]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.code, item.variant)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Xóa món"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between px-2 pt-1 font-mono text-sm">
                      <span className="text-[var(--text-secondary)]">Tổng ước tính:</span>
                      <span className="font-bold text-[#E86C3A] text-base">
                        {new Intl.NumberFormat("vi-VN").format(totalEstimatedAmount)} đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Ghi chú thêm */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase text-[var(--text-secondary)] font-bold">
                  Ghi Chú Thêm (Vị trí bàn, khẩu vị,...)
                </label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Ví dụ: Xin chọn bàn sát mép suối mát, cà phê ít ngọt..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[#E86C3A]"
                />
              </div>

              {/* HÀNH ĐỘNG GỬI ĐƠN & GỌI HOTLINE / ZALO HOÀN TẤT ĐẶT CHỖ */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-4">
                {/* NÚT GỬI ĐƠN ĐẶT CHỖ TRỰC TIẾP LÊN ADMIN */}
                <button
                  type="button"
                  onClick={handleSendReservation}
                  className="w-full py-4 bg-emerald-600 text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-md text-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Đặt Chỗ Đến Quán</span>
                </button>

                {submittedReservation && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium text-center animate-fadeIn">
                    ✓ Đã gửi yêu cầu đặt chỗ thành công! Quán sẽ gọi xác nhận ngay cho bạn qua số điện thoại đã cung cấp.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0382851688"
                    onClick={() => trackCustomerAction("click_call")}
                    className="py-4 bg-[#E86C3A] text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md text-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Gọi Hotline 0382 851 688</span>
                  </a>

                  <a
                    href="https://zalo.me/0382851688"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCustomerAction("click_zalo")}
                    className="py-4 bg-[#141B17] border border-white/20 text-[#F3F1EC] font-bold text-center rounded-xl flex items-center justify-center gap-2 hover:border-[#E86C3A] transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E86C3A]" />
                    <span>Nhắn Zalo 0382 851 688</span>
                  </a>
                </div>

                {/* Sao chép lời nhắn */}
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full py-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#E86C3A] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNote ? "Đã sao chép nội dung đặt chỗ!" : "Sao chép toàn bộ thông tin đặt chỗ"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
