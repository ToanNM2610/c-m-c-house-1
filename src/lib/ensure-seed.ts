import { prisma } from './prisma';
import { initialDbData } from './seedData';
import { hashPassword } from './auth';
import {
  menuItemTranslations,
  spatialPlateTranslations,
  eventTranslations,
  defaultSettingsEn,
  defaultContentEn,
} from './translations';

let seedPromise: Promise<void> | null = null;

const categories = [
  { id: 'coffee', nameVi: 'Cà phê', nameEn: 'Coffee', slug: 'ca-phe', orderIndex: 1 },
  { id: 'tea', nameVi: 'Trà & Thảo mộc', nameEn: 'Herbal Tea', slug: 'tra-thao-moc', orderIndex: 2 },
  { id: 'smoothie', nameVi: 'Sinh tố', nameEn: 'Smoothie', slug: 'sinh-to', orderIndex: 3 },
  { id: 'juice', nameVi: 'Nước ép', nameEn: 'Fresh Juice', slug: 'nuoc-ep', orderIndex: 4 },
  { id: 'soda-yogurt', nameVi: 'Soda / Sữa chua', nameEn: 'Soda & Yogurt', slug: 'soda-sua-chua', orderIndex: 5 },
  { id: 'other', nameVi: 'Thức uống khác', nameEn: 'Other Drinks', slug: 'thuc-uong-khac', orderIndex: 6 },
  { id: 'food', nameVi: 'Đồ ăn no & Ăn vặt', nameEn: 'Food & Snacks', slug: 'do-an-vat', orderIndex: 7 },
];

const defaultPhilosophyCards = [
  {
    title: 'Dòng Suối Tự Nhiên Mát Lành',
    desc: 'Bờ suối uốn lượn róc rách suốt 4 mùa mang đến hơi sương tinh khôi, xua tan cái oi bức và mệt mỏi.',
    iconName: 'Droplets',
  },
  {
    title: 'Hương Vị Bazan Đăk Nông',
    desc: 'Hạt cà phê Robusta tuyển chọn chín mọng trên vùng đất đỏ núi lửa, rang mộc giữ trọn hương nồng đậm đà.',
    iconName: 'Coffee',
  },
  {
    title: 'Vòm Lá & Hoa Lan Cẩm Cù',
    desc: 'Không gian ngập tràn sắc xanh sinh thái, nơi những chùm hoa Cẩm Cù bung nở dịu dàng trong nắng sớm.',
    iconName: 'Sprout',
  },
];

