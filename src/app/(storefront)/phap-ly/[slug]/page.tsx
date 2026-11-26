import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Shield, FileText, CheckCircle2 } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';
import type { Metadata } from 'next';

interface LegalPageProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

const LEGAL_FALLBACKS: Record<
  string,
  { titleVi: string; titleEn: string; contentVi: string; contentEn: string }
> = {
  'chinh-sach-bao-mat': {
    titleVi: 'Chính Sách Bảo Mật Thông Tin',
    titleEn: 'Privacy Policy',
    contentVi:
      '## Cam kết bảo mật tại Cẩm Cù House\nCẩm Cù House cam kết bảo mật tuyệt đối thông tin cá nhân của quý khách khi liên hệ tại camcuhouse.online.\n\n### Phạm vi sử dụng\nThông tin họ tên, số điện thoại và email chỉ dùng để xác nhận lịch hẹn, đặt bàn BBQ bên suối và chăm sóc khách hàng.',
    contentEn:
      '## Privacy Commitment\nCẩm Cù House safeguards all guest information submitted via camcuhouse.online.\n\n### Scope of Use\nYour name, phone, and email are used strictly to confirm table/BBQ inquiries and deliver warm hospitality.',
  },
  'chinh-sach-doi-tra': {
    titleVi: 'Chính Sách Đổi Trả & Phục Vụ',
    titleEn: 'Return & Fresh Service Policy',
    contentVi:
      '## Cam kết chất lượng từng ly thức uống\nTất cả thức uống thảo mộc và cà phê rang mộc đều được pha chế tươi mới theo từng lượt khách.\n\n### Hỗ trợ đổi mới tại chỗ\nNếu món chưa hợp khẩu vị hoặc nhầm công thức, vui lòng báo nhân viên quầy pha chế để được đổi mới miễn phí ngay.',
    contentEn:
      '## Fresh Preparation Guarantee\nEvery herbal tea and wood-roasted coffee is freshly crafted to order.\n\n### Immediate Replacement\nIf any item misses your preference, let our baristas know for an immediate complimentary remake.',
  },
  'chinh-sach-bao-hanh': {
    titleVi: 'Chính Sách Chất Lượng & Nông Sản',
    titleEn: 'Quality & Origin Assurance',
    contentVi:
      '## Truy xuất nguồn gốc đất đỏ Bazan Đắk Nông\nHạt cà phê Robusta chín mọng được thu hái tại Gia Nghĩa và rang củi mộc 100%, không tẩm hương liệu nhân tạo.\n\n### Thảo mộc & Nguyên liệu tươi sạch\nGừng sẻ, hoa đu đủ đực, hoa cẩm cù và bơ sáp được tuyển chọn mỗi sáng từ vườn địa phương.',
    contentEn:
      '## Volcanic Basalt Terroir Guarantee\n100% ripe highland Robusta roasted naturally over wood fire with zero artificial additives.\n\n### Pure Local Botanicals\nFresh ginger, papaya blossoms, wax plant herbs, and Gia Nghia butter avocado are sourced daily.',
  },
  'dieu-khoan-su-dung': {
    titleVi: 'Điều Khoản & Quy Định Không Gian',
    titleEn: 'Terms & Space Guidelines',
    contentVi:
      '## Bảo vệ dòng suối tự nhiên Cẩm Cù House\nQuý khách vui lòng chung tay giữ gìn vệ sinh và không xả rác xuống dòng suối đá tại Hẻm 437 Hùng Vương.\n\n### An toàn khu vực suối\nQuý phụ huynh vui lòng quan sát các bạn nhỏ khi di chuyển trên cầu gỗ và các ghềnh đá ven suối.',
    contentEn:
      '## Protecting Our Mountain Stream\nGuests are kindly requested to keep the grounds pristine and avoid littering near our natural stream.\n\n### Safety by the Water\nParents are advised to keep a close eye on young children on wooden bridges and stream rocks.',
  },
};

