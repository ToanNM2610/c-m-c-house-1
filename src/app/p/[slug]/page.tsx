import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Shield, FileText, CheckCircle2 } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';
import type { Metadata } from 'next';

interface StaticPageProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
  let page;
  try {
    page = await prisma.staticPage.findUnique({
      where: { slug: params.slug },
    });
  } catch {
    console.error('[Static page] Unable to load CMS metadata.');
    return { title: 'Chưa kết nối — Cẩm Cù House' };
  }

  if (!page) {
    return { title: 'Trang không tồn tại — Cẩm Cù House' };
  }

  return {
    title: page.metaTitle || `${page.title} — Cẩm Cù House`,
    description: page.metaDescription || `Thông tin chính thức từ Cẩm Cù House Gia Nghĩa Đăk Nông.`,
  };
}

export default async function StaticLegalPage({ params }: StaticPageProps) {
  let page;
  try {
    page = await prisma.staticPage.findUnique({
      where: { slug: params.slug },
    });
  } catch {
    console.error('[Static page] Unable to load CMS content.');
    notFound();
  }

  if (!page || !page.published) {
    notFound();
  }

  // Parse lines for markdown-style headings and paragraphs
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
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
        <p key={idx} className="text-sm sm:text-base text-ink-muted leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      <article className="py-14 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-botanical hover:underline font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trở về Trang chủ Cẩm Cù House</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-forest-200/80 dark:border-forest-700/80">
          <div className="text-xs font-mono uppercase tracking-widest text-accent-botanical font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>THÔNG TIN CHÍNH THỨC & VĂN BẢN QUÁN</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-primary leading-tight">
            {page.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted pt-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chính sách hiệu lực</span>
            </span>
            <span>•</span>
            <span>Cẩm Cù House • TP. Gia Nghĩa, Đăk Nông</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-10 space-y-2 leading-relaxed">
          {renderContent(page.content)}
        </div>

        {/* Document Footer Notice */}
        <div className="p-6 rounded-2xl bg-forest-50/70 dark:bg-forest-900/40 border border-forest-200 dark:border-forest-700 text-xs font-mono text-ink-muted space-y-1.5 mt-8">
          <div className="font-bold text-ink-primary flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-accent-botanical" />
            <span>Cam kết minh bạch từ Ban Quản Lý Cẩm Cù House</span>
          </div>
          <p>
            Mọi thắc mắc hoặc yêu cầu đóng góp liên quan đến chính sách và không gian quán, quý khách vui lòng liên hệ trực tiếp qua hotline 0382 851 688 hoặc email thuynhu8788@gmail.com.
          </p>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}