export async function ensureDatabaseSeeded(): Promise<void> {
  try {
    const [menuCount, contentExists] = await Promise.all([
      prisma.menuItem.count(),
      prisma.siteContent.findUnique({ where: { id: 'default' } }),
    ]);

    if (menuCount >= 60 && contentExists) return;

    if (seedPromise) return seedPromise;

    seedPromise = (async () => {
      console.log('Database empty or incomplete. Auto-seeding enterprise data...');

      // 1. Store settings
      const s = initialDbData.settings;
      const settingsData = {
        name: s.name,
        tagline: s.tagline,
        taglineEn: defaultSettingsEn.taglineEn,
        address: s.address,
        addressEn: defaultSettingsEn.addressEn,
        hotlines: JSON.stringify(s.hotlines),
        email: s.email,
        monThuHours: s.hours.monThu,
        monThuHoursEn: defaultSettingsEn.hoursWeekdayEn,
        friSunHours: s.hours.friSun,
        friSunHoursEn: defaultSettingsEn.hoursWeekendEn,
        timezone: s.hours.timezone || 'Asia/Ho_Chi_Minh',
        socialProof: s.socialProof,
        socialProofEn: defaultSettingsEn.socialProofEn,
        googleMapsUrl: s.links.googleMaps,
        facebookUrl: s.links.facebook,
        tiktokUrl: s.links.tiktok,
        youtubeUrl: s.links.youtube,
        announcement: s.announcement,
        announcementEn: defaultSettingsEn.announcementEn,
        footerDesc: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng. Thức uống thảo mộc và cà phê rang mộc.',
        footerDescEn: defaultSettingsEn.footerDescEn,
        defaultLanguage: defaultSettingsEn.defaultLanguage,
        defaultTheme: defaultSettingsEn.defaultTheme,
        fontPreset: 'sans-be-vietnam',
        lightBgHex: defaultSettingsEn.lightBgHex,
        lightAccentHex: defaultSettingsEn.lightAccentHex,
        darkBgHex: defaultSettingsEn.darkBgHex,
        darkAccentHex: defaultSettingsEn.darkAccentHex,
        enableAnimations: true,
        gaMeasurementId: '',
        gtmContainerId: '',
        gscVerification: '',
        facebookPixelId: '',
        tiktokPixelId: '',
        enableQuickChat: true,
        zaloUrl: 'https://zalo.me/0382851688',
        messengerUrl: 'https://m.me/camcuhousedaknong',
        quickChatPhone: '0382851688',
        enableSocialShare: true,
        showEventsSection: true,
        showHighlightsSection: true,
      };

      await prisma.storeSettings.upsert({
        where: { id: 'default' },
        update: settingsData,
        create: { id: 'default', ...settingsData },
      });

      // 2. Site Content
      const contentData = {
        heroEyebrow: 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
        heroEyebrowEn: defaultContentEn.heroEyebrowEn,
        heroTitle: 'CẨM CÙ HOUSE',
        heroTitleEn: defaultContentEn.heroTitleEn,
        heroSubtitle: 'Bên Dòng Suối Mát • Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
        heroSubtitleEn: defaultContentEn.heroSubtitleEn,
        heroTagline: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
        heroTaglineEn: defaultContentEn.heroTaglineEn,
        heroDescription: 'Tận hưởng không gian suối mát rượi quanh năm, view suối tự nhiên, hương vị cà phê muối đậm đà rang mộc bazan Đăk Nông cùng các thức uống thảo mộc lành sạch cho tâm hồn.',
        heroDescriptionEn: defaultContentEn.heroDescriptionEn,
        showHero3DBean: true,
        philosophyEyebrow: 'VỀ KHÔNG GIAN BÊN SUỐI',
        philosophyEyebrowEn: defaultContentEn.philosophyEyebrowEn,
        philosophyTitle: 'Nơi Nhịp Thở Chậm Lại Bên Dòng Suối Tự Nhiên',
        philosophyTitleEn: defaultContentEn.philosophyTitleEn,
        philosophyLead: 'Giữa lòng Đông Gia Nghĩa, Lâm Đồng, Cẩm Cù House ẩn mình dưới con dốc rợp bóng cây tại Hẻm 437 Hùng Vương, nép mình bên dòng suối nhỏ chảy róc rách bốn mùa.',
        philosophyLeadEn: defaultContentEn.philosophyLeadEn,
        philosophyStory: 'Chúng tôi giữ lại nguyên vẹn nét hoang sơ của ghềnh đá, tán cây rừng và làn hơi nước mát lạnh để tạo nên một chốn dừng chân thanh sạch, bình yên đúng nghĩa cho bạn và người thương.',
        philosophyStoryEn: defaultContentEn.philosophyStoryEn,
        philosophyCards: JSON.stringify(defaultPhilosophyCards),
        philosophyCardsEn: JSON.stringify(defaultContentEn.philosophyCardsEn),
        brandStoryTitle: 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù',
        brandStoryTitleEn: defaultContentEn.brandStoryTitleEn,
        brandStorySubtitle: 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc',
        brandStorySubtitleEn: defaultContentEn.brandStorySubtitleEn,
        brandStoryContent: 'Đông Gia Nghĩa, Lâm Đồng không chỉ có thiên nhiên xanh mát mà còn có những thung lũng xanh tĩnh lặng ẩn mình. Cẩm Cù House được sinh ra từ chính niềm say mê thiên nhiên và khát khao gìn giữ một khoảng trời xanh trong lành giữa lòng Đông Gia Nghĩa. Từng giàn lan Cẩm Cù bung nở những chùm hoa hình ngôi sao sáp dịu dàng soi bóng xuống dòng nước suối trong veo.',
        brandStoryContentEn: defaultContentEn.brandStoryContentEn,
        brandStoryPhilosophy: 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết". Mỗi ly cà phê mộc là hương vị của đất bazan núi lửa, mỗi ấm trà thảo mộc là sự chắt chiu từ hoa lá vườn nhà. Không gian ở đây không có máy lạnh ngột ngạt hay tiếng còi xe, chỉ có gió ngàn, tiếng suối reo và tiếng cười của những buổi chuyện trò ấm cúng.',
        brandStoryPhilosophyEn: defaultContentEn.brandStoryPhilosophyEn,
        brandStoryImageUrl: null,
        visionTitle: 'Tầm Nhìn & Sứ Mệnh Sinh Thái',
        visionTitleEn: 'Ecological Vision & Mission',
        visionDesc: 'Trở thành điểm hẹn sinh thái biểu trưng của Đông Gia Nghĩa, Lâm Đồng — nơi gìn giữ vẻ đẹp nguyên bản của dòng suối rừng và tôn vinh nông sản thảo mộc tự nhiên.',
        visionDescEn: 'To be the premier ecological destination of Dong Gia Nghia, Lam Dong — preserving the pristine beauty of natural forest streams and celebrating wholesome organic botanicals.',
      };

      await prisma.siteContent.upsert({
        where: { id: 'default' },
        update: contentData,
        create: { id: 'default', ...contentData },
      });

      // 3. Menu categories
      for (const cat of categories) {
        await prisma.menuCategory.upsert({
          where: { id: cat.id },
          update: cat,
          create: cat,
        });
      }

      // 4. Menu items
      for (const item of initialDbData.menu) {
        const trans = menuItemTranslations[item.id];
        const itemData = {
          categoryId: item.categoryId,
          name: item.name,
          nameEn: trans?.nameEn || item.name,
          vietnameseTitle: item.vietnameseTitle,
          description: item.description,
          descriptionEn: trans?.descriptionEn || item.description,
          price: item.price,
          priceDisplay: item.priceDisplay || `${item.price.toLocaleString('vi-VN')}đ`,
          variants: item.variants ? JSON.stringify(item.variants) : null,
          variantsEn: trans?.variantsEn ? JSON.stringify(trans.variantsEn) : null,
          highlight: item.highlight || null,
          highlightEn: trans?.highlightEn || null,
          editorialNote: item.editorialNote || null,
          editorialNoteEn: trans?.editorialNoteEn || null,
          moodTags: item.moodTags ? JSON.stringify(item.moodTags) : null,
          modelType: item.modelType || 'coffee-cup',
          customGlbUrl: item.customGlbUrl || null,
          photoUrl: item.photoUrl || null,
          ingredients: item.ingredients ? JSON.stringify(item.ingredients) : null,
          inStock: item.inStock ?? true,
          orderCount: item.orderCount || 0,
        };

        await prisma.menuItem.upsert({
          where: { id: item.id },
          update: itemData,
          create: { id: item.id, ...itemData },
        });
      }

      // 5. Spatial plates
      for (const plate of initialDbData.spatialPlates) {
        const trans = spatialPlateTranslations[plate.id];
        const plateData = {
          chapter: plate.chapter,
          chapterTitleVi: plate.chapterTitleVi,
          chapterTitleEn: trans?.chapterTitleEn || '',
          titleVi: plate.titleVi,
          titleEn: trans?.titleEn || '',
          locationVi: plate.locationVi,
          locationEn: trans?.locationEn || '',
          descriptionVi: plate.descriptionVi,
          descriptionEn: trans?.descriptionEn || '',
          imageUrl: plate.imageUrl,
          customGlbUrl: plate.customGlbUrl || null,
          aspectRatio: plate.aspectRatio || '4/3',
        };

        await prisma.spatialFigure.upsert({
          where: { id: plate.id },
          update: plateData,
          create: { id: plate.id, ...plateData },
        });
      }

      // 6. Events
      for (const ev of initialDbData.events) {
        const trans = eventTranslations[ev.id];
        const evData = {
          title: ev.title,
          titleEn: trans?.titleEn || '',
          subtitle: ev.subtitle,
          subtitleEn: trans?.subtitleEn || '',
          dateOrSchedule: ev.dateOrSchedule,
          dateOrScheduleEn: trans?.dateOrScheduleEn || '',
          description: ev.description,
          descriptionEn: trans?.descriptionEn || '',
          badge: ev.badge,
          badgeEn: trans?.badgeEn || '',
          imageUrl: ev.imageUrl || null,
          active: false,
        };

        await prisma.eventPost.upsert({
          where: { id: ev.id },
          update: evData,
          create: { id: ev.id, ...evData },
        });
      }

      // 7. Admin user
      const existingAdmin = await prisma.adminUser.findUnique({
        where: { username: 'admin' },
      });

      if (!existingAdmin) {
        const initialPass = process.env.INITIAL_ADMIN_PASSWORD || 'admin123';
        const passwordHash = hashPassword(initialPass);
        await prisma.adminUser.create({
          data: {
            username: 'admin',
            passwordHash,
            fullName: 'Quản trị viên Cẩm Cù House',
            role: 'SUPER_ADMIN',
            isActive: true,
          },
        });
      }

      // 8. Gmail SMTP config & recipient
      await prisma.gmailConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
          id: 'default',
          isEnabled: true,
          senderName: 'Cẩm Cù House — Thông Báo Website',
          senderEmail: '',
          appPassword: '',
          autoReplyEnabled: false,
          autoReplySubject: 'Cẩm Cù House đã nhận được lời nhắn của bạn',
          autoReplyBody: 'Cảm ơn bạn đã liên hệ Cẩm Cù House. Chúng tôi đã ghi nhận lời nhắn và sẽ phản hồi sớm nhất.',
        },
      });

      await prisma.gmailRecipient.upsert({
        where: { email: 'thuynhu8788@gmail.com' },
        update: {},
        create: {
          email: 'thuynhu8788@gmail.com',
          label: 'Email chính Cẩm Cù House',
          receiveSubjects: 'ALL',
          isActive: true,
        },
      });

      // 9. Anti-spam Singleton config
      await prisma.antiSpamConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
          id: 'default',
          emergencyLockdown: false,
          maxRequestSizeKb: 8,
          cooldownSeconds: 60,
          maxPerTenMinutes: 3,
          maxPerDay: 8,
          globalMaxPerFiveMinutes: 25,
          escalatingBanEnabled: true,
          mathChallengeRequired: true,
          mathChallengeTtlMinutes: 15,
          mathChallengeMinFillSeconds: 3,
          nameMinLength: 2,
          nameMaxLength: 80,
          contentMinLength: 10,
          contentMaxLength: 1200,
          maxLinksAllowed: 1,
          blockedKeywords: 'casino,bet88,kubet,viagra,sex,porn,vay tien,danh bac,lo de,keo nha cai,telegram,crypto,forex',
          maxGmailPerHour: 15,
        },
      });

      console.log('✓ Auto-seed completed successfully');
    })();

    await seedPromise;
  } catch (error) {
    console.error('ensureDatabaseSeeded error:', error);
  } finally {
    seedPromise = null;
  }
}
