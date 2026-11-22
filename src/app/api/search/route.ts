import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({
        menu: [],
        events: [],
        faqs: [],
        pages: [],
        plates: [],
      });
    }

    const lower = query.toLowerCase();

    // Fetch all published candidates from PostgreSQL (Neon)
    const [menuItems, events, faqs, pages, plates] = await Promise.all([
      prisma.menuItem.findMany({
        where: { inStock: true },
        select: {
          id: true,
          name: true,
          nameVi: true,
          nameEn: true,
          vietnameseTitle: true,
          description: true,
          descVi: true,
          price: true,
          priceDisplay: true,
          categoryId: true,
          highlight: true,
        },
      }),
      prisma.eventPost.findMany({
        where: { active: true },
        select: {
          id: true,
          title: true,
          titleEn: true,
          subtitle: true,
          description: true,
          badge: true,
        },
      }),
      prisma.faqItem.findMany({
        where: { published: true },
        select: {
          id: true,
          question: true,
          questionEn: true,
          answer: true,
          category: true,
        },
      }),
      prisma.staticPage.findMany({
        where: { published: true },
        select: {
          id: true,
          slug: true,
          title: true,
          titleEn: true,
          content: true,
        },
      }),
      prisma.spatialFigure.findMany({
        select: {
          id: true,
          titleVi: true,
          titleEn: true,
          chapterTitleVi: true,
          locationVi: true,
        },
      }),
    ]);

    // Memory filter with Vietnamese case-insensitive matching
    const matchedMenu = menuItems.filter(
      (m) =>
        (m.name || m.nameVi || '').toLowerCase().includes(lower) ||
        (m.vietnameseTitle || m.nameVi || '').toLowerCase().includes(lower) ||
        (m.nameEn && m.nameEn.toLowerCase().includes(lower)) ||
        (m.description || m.descVi || '').toLowerCase().includes(lower)
    ).slice(0, 6);

    const matchedEvents = events.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        (e.titleEn && e.titleEn.toLowerCase().includes(lower)) ||
        e.subtitle.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower)
    ).slice(0, 4);

    const matchedFaqs = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(lower) ||
        (f.questionEn && f.questionEn.toLowerCase().includes(lower)) ||
        f.answer.toLowerCase().includes(lower)
    ).slice(0, 4);

    const matchedPages = pages.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(lower)) ||
        p.content.toLowerCase().includes(lower)
    ).slice(0, 3);

    const matchedPlates = plates.filter(
      (pl) =>
        pl.id.toLowerCase().includes(lower) ||
        pl.titleVi.toLowerCase().includes(lower) ||
        (pl.titleEn && pl.titleEn.toLowerCase().includes(lower)) ||
        pl.locationVi.toLowerCase().includes(lower)
    ).slice(0, 4);

    return NextResponse.json({
      query,
      menu: matchedMenu,
      events: matchedEvents,
      faqs: matchedFaqs,
      pages: matchedPages,
      plates: matchedPlates,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}

