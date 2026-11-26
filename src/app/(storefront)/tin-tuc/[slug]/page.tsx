import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, Tag, PhoneCall, MapPin } from 'lucide-react';
import FooterSection from '@/components/home/FooterSection';
import type { Metadata } from 'next';

interface PostDetailProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (post && post.published) return post;
  } catch {
    // ignore
  }
  return null;
}

export async function generateMetadata({ params }: PostDetailProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Bài viết không tồn tại — Cẩm Cù House' };
  const isEn = headers().get('x-locale') === 'en';
  return {
    title: isEn
      ? post.seoTitleEn || `${post.titleEn} — Cẩm Cù House`
      : post.seoTitleVi || `${post.titleVi} — Cẩm Cù House`,
    description: isEn
      ? post.seoDescEn || post.subtitleEn || post.contentEn.slice(0, 155)
      : post.seoDescVi || post.subtitleVi || post.contentVi.slice(0, 155),
    openGraph: post.imageUrl ? { images: [{ url: post.imageUrl }] } : undefined,
  };
}

export default async function NewsArticleDetailPage({ params }: PostDetailProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const isEn = headers().get('x-locale') === 'en';
  const title = isEn ? post.titleEn : post.titleVi;
  const subtitle = isEn ? post.subtitleEn : post.subtitleVi;
  const dateLabel = isEn ? post.dateLabelEn : post.dateLabelVi;
  const badge = isEn ? post.badgeEn || 'Dispatch' : post.badgeVi || 'Bản tin';
  const body = isEn ? post.contentEn : post.contentVi;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: subtitle || body.slice(0, 150),
    image: post.imageUrl || undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: 'Cẩm Cù House' },
  };

  return (
    <main className="min-h-screen pt-[72px] bg-paper text-ink-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-14 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={isEn ? '/en/news' : '/tin-tuc'}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-botanical hover:underline font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to News & FAQ' : 'Quay lại Tin tức & FAQ'}</span>
          </Link>
        </div>

        <header className="space-y-4 pb-8 border-b border-forest-200/80 dark:border-forest-700/80">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-accent-botanical text-white font-semibold">
              <Tag className="w-3 h-3" />
              {badge}
            </span>
            {dateLabel && (
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <Calendar className="w-3.5 h-3.5 text-accent-earth" />
                {dateLabel}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-primary leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="font-serif text-lg sm:text-xl italic text-ink-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>

        {post.imageUrl && (
          <figure className="my-8 overflow-hidden rounded-md border border-forest-200/80 dark:border-forest-700/80 bg-moss-soft">
            <img
              src={post.imageUrl}
              alt={title}
              className="w-full aspect-[3/2] object-cover"
            />
            <figcaption className="px-4 py-2.5 text-xs font-mono text-ink-muted border-t border-forest-200/60 dark:border-forest-700/60">
              Cẩm Cù House · Hẻm 437 Hùng Vương, Đông Gia Nghĩa · 11.99° N, 107.69° E
            </figcaption>
          </figure>
        )}

        <div className="py-4 space-y-4 text-[15px] sm:text-base text-ink-primary leading-relaxed whitespace-pre-line font-sans">
          {body}
        </div>

        <div className="mt-12 p-6 rounded-md bg-moss-soft border border-forest-200 dark:border-forest-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-serif text-lg font-bold text-ink-primary">
              {isEn ? 'Visit Cẩm Cù House Beside the Stream' : 'Ghé Cẩm Cù House Bên Dòng Suối Mát'}
            </p>
            <p className="text-sm text-ink-muted flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent-earth shrink-0" />
              <span>Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông</span>
            </p>
          </div>
          <a
            href="tel:0382851688"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-accent-botanical text-white text-sm font-sans font-semibold whitespace-nowrap hover:opacity-95 transition-opacity"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hotline: 0382 851 688</span>
          </a>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
