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
    if (typeof body.showStoryMilestones === 'boolean') dataToUpdate.showStoryMilestones = body.showStoryMilestones;
    if (typeof body.showTeamMembers === 'boolean') dataToUpdate.showTeamMembers = body.showTeamMembers;
    if (body.visionTitle !== undefined) dataToUpdate.visionTitle = body.visionTitle;
    if (body.visionTitleEn !== undefined) dataToUpdate.visionTitleEn = body.visionTitleEn;
    if (body.visionDesc !== undefined) dataToUpdate.visionDesc = body.visionDesc;
    if (body.visionDescEn !== undefined) dataToUpdate.visionDescEn = body.visionDescEn;

    // Page 1 Home Section Toggles
    if (typeof body.showFeaturedMenu === 'boolean') dataToUpdate.showFeaturedMenu = body.showFeaturedMenu;
    if (typeof body.showFeaturedSpace === 'boolean') dataToUpdate.showFeaturedSpace = body.showFeaturedSpace;
    if (typeof body.showFeaturedReviews === 'boolean') dataToUpdate.showFeaturedReviews = body.showFeaturedReviews;
    if (typeof body.showFeaturedEvents === 'boolean') dataToUpdate.showFeaturedEvents = body.showFeaturedEvents;

    // Page 3: Không gian (/khong-gian)
    if (body.spaceEyebrow !== undefined) dataToUpdate.spaceEyebrow = body.spaceEyebrow;
    if (body.spaceEyebrowEn !== undefined) dataToUpdate.spaceEyebrowEn = body.spaceEyebrowEn;
    if (body.spaceTitle !== undefined) dataToUpdate.spaceTitle = body.spaceTitle;
    if (body.spaceTitleEn !== undefined) dataToUpdate.spaceTitleEn = body.spaceTitleEn;
    if (body.spaceSubtitle !== undefined) dataToUpdate.spaceSubtitle = body.spaceSubtitle;
    if (body.spaceSubtitleEn !== undefined) dataToUpdate.spaceSubtitleEn = body.spaceSubtitleEn;
    if (body.spaceIntro !== undefined) dataToUpdate.spaceIntro = body.spaceIntro;
    if (body.spaceIntroEn !== undefined) dataToUpdate.spaceIntroEn = body.spaceIntroEn;
    if (body.spaceHeroBanner !== undefined) dataToUpdate.spaceHeroBanner = body.spaceHeroBanner || null;

    // Page 4: Thực đơn (/thuc-don)
    if (body.menuEyebrow !== undefined) dataToUpdate.menuEyebrow = body.menuEyebrow;
    if (body.menuEyebrowEn !== undefined) dataToUpdate.menuEyebrowEn = body.menuEyebrowEn;
    if (body.menuTitle !== undefined) dataToUpdate.menuTitle = body.menuTitle;
    if (body.menuTitleEn !== undefined) dataToUpdate.menuTitleEn = body.menuTitleEn;
    if (body.menuSubtitle !== undefined) dataToUpdate.menuSubtitle = body.menuSubtitle;
    if (body.menuSubtitleEn !== undefined) dataToUpdate.menuSubtitleEn = body.menuSubtitleEn;
    if (body.menuIntro !== undefined) dataToUpdate.menuIntro = body.menuIntro;
    if (body.menuIntroEn !== undefined) dataToUpdate.menuIntroEn = body.menuIntroEn;
    if (body.menuNotice !== undefined) dataToUpdate.menuNotice = body.menuNotice;
    if (body.menuNoticeEn !== undefined) dataToUpdate.menuNoticeEn = body.menuNoticeEn;

    // Page 5: Khách hàng (/khach-hang)
    if (body.reviewsEyebrow !== undefined) dataToUpdate.reviewsEyebrow = body.reviewsEyebrow;
    if (body.reviewsEyebrowEn !== undefined) dataToUpdate.reviewsEyebrowEn = body.reviewsEyebrowEn;
    if (body.reviewsTitle !== undefined) dataToUpdate.reviewsTitle = body.reviewsTitle;
    if (body.reviewsTitleEn !== undefined) dataToUpdate.reviewsTitleEn = body.reviewsTitleEn;
    if (body.reviewsSubtitle !== undefined) dataToUpdate.reviewsSubtitle = body.reviewsSubtitle;
    if (body.reviewsSubtitleEn !== undefined) dataToUpdate.reviewsSubtitleEn = body.reviewsSubtitleEn;
    if (body.reviewsIntro !== undefined) dataToUpdate.reviewsIntro = body.reviewsIntro;
    if (body.reviewsIntroEn !== undefined) dataToUpdate.reviewsIntroEn = body.reviewsIntroEn;
    if (body.reviewsPrompt !== undefined) dataToUpdate.reviewsPrompt = body.reviewsPrompt;
    if (body.reviewsPromptEn !== undefined) dataToUpdate.reviewsPromptEn = body.reviewsPromptEn;

    // Page 6: Tin tức & FAQ (/tin-tuc)
    if (body.newsEyebrow !== undefined) dataToUpdate.newsEyebrow = body.newsEyebrow;
    if (body.newsEyebrowEn !== undefined) dataToUpdate.newsEyebrowEn = body.newsEyebrowEn;
    if (body.newsTitle !== undefined) dataToUpdate.newsTitle = body.newsTitle;
    if (body.newsTitleEn !== undefined) dataToUpdate.newsTitleEn = body.newsTitleEn;
    if (body.newsSubtitle !== undefined) dataToUpdate.newsSubtitle = body.newsSubtitle;
    if (body.newsSubtitleEn !== undefined) dataToUpdate.newsSubtitleEn = body.newsSubtitleEn;
    if (body.newsIntro !== undefined) dataToUpdate.newsIntro = body.newsIntro;
    if (body.newsIntroEn !== undefined) dataToUpdate.newsIntroEn = body.newsIntroEn;
    if (typeof body.showNewsEvents === 'boolean') dataToUpdate.showNewsEvents = body.showNewsEvents;
    if (typeof body.showNewsFaq === 'boolean') dataToUpdate.showNewsFaq = body.showNewsFaq;

    // Page 7: Liên hệ (/lien-he)
    if (body.contactEyebrow !== undefined) dataToUpdate.contactEyebrow = body.contactEyebrow;
    if (body.contactEyebrowEn !== undefined) dataToUpdate.contactEyebrowEn = body.contactEyebrowEn;
    if (body.contactTitle !== undefined) dataToUpdate.contactTitle = body.contactTitle;
    if (body.contactTitleEn !== undefined) dataToUpdate.contactTitleEn = body.contactTitleEn;
    if (body.contactSubtitle !== undefined) dataToUpdate.contactSubtitle = body.contactSubtitle;
    if (body.contactSubtitleEn !== undefined) dataToUpdate.contactSubtitleEn = body.contactSubtitleEn;
    if (body.contactIntro !== undefined) dataToUpdate.contactIntro = body.contactIntro;
    if (body.contactIntroEn !== undefined) dataToUpdate.contactIntroEn = body.contactIntroEn;
    if (body.contactBbqCallout !== undefined) dataToUpdate.contactBbqCallout = body.contactBbqCallout;
    if (body.contactBbqCalloutEn !== undefined) dataToUpdate.contactBbqCalloutEn = body.contactBbqCalloutEn;
    if (body.contactDirectionsNote !== undefined) dataToUpdate.contactDirectionsNote = body.contactDirectionsNote;
    if (body.contactDirectionsNoteEn !== undefined) dataToUpdate.contactDirectionsNoteEn = body.contactDirectionsNoteEn;

    // Page-Level Visibility Toggles (Module 1)
    if (typeof body.showPageAbout === 'boolean') dataToUpdate.showPageAbout = body.showPageAbout;
    if (typeof body.showPageSpace === 'boolean') dataToUpdate.showPageSpace = body.showPageSpace;
    if (typeof body.showPageMenu === 'boolean') dataToUpdate.showPageMenu = body.showPageMenu;
    if (typeof body.showPageReviews === 'boolean') dataToUpdate.showPageReviews = body.showPageReviews;
    if (typeof body.showPageNews === 'boolean') dataToUpdate.showPageNews = body.showPageNews;
    if (typeof body.showPageContact === 'boolean') dataToUpdate.showPageContact = body.showPageContact;

    // Universal Section Ordering
    if (body.homeSectionOrder !== undefined) dataToUpdate.homeSectionOrder = body.homeSectionOrder;
    if (body.aboutSectionOrder !== undefined) dataToUpdate.aboutSectionOrder = body.aboutSectionOrder;
    if (body.spaceSectionOrder !== undefined) dataToUpdate.spaceSectionOrder = body.spaceSectionOrder;
    if (body.menuSectionOrder !== undefined) dataToUpdate.menuSectionOrder = body.menuSectionOrder;
    if (body.reviewsSectionOrder !== undefined) dataToUpdate.reviewsSectionOrder = body.reviewsSectionOrder;
    if (body.newsSectionOrder !== undefined) dataToUpdate.newsSectionOrder = body.newsSectionOrder;
    if (body.contactSectionOrder !== undefined) dataToUpdate.contactSectionOrder = body.contactSectionOrder;

    // Universal Section Layout Variants & Visibility
    if (body.sectionLayouts !== undefined) dataToUpdate.sectionLayouts = body.sectionLayouts;
    if (body.sectionVisibility !== undefined) dataToUpdate.sectionVisibility = body.sectionVisibility;

    // Additional section content fields
    if (body.heroLayout !== undefined) dataToUpdate.heroLayout = body.heroLayout;
    if (body.heroPrimaryCtaText !== undefined) dataToUpdate.heroPrimaryCtaText = body.heroPrimaryCtaText;
    if (body.heroPrimaryCtaTextEn !== undefined) dataToUpdate.heroPrimaryCtaTextEn = body.heroPrimaryCtaTextEn;
    if (body.heroPrimaryCtaLink !== undefined) dataToUpdate.heroPrimaryCtaLink = body.heroPrimaryCtaLink;
    if (body.heroSecondaryCtaText !== undefined) dataToUpdate.heroSecondaryCtaText = body.heroSecondaryCtaText;
    if (body.heroSecondaryCtaTextEn !== undefined) dataToUpdate.heroSecondaryCtaTextEn = body.heroSecondaryCtaTextEn;
    if (body.heroSecondaryCtaLink !== undefined) dataToUpdate.heroSecondaryCtaLink = body.heroSecondaryCtaLink;
    if (body.heroCoverImage !== undefined) dataToUpdate.heroCoverImage = body.heroCoverImage;
    if (typeof body.showHeroCoverImage === 'boolean') dataToUpdate.showHeroCoverImage = body.showHeroCoverImage;
    if (body.heroCaption !== undefined) dataToUpdate.heroCaption = body.heroCaption;
    if (body.heroCaptionEn !== undefined) dataToUpdate.heroCaptionEn = body.heroCaptionEn;
    if (body.homeCtaBannerTitle !== undefined) dataToUpdate.homeCtaBannerTitle = body.homeCtaBannerTitle;
    if (body.homeCtaBannerTitleEn !== undefined) dataToUpdate.homeCtaBannerTitleEn = body.homeCtaBannerTitleEn;
    if (body.homeCtaBannerDesc !== undefined) dataToUpdate.homeCtaBannerDesc = body.homeCtaBannerDesc;
    if (body.homeCtaBannerDescEn !== undefined) dataToUpdate.homeCtaBannerDescEn = body.homeCtaBannerDescEn;
    if (body.homeCtaBannerBtnText !== undefined) dataToUpdate.homeCtaBannerBtnText = body.homeCtaBannerBtnText;
    if (body.homeCtaBannerBtnTextEn !== undefined) dataToUpdate.homeCtaBannerBtnTextEn = body.homeCtaBannerBtnTextEn;
    if (body.homeCtaBannerBtnLink !== undefined) dataToUpdate.homeCtaBannerBtnLink = body.homeCtaBannerBtnLink;
    if (typeof body.showHomeCtaBanner === 'boolean') dataToUpdate.showHomeCtaBanner = body.showHomeCtaBanner;

    if (body.aboutCommitments !== undefined) dataToUpdate.aboutCommitments = body.aboutCommitments;

    if (body.spaceZones !== undefined) dataToUpdate.spaceZones = body.spaceZones;
    if (body.spaceCtaTitle !== undefined) dataToUpdate.spaceCtaTitle = body.spaceCtaTitle;
    if (body.spaceCtaTitleEn !== undefined) dataToUpdate.spaceCtaTitleEn = body.spaceCtaTitleEn;
    if (body.spaceCtaDesc !== undefined) dataToUpdate.spaceCtaDesc = body.spaceCtaDesc;
    if (body.spaceCtaDescEn !== undefined) dataToUpdate.spaceCtaDescEn = body.spaceCtaDescEn;
    if (body.spaceCtaBtnText !== undefined) dataToUpdate.spaceCtaBtnText = body.spaceCtaBtnText;
    if (body.spaceCtaBtnTextEn !== undefined) dataToUpdate.spaceCtaBtnTextEn = body.spaceCtaBtnTextEn;
    if (typeof body.showSpaceCta === 'boolean') dataToUpdate.showSpaceCta = body.showSpaceCta;
    if (typeof body.showSpaceFilterBar === 'boolean') dataToUpdate.showSpaceFilterBar = body.showSpaceFilterBar;

    if (typeof body.menuShowPrices === 'boolean') dataToUpdate.menuShowPrices = body.menuShowPrices;
    if (body.menuDietaryNote !== undefined) dataToUpdate.menuDietaryNote = body.menuDietaryNote;
    if (body.menuDietaryNoteEn !== undefined) dataToUpdate.menuDietaryNoteEn = body.menuDietaryNoteEn;
    if (body.menuCurrencyNote !== undefined) dataToUpdate.menuCurrencyNote = body.menuCurrencyNote;
    if (body.menuCurrencyNoteEn !== undefined) dataToUpdate.menuCurrencyNoteEn = body.menuCurrencyNoteEn;
    if (body.menuBbqBannerTitle !== undefined) dataToUpdate.menuBbqBannerTitle = body.menuBbqBannerTitle;
    if (body.menuBbqBannerTitleEn !== undefined) dataToUpdate.menuBbqBannerTitleEn = body.menuBbqBannerTitleEn;
    if (body.menuBbqBannerDesc !== undefined) dataToUpdate.menuBbqBannerDesc = body.menuBbqBannerDesc;
    if (body.menuBbqBannerDescEn !== undefined) dataToUpdate.menuBbqBannerDescEn = body.menuBbqBannerDescEn;
    if (body.menuBbqBannerBtnText !== undefined) dataToUpdate.menuBbqBannerBtnText = body.menuBbqBannerBtnText;
    if (body.menuBbqBannerBtnTextEn !== undefined) dataToUpdate.menuBbqBannerBtnTextEn = body.menuBbqBannerBtnTextEn;
    if (typeof body.showMenuBbqBanner === 'boolean') dataToUpdate.showMenuBbqBanner = body.showMenuBbqBanner;

    if (body.reviewsTrustScore !== undefined) dataToUpdate.reviewsTrustScore = body.reviewsTrustScore;
    if (body.reviewsTrustScoreEn !== undefined) dataToUpdate.reviewsTrustScoreEn = body.reviewsTrustScoreEn;
    if (body.reviewsThankYou !== undefined) dataToUpdate.reviewsThankYou = body.reviewsThankYou;
    if (body.reviewsThankYouEn !== undefined) dataToUpdate.reviewsThankYouEn = body.reviewsThankYouEn;

    if (body.newsContactPrompt !== undefined) dataToUpdate.newsContactPrompt = body.newsContactPrompt;
    if (body.newsContactPromptEn !== undefined) dataToUpdate.newsContactPromptEn = body.newsContactPromptEn;

    if (body.contactQuickInfoLayout !== undefined) dataToUpdate.contactQuickInfoLayout = body.contactQuickInfoLayout;
    if (body.contactMapCaption !== undefined) dataToUpdate.contactMapCaption = body.contactMapCaption;
    if (body.contactMapCaptionEn !== undefined) dataToUpdate.contactMapCaptionEn = body.contactMapCaptionEn;
    if (body.contactMapEmbedUrl !== undefined) dataToUpdate.contactMapEmbedUrl = body.contactMapEmbedUrl;

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
        showStoryMilestones: typeof body.showStoryMilestones === 'boolean' ? body.showStoryMilestones : true,
        showTeamMembers: typeof body.showTeamMembers === 'boolean' ? body.showTeamMembers : true,
        visionTitle: body.visionTitle || 'Tầm Nhìn & Sứ Mệnh Sinh Thái',
        visionTitleEn: body.visionTitleEn || 'Ecological Vision & Mission',
        visionDesc: body.visionDesc || 'Trở thành điểm hẹn sinh thái biểu trưng của Đông Gia Nghĩa, Lâm Đồng...',
        visionDescEn: body.visionDescEn || 'To be the premier ecological destination of Dong Gia Nghia, Lam Dong...',

        // Page 1 Home Section Toggles
        showFeaturedMenu: typeof body.showFeaturedMenu === 'boolean' ? body.showFeaturedMenu : true,
        showFeaturedSpace: typeof body.showFeaturedSpace === 'boolean' ? body.showFeaturedSpace : true,
        showFeaturedReviews: typeof body.showFeaturedReviews === 'boolean' ? body.showFeaturedReviews : true,
        showFeaturedEvents: typeof body.showFeaturedEvents === 'boolean' ? body.showFeaturedEvents : true,

        // Page 3: Không gian (/khong-gian)
        spaceEyebrow: body.spaceEyebrow || 'BỘ SƯU TẬP KHÔNG GIAN • BẢN KHẮC THỊ GIÁC',
        spaceEyebrowEn: body.spaceEyebrowEn || 'SPATIAL GALLERY • CURATED VISUAL PLATES',
        spaceTitle: body.spaceTitle || '30 Bản Khắc Không Gian Bên Bờ Suối Mát',
        spaceTitleEn: body.spaceTitleEn || '30 Streamside Spatial Plates',
        spaceSubtitle: body.spaceSubtitle || 'Nơi mỗi góc quán mộc mạc ghi lại vẻ đẹp tĩnh lặng của làn nước suối và vòm lá Cẩm Cù',
        spaceSubtitleEn: body.spaceSubtitleEn || 'Where each rustic frame captures the quiet poetry of flowing water and wax plant canopies',
        spaceIntro: body.spaceIntro || 'Khám phá trọn vẹn các bản khắc thị giác của Cẩm Cù House qua 4 chương không gian: Lối nhỏ vào vườn, Bên bờ suối mát, Hương vị xanh sạch và Hoàng hôn buông.',
        spaceIntroEn: body.spaceIntroEn || 'Explore all curated visual plates of Cẩm Cù House organized across 4 chapters: The Wax Flower Path, Beside the Cool Stream, Wholesome Pure Flavors, and Twilight.',
        spaceHeroBanner: body.spaceHeroBanner || '/uploads/gallery/fig-01.jpg',

        // Page 4: Thực đơn (/thuc-don)
        menuEyebrow: body.menuEyebrow || 'THỰC ĐƠN THẢO MỘC & CÀ PHÊ RANG MỘC',
        menuEyebrowEn: body.menuEyebrowEn || 'BOTANICAL HERBAL MENU & WOOD-ROASTED COFFEE',
        menuTitle: body.menuTitle || 'Thực Đơn Cẩm Cù House',
        menuTitleEn: body.menuTitleEn || 'Cẩm Cù House Botanical Menu',
        menuSubtitle: body.menuSubtitle || 'Hương Vị Bazan Đăk Nông & Thảo Mộc Thanh Mát',
        menuSubtitleEn: body.menuSubtitleEn || 'Flavors of Basalt Soil & Wholesome Fresh Herbs',
        menuIntro: body.menuIntro || '67 món thức uống và điểm tâm được chế biến từ nông sản tự nhiên, cà phê rang củi mộc và thảo mộc tươi mát.',
        menuIntroEn: body.menuIntroEn || '67 drinks and artisanal breakfast dishes crafted from organic botanicals, wood-roasted coffee, and garden herbs.',
        menuNotice: body.menuNotice || 'Phục vụ tại bàn sát suối • Không sử dụng phẩm màu hay hương liệu nhân tạo • Thảo mộc tươi hái mỗi sáng',
        menuNoticeEn: body.menuNoticeEn || 'Served right beside the stream • Zero artificial flavors or coloring • Fresh herbs harvested every morning',

        // Page 5: Khách hàng (/khach-hang)
        reviewsEyebrow: body.reviewsEyebrow || 'CẢM NHẬN & ĐÁNH GIÁ THỰC TẾ',
        reviewsEyebrowEn: body.reviewsEyebrowEn || 'GENUINE GUEST REVIEWS & STORIES',
        reviewsTitle: body.reviewsTitle || 'Những Lời Gửi Gắm Bên Dòng Suối',
        reviewsTitleEn: body.reviewsTitleEn || 'Heartfelt Words Beside the Stream',
        reviewsSubtitle: body.reviewsSubtitle || '100% Đề xuất từ những vị khách quý ghé thăm Cẩm Cù House',
        reviewsSubtitleEn: body.reviewsSubtitleEn || '100% Recommended by genuine guests visiting Cẩm Cù House',
        reviewsIntro: body.reviewsIntro || 'Mỗi tách cà phê, mỗi buổi chiều ngồi nghe tiếng suối là một kỷ niệm đẹp. Chúng tôi trân trọng từng chia sẻ và góp ý chân tình của bạn.',
        reviewsIntroEn: body.reviewsIntroEn || 'Every cup of coffee, every peaceful afternoon listening to the gentle brook is a cherished memory. We treasure every heartfelt guest review.',
        reviewsPrompt: body.reviewsPrompt || 'Bạn đã ghé thăm Cẩm Cù House? Hãy để lại cảm nhận của bạn để chúng tôi phục vụ ngày một chu đáo hơn!',
        reviewsPromptEn: body.reviewsPromptEn || 'Have you visited Cẩm Cù House? Please leave your review so we can welcome you even better!',

        // Page 6: Tin tức & FAQ (/tin-tuc)
        newsEyebrow: body.newsEyebrow || 'BẢN TIN SINH THÁI & GIẢI ĐÁP',
        newsEyebrowEn: body.newsEyebrowEn || 'ECOLOGICAL DISPATCH & FAQ',
        newsTitle: body.newsTitle || 'Tin Tức Hoạt Động & Câu Hỏi Thường Gặp',
        newsTitleEn: body.newsTitleEn || 'Events, News & Frequently Asked Questions',
        newsSubtitle: body.newsSubtitle || 'Cập nhật nhịp sống bên suối và thông tin hướng dẫn chi tiết dành cho bạn',
        newsSubtitleEn: body.newsSubtitleEn || 'Updates on streamside happenings and helpful guide notes for your visit',
        newsIntro: body.newsIntro || 'Xem lịch trình các hoạt động âm nhạc, mùa vụ hoa nở và câu trả lời cho các thắc mắc về đường đi, thực đơn, bãi đỗ xe.',
        newsIntroEn: body.newsIntroEn || 'Check schedules for acoustic sessions, seasonal blooms, and clear answers regarding parking, menu, and directions.',
        showNewsEvents: typeof body.showNewsEvents === 'boolean' ? body.showNewsEvents : true,
        showNewsFaq: typeof body.showNewsFaq === 'boolean' ? body.showNewsFaq : true,

        // Page 7: Liên hệ (/lien-he)
        contactEyebrow: body.contactEyebrow || 'CHỈ ĐƯỜNG & KẾT NỐI',
        contactEyebrowEn: body.contactEyebrowEn || 'DIRECTIONS & GET IN TOUCH',
        contactTitle: body.contactTitle || 'Ghé Thăm Cẩm Cù House',
        contactTitleEn: body.contactTitleEn || 'Visit Cẩm Cù House',
        contactSubtitle: body.contactSubtitle || 'Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông',
        contactSubtitleEn: body.contactSubtitleEn || 'Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City, Dak Nong',
        contactIntro: body.contactIntro || 'Quán nằm dưới con dốc rợp bóng cây xanh mát, chỉ cách trục đường Hùng Vương vài bước chân. Dòng suối tự nhiên uốn lượn ngay sau quán.',
        contactIntroEn: body.contactIntroEn || 'Nestled down a tree-shaded slope just steps away from Hung Vuong street. The gentle natural stream flows right behind the café.',
        contactBbqCallout: body.contactBbqCallout || 'Tiệc BBQ bên bờ suối & Đặt chỗ đoàn: Vui lòng liên hệ Hotline trước ít nhất 1 ngày để quán chuẩn bị chu đáo nhất.',
        contactBbqCalloutEn: body.contactBbqCalloutEn || 'Streamside BBQ & Group gatherings: Please contact our Hotline at least 1 day in advance for optimal preparation.',
        contactDirectionsNote: body.contactDirectionsNote || 'Từ đường Hùng Vương rẽ vào Hẻm 437, đi thẳng 50m xuống dốc có biển chỉ dẫn gỗ Cẩm Cù House. Có bãi đỗ xe ô tô và xe máy rộng rãi.',
        contactDirectionsNoteEn: body.contactDirectionsNoteEn || 'From Hung Vuong street turn into Alley 437, drive 50m down the shaded slope following wooden signs. Spacious parking available for cars and motorcycles.',
      },
    });

    // Dual-sync PageConfig enabled status so dynamic dashboard counts reflect accurately
    const pageToggles: Record<string, boolean | undefined> = {
      about: typeof body.showPageAbout === 'boolean' ? body.showPageAbout : undefined,
      space: typeof body.showPageSpace === 'boolean' ? body.showPageSpace : undefined,
      menu: typeof body.showPageMenu === 'boolean' ? body.showPageMenu : undefined,
      reviews: typeof body.showPageReviews === 'boolean' ? body.showPageReviews : undefined,
      news: typeof body.showPageNews === 'boolean' ? body.showPageNews : undefined,
      contact: typeof body.showPageContact === 'boolean' ? body.showPageContact : undefined,
    };

    for (const [pKey, isEn] of Object.entries(pageToggles)) {
      if (isEn !== undefined) {
        try {
          await prisma.pageConfig.updateMany({
            where: { pageKey: pKey },
            data: { enabled: isEn },
          });
        } catch (e) {
          console.warn(`Could not sync pageConfig for ${pKey}`, e);
        }
      }
    }

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
