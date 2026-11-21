import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { id: 'default' },
    });

    if (!content) {
      return apiError('Chưa có nội dung website', 404);
    }

    return apiSuccess({
      ...content,
      philosophyCards: content.philosophyCards ? JSON.parse(content.philosophyCards) : [],
      philosophyCardsEn: content.philosophyCardsEn ? JSON.parse(content.philosophyCardsEn) : [],
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return apiError('Lỗi lấy dữ liệu CMS nội dung', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await req.json();
    const dataToUpdate: Record<string, unknown> = {};

    // Hero Section
    if (body.heroEyebrow !== undefined) dataToUpdate.heroEyebrow = body.heroEyebrow;
    if (body.heroEyebrowEn !== undefined) dataToUpdate.heroEyebrowEn = body.heroEyebrowEn;
    if (body.heroTitle !== undefined) dataToUpdate.heroTitle = body.heroTitle;
    if (body.heroTitleEn !== undefined) dataToUpdate.heroTitleEn = body.heroTitleEn;
    if (body.heroSubtitle !== undefined) dataToUpdate.heroSubtitle = body.heroSubtitle;
    if (body.heroSubtitleEn !== undefined) dataToUpdate.heroSubtitleEn = body.heroSubtitleEn;
    if (body.heroTagline !== undefined) dataToUpdate.heroTagline = body.heroTagline;
    if (body.heroTaglineEn !== undefined) dataToUpdate.heroTaglineEn = body.heroTaglineEn;
    if (body.heroDescription !== undefined) dataToUpdate.heroDescription = body.heroDescription;
    if (body.heroDescriptionEn !== undefined) dataToUpdate.heroDescriptionEn = body.heroDescriptionEn;
    if (typeof body.showHero3DBean === 'boolean') dataToUpdate.showHero3DBean = body.showHero3DBean;

    // Philosophy Section
    if (body.philosophyEyebrow !== undefined) dataToUpdate.philosophyEyebrow = body.philosophyEyebrow;
    if (body.philosophyEyebrowEn !== undefined) dataToUpdate.philosophyEyebrowEn = body.philosophyEyebrowEn;
    if (body.philosophyTitle !== undefined) dataToUpdate.philosophyTitle = body.philosophyTitle;
    if (body.philosophyTitleEn !== undefined) dataToUpdate.philosophyTitleEn = body.philosophyTitleEn;
    if (body.philosophyLead !== undefined) dataToUpdate.philosophyLead = body.philosophyLead;
    if (body.philosophyLeadEn !== undefined) dataToUpdate.philosophyLeadEn = body.philosophyLeadEn;
    if (body.philosophyStory !== undefined) dataToUpdate.philosophyStory = body.philosophyStory;
    if (body.philosophyStoryEn !== undefined) dataToUpdate.philosophyStoryEn = body.philosophyStoryEn;
    if (body.philosophyCards !== undefined) {
      dataToUpdate.philosophyCards = typeof body.philosophyCards === 'string'
        ? body.philosophyCards
        : JSON.stringify(body.philosophyCards);
    }
    if (body.philosophyCardsEn !== undefined) {
      dataToUpdate.philosophyCardsEn = typeof body.philosophyCardsEn === 'string'
        ? body.philosophyCardsEn
        : JSON.stringify(body.philosophyCardsEn);
    }

    // Brand Story Section
    if (body.brandStoryTitle !== undefined) dataToUpdate.brandStoryTitle = body.brandStoryTitle;
    if (body.brandStoryTitleEn !== undefined) dataToUpdate.brandStoryTitleEn = body.brandStoryTitleEn;
    if (body.brandStorySubtitle !== undefined) dataToUpdate.brandStorySubtitle = body.brandStorySubtitle;
    if (body.brandStorySubtitleEn !== undefined) dataToUpdate.brandStorySubtitleEn = body.brandStorySubtitleEn;
    if (body.brandStoryContent !== undefined) dataToUpdate.brandStoryContent = body.brandStoryContent;
    if (body.brandStoryContentEn !== undefined) dataToUpdate.brandStoryContentEn = body.brandStoryContentEn;
    if (body.brandStoryPhilosophy !== undefined) dataToUpdate.brandStoryPhilosophy = body.brandStoryPhilosophy;
    if (body.brandStoryPhilosophyEn !== undefined) dataToUpdate.brandStoryPhilosophyEn = body.brandStoryPhilosophyEn;
    if (body.brandStoryImageUrl !== undefined) dataToUpdate.brandStoryImageUrl = body.brandStoryImageUrl || null;

    const updated = await prisma.siteContent.upsert({
      where: { id: 'default' },
      update: dataToUpdate,
      create: {
        id: 'default',
        heroEyebrow: body.heroEyebrow || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
        heroEyebrowEn: body.heroEyebrowEn || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
        heroTitle: body.heroTitle || 'CẨM CÙ HOUSE',
        heroTitleEn: body.heroTitleEn || 'CẨM CÙ HOUSE',
        heroSubtitle: body.heroSubtitle || 'Bên Dòng Suối Mát • Hẻm 437 Hùng Vương, Gia Nghĩa',
        heroSubtitleEn: body.heroSubtitleEn || 'Beside Fresh Mountain Stream • Alley 437 Hung Vuong, Gia Nghia',
        heroTagline: body.heroTagline || 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Gia Nghĩa.',
        heroTaglineEn: body.heroTaglineEn || 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Gia Nghia.',
        heroDescription: body.heroDescription || 'Tận hưởng không gian suối mát rượi quanh năm...',
        heroDescriptionEn: body.heroDescriptionEn || 'Experience year-round cool streamside breezes...',
        showHero3DBean: typeof body.showHero3DBean === 'boolean' ? body.showHero3DBean : true,
        philosophyEyebrow: body.philosophyEyebrow || 'VỀ KHÔNG GIAN BÊN SUỐI',
        philosophyEyebrowEn: body.philosophyEyebrowEn || 'ABOUT OUR STREAMSIDE SANCTUARY',
        philosophyTitle: body.philosophyTitle || 'Nơi Nhịp Thở Chậm Lại Bên Dòng Suối Tự Nhiên',
        philosophyTitleEn: body.philosophyTitleEn || 'Where Your Breath Slows Down by the Gentle Stream',
        philosophyLead: body.philosophyLead || 'Giữa lòng phố núi Gia Nghĩa...',
        philosophyLeadEn: body.philosophyLeadEn || 'In the heart of Gia Nghia mountain town...',
        philosophyStory: body.philosophyStory || 'Chúng tôi giữ lại nguyên vẹn...',
        philosophyStoryEn: body.philosophyStoryEn || 'We preserve the pristine basalt rocks...',
        philosophyCards: body.philosophyCards ? (typeof body.philosophyCards === 'string' ? body.philosophyCards : JSON.stringify(body.philosophyCards)) : '[]',
        philosophyCardsEn: body.philosophyCardsEn ? (typeof body.philosophyCardsEn === 'string' ? body.philosophyCardsEn : JSON.stringify(body.philosophyCardsEn)) : '[]',
        brandStoryTitle: body.brandStoryTitle || 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù',
        brandStoryTitleEn: body.brandStoryTitleEn || 'The Awakening Journey Beneath the Wax Plant Vines',
        brandStorySubtitle: body.brandStorySubtitle || 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc',
        brandStorySubtitleEn: body.brandStorySubtitleEn || 'A Story of Basalt Soil, Gentle Streams & Pure Wood-Roasted Coffee',
        brandStoryContent: body.brandStoryContent || 'Đăk Nông không chỉ có thác đổ hùng vĩ...',
        brandStoryContentEn: body.brandStoryContentEn || 'Dak Nong is blessed not only with majestic waterfalls...',
        brandStoryPhilosophy: body.brandStoryPhilosophy || 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết"...',
        brandStoryPhilosophyEn: body.brandStoryPhilosophyEn || 'Our philosophy is simple: "Green - Wholesome - Pure"...',
        brandStoryImageUrl: body.brandStoryImageUrl || null,
      },
    });

    revalidatePath('/', 'layout');

    await logAction({
      level: 'INFO',
      category: 'CMS',
      action: 'CONTENT_UPDATE',
      actor: user.username,
      details: 'Updated site content (Hero, Philosophy, Brand Story)',
    });

    return apiSuccess({
      ...updated,
      philosophyCards: updated.philosophyCards ? JSON.parse(updated.philosophyCards) : [],
      philosophyCardsEn: updated.philosophyCardsEn ? JSON.parse(updated.philosophyCardsEn) : [],
    }, { message: 'Cập nhật nội dung website thành công' });
  } catch (error: any) {
    console.error('Error updating site content:', error);
    return apiError(error.message || 'Lỗi cập nhật CMS nội dung', 500);
  }
}
