import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseSeeded } from '@/lib/ensure-seed';
import { DatabaseSchema, MenuItem, SiteContent } from '@/types';
import { initialDbData, initialSiteContent } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    await ensureDatabaseSeeded().catch(() => {});

    const [
      settings,
      siteSettings,
      commerceSettings,
      siteContent,
      menuItems,
      spatialFigures,
      galleryPlates,
      events,
      posts,
      teamMembers,
      stories,
      faqs,
      staticPages,
      legalPages,
    ] = await Promise.all([
      prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.commerceSettings.findUnique({ where: { id: 'commerce-settings' } }).catch(() => null),
      prisma.siteContent.findUnique({ where: { id: 'default' } }).catch(() => null),
      prisma.menuItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }).catch(() => []),
      prisma.spatialFigure.findMany({ orderBy: { id: 'asc' } }).catch(() => []),
      prisma.galleryPlate.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
      prisma.eventPost.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
      prisma.post.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
      prisma.teamMember.findMany({ where: { active: true }, orderBy: { orderIndex: 'asc' } }).catch(() => []),
      prisma.highlightStory.findMany({ where: { published: true }, orderBy: { orderIndex: 'asc' } }).catch(() => []),
      prisma.faqItem
        .findMany({
          where: {
            published: true,
            NOT: {
              OR: [
                { id: 'faq-5' },
                { question: { contains: 'Đêm nhạc Acoustic' } },
                { questionEn: { contains: 'Acoustic Live sessions' } },
              ],
            },
          },
          orderBy: { orderIndex: 'asc' },
        })
        .catch(() => []),
      prisma.staticPage.findMany({ where: { published: true } }).catch(() => []),
      prisma.legalPage.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } }).catch(() => []),
    ]);

    const resolvedContent: SiteContent = siteContent
      ? {
          id: siteContent.id,
          heroEyebrow: siteContent.heroEyebrow,
          heroEyebrowEn: siteContent.heroEyebrowEn,
          heroTitle: siteContent.heroTitle,
          heroTitleEn: siteContent.heroTitleEn,
          heroSubtitle: siteContent.heroSubtitle,
          heroSubtitleEn: siteContent.heroSubtitleEn,
          heroTagline: siteContent.heroTagline,
          heroTaglineEn: siteContent.heroTaglineEn,
          heroDescription: siteContent.heroDescription,
          heroDescriptionEn: siteContent.heroDescriptionEn,
          showHero3DBean: siteContent.showHero3DBean,
          philosophyEyebrow: siteContent.philosophyEyebrow,
          philosophyEyebrowEn: siteContent.philosophyEyebrowEn,
          philosophyTitle: siteContent.philosophyTitle,
          philosophyTitleEn: siteContent.philosophyTitleEn,
          philosophyLead: siteContent.philosophyLead,
          philosophyLeadEn: siteContent.philosophyLeadEn,
          philosophyStory: siteContent.philosophyStory,
          philosophyStoryEn: siteContent.philosophyStoryEn,
          philosophyCards: safeJsonParse(siteContent.philosophyCards, initialSiteContent.philosophyCards),
          philosophyCardsEn: safeJsonParse(siteContent.philosophyCardsEn, undefined as any),
          brandStoryTitle: siteContent.brandStoryTitle,
          brandStoryTitleEn: siteContent.brandStoryTitleEn,
          brandStorySubtitle: siteContent.brandStorySubtitle,
          brandStorySubtitleEn: siteContent.brandStorySubtitleEn,
          brandStoryContent: siteContent.brandStoryContent,
          brandStoryContentEn: siteContent.brandStoryContentEn,
          brandStoryPhilosophy: siteContent.brandStoryPhilosophy,
          brandStoryPhilosophyEn: siteContent.brandStoryPhilosophyEn,
          brandStoryImageUrl: siteContent.brandStoryImageUrl || undefined,
          visionTitle: siteContent.visionTitle,
          visionTitleEn: siteContent.visionTitleEn,
          visionDesc: siteContent.visionDesc,
          visionDescEn: siteContent.visionDescEn,
          showFeaturedMenu: siteContent.showFeaturedMenu ?? true,
          showFeaturedSpace: siteContent.showFeaturedSpace ?? true,
          showFeaturedReviews: siteContent.showFeaturedReviews ?? true,
          showFeaturedEvents: siteContent.showFeaturedEvents ?? true,
          showStoryMilestones: siteContent.showStoryMilestones ?? true,
          showTeamMembers: siteContent.showTeamMembers ?? true,
          spaceEyebrow: siteContent.spaceEyebrow,
          spaceEyebrowEn: siteContent.spaceEyebrowEn,
          spaceTitle: siteContent.spaceTitle,
          spaceTitleEn: siteContent.spaceTitleEn,
          spaceSubtitle: siteContent.spaceSubtitle,
          spaceSubtitleEn: siteContent.spaceSubtitleEn,
          spaceIntro: siteContent.spaceIntro,
          spaceIntroEn: siteContent.spaceIntroEn,
          spaceHeroBanner: siteContent.spaceHeroBanner || undefined,
          menuEyebrow: siteContent.menuEyebrow,
          menuEyebrowEn: siteContent.menuEyebrowEn,
          menuTitle: siteContent.menuTitle,
          menuTitleEn: siteContent.menuTitleEn,
          menuSubtitle: siteContent.menuSubtitle,
          menuSubtitleEn: siteContent.menuSubtitleEn,
          menuIntro: siteContent.menuIntro,
          menuIntroEn: siteContent.menuIntroEn,
          menuNotice: siteContent.menuNotice,
          menuNoticeEn: siteContent.menuNoticeEn,
          reviewsEyebrow: siteContent.reviewsEyebrow,
          reviewsEyebrowEn: siteContent.reviewsEyebrowEn,
          reviewsTitle: siteContent.reviewsTitle,
          reviewsTitleEn: siteContent.reviewsTitleEn,
          reviewsSubtitle: siteContent.reviewsSubtitle,
          reviewsSubtitleEn: siteContent.reviewsSubtitleEn,
          reviewsIntro: siteContent.reviewsIntro,
          reviewsIntroEn: siteContent.reviewsIntroEn,
          reviewsPrompt: siteContent.reviewsPrompt,
          reviewsPromptEn: siteContent.reviewsPromptEn,
          newsEyebrow: siteContent.newsEyebrow,
          newsEyebrowEn: siteContent.newsEyebrowEn,
          newsTitle: siteContent.newsTitle,
          newsTitleEn: siteContent.newsTitleEn,
          newsSubtitle: siteContent.newsSubtitle,
          newsSubtitleEn: siteContent.newsSubtitleEn,
          newsIntro: siteContent.newsIntro,
          newsIntroEn: siteContent.newsIntroEn,
          showNewsEvents: siteContent.showNewsEvents ?? true,
          showNewsFaq: siteContent.showNewsFaq ?? true,
          contactEyebrow: siteContent.contactEyebrow,
          contactEyebrowEn: siteContent.contactEyebrowEn,
          contactTitle: siteContent.contactTitle,
          contactTitleEn: siteContent.contactTitleEn,
          contactSubtitle: siteContent.contactSubtitle,
          contactSubtitleEn: siteContent.contactSubtitleEn,
          contactIntro: siteContent.contactIntro,
          contactIntroEn: siteContent.contactIntroEn,
          contactBbqCallout: siteContent.contactBbqCallout,
          contactBbqCalloutEn: siteContent.contactBbqCalloutEn,
          contactDirectionsNote: siteContent.contactDirectionsNote,
          contactDirectionsNoteEn: siteContent.contactDirectionsNoteEn,
          showPageAbout: siteContent.showPageAbout ?? true,
          showPageSpace: siteContent.showPageSpace ?? true,
          showPageMenu: siteContent.showPageMenu ?? true,
          showPageReviews: siteContent.showPageReviews ?? true,
          showPageNews: siteContent.showPageNews ?? true,
          showPageContact: siteContent.showPageContact ?? true,
          homeSectionOrder: (siteContent.homeSectionOrder as string[]) || initialSiteContent.homeSectionOrder,
          aboutSectionOrder: (siteContent.aboutSectionOrder as string[]) || initialSiteContent.aboutSectionOrder,
          spaceSectionOrder: (siteContent.spaceSectionOrder as string[]) || initialSiteContent.spaceSectionOrder,
          menuSectionOrder: (siteContent.menuSectionOrder as string[]) || initialSiteContent.menuSectionOrder,
          reviewsSectionOrder: (siteContent.reviewsSectionOrder as string[]) || initialSiteContent.reviewsSectionOrder,
          newsSectionOrder: (siteContent.newsSectionOrder as string[]) || initialSiteContent.newsSectionOrder,
          contactSectionOrder: (siteContent.contactSectionOrder as string[]) || initialSiteContent.contactSectionOrder,
          sectionLayouts: (siteContent.sectionLayouts as Record<string, string>) || initialSiteContent.sectionLayouts,
          sectionVisibility: (siteContent.sectionVisibility as Record<string, boolean>) || initialSiteContent.sectionVisibility,
          heroLayout: siteContent.heroLayout || initialSiteContent.heroLayout,
          heroPrimaryCtaText: siteContent.heroPrimaryCtaText || initialSiteContent.heroPrimaryCtaText,
          heroPrimaryCtaTextEn: siteContent.heroPrimaryCtaTextEn || initialSiteContent.heroPrimaryCtaTextEn,
          heroPrimaryCtaLink: siteContent.heroPrimaryCtaLink || initialSiteContent.heroPrimaryCtaLink,
          heroSecondaryCtaText: siteContent.heroSecondaryCtaText || initialSiteContent.heroSecondaryCtaText,
          heroSecondaryCtaTextEn: siteContent.heroSecondaryCtaTextEn || initialSiteContent.heroSecondaryCtaTextEn,
          heroSecondaryCtaLink: siteContent.heroSecondaryCtaLink || initialSiteContent.heroSecondaryCtaLink,
          heroCoverImage: siteContent.heroCoverImage || initialSiteContent.heroCoverImage,
          showHeroCoverImage: siteContent.showHeroCoverImage ?? true,
          heroCaption: siteContent.heroCaption || initialSiteContent.heroCaption,
          heroCaptionEn: siteContent.heroCaptionEn || initialSiteContent.heroCaptionEn,
          homeCtaBannerTitle: siteContent.homeCtaBannerTitle || initialSiteContent.homeCtaBannerTitle,
          homeCtaBannerTitleEn: siteContent.homeCtaBannerTitleEn || initialSiteContent.homeCtaBannerTitleEn,
          homeCtaBannerDesc: siteContent.homeCtaBannerDesc || initialSiteContent.homeCtaBannerDesc,
          homeCtaBannerDescEn: siteContent.homeCtaBannerDescEn || initialSiteContent.homeCtaBannerDescEn,
          homeCtaBannerBtnText: siteContent.homeCtaBannerBtnText || initialSiteContent.homeCtaBannerBtnText,
          homeCtaBannerBtnTextEn: siteContent.homeCtaBannerBtnTextEn || initialSiteContent.homeCtaBannerBtnTextEn,
          homeCtaBannerBtnLink: siteContent.homeCtaBannerBtnLink || initialSiteContent.homeCtaBannerBtnLink,
          showHomeCtaBanner: siteContent.showHomeCtaBanner ?? true,
          aboutCommitments: (siteContent.aboutCommitments as any[]) || initialSiteContent.aboutCommitments,
          spaceZones: (siteContent.spaceZones as any[]) || initialSiteContent.spaceZones,
          spaceCtaTitle: siteContent.spaceCtaTitle || initialSiteContent.spaceCtaTitle,
          spaceCtaTitleEn: siteContent.spaceCtaTitleEn || initialSiteContent.spaceCtaTitleEn,
          spaceCtaDesc: siteContent.spaceCtaDesc || initialSiteContent.spaceCtaDesc,
          spaceCtaDescEn: siteContent.spaceCtaDescEn || initialSiteContent.spaceCtaDescEn,
          spaceCtaBtnText: siteContent.spaceCtaBtnText || initialSiteContent.spaceCtaBtnText,
          spaceCtaBtnTextEn: siteContent.spaceCtaBtnTextEn || initialSiteContent.spaceCtaBtnTextEn,
          showSpaceCta: siteContent.showSpaceCta ?? true,
          showSpaceFilterBar: siteContent.showSpaceFilterBar ?? true,
          menuShowPrices: siteContent.menuShowPrices ?? true,
          menuDietaryNote: siteContent.menuDietaryNote || initialSiteContent.menuDietaryNote,
          menuDietaryNoteEn: siteContent.menuDietaryNoteEn || initialSiteContent.menuDietaryNoteEn,
          menuCurrencyNote: siteContent.menuCurrencyNote || initialSiteContent.menuCurrencyNote,
          menuCurrencyNoteEn: siteContent.menuCurrencyNoteEn || initialSiteContent.menuCurrencyNoteEn,
          menuBbqBannerTitle: siteContent.menuBbqBannerTitle || initialSiteContent.menuBbqBannerTitle,
          menuBbqBannerTitleEn: siteContent.menuBbqBannerTitleEn || initialSiteContent.menuBbqBannerTitleEn,
          menuBbqBannerDesc: siteContent.menuBbqBannerDesc || initialSiteContent.menuBbqBannerDesc,
          menuBbqBannerDescEn: siteContent.menuBbqBannerDescEn || initialSiteContent.menuBbqBannerDescEn,
          menuBbqBannerBtnText: siteContent.menuBbqBannerBtnText || initialSiteContent.menuBbqBannerBtnText,
          menuBbqBannerBtnTextEn: siteContent.menuBbqBannerBtnTextEn || initialSiteContent.menuBbqBannerBtnTextEn,
          showMenuBbqBanner: siteContent.showMenuBbqBanner ?? true,
          reviewsTrustScore: siteContent.reviewsTrustScore || initialSiteContent.reviewsTrustScore,
          reviewsTrustScoreEn: siteContent.reviewsTrustScoreEn || initialSiteContent.reviewsTrustScoreEn,
          reviewsThankYou: siteContent.reviewsThankYou || initialSiteContent.reviewsThankYou,
          reviewsThankYouEn: siteContent.reviewsThankYouEn || initialSiteContent.reviewsThankYouEn,
          newsContactPrompt: siteContent.newsContactPrompt || initialSiteContent.newsContactPrompt,
          newsContactPromptEn: siteContent.newsContactPromptEn || initialSiteContent.newsContactPromptEn,
          contactQuickInfoLayout: siteContent.contactQuickInfoLayout || initialSiteContent.contactQuickInfoLayout,
          contactMapCaption: siteContent.contactMapCaption || initialSiteContent.contactMapCaption,
          contactMapCaptionEn: siteContent.contactMapCaptionEn || initialSiteContent.contactMapCaptionEn,
          contactMapEmbedUrl: siteContent.contactMapEmbedUrl || initialSiteContent.contactMapEmbedUrl,
        }
      : initialSiteContent;

    const fallbackSettings = initialDbData.settings;
    const rawHotlines = settings
      ? safeJsonParse<any[]>(settings.hotlines, ['0382 851 688', '0774 659 000'])
      : ['0382 851 688', '0774 659 000'];

    const normalizedHotlines: string[] = rawHotlines
      .map((h) => (typeof h === 'string' ? h : h?.number || h?.rawNumber || ''))
      .filter(Boolean);

    const resolvedCommerceEnabled = Boolean(
      commerceSettings?.commerceEnabled ?? siteSettings?.commerceEnabled ?? false
    );
    const resolvedCustomerPortal = Boolean(
      commerceSettings?.enableCustomerPortal ?? siteSettings?.enableCustomerPortal ?? false
    );
    const resolvedNewsletter = Boolean(
      commerceSettings?.enableNewsletter ?? siteSettings?.enableNewsletter ?? false
    );
    const resolvedMessenger = Boolean(
      commerceSettings?.enableSupportMessenger ?? siteSettings?.enableMessenger ?? false
    );
    const resolvedWhatsApp = Boolean(
      commerceSettings?.enableSupportWhatsApp ?? siteSettings?.enableWhatsApp ?? false
    );

    const mappedMenu: MenuItem[] =
      menuItems.length > 0
        ? menuItems.map((m: any) => ({
            id: m.id,
            categoryId: (m.categoryId === 'others' ? 'other' : m.categoryId || 'coffee') as MenuItem['categoryId'],
            name: m.name || m.nameVi || '',
            nameEn: m.nameEn || undefined,
            vietnameseTitle: m.vietnameseTitle || m.nameVi || m.name || '',
            description: m.description || m.descVi || '',
            descriptionEn: m.descriptionEn || m.descEn || undefined,
            price: Number(m.price || m.priceVnd || 0),
            salePriceVnd: m.salePriceVnd ?? undefined,
            priceDisplay: m.priceDisplay || `${Number(m.price || m.priceVnd || 0).toLocaleString('vi-VN')}đ`,
            originRegion: m.originRegion || undefined,
            tastingNotes: m.tastingNotes || undefined,
            servingSize: m.servingSize || undefined,
            variants: safeJsonParse(m.variants, undefined as any),
            variantsEn: safeJsonParse(m.variantsEn, undefined as any),
            highlight: m.highlight || m.badgeVi || undefined,
            highlightEn: m.highlightEn || m.badgeEn || undefined,
            editorialNote: m.editorialNote || m.editorialNoteVi || undefined,
            editorialNoteEn: m.editorialNoteEn || undefined,
            moodTags: safeJsonParse(m.moodTags, undefined as any),
            modelType: (m.modelType as MenuItem['modelType']) || undefined,
            customGlbUrl: m.customGlbUrl || undefined,
            photoUrl: m.photoUrl || undefined,
            ingredients: safeJsonParse(m.ingredients, undefined as any),
            inStock: m.inStock ?? m.isAvailable ?? true,
            isAvailable: m.isAvailable ?? m.inStock ?? true,
            isVisible: m.isVisible ?? true,
            allowOrdering: m.allowOrdering ?? true,
            sortOrder: m.sortOrder ?? 0,
            orderCount: m.orderCount ?? 0,
            sku: m.sku || undefined,
            productType: m.productType || 'DRINK_FOOD',
            trackInventory: m.trackInventory ?? false,
            stockQuantity: m.stockQuantity ?? 0,
            stockReserved: m.stockReserved ?? 0,
          }))
        : initialDbData.menu;

    const mappedPlates =
      galleryPlates.length > 0
        ? galleryPlates.map((p: any) => ({
            id: p.code || p.id,
            chapter: (p.chapter || 1) as 1 | 2 | 3 | 4,
            chapterTitleVi: p.chapterTitleVi || 'Chương I — Lối Nhỏ Vào Vườn',
            chapterTitleEn: p.chapterTitleEn || undefined,
            titleVi: p.titleVi,
            titleEn: p.titleEn || undefined,
            locationVi: p.zoneTag || 'Bờ suối',
            locationEn: p.zoneTag || undefined,
            descriptionVi: p.captionVi || '',
            descriptionEn: p.captionEn || undefined,
            imageUrl: p.imageUrl,
            aspectRatio: p.chapter % 2 === 1 ? '4/5' : '3/2',
          }))
        : spatialFigures.length > 0
        ? spatialFigures.map((f: any) => ({
            id: f.id,
            chapter: f.chapter as 1 | 2 | 3 | 4,
            chapterTitleVi: f.chapterTitleVi,
            chapterTitleEn: f.chapterTitleEn || undefined,
            titleVi: f.titleVi,
            titleEn: f.titleEn || undefined,
            locationVi: f.locationVi,
            locationEn: f.locationEn || undefined,
            descriptionVi: f.descriptionVi,
            descriptionEn: f.descriptionEn || undefined,
            imageUrl: f.imageUrl,
            customGlbUrl: f.customGlbUrl || undefined,
            aspectRatio: f.aspectRatio || '4/3',
          }))
        : initialDbData.spatialPlates;

    const mappedEvents =
      posts.length > 0
        ? posts.map((p: any) => ({
            id: p.slug || p.id,
            title: p.titleVi,
            titleEn: p.titleEn || undefined,
            subtitle: p.subtitleVi || '',
            subtitleEn: p.subtitleEn || undefined,
            dateOrSchedule: p.dateLabelVi || '',
            dateOrScheduleEn: p.dateLabelEn || undefined,
            description: p.contentVi,
            descriptionEn: p.contentEn || undefined,
            badge: p.badgeVi || 'Tin tức',
            badgeEn: p.badgeEn || 'News',
            imageUrl: p.imageUrl || undefined,
            active: p.published,
          }))
        : events.length > 0
        ? events.map((e: any) => ({
            id: e.id,
            title: e.title,
            titleEn: e.titleEn || undefined,
            subtitle: e.subtitle,
            subtitleEn: e.subtitleEn || undefined,
            dateOrSchedule: e.dateOrSchedule,
            dateOrScheduleEn: e.dateOrScheduleEn || undefined,
            description: e.description,
            descriptionEn: e.descriptionEn || undefined,
            badge: e.badge,
            badgeEn: e.badgeEn || undefined,
            imageUrl: e.imageUrl || undefined,
            active: e.active,
          }))
        : initialDbData.events;

    const mappedStaticPages =
      legalPages.length > 0
        ? legalPages.map((lp: any) => ({
            id: lp.id,
            slug: lp.slug,
            title: lp.titleVi,
            titleEn: lp.titleEn,
            content: lp.contentVi,
            contentEn: lp.contentEn,
            metaTitle: lp.seoTitleVi,
            metaDescription: lp.seoDescVi,
            published: lp.published,
          }))
        : staticPages.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            titleEn: p.titleEn,
            content: p.content,
            contentEn: p.contentEn,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            published: p.published,
          }));

    const responsePayload: DatabaseSchema = {
      settings: settings
        ? {
            name: settings.name || siteSettings?.brandNameVi || fallbackSettings.name,
            tagline: settings.tagline || siteSettings?.taglineVi || fallbackSettings.tagline,
            taglineEn: settings.taglineEn || siteSettings?.taglineEn,
            address: settings.address || siteSettings?.addressVi || fallbackSettings.address,
            addressEn: settings.addressEn || siteSettings?.addressEn,
            hotlines: normalizedHotlines.length > 0 ? normalizedHotlines : ['0382 851 688', '0774 659 000'],
            email: settings.email || siteSettings?.email || fallbackSettings.email,
            hours: {
              monThu: settings.monThuHours,
              friSun: settings.friSunHours,
              monThuEn: settings.monThuHoursEn,
              friSunEn: settings.friSunHoursEn,
              timezone: settings.timezone,
            },
            socialProof: settings.socialProof,
            socialProofEn: settings.socialProofEn,
            links: {
              googleMaps: settings.googleMapsUrl || siteSettings?.googleMapsUrl || fallbackSettings.links.googleMaps,
              facebook: settings.facebookUrl || siteSettings?.facebookUrl || fallbackSettings.links.facebook,
              tiktok: settings.tiktokUrl || siteSettings?.tiktokUrl || fallbackSettings.links.tiktok,
              youtube: settings.youtubeUrl ?? siteSettings?.youtubeUrl ?? '',
            },
            announcement: settings.announcement,
            announcementEn: settings.announcementEn,
            footerDesc: settings.footerDesc,
            footerDescEn: settings.footerDescEn,
            defaultLanguage: (settings.defaultLanguage as 'vi' | 'en') || 'vi',
            defaultTheme: (settings.defaultTheme as 'light' | 'dark' | 'auto') || 'light',
            fontPreset: settings.fontPreset || 'sans-be-vietnam',
            lightBgHex: settings.lightBgHex || '#F6F3EC',
            lightAccentHex: settings.lightAccentHex || '#233B2D',
            darkBgHex: settings.darkBgHex || '#131613',
            darkAccentHex: settings.darkAccentHex || '#3A5E49',
            enableAnimations: settings.enableAnimations ?? true,
            motionIntensity: (settings as any).motionIntensity || 'VIVID',
            gaMeasurementId: settings.gaMeasurementId || siteSettings?.ga4MeasurementId || '',
            gtmContainerId: settings.gtmContainerId || '',
            gscVerification: settings.gscVerification || siteSettings?.gscVerificationCode || '',
            facebookPixelId: settings.facebookPixelId || siteSettings?.metaPixelId || '',
            tiktokPixelId: settings.tiktokPixelId || siteSettings?.tiktokPixelId || '',
            enableSupportWidget:
              commerceSettings?.enableQuickSupportWidget ?? siteSettings?.enableSupportWidget ?? settings.enableQuickChat ?? true,
            enableQuickChat:
              commerceSettings?.enableQuickSupportWidget ?? siteSettings?.enableSupportWidget ?? settings.enableQuickChat ?? true,
            enableHotline: commerceSettings?.enableSupportHotline ?? siteSettings?.enableHotline ?? true,
            hotlineNumber: siteSettings?.hotlineNumber || settings.quickChatPhone || '0382851688',
            enableZalo: commerceSettings?.enableSupportZalo ?? siteSettings?.enableZalo ?? true,
            zaloUrl: siteSettings?.zaloUrl || settings.zaloUrl || 'https://zalo.me/0382851688',
            enableMessenger: resolvedMessenger,
            messengerUrl: siteSettings?.messengerUrl || settings.messengerUrl || '',
            enableWhatsApp: resolvedWhatsApp,
            quickChatPhone: siteSettings?.hotlineNumber || settings.quickChatPhone || '0382851688',
            enableSocialShare: settings.enableSocialShare ?? true,
            enableIntro: settings.enableIntro ?? true,
            introFrequency: settings.introFrequency || 'SESSION',
            introEyebrowVi: settings.introEyebrowVi || 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG',
            introEyebrowEn: settings.introEyebrowEn || 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG',
            introSubtitleVi: settings.introSubtitleVi || 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành',
            introSubtitleEn: settings.introSubtitleEn || 'Streamside Ecological Café — Clean & Lush Sanctuary',
            reviewDisplayMode: (settings as any).reviewDisplayMode || 'AUTO_RANDOM',
            reviewAutoIntervalSec: (settings as any).reviewAutoIntervalSec ?? 6,
            showEventsSection: settings.showEventsSection ?? true,
            showHighlightsSection: settings.showHighlightsSection ?? true,
            whatsappUrl: settings.whatsappUrl || '',
            instagramUrl: settings.instagramUrl || '',
            usdExchangeRate: settings.usdExchangeRate ?? 25000,
            commerceEnabled: resolvedCommerceEnabled,
            enableCustomerPortal: resolvedCustomerPortal,
            enableNewsletter: resolvedNewsletter,
          }
        : fallbackSettings,
      commerceSettings: {
        id: commerceSettings?.id || 'commerce-settings',
        commerceEnabled: resolvedCommerceEnabled,
        enableDelivery: commerceSettings?.enableDelivery ?? true,
        enablePickup: commerceSettings?.enablePickup ?? true,
        enableDineInBbq: commerceSettings?.enableDineInBbq ?? true,
        enableCod: commerceSettings?.enableCod ?? true,
        enableVietQr: commerceSettings?.enableVietQr ?? true,
        enableEwallet: commerceSettings?.enableEwallet ?? false,
        enableCard: commerceSettings?.enableCard ?? false,
        bankId: commerceSettings?.bankId || 'MB',
        bankAccountNo: commerceSettings?.bankAccountNo || '0382851688',
        bankAccountName: commerceSettings?.bankAccountName || 'CAM CU HOUSE',
        vietQrTemplate: commerceSettings?.vietQrTemplate || 'compact2',
        vatPercent: commerceSettings?.vatPercent ?? 0,
        defaultFreeShipThreshold: commerceSettings?.defaultFreeShipThreshold ?? 300000,
        orderNotificationEmail: commerceSettings?.orderNotificationEmail || siteSettings?.email || '',
        enableCustomerPortal: resolvedCustomerPortal,
        enableNewsletter: resolvedNewsletter,
        enableQuickSupportWidget: commerceSettings?.enableQuickSupportWidget ?? true,
        enableSupportHotline: commerceSettings?.enableSupportHotline ?? true,
        enableSupportZalo: commerceSettings?.enableSupportZalo ?? true,
        enableSupportMessenger: resolvedMessenger,
        enableSupportWhatsApp: resolvedWhatsApp,
      },
      content: resolvedContent,
      menu: mappedMenu,
      spatialPlates: mappedPlates,
      events: mappedEvents,
      teamMembers: teamMembers.map((t: any) => ({
        id: t.id,
        name: t.name || t.nameVi,
        nameEn: t.nameEn,
        role: t.role || t.roleVi,
        roleEn: t.roleEn,
        bio: t.bio || t.bioVi,
        bioEn: t.bioEn,
        avatarUrl: t.avatarUrl,
        orderIndex: t.orderIndex ?? t.sortOrder ?? 0,
        active: t.active ?? t.published ?? true,
      })),
      stories: stories.map((s: any) => ({
        id: s.id,
        title: s.title,
        titleEn: s.titleEn,
        category: s.category,
        categoryEn: s.categoryEn,
        date: s.date,
        dateEn: s.dateEn,
        summary: s.summary,
        summaryEn: s.summaryEn,
        content: s.content,
        contentEn: s.contentEn,
        imageUrl: s.imageUrl,
        badge: s.badge,
        badgeEn: s.badgeEn,
        orderIndex: s.orderIndex,
        published: s.published,
      })),
      faqs: faqs.map((f: any) => ({
        id: f.id,
        question: f.question || f.questionVi,
        questionEn: f.questionEn,
        answer: f.answer || f.answerVi,
        answerEn: f.answerEn,
        category: f.category || f.categoryVi,
        categoryEn: f.categoryEn,
        orderIndex: f.orderIndex ?? f.sortOrder ?? 0,
        published: f.published,
      })),
      staticPages: mappedStaticPages,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Fallback triggered in /api/bootstrap:', error);
    return NextResponse.json(initialDbData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
