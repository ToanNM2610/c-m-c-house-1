import { PrismaClient } from '@prisma/client';
import { initialDbData } from '../src/lib/seedData';
import { hashPassword } from '../src/lib/auth';
import {
  menuItemTranslations,
  spatialPlateTranslations,
  eventTranslations,
  defaultSettingsEn,
  defaultContentEn,
} from '../src/lib/translations';

const prisma = new PrismaClient();

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

async function main() {
  console.log('Seeding Cẩm Cù House Enterprise Corporate Website & 5-Module Headless CMS...');

  // 1. Store Settings
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
    motionIntensity: 'VIVID',

    // Module 4 Fields
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

    // Cinematic Intro Overlay Configuration (120fps)
    enableIntro: true,
    introFrequency: 'SESSION',
    introEyebrowVi: 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG',
    introEyebrowEn: 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG',
    introSubtitleVi: 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành',
    introSubtitleEn: 'Streamside Ecological Café — Clean & Lush Sanctuary',

    // Review Showcase Configuration (Module 4)
    reviewDisplayMode: 'AUTO_RANDOM',
    reviewAutoIntervalSec: 6,
  };

  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: settingsData,
    create: { id: 'default', ...settingsData },
  });
  console.log('✓ Store settings upserted');

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
    brandStoryImageUrl: '/uploads/gallery/fig-01.jpg',
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
  console.log('✓ Site content Headless CMS upserted');

  // 3. Menu Categories
  for (const cat of categories) {
    await prisma.menuCategory.upsert({
      where: { id: cat.id },
      update: {
        nameVi: cat.nameVi,
        nameEn: cat.nameEn,
        slug: cat.slug,
        orderIndex: cat.orderIndex,
      },
      create: {
        id: cat.id,
        nameVi: cat.nameVi,
        nameEn: cat.nameEn,
        slug: cat.slug,
        orderIndex: cat.orderIndex,
      },
    });
  }
  console.log(`✓ ${categories.length} menu categories upserted`);

  // 4. Menu Items (~67 items)
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
      create: {
        id: item.id,
        ...itemData,
      },
    });
  }
  console.log(`✓ ${initialDbData.menu.length} menu items upserted`);

  // 5. Spatial Figures (30 figures)
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
      create: {
        id: plate.id,
        ...plateData,
      },
    });
  }
  console.log(`✓ ${initialDbData.spatialPlates.length} spatial figures upserted`);

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
      active: ev.active,
    };

    await prisma.eventPost.upsert({
      where: { id: ev.id },
      update: evData,
      create: {
        id: ev.id,
        ...evData,
      },
    });
  }
  console.log(`✓ ${initialDbData.events.length} event posts upserted`);

  // 7. Team Members (3 members)
  const team = [
    {
      id: 'team-1',
      name: 'Ms. Thùy Như',
      nameEn: 'Ms. Thuy Nhu',
      role: 'Sáng Lập & Chủ Quán',
      roleEn: 'Founder & Sanctuary Hostess',
      bio: 'Người con của phố núi Gia Nghĩa, luôn trân quý từng dòng suối, vòm lá và khát khao tạo dựng một chốn bình yên thanh sạch cho mọi thực khách.',
      bioEn: 'A native daughter of Gia Nghia mountain town with a deep passion for natural preservation and warm botanical hospitality.',
      avatarUrl: '/images/team-nhu.jpg',
      orderIndex: 1,
      active: true,
    },
    {
      id: 'team-2',
      name: 'Nguyễn Tuấn Anh',
      nameEn: 'Tuan Anh Nguyen',
      role: 'Trưởng Pha Chế & Kỹ Thuật Rang',
      roleEn: 'Head Barista & Wood-Roast Artisan',
      bio: 'Hơn 8 năm tâm huyết cùng hạt Robusta bản địa Đăk Nông, nắm giữ bí quyết rang củi mộc đậm đà chuẩn vị bazan.',
      bioEn: 'Over 8 years mastering indigenous Dak Nong Robusta and traditional wood-roasting secrets.',
      avatarUrl: '/images/team-anh.jpg',
      orderIndex: 2,
      active: true,
    },
    {
      id: 'team-3',
      name: 'Lê Thị Mai',
      nameEn: 'Mai Le',
      role: 'Chuyên Viên Thảo Mộc & Ẩm Thực',
      roleEn: 'Botanical Herbalist & Nutritionist',
      bio: 'Chăm chút tỉ mỉ từng mẻ hoa đu đủ đực chưng mật ong, trà thảo mộc tươi mát và công thức nước ép thanh lọc cơ thể.',
      bioEn: 'Specializes in home-garden herbal infusions, forest honey steamed papaya blossoms, and green cleanse juices.',
      avatarUrl: '/images/team-mai.jpg',
      orderIndex: 3,
      active: true,
    },
  ];

  for (const m of team) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log(`✓ ${team.length} team members upserted`);

  // 8. Highlight Stories (4 stories)
  const stories = [
    {
      id: 'story-1',
      title: 'Đêm Nhạc Acoustic Mộc Bên Bờ Suối Tự Nhiên',
      titleEn: 'Streamside Acoustic Live Music Nights',
      category: 'Sự kiện',
      categoryEn: 'Events',
      date: 'Thứ Bảy hàng tuần',
      dateEn: 'Every Saturday evening',
      summary: 'Không gian ấm cúng dưới ánh đèn vàng, tiếng suối reo hòa cùng tiếng đàn guitar mộc mạc mang đến những phút giây lắng đọng.',
      summaryEn: 'Gentle golden lanterns, babbling water, and soothing acoustic guitar melodies creating unforgettable weekend memories.',
      content: 'Chương trình diễn ra từ 19:30 đến 21:30 tối Thứ Bảy hàng tuần. Quán không phụ thu bất kỳ chi phí vé nào, nhằm tạo nên không gian giao lưu âm nhạc mộc mạc cho cộng đồng yêu thích vẻ đẹp tự nhiên.',
      contentEn: 'Every Saturday 19:30 - 21:30. Free admission and no surcharge, creating an intimate musical sanctuary by the stream.',
      imageUrl: '/images/acoustic-night.jpg',
      badge: 'Cuối tuần',
      badgeEn: 'Weekend Live',
      orderIndex: 1,
      published: true,
    },
    {
      id: 'story-2',
      title: 'Mùa Bơ Sáp Đăk Nông & Nông Sản Bản Địa',
      titleEn: 'Dak Nong Wax Avocado Harvest Season',
      category: 'Mùa vụ',
      categoryEn: 'Harvest',
      date: 'Tháng 05 – Tháng 09',
      dateEn: 'May – September',
      summary: 'Từng quả bơ sáp chín cây từ các nhà vườn Gia Nghĩa được tuyển chọn tươi mới mỗi sáng sớm, mang đến vị béo ngậy tự nhiên.',
      summaryEn: 'Tree-ripened creamy wax avocados selected fresh daily from local Gia Nghia organic orchards.',
      content: 'Đăk Nông vốn nổi danh là thủ phủ bơ sáp với chất lượng dẻo béo khó nơi nào sánh kịp. Cẩm Cù House tự hào kết hợp bơ sáp cùng sữa chua nhà làm và sầu riêng nguyên chất tạo nên những ly sinh tố đậm đà khó quên.',
      contentEn: 'Dak Nong is celebrated for creamy avocados. Combined with house yogurt and fresh durian for unmatched taste.',
      imageUrl: '/images/avocado-story.jpg',
      badge: 'Mùa vụ',
      badgeEn: 'Harvest',
      orderIndex: 2,
      published: true,
    },
    {
      id: 'story-3',
      title: 'Góc Suối Đá Cuội Tự Nhiên & 18 Bàn View Nước',
      titleEn: 'Natural River Stone Stream & 18 Waterfront Tables',
      category: 'Không gian',
      categoryEn: 'Sanctuary',
      date: 'Quanh năm',
      dateEn: 'Year-round',
      summary: 'Những tảng đá cuội bazan được hình thành qua hàng nghìn năm, tạo nên ghềnh suối mát rượi 3–4°C thấp hơn phố xá.',
      summaryEn: 'Ancient basalt boulders creating pristine natural cascades 3–4°C cooler than city streets.',
      content: 'Hệ sinh thái tự nhiên quanh suối được giữ gìn nguyên vẹn với 18 bàn gỗ mộc kê sát mép nước. Khách có thể chạm tay vào làn nước trong vắt và tận hưởng làn gió mát lành tự nhiên bốn mùa.',
      contentEn: 'Pristine riparian ecosystem preserved with 18 wooden tables right on the stream edge.',
      imageUrl: '/images/stream-story.jpg',
      badge: 'Sinh thái',
      badgeEn: 'Eco-Living',
      orderIndex: 3,
      published: true,
    },
    {
      id: 'story-4',
      title: 'Vòm Hoa Cẩm Cù Nở Rộ Bên Thác Nước Nhỏ',
      titleEn: 'Porcelain Wax Flowers Blooming Over Streamside',
      category: 'Thiên nhiên',
      categoryEn: 'Botanical',
      date: 'Mùa xuân & Hè',
      dateEn: 'Spring & Summer',
      summary: 'Biểu tượng của tình yêu bền bỉ và sức sống mãnh liệt, hoa Cẩm Cù bung nở những chùm sao sáp thơm dịu dàng.',
      summaryEn: 'Symbol of resilient love and vitality, star-shaped wax flowers bloom gracefully over water.',
      content: 'Những giàn hoa Cẩm Cù được bàn tay gia đình chăm sóc tỉ mỉ từng ngày, leo phủ trên những khung gỗ mộc và soi bóng xuống dòng suối mát lành.',
      contentEn: 'Carefully nurtured wax flowers climbing over rustic wooden trellises reflected in crystal stream water.',
      imageUrl: '/images/camcu-bloom.jpg',
      badge: 'Đặc trưng',
      badgeEn: 'Signature',
      orderIndex: 4,
      published: true,
    },
  ];

  for (const st of stories) {
    await prisma.highlightStory.upsert({
      where: { id: st.id },
      update: st,
      create: st,
    });
  }
  console.log(`✓ ${stories.length} highlight stories upserted`);

  // 9. Verified Customer Reviews (8 reviews for 100% Đề xuất)
  const reviews = [
    {
      id: 'rev-1',
      authorName: 'Nguyễn Hoài An',
      rating: 5,
      content: 'Không gian quán rất thoáng mát, view suối đá tự nhiên cực chill giữa lòng Gia Nghĩa. Cà phê muối béo ngậy đậm đà, nhân viên phục vụ rất dễ thương và niềm nở.',
      visitDate: 'Tháng 11, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-2',
      authorName: 'Trần Quốc Bảo',
      rating: 5,
      content: 'Quán nằm dưới dốc yên tĩnh, hoàn toàn tách biệt với khói bụi đường phố. Sinh tố bơ sáp Đăk Nông đặc dẻo thơm lừng, rất đáng thử khi ghé Gia Nghĩa!',
      visitDate: 'Tháng 11, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-3',
      authorName: 'Lê Thị Kim Ngân',
      rating: 5,
      content: 'Đêm nhạc acoustic tối thứ Bảy bên bờ suối rất ấm cúng. Tiếng suối róc rách hòa cùng tiếng đàn guitar mộc mạc tạo cảm giác bình yên đến lạ kỳ.',
      visitDate: 'Tháng 10, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-4',
      authorName: 'Đặng Minh Trí',
      rating: 5,
      content: 'Menu đa dạng hơn 60 món mà giá cả rất bình dân, chỉ 20k - 45k. Món trà hoa đu đủ mật ong thơm dịu, uống vào ấm bụng và tốt cho sức khỏe.',
      visitDate: 'Tháng 10, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-5',
      authorName: 'Vũ Phương Linh',
      rating: 5,
      content: 'Có 18 bàn sát suối view đẹp mê li, nước suối trong vắt nhìn thấy cả đá cuội. Chụp hình góc nào cũng thơ mộng. Chủ quán hướng dẫn đường đi rất tận tình.',
      visitDate: 'Tháng 09, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-6',
      authorName: 'Huỳnh Văn Đông',
      rating: 5,
      content: 'Đường dốc vào quán cây xanh rợp bóng mát, bãi đậu xe ô tô và xe máy rộng rãi ngay trước cổng. Cà phê rang củi mộc chuẩn vị bazan đậm đà, hậu vị sâu.',
      visitDate: 'Tháng 09, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-7',
      authorName: 'Bùi Thanh Hương',
      rating: 5,
      content: 'Rất thích không gian sinh thái không có máy lạnh ngột ngạt. Gió suối tự nhiên mát lành sảng khoái. Bánh mì bò kho và spaghetti ăn sáng cũng rất ngon miệng.',
      visitDate: 'Tháng 08, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
    {
      id: 'rev-8',
      authorName: 'Hoàng Đức Nam',
      rating: 5,
      content: 'Điểm đến lý tưởng khi ghé thăm Gia Nghĩa. Giàn hoa cẩm cù nở hoa hình sao rất đẹp và thơm ngát. Chấm 10/10 trải nghiệm cho cả gia đình vào dịp cuối tuần.',
      visitDate: 'Tháng 08, 2026',
      status: 'APPROVED',
      isFeatured: true,
    },
  ];

  for (const r of reviews) {
    await prisma.guestComment.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log(`✓ ${reviews.length} verified reviews (100% Đề xuất) upserted`);

  // 10. FAQs across 4 categories (8 items)
  const faqs = [
    {
      id: 'faq-1',
      question: 'Quán có chỗ đậu xe ô tô và xe máy không?',
      questionEn: 'Is parking available for cars and motorbikes?',
      answer: 'Có. Quán có bãi đậu xe máy và bãi đậu ô tô rộng rãi, an ninh ngay trước cổng quán. Bạn chỉ cần men theo Hẻm 437 Hùng Vương xuống con dốc rợp bóng cây là vào tận nơi.',
      answerEn: 'Yes, spacious and free parking for both cars and motorbikes is available right at the sanctuary gate.',
      category: 'Đường đi & Đỗ xe',
      categoryEn: 'Directions & Parking',
      orderIndex: 1,
      published: true,
    },
    {
      id: 'faq-2',
      question: 'Đường vào quán có dốc khó đi không?',
      questionEn: 'Is the road leading down to the stream steep or difficult?',
      answer: 'Hẻm 437 Hùng Vương là con dốc thoai thoải rợp bóng mát, đã được trải bê tông kiên cố và bằng phẳng. Xe tay ga và ô tô 4–7 chỗ đều di chuyển an toàn, êm ái.',
      answerEn: 'Alley 437 Hung Vuong is a gentle, fully paved road with lush shade. Both scooters and cars navigate comfortably.',
      category: 'Đường đi & Đỗ xe',
      categoryEn: 'Directions & Parking',
      orderIndex: 2,
      published: true,
    },
    {
      id: 'faq-3',
      question: 'Quán phục vụ những loại đồ uống nào đặc sắc nhất?',
      questionEn: 'What are the top signature drinks at Cẩm Cù House?',
      answer: 'Những món được yêu thích nhất gồm: Cà phê muối Đăk Nông, Cà phê dừa xay, Trà hoa đu đủ đực mật ong rừng, Sinh tố bơ sáp Đăk Nông và Nước ép cải Kale xanh sạch.',
      answerEn: 'Favorites include Salted Cream Coffee, Coconut Coffee, Male Papaya Blossom Forest Honey Tea, and Dak Nong Avocado Smoothie.',
      category: 'Thực đơn xanh sạch',
      categoryEn: 'Botanical Menu',
      orderIndex: 3,
      published: true,
    },
    {
      id: 'faq-4',
      question: 'Cà phê của quán là loại cà phê gì?',
      questionEn: 'What kind of coffee beans are used?',
      answer: '100% hạt Robusta bản địa Đăk Nông sinh trưởng trên đất đỏ núi lửa bazan giàu khoáng chất, được rang củi mộc theo bí quyết truyền thống, không tẩm ướp hương liệu.',
      answerEn: '100% indigenous Dak Nong Robusta beans grown on volcanic basalt soil, traditionally wood-roasted without artificial flavorings.',
      category: 'Thực đơn xanh sạch',
      categoryEn: 'Botanical Menu',
      orderIndex: 4,
      published: true,
    },
    {
      id: 'faq-5',
      question: 'Đêm nhạc Acoustic diễn ra vào thời gian nào?',
      questionEn: 'When do the weekend Acoustic Live sessions take place?',
      answer: 'Chương trình Acoustic mộc bên bờ suối diễn ra định kỳ vào tối Thứ Bảy hàng tuần từ 19:30 đến 21:30. Quán hoàn toàn không phụ thu bất kỳ phụ phí hay vé vào cửa nào.',
      answerEn: 'Acoustic live music by the stream takes place every Saturday from 19:30 to 21:30 with zero surcharge.',
      category: 'Giờ mở cửa & Acoustic',
      categoryEn: 'Hours & Music',
      orderIndex: 5,
      published: true,
    },
    {
      id: 'faq-6',
      question: 'Giờ mở cửa đón khách của quán như thế nào?',
      questionEn: 'What are the sanctuary operating hours?',
      answer: 'Thứ Hai đến Thứ Năm quán mở từ 07:00 đến 18:00. Thứ Sáu, Thứ Bảy và Chủ Nhật quán mở muộn ngắm suối đêm đến 22:00.',
      answerEn: 'Monday to Thursday: 07:00 - 18:00. Friday to Sunday: 07:00 - 22:00 for evening night stream views.',
      category: 'Giờ mở cửa & Acoustic',
      categoryEn: 'Hours & Music',
      orderIndex: 6,
      published: true,
    },
    {
      id: 'faq-7',
      question: 'Quán có nhận đặt đồ uống mang về (takeaway) không?',
      questionEn: 'Can I order drinks ahead for takeaway?',
      answer: 'Có. Bạn có thể gọi trực tiếp qua 2 hotline: 0382 851 688 hoặc 0774 659 000 để quán chuẩn bị sẵn đồ uống khi bạn ghé lấy.',
      answerEn: 'Yes! Call hotlines 0382 851 688 or 0774 659 000 in advance for prompt takeaway preparation.',
      category: 'Họp nhóm & Mang về',
      categoryEn: 'Gatherings & Takeaway',
      orderIndex: 7,
      published: true,
    },
    {
      id: 'faq-8',
      question: 'Quán có không gian dành cho gia đình và nhóm đông người không?',
      questionEn: 'Is there suitable seating for large groups or families?',
      answer: 'Quán có 18 bàn view suối và các khu bàn dài rợp bóng cây dưới tán rừng, rất phù hợp cho họp mặt gia đình, bạn bè hoặc nhóm từ 10 đến 25 người.',
      answerEn: 'Yes, with 18 streamside tables and long wooden banquet setups, we comfortably accommodate groups of 10 to 25 guests.',
      category: 'Họp nhóm & Mang về',
      categoryEn: 'Gatherings & Takeaway',
      orderIndex: 8,
      published: true,
    },
  ];

  for (const f of faqs) {
    await prisma.faqItem.upsert({
      where: { id: f.id },
      update: f,
      create: f,
    });
  }
  console.log(`✓ ${faqs.length} FAQs upserted`);

  // 11. Static Legal Pages (3 pages)
  const staticPages = [
    {
      id: 'page-1',
      slug: 'chinh-sach-bao-mat',
      title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng',
      titleEn: 'Privacy & Customer Data Protection Policy',
      content: `### 1. Thu thập thông tin\nCẩm Cù House cam kết bảo mật tuyệt đối các thông tin cá nhân của quý khách (bao gồm tên, số điện thoại, email) khi quý khách liên hệ, gửi đánh giá hoặc tư vấn dịch vụ.\n\n### 2. Mục đích sử dụng\nThông tin chỉ được sử dụng cho mục đích: giải đáp thắc mắc, phản hồi tư vấn, và nâng cao chất lượng trải nghiệm tại quán. Chúng tôi cam đoan không bán, chia sẻ hoặc cung cấp thông tin cho bất kỳ bên thứ ba nào vì mục đích thương mại.\n\n### 3. Quyền của khách hàng\nQuý khách có quyền yêu cầu cập nhật, chỉnh sửa hoặc xóa vĩnh viễn thông tin liên hệ của mình bất kỳ lúc nào qua email thuynhu8788@gmail.com hoặc hotline 0382 851 688.`,
      contentEn: `### 1. Data Collection\nCam Cu House strictly protects personal data (name, phone, email) submitted through contact forms or feedback.\n\n### 2. Purpose of Use\nData is exclusively used for guest support, feedback resolution, and sanctuary experience enhancement. Never sold or shared with third parties.\n\n### 3. Your Rights\nYou may request update or deletion of your contact information at any time via thuynhu8788@gmail.com or 0382 851 688.`,
      metaTitle: 'Chính Sách Bảo Mật — Cẩm Cù House',
      metaDescription: 'Cam kết bảo mật thông tin khách hàng tuyệt đối tại Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
      published: true,
    },
    {
      id: 'page-2',
      slug: 'dieu-khoan-su-dung',
      title: 'Điều Khoản Dịch Vụ & Sử Dụng Website',
      titleEn: 'Terms of Service & Website Usage',
      content: `### 1. Giới thiệu chung\nWebsite camcuhouse.vn là trang thông tin chính thức của Cẩm Cù House — Cà phê sinh thái bên bờ suối Đông Gia Nghĩa, Lâm Đồng. Mọi nội dung, hình ảnh thực đơn và bài viết đều thuộc quyền sở hữu của Cẩm Cù House.\n\n### 2. Quyền sở hữu trí tuệ\nMọi hình ảnh 30 góc không gian (FIG. 01 – FIG. 30), hình ảnh hoa Cẩm Cù và tư liệu sự kiện không được sao chép cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của chúng tôi.\n\n### 3. Giá cả & Thực đơn\nBảng giá và danh mục thực đơn được cập nhật trực tiếp theo thời gian thực từ hệ thống quản lý quán. Giá hiển thị bằng Việt Nam Đồng (VND) đã bao gồm thuế và không có bất kỳ phí ẩn nào.`,
      contentEn: `### 1. General Terms\nOfficial website of Cam Cu House ecological cafe in Dong Gia Nghia, Lam Dong. All media and text are protected.\n\n### 2. Intellectual Property\n30 Spatial plates (FIG. 01 - 30) and branding media cannot be duplicated for commercial intent without prior consent.\n\n### 3. Pricing Transparency\nTransparent VND prices directly synchronized from our live headless CMS without hidden surcharges.`,
      metaTitle: 'Điều Khoản Sử Dụng — Cẩm Cù House',
      metaDescription: 'Điều khoản sử dụng dịch vụ và thông tin minh bạch tại Cẩm Cù House.',
      published: true,
    },
    {
      id: 'page-3',
      slug: 'noi-quy-khong-gian',
      title: 'Nội Quy Không Gian Sinh Thái Bên Bờ Suối',
      titleEn: 'Sanctuary Environmental Guidelines',
      content: `### 1. Giữ gìn vệ sinh dòng suối và cây xanh\nVì một môi trường xanh sạch và trong lành, quý khách vui lòng không vứt rác, tàn thuốc xuống dòng suối hay bồn cây hoa Cẩm Cù. Thùng rác được bố trí đầy đủ tại các phân khu.\n\n### 2. An toàn bên bờ suối\nDòng suối tự nhiên có ghềnh đá trơn trượt mùa mưa. Quý khách vui lòng lưu ý khi di chuyển sát mép nước và trông chừng các em nhỏ.\n\n### 3. Trật tự và không gian thư giãn\nCẩm Cù House là chốn dừng chân bình yên để lắng nghe tiếng suối và hòa mình vào thiên nhiên. Xin quý khách giữ âm lượng vừa phải, không sử dụng loa kéo cá nhân.`,
      contentEn: `### 1. Stream & Botanical Preservation\nPlease do not discard trash or cigarette butts into the natural stream or wax flower planters. Dedicated bins are placed throughout.\n\n### 2. Streamside Safety\nNatural river stones can be slippery. Please take care when walking near the water edge and supervise small children.\n\n### 3. Peaceful Atmosphere\nA sanctuary to enjoy tranquil water and forest whispers. Please keep conversational volume moderate and refrain from personal portable loudspeakers.`,
      metaTitle: 'Nội Quy Không Gian — Cẩm Cù House',
      metaDescription: 'Nội quy giữ gìn vệ sinh sinh thái và an toàn bên bờ suối tại Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
      published: true,
    },
  ];

  for (const p of staticPages) {
    await prisma.staticPage.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✓ ${staticPages.length} static legal pages upserted`);

  // 12. Page SEO Records (6 core routes)
  const seoRecords = [
    {
      id: 'seo-home',
      route: '/',
      metaTitleVi: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
      metaTitleEn: 'Cẩm Cù House — Streamside Ecological Cafe in Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, 18 bàn view suối mát rượi tại Đông Gia Nghĩa, Lâm Đồng. Cà phê muối rang mộc bazan và thức uống thảo mộc.',
      metaDescEn: 'Streamside ecological cafe in Dong Gia Nghia, Lam Dong. 18 natural stream tables, wood-roasted basalt coffee, and fresh organic herbal tonics.',
      h1Vi: 'CẨM CÙ HOUSE — Cà Phê Sinh Thái Bên Bờ Suối Đông Gia Nghĩa, Lâm Đồng',
      h1En: 'CẨM CÙ HOUSE — Streamside Eco-Coffee Sanctuary',
      ogImage: '/images/og-cover.jpg',
      canonicalUrl: 'https://camcuhouse.vn',
      noIndex: false,
    },
    {
      id: 'seo-about',
      route: '/gioi-thieu',
      metaTitleVi: 'Giới Thiệu Cẩm Cù House — Câu Chuyện Cội Nguồn & Đội Ngũ Sáng Lập',
      metaTitleEn: 'About Cẩm Cù House — Origin Story & Founding Team',
      metaDescVi: 'Hành trình khởi sinh dưới vòm hoa Cẩm Cù, đội ngũ tâm huyết và triết lý Xanh - Lành - Thuần khiết của Cẩm Cù House tại Đông Gia Nghĩa, Lâm Đồng.',
      metaDescEn: 'The awakening journey under porcelain wax flowers, our passionate team, and pure ecological philosophy.',
      h1Vi: 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù',
      h1En: 'The Awakening Journey Beneath the Wax Plant Vines',
      ogImage: '/images/og-about.jpg',
      canonicalUrl: 'https://camcuhouse.vn/gioi-thieu',
      noIndex: false,
    },
    {
      id: 'seo-space',
      route: '/khong-gian',
      metaTitleVi: 'Không Gian Quán Bên Bờ Suối — 30 Bản Khắc Thị Giác Cẩm Cù House',
      metaTitleEn: 'Streamside Sanctuary Gallery — 30 Spatial Plates | Cẩm Cù House',
      metaDescVi: 'Khám phá 30 góc ảnh không gian sinh thái bên suối mát tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng. Bàn ngắm suối tự nhiên, vòm hoa cẩm cù và acoustic cuối tuần.',
      metaDescEn: 'Explore 30 visual frames of Cẩm Cù House eco-coffee sanctuary in Dong Gia Nghia, Lam Dong. Streamside seats, natural boulders, and wax flower gardens.',
      h1Vi: '30 Bản Khắc Không Gian Bên Suối Cẩm Cù House',
      h1En: '30 Streamside Spatial Plates & Sanctuary Gallery',
      ogImage: '/images/og-gallery.jpg',
      canonicalUrl: 'https://camcuhouse.vn/khong-gian',
      noIndex: false,
    },
    {
      id: 'seo-menu',
      route: '/thuc-don',
      metaTitleVi: 'Thực Đơn Cẩm Cù House — 7 Nhóm Thức Uống Rang Mộc & Thảo Mộc Bản Địa',
      metaTitleEn: 'Menu at Cẩm Cù House — 7 Categories of Wood-Roasted & Herbal Drinks',
      metaDescVi: 'Khám phá thực đơn 67 món: cà phê muối rang mộc, trà thảo mộc tươi, sinh tố bơ sáp Đăk Nông, nước ép thanh lọc và đồ ăn no đậm đà.',
      metaDescEn: 'Explore 67 artisan drinks: salted cream coffee, fresh botanical teas, avocado smoothies, cleanse juices, and hearty local snacks.',
      h1Vi: 'Thực Đơn Sinh Thái Cẩm Cù House (~67 Món)',
      h1En: 'Botanical Eco-Menu (~67 Items)',
      ogImage: '/images/og-menu.jpg',
      canonicalUrl: 'https://camcuhouse.vn/thuc-don',
      noIndex: false,
    },
    {
      id: 'seo-reviews',
      route: '/khach-hang',
      metaTitleVi: 'Dấu Ấn & Đánh Giá Khách Hàng — 100% Đề Xuất Cẩm Cù House',
      metaTitleEn: 'Milestones & Guest Reviews — 100% Recommended Cẩm Cù House',
      metaDescVi: 'Dấu ấn nhịp sống bên suối, những cột mốc đáng nhớ và cảm nhận chân thực từ thực khách ghé thăm Cẩm Cù House Đông Gia Nghĩa, Lâm Đồng.',
      metaDescEn: 'Streamside milestones and authentic guest testimonials with 100% recommendation for Cẩm Cù House.',
      h1Vi: 'Dấu Ấn Nhịp Sống & Cảm Nhận Thực Khách',
      h1En: 'Sanctuary Milestones & Guest Testimonials',
      ogImage: '/images/og-reviews.jpg',
      canonicalUrl: 'https://camcuhouse.vn/khach-hang',
      noIndex: false,
    },
    {
      id: 'seo-news',
      route: '/su-kien',
      metaTitleVi: 'Tin Tức, Sự Kiện & FAQ — Đêm Nhạc Acoustic Cẩm Cù House',
      metaTitleEn: 'News, Events & FAQ — Acoustic Live Nights at Cẩm Cù House',
      metaDescVi: 'Lịch đêm nhạc Acoustic mộc tối Thứ Bảy bên bờ suối, các chương trình mùa vụ nông sản và giải đáp thắc mắc thường gặp.',
      metaDescEn: 'Saturday evening acoustic music schedules, seasonal agricultural updates, and comprehensive guest FAQs.',
      h1Vi: 'Nhịp Sống, Sự Kiện & Giải Đáp Thắc Mắc',
      h1En: 'Sanctuary Life, Events & Guest FAQs',
      ogImage: '/images/og-events.jpg',
      canonicalUrl: 'https://camcuhouse.vn/su-kien',
      noIndex: false,
    },
    {
      id: 'seo-contact',
      route: '/lien-he',
      metaTitleVi: 'Liên Hệ & Chỉ Đường — Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
      metaTitleEn: 'Contact & Directions — Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Địa chỉ Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng; hotline 0382 851 688, giờ mở cửa GMT+7 và bản đồ Google Maps chỉ đường đến tận cổng Cẩm Cù House.',
      metaDescEn: 'Address at Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong; hotlines, GMT+7 hours, and Google Maps directions straight to Cẩm Cù House gate.',
      h1Vi: 'Liên Hệ & Chỉ Đường Đến Bờ Suối Cẩm Cù House',
      h1En: 'Contact & Directions to Cẩm Cù House Streamside',
      ogImage: '/images/og-contact.jpg',
      canonicalUrl: 'https://camcuhouse.vn/lien-he',
      noIndex: false,
    },
  ];

  for (const s of seoRecords) {
    await prisma.pageSeo.upsert({
      where: { route: s.route },
      update: s,
      create: s,
    });
  }
  console.log(`✓ ${seoRecords.length} PageSeo records upserted`);

  // 13. Ensure /khong-gian is a standalone page (Clean up any legacy redirect)
  await prisma.redirectRule.deleteMany({
    where: { sourcePath: '/khong-gian' },
  });
  console.log('✓ Cleaned up legacy /khong-gian redirect rule (Standalone page active)');

  // 14. Default Super Admin User
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const passwordHash = hashPassword('admin123');
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        passwordHash,
        fullName: 'Quản trị viên Cẩm Cù House',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('✓ Default Super Admin account created (username: admin / pass: admin123)');
  } else {
    console.log('✓ Default Super Admin account already exists');
  }

  // 15. Gmail SMTP Singleton Configuration & Pre-seeded Recipient
  await prisma.gmailConfig.upsert({
    where: { id: 'default' },
    update: {
      senderName: 'Cẩm Cù House — Thông Báo Website',
    },
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
  console.log('✓ Default GmailConfig upserted');

  await prisma.gmailRecipient.upsert({
    where: { email: 'thuynhu8788@gmail.com' },
    update: {
      label: 'Email chính Cẩm Cù House',
      receiveSubjects: 'ALL',
      isActive: true,
    },
    create: {
      email: 'thuynhu8788@gmail.com',
      label: 'Email chính Cẩm Cù House',
      receiveSubjects: 'ALL',
      isActive: true,
    },
  });
  console.log('✓ Pre-seeded GmailRecipient (thuynhu8788@gmail.com) upserted');

  // 16. Default AntiSpamConfig Singleton
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
  console.log('✓ Default AntiSpamConfig upserted');

  console.log('Master Enterprise Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
