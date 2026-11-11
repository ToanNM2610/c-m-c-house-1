"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CAM_CU_HOUSE_INFO } from "@/data/camCuHouseData";
import {
  X,
  PhoneCall,
  Calendar,
  Clock,
  Users,
  MapPin,
  Utensils,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preOrderItems?: string[];
}

export default function ReservationModal({
  isOpen,
  onClose,
  preOrderItems = [],
}: ReservationModalProps) {
  const { locale } = useLanguage();
  const isVi = locale !== "en";

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [visitTime, setVisitTime] = useState("09:00");
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<"stream" | "garden" | "covered">("stream");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeError, setTimeError] = useState("");

  if (!isOpen) return null;

  const validateVisitTime = (dateStr: string, timeStr: string) => {
    const dateObj = new Date(`${dateStr}T${timeStr}:00`);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const [h, m] = timeStr.split(":").map(Number);
    const minutes = h * 60 + m;

    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    const openMin = 7 * 60; // 07:00
    const closeMin = isWeekend ? 22 * 60 : 18 * 60;

    if (minutes < openMin || minutes >= closeMin) {
      const closeLabel = isWeekend ? "22:00" : "18:00";
      return isVi
        ? `Quán mở cửa từ 07:00 đến ${closeLabel} vào ngày đã chọn.`
        : `Cafe is open from 07:00 to ${closeLabel} on the selected day.`;
    }
    return "";
  };

  const handleTimeChange = (newTime: string) => {
    setVisitTime(newTime);
    const err = validateVisitTime(visitDate, newTime);
    setTimeError(err);
  };

  const handleDateChange = (newDate: string) => {
    setVisitDate(newDate);
    const err = validateVisitTime(newDate, visitTime);
    setTimeError(err);
  };

  const handleConfirmReservation = (action: "call" | "save") => {
    const err = validateVisitTime(visitDate, visitTime);
    if (err) {
      setTimeError(err);
      return;
    }

    // Save record to local storage for persistence
    try {
      const records = JSON.parse(localStorage.getItem("camcu_reservations") || "[]");
      records.push({
        customerName,
        phone,
        visitDate,
        visitTime,
        guests,
        seatingArea,
        preOrderItems,
        note,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("camcu_reservations", JSON.stringify(records));
    } catch {}

    setSubmitted(true);

    if (action === "call") {
      window.location.href = CAM_CU_HOUSE_INFO.contacts.primaryTel;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-modal-title"
    >
      <div className="relative w-full max-w-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
          aria-label={isVi ? "Đóng cửa sổ" : "Close modal"}
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="flex flex-col gap-6">
            <div>
              <span className="label-uppercase-12 text-[var(--accent-warm)]">
                {isVi ? "TRỢ LÝ LIÊN HỆ ĐẶT CHỖ & MANG VỀ" : "RESERVATION & TAKEAWAY ASSISTANT"}
              </span>
              <h3 id="reservation-modal-title" className="font-display font-bold text-[24px] sm:text-[28px] text-[var(--text-primary)] mt-1">
                {isVi ? "Đặt Chỗ Trước Bên Bờ Suối" : "Reserve Your Streamside Seat"}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                {isVi
                  ? "Cẩm Cù House đón khách theo khung giờ: T2–T5: 07h–18h | T6–CN: 07h–22h."
                  : "Cẩm Cù House opens: Mon–Thu: 07:00–18:00 | Fri–Sun: 07:00–22:00."}
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  {isVi ? "Họ và Tên *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isVi ? "Nguyễn Văn A" : "John Doe"}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  {isVi ? "Số Điện Thoại *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0382 851 688"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  {isVi ? "Ngày Đến" : "Date"}
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  {isVi ? "Giờ Đến (07h–18h/22h)" : "Time"}
                </label>
                <input
                  type="time"
                  value={visitTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>
            </div>

            {timeError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{timeError}</span>
              </p>
            )}

            {/* Guests & Seating Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  {isVi ? "Số Lượng Khách" : "Guests"}
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {isVi ? "người" : "guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  {isVi ? "Khu Vực Ngồi Mong Muốn" : "Preferred Area"}
                </label>
                <select
                  value={seatingArea}
                  onChange={(e) => setSeatingArea(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                >
                  <option value="stream">Bàn ngoài trời sát bờ suối</option>
                  <option value="garden">Dưới tán cây sân vườn</option>
                  <option value="covered">Khu vực có mái che yên tĩnh</option>
                </select>
              </div>
            </div>

            {/* Pre-ordered items summary */}
            {preOrderItems.length > 0 && (
              <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold uppercase text-[var(--accent-botanical)]">
                  <Utensils className="w-3.5 h-3.5 inline mr-1" />
                  {isVi ? "Danh Sách Món Đặt Trước:" : "Pre-ordered Items:"}
                </span>
                <p className="text-[13px] text-[var(--text-primary)]">
                  {preOrderItems.join(", ")}
                </p>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--text-primary)] mb-1">
                {isVi ? "Ghi Chú Thêm (Nếu Có)" : "Additional Notes"}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isVi ? "Ví dụ: Ghế cao cho trẻ em, góc chụp ảnh đẹp..." : "Any special requests..."}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmReservation("call")}
                className="btn-cta-primary w-full py-3.5 text-[14px] rounded-xl justify-center inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>
                  {isVi
                    ? `Gọi Hotline Đón Tiếp (${CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]})`
                    : `Call Hotline (${CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmReservation("save")}
                className="btn-cta-secondary w-full py-3.5 text-[14px] rounded-xl justify-center inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVi ? "Lưu Phiếu Đặt Trước" : "Save Reservation"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Submitted State */
          <div className="flex flex-col items-center text-center gap-5 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-display font-bold text-[24px] text-[var(--text-primary)]">
                {isVi ? "Thông Tin Đã Được Tiếp Nhận" : "Reservation Prepared"}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] max-w-md">
                {isVi
                  ? `Cảm ơn ${customerName || "quý khách"}! Để được hỗ trợ chọn bàn sát bờ suối đẹp nhất, bạn có thể gọi trực tiếp Hotline quán bên dưới.`
                  : "Thank you! To ensure the best streamside seating, you can call our hotline directly."}
              </p>
            </div>

            <div className="w-full p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-left text-xs font-mono flex flex-col gap-1">
              <div><strong>Họ tên:</strong> {customerName || "Khách ghé thăm"}</div>
              <div><strong>Thời gian:</strong> {visitTime} · {visitDate}</div>
              <div><strong>Số khách:</strong> {guests} người</div>
              <div><strong>Khu vực:</strong> {seatingArea}</div>
              {preOrderItems.length > 0 && <div><strong>Món chọn:</strong> {preOrderItems.join(", ")}</div>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <a
                href={CAM_CU_HOUSE_INFO.contacts.primaryTel}
                className="btn-cta-primary px-6 py-3 text-sm rounded-xl inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi {CAM_CU_HOUSE_INFO.contacts.formattedPhones[0]}</span>
              </a>

              <a
                href={CAM_CU_HOUSE_INFO.socials.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta-secondary px-6 py-3 text-sm rounded-xl inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Chỉ đường Maps</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
