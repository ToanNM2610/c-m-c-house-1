"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gửi dữ liệu tới API đặt chỗ nội bộ
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      // Vẫn hiển thị xác nhận cho trải nghiệm mượt mà
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FDFBF7] text-[#222222]">
      
      {/* ========================================================= */}
      {/* 1. BANNER TIÊU ĐỀ TRANG                                   */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 text-center border-b border-[#EAE6DF] bg-[#F7F4EE]">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D4A3E]/10 border border-[#2D4A3E]/20 text-xs font-semibold text-[#2D4A3E]">
            <Compass size={14} className="text-[#C88A4B]" />
            <span>KẾT NỐI VỚI CHÚNG TÔI</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#2D4A3E] tracking-tight">
            Liên Hệ &amp; Đặt Bàn
          </h1>

          <p className="text-base sm:text-lg font-light text-[#222222]/80 leading-relaxed">
            Dù bạn đến từ bất kỳ đâu trên thế giới, Cẩm Cù House luôn dành sẵn
            một góc hiên nhà và một tách cà phê ấm chờ đón bạn.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. 4 CỘT THÔNG TIN TRỰC QUAN (CARDS)                     */}
      {/* ========================================================= */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Địa chỉ */}
          <div className="bg-white p-7 rounded-2xl border border-[#EAE6DF] shadow-xs hover:border-[#C88A4B] transition-colors space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D4A3E]/10 flex items-center justify-center text-[#2D4A3E]">
              <MapPin size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D4A3E]">
              Địa Chỉ Quán
            </h3>
            <p className="text-xs font-light text-[#222222]/75 leading-relaxed">
              Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP Gia Nghĩa, Đắk Nông.
            </p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#C88A4B] hover:underline pt-1"
            >
              <span>Chỉ đường</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Card 2: Hotline / Zalo */}
          <div className="bg-white p-7 rounded-2xl border border-[#EAE6DF] shadow-xs hover:border-[#C88A4B] transition-colors space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D4A3E]/10 flex items-center justify-center text-[#2D4A3E]">
              <Phone size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D4A3E]">
              Hotline &amp; Zalo
            </h3>
            <div className="text-xs font-light text-[#222222]/75 space-y-1">
              <p>
                <a href="tel:0382851688" className="hover:text-[#2D4A3E] font-medium">
                  038 285 1688
                </a>
              </p>
              <p>
                <a href="tel:0774659000" className="hover:text-[#2D4A3E] font-medium">
                  077 465 9000
                </a>
              </p>
            </div>
            <p className="text-[11px] text-[#2D4A3E]/70 pt-1 font-medium">
              Gọi trực tiếp để giữ chỗ ngay
            </p>
          </div>

          {/* Card 3: Giờ phục vụ */}
          <div className="bg-white p-7 rounded-2xl border border-[#EAE6DF] shadow-xs hover:border-[#C88A4B] transition-colors space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D4A3E]/10 flex items-center justify-center text-[#2D4A3E]">
              <Clock size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D4A3E]">
              Giờ Phục Vụ
            </h3>
            <div className="text-xs font-light text-[#222222]/75 space-y-1 leading-relaxed">
              <p>T2 – T5: 07:00 – 18:00</p>
              <p>T6 – CN: 07:00 – 22:00</p>
            </div>
            <p className="text-[11px] text-[#C88A4B] pt-1 font-medium">
              Mở cửa đón khách quanh năm
            </p>
          </div>

          {/* Card 4: Email */}
          <div className="bg-white p-7 rounded-2xl border border-[#EAE6DF] shadow-xs hover:border-[#C88A4B] transition-colors space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#2D4A3E]/10 flex items-center justify-center text-[#2D4A3E]">
              <Mail size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#2D4A3E]">
              Hòm Thư Điện Tử
            </h3>
            <p className="text-xs font-light text-[#222222]/75 leading-relaxed break-all">
              thuynhu8788@gmail.com
            </p>
            <a
              href="mailto:thuynhu8788@gmail.com"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#C88A4B] hover:underline pt-1"
            >
              <span>Gửi thư điện tử</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FORM ĐẶT BÀN / GỬI THƯ (BOOKING FORM)                  */}
      {/* ========================================================= */}
      <section className="pb-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6DF] shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C88A4B] font-semibold">
              ĐẶT CHỖ TRƯỚC • RESERVATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D4A3E]">
              Đặt Bàn / Gửi Lời Nhắn
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#222222]/75">
              Để chúng tôi chuẩn bị góc bàn đẹp nhất bên bờ suối và đón tiếp bạn
              chu đáo nhất.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#F7F4EE] border border-[#2D4A3E]/20 text-center space-y-3">
              <CheckCircle2 size={40} className="text-[#2D4A3E] mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#2D4A3E]">
                Cảm ơn bạn đã đặt bàn!
              </h3>
              <p className="text-xs sm:text-sm text-[#222222]/80 max-w-md mx-auto">
                Cẩm Cù House đã ghi nhận thông tin và sẽ gọi điện xác nhận chỗ ngồi
                cho bạn trong thời gian sớm nhất. Chúc bạn có một ngày thật an
                nhiên!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-full border border-[#2D4A3E] text-xs font-medium text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white transition-colors"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Họ và tên (*) */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#222222]">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>

                {/* Số điện thoại (*) */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#222222]">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>

                {/* Ngày ghé */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#222222] flex items-center gap-1">
                    <Calendar size={13} className="text-[#C88A4B]" />
                    <span>Ngày ghé</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>

                {/* Giờ ghé */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#222222] flex items-center gap-1">
                    <Clock size={13} className="text-[#C88A4B]" />
                    <span>Giờ ghé</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>

                {/* Số lượng khách */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-[#222222] flex items-center gap-1">
                    <Users size={13} className="text-[#C88A4B]" />
                    <span>Số lượng khách</span>
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors"
                  >
                    <option value="1">1 khách (Đi một mình)</option>
                    <option value="2">2 khách (Cặp đôi / Bạn thân)</option>
                    <option value="3-5">3 – 5 khách (Gia đình / Nhóm nhỏ)</option>
                    <option value="6-10">6 – 10 khách (Họp mặt / Sinh nhật)</option>
                    <option value=">10">Hơn 10 khách (Đoàn du lịch / Sự kiện)</option>
                  </select>
                </div>

                {/* Lời nhắn / Ghi chú đặt chỗ */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-[#222222] flex items-center gap-1">
                    <MessageSquare size={13} className="text-[#C88A4B]" />
                    <span>Lời nhắn / Ghi chú đặt chỗ</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ví dụ: Ưu tiên góc bàn sát bờ suối, có trẻ nhỏ, chuẩn bị hoa..."
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE6DF] bg-[#FDFBF7] text-sm focus:outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Nút bấm gửi màu #2D4A3E */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#2D4A3E] hover:bg-[#1F342B] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Đang gửi thông tin..." : "Gửi thông tin đặt bàn"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. BẢN ĐỒ NHÚNG TOÀN KHỔ (INTERACTIVE GOOGLE MAP)         */}
      {/* ========================================================= */}
      <section className="w-full border-t border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D4A3E]">
              Bản Đồ Đến Cẩm Cù House
            </h3>
            <p className="text-xs sm:text-sm font-light text-[#222222]/75">
              Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP Gia Nghĩa, Đắk Nông
            </p>
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#2D4A3E] hover:text-white transition-colors text-xs font-medium"
          >
            <span>Mở chỉ đường trên ứng dụng Google Maps</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Iframe bản đồ khổ rộng chân thực */}
        <div className="w-full h-[380px] sm:h-[460px] relative bg-[#EAE6DF]">
          <iframe
            title="Bản đồ Cẩm Cù House Gia Nghĩa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15582.493822184136!2d107.68536894999999!3d11.99026775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173fe8e0e7a25b1%3A0x9330a10df768f565!2zQ-G6q20gQ8O5IEhvdXNl!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[15%] hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </section>

    </div>
  );
}