async function findLegalRecord(slug: string) {
  const legal = await prisma.legalPage.findUnique({ where: { slug } }).catch(() => null);
  if (legal && legal.published) {
    return {
      slug: legal.slug,
      titleVi: legal.titleVi,
      titleEn: legal.titleEn,
      contentVi: legal.contentVi,
      contentEn: legal.contentEn,
      seoTitleVi: legal.seoTitleVi,
      seoTitleEn: legal.seoTitleEn,
      seoDescVi: legal.seoDescVi,
      seoDescEn: legal.seoDescEn,
    };
  }

  const staticFallback = await prisma.staticPage.findUnique({ where: { slug } }).catch(() => null);
  if (staticFallback && staticFallback.published) {
    return {
      slug: staticFallback.slug,
      titleVi: staticFallback.title,
      titleEn: staticFallback.titleEn || staticFallback.title,
      contentVi: staticFallback.content,
      contentEn: staticFallback.contentEn || staticFallback.content,
      seoTitleVi: staticFallback.metaTitle,
      seoTitleEn: staticFallback.metaTitle,
      seoDescVi: staticFallback.metaDescription,
      seoDescEn: staticFallback.metaDescription,
    };
  }

  const builtIn = LEGAL_FALLBACKS[slug];
  if (builtIn) {
    return { slug, ...builtIn, seoTitleVi: null, seoTitleEn: null, seoDescVi: null, seoDescEn: null };
  }

  return null;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const doc = await findLegalRecord(params.slug);
  if (!doc) {
    return { title: 'Chính sách không tồn tại — Cẩm Cù House' };
  }
  const locale = headers().get('x-locale') === 'en' ? 'en' : 'vi';
  return {
    title:
      locale === 'en'
        ? doc.seoTitleEn || `${doc.titleEn} — Cẩm Cù House`
        : doc.seoTitleVi || `${doc.titleVi} — Cẩm Cù House`,
    description:
      locale === 'en'
        ? doc.seoDescEn || `Official policy and guidelines from Cẩm Cù House Dong Gia Nghia.`
        : doc.seoDescVi || `Văn bản chính sách chính thức từ Cẩm Cù House Đông Gia Nghĩa.`,
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const doc = await findLegalRecord(params.slug);
  if (!doc) {
    notFound();
  }

  const isEn = headers().get('x-locale') === 'en';
  const title = isEn ? doc.titleEn : doc.titleVi;
  const content = isEn ? doc.contentEn : doc.contentVi;

  const renderContent = (text: string) =>
    text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-ink-primary mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary mt-8 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-[15px] text-ink-muted leading-relaxed">
          {line}
        </p>
      );
    });

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      <article className="py-14 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={isEn ? '/en' : '/'}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-botanical hover:underline font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Cẩm Cù House Home' : 'Trở về Trang chủ Cẩm Cù House'}</span>
          </Link>
        </div>

        <div className="space-y-3 pb-8 border-b border-forest-200/80 dark:border-forest-700/80">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{isEn ? 'OFFICIAL POLICY & LEGAL' : 'VĂN BẢN CHÍNH SÁCH & PHÁP LÝ'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-primary leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted pt-1">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Active Policy' : 'Chính sách hiện hành'}</span>
            </span>
            <span>•</span>
            <span>Cẩm Cù House · 11.99° N, 107.69° E</span>
          </div>
        </div>

        <div className="py-10 space-y-2 leading-relaxed">{renderContent(content)}</div>

        <div className="p-6 rounded-md bg-moss-soft border border-forest-200 dark:border-forest-700 text-sm font-sans text-ink-muted space-y-2 mt-8">
          <div className="font-bold text-ink-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-botanical" />
            <span>{isEn ? 'Transparency Commitment' : 'Cam kết minh bạch từ Cẩm Cù House'}</span>
          </div>
          <p>
            {isEn
              ? 'For any questions regarding our policies or sanctuary visit, reach us directly via Hotline 0382 851 688 or thuynhu8788@gmail.com.'
              : 'Mọi thắc mắc về chính sách hoặc hỗ trợ đặt chỗ, vui lòng gọi trực tiếp Hotline 0382 851 688 / 0774 659 000 hoặc email thuynhu8788@gmail.com.'}
          </p>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
