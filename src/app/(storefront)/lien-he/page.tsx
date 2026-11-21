'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  ExternalLink,
  Share2,
  Sparkles,
  ArrowRight,
  Utensils,
  Music,
  Send,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FooterSection from '@/components/home/FooterSection';
import { ScrollLayoutCard3D } from '@/components/motion/ScrollMotion120';
import { MagneticButton } from '@/components/motion/VividMotion';
import HumanChallengeBox, {
  ChallengeState,
  HumanChallengeBoxRef,
} from '@/components/security/HumanChallengeBox';

export default function LienHePage() {
  const { data, language } = useApp();
  const s = data.settings;
  const isEn = language === 'en';

  const address = isEn && s.addressEn ? s.addressEn : s.address;

  // Contact form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tư vấn chung');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Anti-spam challenge & Cooldown states
  const challengeRef = useRef<HumanChallengeBoxRef>(null);
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    challengeToken: '',
    challengeAnswer: '',
    websiteUrl: '',
    companyFax: '',
    isReady: false,
    isAnswered: false,
    isValid: false,
  });
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Cooldown restoration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cam_cu_cooldown_contact');
      if (saved) {
        const expiresAt = parseInt(saved, 10);
        const now = Date.now();
        if (expiresAt > now) {
          setCooldownRemaining(Math.ceil((expiresAt - now) / 1000));
        } else {
          localStorage.removeItem('cam_cu_cooldown_contact');
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Cooldown countdown tick
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          try {
            localStorage.removeItem('cam_cu_cooldown_contact');
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cooldownRemaining > 0) {
      setErrorMessage(
        isEn
          ? `Please wait ${cooldownRemaining}s before sending another message.`
          : `Đợi ${cooldownRemaining}s để gửi tiếp...`
      );
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage(
        isEn
          ? 'Please enter your full name (minimum 2 characters).'
          : 'Vui lòng nhập họ và tên của bạn (tối thiểu 2 ký tự).'
      );
      return;
    }

    if (trimmedName.length > 80) {
      setErrorMessage(
        isEn
          ? 'Full name must not exceed 80 characters.'
          : 'Họ và tên không được vượt quá 80 ký tự.'
      );
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 8) {
      setErrorMessage(
        isEn
          ? 'Please enter a valid phone number (at least 8 digits).'
          : 'Vui lòng nhập số điện thoại liên hệ hợp lệ (tối thiểu 8 chữ số).'
      );
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      setErrorMessage(
        isEn
          ? 'Please enter your message (minimum 10 characters).'
          : 'Vui lòng nhập nội dung tin nhắn chi tiết (tối thiểu 10 ký tự).'
      );
      return;
    }

    if (trimmedMessage.length > 1200) {
      setErrorMessage(
        isEn
          ? 'Message content must not exceed 1200 characters.'
          : 'Nội dung tin nhắn không được vượt quá 1200 ký tự.'
      );
      return;
    }

    if (!challengeState.challengeAnswer.trim()) {
      setErrorMessage(
        isEn
          ? 'Please complete the security math challenge below.'
          : 'Vui lòng điền đáp án phép tính xác minh bảo mật bên dưới.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          phone: trimmedPhone,
          email: email ? email.trim() : null,
          subject,
          message: trimmedMessage,
          challengeToken: challengeState.challengeToken,
          challengeAnswer: challengeState.challengeAnswer,
          websiteUrl: challengeState.websiteUrl,
          companyFax: challengeState.companyFax,
          honeypot: challengeState.websiteUrl, // legacy compatibility
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFullName('');
        setPhone('');
        setEmail('');
        setSubject('Tư vấn chung');
        setMessage('');
        // Start 60s cooldown
        const cooldownMs = 60 * 1000;
        try {
          localStorage.setItem('cam_cu_cooldown_contact', String(Date.now() + cooldownMs));
        } catch {}
        setCooldownRemaining(60);
        challengeRef.current?.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 429) {
          const retryHeader = res.headers.get('Retry-After');
          const retrySec = retryHeader ? parseInt(retryHeader, 10) : errJson.retryAfter || 60;
          try {
            localStorage.setItem('cam_cu_cooldown_contact', String(Date.now() + retrySec * 1000));
          } catch {}
          setCooldownRemaining(retrySec);
          setErrorMessage(
            errJson.error ||
              (isEn
                ? `Submission rate limit reached. Please wait ${retrySec}s.`
                : `Bạn gửi quá nhanh. Đợi ${retrySec}s để gửi tiếp...`)
          );
        } else {
          setErrorMessage(errJson.error || (isEn ? 'Failed to send message. Please try again.' : 'Có lỗi xảy ra, vui lòng thử lại.'));
        }
        challengeRef.current?.refresh();
      }
    } catch {
      setErrorMessage(isEn ? 'Cannot connect to the server.' : 'Không thể kết nối đến máy chủ.');
      challengeRef.current?.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      {/* Editorial Page Header */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <span className="w-8 h-px bg-accent-botanical" />
            <span>{isEn ? 'MAP & BOTANICAL SANCTUARY CONTACT' : 'BẢN ĐỒ & LIÊN HỆ QUÁN'}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
            {isEn ? 'Contact & Directions' : 'Liên Hệ & Chỉ Đường'} <br />
            <span className="italic font-normal text-accent-botanical">
              {isEn ? 'Connect with Cẩm Cù House' : 'Kết Nối Cùng Cẩm Cù House'}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            {isEn
              ? 'Connect with Cẩm Cù House in Dong Gia Nghia, Lam Dong — Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong.'
              : 'Kết nối cùng Cẩm Cù House tại Đông Gia Nghĩa, Lâm Đồng — Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng.'}
          </p>
        </div>
      </section>

      {/* Main Contact & Location Grid Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Contacts, Hotlines, Hours & Social (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
                <span className="w-6 h-px bg-accent-botanical" />
                <span>{isEn ? 'DIRECT CONTACT INFORMATION' : 'THÔNG TIN LIÊN LẠC TRỰC TIẾP'}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-ink-primary">
                {isEn ? 'Visit the Streamside Sanctuary' : 'Ghé Thăm Không Gian Quán'}
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                {isEn
                  ? 'Nestled in a peaceful green valley beside a fresh mountain stream in Dong Gia Nghia, Lam Dong.'
                  : 'Quán tọa lạc tại vị trí yên tĩnh bên bờ suối mát tại Đông Gia Nghĩa, Lâm Đồng.'}
              </p>
            </div>

            {/* 1. Address Card */}
            <ScrollLayoutCard3D delay={0.05}>
              <div className="p-6 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-botanical font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-accent-botanical" />
                  <span>{isEn ? 'SANCTUARY ADDRESS' : 'ĐỊA CHỈ QUÁN'}</span>
                </div>
                <p className="font-serif text-xl font-bold text-ink-primary leading-snug">
                  {address}
                </p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {isEn
                    ? 'Follow Alley 437 Hung Vuong down the tree-shaded slope; motorbikes and cars can enter straight to the gate with spacious parking.'
                    : 'Men theo hẻm 437 Hùng Vương (con dốc cây xanh mát), xe máy và ô tô vào tận cổng quán có bãi đậu xe rộng rãi.'}
                </p>
              </div>
            </ScrollLayoutCard3D>

            {/* 2. Hotlines Card */}
            <ScrollLayoutCard3D delay={0.1}>
              <div className="p-6 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-botanical font-bold uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-accent-botanical" />
                  <span>{isEn ? 'HOTLINES & GUEST SUPPORT' : 'HOTLINE LIÊN HỆ & HỖ TRỢ'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0382851688"
                    className="p-3.5 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs transition-colors flex flex-col group"
                  >
                    <span className="text-[10px] font-mono text-ink-muted">
                      {isEn ? 'Hotline 1 (Ms. Thuy Nhu):' : 'Hotline 1 (Ms. Thùy Như):'}
                    </span>
                    <span className="font-mono text-base font-bold text-accent-botanical group-hover:underline">0382 851 688</span>
                  </a>
                  <a
                    href="tel:0774659000"
                    className="p-3.5 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-2xl border border-forest-200 dark:border-forest-700 text-xs transition-colors flex flex-col group"
                  >
                    <span className="text-[10px] font-mono text-ink-muted">
                      {isEn ? 'Hotline 2 (Guest Support):' : 'Hotline 2 (Hỗ trợ khách):'}
                    </span>
                    <span className="font-mono text-base font-bold text-accent-botanical group-hover:underline">0774 659 000</span>
                  </a>
                </div>
              </div>
            </ScrollLayoutCard3D>

            {/* 3. Operating Hours Card */}
            <ScrollLayoutCard3D delay={0.15}>
              <div className="p-6 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-botanical font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-accent-botanical" />
                  <span>{isEn ? 'OPERATING HOURS (GMT+7)' : 'GIỜ MỞ CỬA ĐÓN KHÁCH (GMT+7)'}</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 bg-forest-50 dark:bg-forest-800/80 rounded-xl">
                    <span className="text-ink-muted">
                      {isEn ? 'Monday – Thursday:' : 'Thứ Hai – Thứ Năm:'}
                    </span>
                    <span className="text-ink-primary font-bold">{s.hours.monThu}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-forest-50 dark:bg-forest-800/80 rounded-xl">
                    <span className="text-ink-muted">
                      {isEn ? 'Friday – Sunday:' : 'Thứ Sáu – Chủ Nhật:'}
                    </span>
                    <span className="text-accent-botanical font-bold">{s.hours.friSun}</span>
                  </div>
                  <p className="text-[11px] font-serif italic text-accent-earth pt-1">
                    {isEn ? '* Open late for evening night stream views & Saturday Acoustic live sessions.' : '* Mở muộn ngắm cảnh suối đêm & đêm nhạc Acoustic tối Thứ Bảy hàng tuần.'}
                  </p>
                </div>
              </div>
            </ScrollLayoutCard3D>

            {/* 4. Social & Email */}
            <ScrollLayoutCard3D delay={0.2}>
              <div className="p-6 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-accent-botanical font-bold uppercase tracking-wider">
                  <Share2 className="w-4 h-4 text-accent-botanical" />
                  <span>{isEn ? 'SOCIAL CHANNELS & EMAIL' : 'MẠNG XÃ HỘI & EMAIL'}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <a
                    href={s.links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-xl text-xs font-mono text-ink-primary border border-forest-200 dark:border-forest-700 transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={s.links.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-xl text-xs font-mono text-ink-primary border border-forest-200 dark:border-forest-700 transition-colors"
                  >
                    TikTok
                  </a>
                  <a
                    href={s.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-xl text-xs font-mono text-ink-primary border border-forest-200 dark:border-forest-700 transition-colors"
                  >
                    YouTube
                  </a>
                  <a
                    href={`mailto:${s.email}`}
                    className="px-3.5 py-2 bg-forest-50 dark:bg-forest-800/80 hover:bg-forest-100 rounded-xl text-xs font-mono text-ink-primary border border-forest-200 dark:border-forest-700 transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-accent-botanical" />
                    <span>{s.email}</span>
                  </a>
                </div>
              </div>
            </ScrollLayoutCard3D>
          </div>

          {/* Right Column: Google Maps & Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollLayoutCard3D delay={0.1}>
              <div className="p-8 sm:p-10 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-100 dark:border-forest-800">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2 mb-1">
                      <Compass className="w-4 h-4 text-accent-botanical" />
                      <span>{isEn ? 'LOCATION & GOOGLE MAPS' : 'VỊ TRÍ & BẢN ĐỒ GOOGLE MAPS'}</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-ink-primary">
                      {isEn ? 'Directions to Cẩm Cù House Streamside' : 'Chỉ Đường Đến Bờ Suối Cẩm Cù House'}
                    </h3>
                  </div>

                  <a
                    href={s.links.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-accent-botanical hover:bg-forest-800 text-white rounded-xl text-xs font-mono font-medium transition-all shadow-sm active:scale-95 whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>{isEn ? 'Open Google Maps' : 'Mở Google Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Wayfinding Instructions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-ink-primary font-bold">
                    {isEn ? '3 EASY STEPS TO REACH THE STREAMSIDE SANCTUARY:' : '3 BƯỚC ĐƠN GIẢN ĐỂ ĐẾN QUÁN:'}
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm text-ink-muted">
                    <div className="flex items-start gap-3 p-3.5 bg-forest-50/70 dark:bg-forest-800/60 rounded-2xl border border-forest-100 dark:border-forest-700">
                      <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </span>
                      <p className="leading-relaxed">
                        {isEn
                          ? 'From city center: Go along Hung Vuong Street toward Dong Gia Nghia.'
                          : 'Từ trung tâm: Đi dọc theo đường Hùng Vương hướng về phía Đông Gia Nghĩa.'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 bg-forest-50/70 dark:bg-forest-800/60 rounded-2xl border border-forest-100 dark:border-forest-700">
                      <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </span>
                      <p className="leading-relaxed">
                        {isEn
                          ? 'Look for Alley 437 Hung Vuong (a wide tree-shaded slope) and follow the gentle slope downward.'
                          : 'Tìm Hẻm 437 Hùng Vương (con dốc lớn rợp bóng cây xanh) và rẽ vào con dốc xuống bờ suối.'}
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 bg-forest-50/70 dark:bg-forest-800/60 rounded-2xl border border-forest-100 dark:border-forest-700">
                      <span className="w-6 h-6 rounded-full bg-accent-botanical text-white font-mono text-xs flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </span>
                      <p className="leading-relaxed">
                        {isEn
                          ? 'Follow the slope ~150m down to the stream to reach Cẩm Cù House. Spacious free parking available inside.'
                          : 'Men theo con dốc khoảng 150m xuống sát bờ suối là cổng quán Cẩm Cù House, có bãi đỗ xe máy & ô tô rộng rãi miễn phí.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Box */}
                <div className="relative rounded-2xl overflow-hidden border border-forest-200 dark:border-forest-700 bg-forest-100/50 dark:bg-forest-950 p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-forest-900 shadow-subtle flex items-center justify-center mx-auto text-accent-botanical">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="font-serif text-xl font-bold text-ink-primary">
                      Cẩm Cù House — Đông Gia Nghĩa, Lâm Đồng
                    </h4>
                    <p className="text-xs text-ink-muted">
                      {address}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={s.links.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-accent-botanical hover:bg-forest-800 text-white rounded-xl text-xs font-mono font-medium transition-all shadow-sm active:scale-95"
                    >
                      <Compass className="w-4 h-4" />
                      <span>{isEn ? 'Get Directions on Google Maps' : 'Mở chỉ đường trên Google Maps'}</span>
                    </a>
                    <a
                      href="tel:0382851688"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-forest-900 hover:bg-forest-50 text-ink-primary rounded-xl text-xs font-mono font-medium border border-forest-200 dark:border-forest-700 transition-all shadow-subtle active:scale-95"
                    >
                      <Phone className="w-4 h-4 text-accent-botanical" />
                      <span>{isEn ? 'Call Hotline for Guidance' : 'Gọi Hotline chỉ đường'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollLayoutCard3D>

            {/* Interactive Contact & Consultation Form */}
            <ScrollLayoutCard3D delay={0.15}>
              <div className="p-8 sm:p-10 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle space-y-5">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-accent-botanical" />
                    <span>{isEn ? 'DIRECT CONSULTATION FORM' : 'GỬI TIN NHẮN TƯ VẤN & HỖ TRỢ'}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink-primary">
                    {isEn ? 'Leave Us a Message' : 'Để Lại Lời Nhắn Cho Cẩm Cù House'}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {isEn
                      ? 'Have questions about directions, takeaway coffee, or group gatherings? Drop us a note.'
                      : 'Bạn cần hỗ trợ chỉ đường, đặt mang về trước hoặc họp mặt gia đình? Hãy để lại thông tin bên dưới.'}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="font-serif font-bold text-base text-emerald-900 dark:text-emerald-200">
                      {isEn ? 'Message sent successfully!' : 'Tin nhắn đã được gửi thành công!'}
                    </h4>
                    <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                      {isEn
                        ? 'Cẩm Cù House will get back to you shortly via your phone or email.'
                        : 'Ban quản lý Cẩm Cù House sẽ phản hồi lại bạn trong thời gian sớm nhất.'}
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-2 text-xs font-mono text-accent-botanical underline hover:text-forest-800"
                    >
                      {isEn ? 'Send another message' : 'Gửi thêm tin nhắn khác'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {errorMessage && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-xs font-mono flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Live Cooldown Banner */}
                    {cooldownRemaining > 0 && (
                      <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-xl text-xs font-mono flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                          <span>{isEn ? 'Anti-spam protection active:' : 'Hệ thống bảo vệ đang bật:'}</span>
                        </span>
                        <span className="font-bold font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-600">
                          {isEn ? `Wait ${cooldownRemaining}s to submit again...` : `Đợi ${cooldownRemaining}s để gửi tiếp...`}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider">
                            {isEn ? 'Full Name *' : 'Họ và tên *'}
                          </label>
                          <span className={`text-[10px] font-mono ${fullName.length > 80 ? 'text-red-500 font-bold' : 'text-ink-muted'}`}>
                            {fullName.length}/80
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={80}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={isEn ? 'e.g. David Nguyen' : 'Ví dụ: Nguyễn Văn An'}
                          className="w-full px-3.5 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1">
                          {isEn ? 'Phone Number *' : 'Số điện thoại liên hệ *'}
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={20}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0382 851 688"
                          className="w-full px-3.5 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1">
                          {isEn ? 'Email (Optional)' : 'Email (Không bắt buộc)'}
                        </label>
                        <input
                          type="email"
                          maxLength={120}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full px-3.5 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1">
                          {isEn ? 'Inquiry Topic' : 'Chủ đề liên hệ'}
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical font-medium cursor-pointer"
                        >
                          <option value="Tư vấn chung">{isEn ? 'General Inquiry' : 'Tư vấn chung'}</option>
                          <option value="Đặt BBQ">{isEn ? 'BBQ Reservation' : 'Đặt BBQ'}</option>
                          <option value="Góp ý không gian">{isEn ? 'Space Feedback' : 'Góp ý không gian'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider">
                          {isEn ? 'Your Message *' : 'Nội dung tin nhắn *'}
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            message.length > 1200
                              ? 'text-red-500 font-bold'
                              : message.length > 0 && message.length < 10
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-ink-muted'
                          }`}
                        >
                          {message.length}/1200 {message.length > 0 && message.length < 10 && (isEn ? '(Min 10)' : '(Tối thiểu 10)')}
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        required
                        maxLength={1200}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          isEn
                            ? 'Let us know how we can assist you (minimum 10 characters)...'
                            : 'Nhập nội dung cần hỗ trợ, thời gian dự kiến ghé quán hoặc câu hỏi của bạn (tối thiểu 10 ký tự)...'
                        }
                        className="w-full px-3.5 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                      />
                    </div>

                    {/* Human Math Challenge & Honeypot Box */}
                    <div className="pt-1">
                      <HumanChallengeBox
                        ref={challengeRef}
                        onChange={setChallengeState}
                        disabled={submitting || cooldownRemaining > 0}
                        isEn={isEn}
                      />
                    </div>

                    <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs font-mono text-ink-muted text-left">
                        {cooldownRemaining > 0 && (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            {isEn ? `Wait ${cooldownRemaining}s to submit again...` : `Đợi ${cooldownRemaining}s để gửi tiếp...`}
                          </span>
                        )}
                      </div>

                      <MagneticButton
                        type="submit"
                        disabled={submitting || cooldownRemaining > 0 || !challengeState.isValid}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-botanical hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-mono font-bold transition-all shadow-subtle active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submitting
                            ? isEn
                              ? 'Sending...'
                              : 'Đang gửi...'
                            : cooldownRemaining > 0
                            ? isEn
                              ? `Wait ${cooldownRemaining}s...`
                              : `Đợi ${cooldownRemaining}s để gửi tiếp...`
                            : isEn
                            ? 'Send Message'
                            : 'Gửi tin nhắn'}
                        </span>
                      </MagneticButton>
                    </div>
                  </form>
                )}
              </div>
            </ScrollLayoutCard3D>
          </div>
        </div>
      </section>

      {/* Bottom Cross-Navigation Links */}
      <section className="py-14 sm:py-18 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/thuc-don"
            className="p-8 rounded-3xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-subtle hover:shadow-elevated hover:border-accent-botanical/60 transition-all duration-300 flex items-center justify-between group"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-accent-botanical font-bold flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>{isEn ? 'BOTANICAL MENU' : 'THỰC ĐƠN QUÁN'}</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-primary group-hover:text-accent-botanical transition-colors">
                {isEn ? 'Explore 67-Item Menu' : 'Khám phá Thực đơn 67 món'}
              </h3>
              <p className="text-xs text-ink-muted">
                {isEn ? 'Cà phê muối bazan, trà thảo mộc & sinh tố bơ sáp' : 'Cà phê muối bazan, trà thảo mộc & sinh tố bơ sáp'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-accent-botanical transform group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/su-kien"
            className="p-8 rounded-3xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-subtle hover:shadow-elevated hover:border-accent-botanical/60 transition-all duration-300 flex items-center justify-between group"
          >
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-accent-botanical font-bold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>{isEn ? 'STREAMSIDE HAPPENINGS' : 'SỰ KIỆN BÊN SUỐI'}</span>
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-primary group-hover:text-accent-botanical transition-colors">
                {isEn ? 'Acoustic Live Music' : 'Đêm nhạc Acoustic cuối tuần'}
              </h3>
              <p className="text-xs text-ink-muted">
                {isEn ? '19:30 - 21:30 Every Saturday evening by the water' : '19:30 - 21:30 Tối Thứ Bảy hàng tuần bên bờ suối'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-accent-botanical transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
