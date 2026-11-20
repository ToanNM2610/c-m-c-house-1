'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Sparkles,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Heart,
  Quote,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { HighlightStory, GuestComment } from '@/types';
import FooterSection from '@/components/home/FooterSection';
import { ScrollLayoutCard3D } from '@/components/motion/ScrollMotion120';
import { InteractiveTiltCard, MagneticButton } from '@/components/motion/VividMotion';
import ReviewShowcase3 from '@/components/testimonials/ReviewShowcase3';
import HumanChallengeBox, {
  ChallengeState,
  HumanChallengeBoxRef,
} from '@/components/security/HumanChallengeBox';

export default function KhachHangPage() {
  const { data, language } = useApp();
  const s = data.settings;
  const isEn = language === 'en';

  const [comments, setComments] = useState<GuestComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Anti-spam & Cooldown states
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

  const stories: HighlightStory[] = data.stories || [];

  // Cooldown restoration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cam_cu_cooldown_comment');
      if (saved) {
        const expiresAt = parseInt(saved, 10);
        const now = Date.now();
        if (expiresAt > now) {
          setCooldownRemaining(Math.ceil((expiresAt - now) / 1000));
        } else {
          localStorage.removeItem('cam_cu_cooldown_comment');
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
            localStorage.removeItem('cam_cu_cooldown_comment');
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  // Fetch approved comments
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.data || [];
          setComments(list);
        }
      } catch (err) {
        console.error('Failed to load guest comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    loadComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Pre-flight checks
    if (cooldownRemaining > 0) {
      setErrorMessage(
        isEn
          ? `Please wait ${cooldownRemaining}s before submitting again.`
          : `Đợi ${cooldownRemaining}s để gửi tiếp...`
      );
      return;
    }

    const trimmedName = authorName.trim();
    const trimmedContent = content.trim();

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
          : 'Họ tên không được vượt quá 80 ký tự.'
      );
      return;
    }

    if (!trimmedContent || trimmedContent.length < 10) {
      setErrorMessage(
        isEn
          ? 'Please enter your feedback (minimum 10 characters).'
          : 'Vui lòng chia sẻ cảm nhận chi tiết hơn (tối thiểu 10 ký tự).'
      );
      return;
    }

    if (trimmedContent.length > 1200) {
      setErrorMessage(
        isEn
          ? 'Feedback content must not exceed 1200 characters.'
          : 'Nội dung cảm nhận không được vượt quá 1200 ký tự.'
      );
      return;
    }

    if (!challengeState.challengeAnswer.trim()) {
      setErrorMessage(
        isEn
          ? 'Please enter the answer to the security math challenge.'
          : 'Vui lòng nhập đáp án câu hỏi xác minh bảo mật bên dưới.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: trimmedName,
          rating,
          content: trimmedContent,
          visitDate: visitDate || (isEn ? 'Recent visit' : 'Ghé thăm gần đây'),
          challengeToken: challengeState.challengeToken,
          challengeAnswer: challengeState.challengeAnswer,
          websiteUrl: challengeState.websiteUrl,
          companyFax: challengeState.companyFax,
          honeypot: challengeState.websiteUrl, // legacy compatibility
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setAuthorName('');
        setContent('');
        setVisitDate('');
        // Start 60s cooldown
        const cooldownMs = 60 * 1000;
        try {
          localStorage.setItem('cam_cu_cooldown_comment', String(Date.now() + cooldownMs));
        } catch {}
        setCooldownRemaining(60);
        challengeRef.current?.refresh();
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 429) {
          const retryHeader = res.headers.get('Retry-After');
          const retrySec = retryHeader ? parseInt(retryHeader, 10) : errJson.retryAfter || 60;
          try {
            localStorage.setItem('cam_cu_cooldown_comment', String(Date.now() + retrySec * 1000));
          } catch {}
          setCooldownRemaining(retrySec);
          setErrorMessage(
            errJson.error ||
              (isEn
                ? `Submission rate limit exceeded. Please wait ${retrySec}s.`
                : `Bạn gửi quá nhanh. Đợi ${retrySec}s để gửi tiếp...`)
          );
        } else {
          setErrorMessage(errJson.error || (isEn ? 'Failed to submit review. Please try again.' : 'Có lỗi xảy ra, vui lòng thử lại.'));
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
      {/* Editorial Header */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <span className="w-8 h-px bg-accent-botanical" />
            <span>{isEn ? 'COMMUNITY & GUEST EXPERIENCES' : 'DẤU ẤN NHỊP SỐNG & CẢM NHẬN THỰC KHÁCH'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight">
            {isEn ? 'Milestones & Memories' : 'Dấu Ấn Bên Suối'} <br />
            <span className="italic font-normal text-accent-botanical">
              {isEn ? 'Heartfelt Customer Voices' : '& Cảm Nhận Thực Khách'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            {isEn
              ? 'Cherished moments beside the cool stream in Gia Nghia, seasonal local harvests, and verified experiences shared by our visitors.'
              : 'Những khoảnh khắc đáng nhớ bên bờ suối mát, câu chuyện mùa vụ nông sản Đăk Nông và những cảm nhận chân thực nhất từ thực khách đã ghé thăm Cẩm Cù House.'}
          </p>

          {/* Trust Banner Badge */}
          <div className="pt-2 inline-flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-forest-900 border border-forest-200 dark:border-forest-700 shadow-subtle">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="border-l border-forest-200 dark:border-forest-700 pl-3">
              <span className="font-serif font-bold text-base text-ink-primary block leading-none">
                {isEn ? '100% Recommended' : '100% Đề Xuất Tuyệt Đối'}
              </span>
              <span className="text-[11px] font-mono text-ink-muted">
                {isEn ? 'Based on 8/8 verified reviews' : 'Dựa trên 8/8 đánh giá thực khách'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: CÁC DẤU ẤN NỔI BẬT (HIGHLIGHT STORIES) */}
      {stories.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
          <div className="space-y-3 mb-12 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-botanical" />
              <span>{isEn ? 'SANCTUARY MILESTONES' : 'DẤU ẤN HOẠT ĐỘNG NỔI BẬT'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
              {isEn ? 'Moments Along The Natural Stream' : 'Nhịp Sống Tự Nhiên Bên Dòng Suối'}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {isEn
                ? 'From weekend acoustic music nights to seasonal Dak Nong avocado harvests.'
                : 'Từ những đêm nhạc Acoustic mộc mạc cuối tuần đến mùa thu hoạch bơ sáp Đăk Nông trù phú.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story, idx) => {
              const title = isEn && story.titleEn ? story.titleEn : story.title;
              const category = isEn && story.categoryEn ? story.categoryEn : story.category;
              const date = isEn && story.dateEn ? story.dateEn : story.date;
              const summary = isEn && story.summaryEn ? story.summaryEn : story.summary;
              const contentText = isEn && story.contentEn ? story.contentEn : story.content;
              const badge = isEn && story.badgeEn ? story.badgeEn : story.badge;

              return (
                <ScrollLayoutCard3D key={story.id} delay={idx * 0.08} className="h-full">
                  <InteractiveTiltCard maxTilt={3.0} spotlight={true} className="h-full">
                    <div className="h-full bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-subtle hover:shadow-elevated transition-shadow duration-200 flex flex-col justify-between overflow-hidden">
                      <div className="p-7 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-botanical bg-forest-100 dark:bg-forest-800 px-3 py-1 rounded-full">
                            {badge || category}
                          </span>
                          <span className="text-xs font-mono text-ink-muted flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent-botanical" />
                            <span>{date}</span>
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-ink-primary leading-snug">
                          {title}
                        </h3>

                        <p className="font-serif italic text-sm text-accent-earth leading-relaxed">
                          &ldquo;{summary}&rdquo;
                        </p>

                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                          {contentText}
                        </p>
                      </div>

                      <div className="px-7 py-4 bg-forest-50 dark:bg-forest-950 border-t border-forest-200 dark:border-forest-800 flex items-center justify-between text-xs font-mono text-accent-botanical">
                        <span>Cẩm Cù House Streamside</span>
                        <span className="font-bold"># {category}</span>
                      </div>
                    </div>
                  </InteractiveTiltCard>
                </ScrollLayoutCard3D>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: GUEST COMMENTS & REVIEWS GRID */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-b border-forest-200/60 dark:border-forest-700/50">
        <div className="space-y-3 mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'VERIFIED GUEST REVIEWS' : 'ĐÁNH GIÁ THỰC KHÁCH ĐÃ TRẢI NGHIỆM'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary">
            {isEn ? 'What Guests Say About Us' : 'Thực Khách Nói Gì Về Cẩm Cù House'}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {isEn
              ? 'Authentic feedback and recommendations from friends and families who spent tranquil hours beside the stream.'
              : 'Những lời chia sẻ ấm áp và chân thành từ các bạn trẻ, gia đình và du khách từng dừng chân uống cà phê bên suối.'}
          </p>
        </div>

        {loadingComments ? (
          <div className="py-12 text-center text-xs font-mono text-ink-muted">
            {isEn ? 'Loading verified reviews...' : 'Đang tải đánh giá thực khách...'}
          </div>
        ) : (
          <ReviewShowcase3 comments={comments} settings={s} />
        )}
      </section>

      {/* SECTION 3: FORM GỬI CẢM NHẬN (REVIEW SUBMISSION FORM) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 bg-white dark:bg-forest-900 rounded-3xl border border-forest-200 dark:border-forest-700 shadow-elevated space-y-6">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-800 text-accent-botanical text-xs font-mono font-bold">
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>{isEn ? 'GUEST FEEDBACK' : 'Ý KIẾN ĐÓNG GÓP'}</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-ink-primary">
              {isEn ? 'Share Your Streamside Experience' : 'Gửi Cảm Nhận Của Bạn Về Quán'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted">
              {isEn
                ? 'Your feedback helps Cẩm Cù House preserve our botanical sanctuary and serve you better.'
                : 'Mỗi lời góp ý là nguồn động viên quý giá để Cẩm Cù House ngày càng hoàn thiện không gian sinh thái.'}
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-emerald-900 dark:text-emerald-200">
                {isEn ? 'Thank you for your review!' : 'Cảm ơn bạn đã gửi cảm nhận!'}
              </h4>
              <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                {isEn
                  ? 'Your feedback has been received and will be displayed after editorial review.'
                  : 'Cảm nhận của bạn đã được gửi thành công và sẽ hiển thị trên website sau khi được kiểm duyệt.'}
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-3 text-xs font-mono text-accent-botanical underline hover:text-forest-800"
              >
                {isEn ? 'Submit another review' : 'Gửi thêm đánh giá khác'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider">
                      {isEn ? 'Your Full Name *' : 'Họ và tên của bạn *'}
                    </label>
                    <span className={`text-[10px] font-mono ${authorName.length > 80 ? 'text-red-500 font-bold' : 'text-ink-muted'}`}>
                      {authorName.length}/80
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={isEn ? 'e.g. John Doe' : 'Ví dụ: Nguyễn Văn An'}
                    className="w-full px-4 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1">
                    {isEn ? 'Visit Date / Timing' : 'Thời gian ghé quán'}
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    placeholder={isEn ? 'e.g. November 2026' : 'Ví dụ: Chiều Thứ Bảy vừa qua'}
                    className="w-full px-4 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
                  />
                </div>
              </div>

              {/* Star rating selector */}
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">
                  {isEn ? 'Your Rating (1 to 5 Stars)' : 'Mức độ hài lòng của bạn'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl border transition-all ${
                        rating >= num
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-500'
                          : 'bg-forest-50/70 dark:bg-forest-800 border-forest-200 dark:border-forest-700 text-ink-muted'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${rating >= num ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-accent-earth font-bold ml-2">
                    {rating} / 5 {isEn ? 'Stars' : 'Sao'}
                  </span>
                </div>
              </div>

              {/* Content text area with inline character counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider">
                    {isEn ? 'Your Detailed Experience *' : 'Cảm nhận chi tiết về không gian & đồ uống *'}
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      content.length > 1200
                        ? 'text-red-500 font-bold'
                        : content.length > 0 && content.length < 10
                        ? 'text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-ink-muted'
                    }`}
                  >
                    {content.length}/1200 {content.length > 0 && content.length < 10 && (isEn ? '(Min 10)' : '(Tối thiểu 10)')}
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={1200}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Share your thoughts about the natural stream, salted coffee, atmosphere, or staff...'
                      : 'Chia sẻ ấn tượng của bạn về con suối, tách cà phê muối, đĩa sinh tố bơ hay thái độ phục vụ...'
                  }
                  className="w-full px-4 py-2.5 bg-forest-50 dark:bg-forest-950 rounded-xl border border-forest-200 dark:border-forest-700 text-xs text-ink-primary focus:outline-none focus:border-accent-botanical"
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

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-botanical hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-mono font-bold transition-all shadow-subtle active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting
                      ? isEn
                        ? 'Submitting...'
                        : 'Đang gửi...'
                      : cooldownRemaining > 0
                      ? isEn
                        ? `Wait ${cooldownRemaining}s...`
                        : `Đợi ${cooldownRemaining}s để gửi tiếp...`
                      : isEn
                      ? 'Submit Review'
                      : 'Gửi cảm nhận'}
                  </span>
                </MagneticButton>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
