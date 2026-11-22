import { PrismaClient, InquiryType, InquiryStatus, ReviewStatus } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'STAFF';
import {
  menuItemTranslations,
  spatialPlateTranslations,
  eventTranslations,
  defaultSettingsEn,
  defaultContentEn,
} from '../src/lib/translations';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

const CATEGORIES = [
  { id: 'coffee', nameVi: 'Cà phê', nameEn: 'Coffee', slug: 'ca-phe', sortOrder: 1 },
  { id: 'tea', nameVi: 'Trà & Thảo mộc', nameEn: 'Herbal Tea', slug: 'tra-thao-moc', sortOrder: 2 },
  { id: 'smoothie', nameVi: 'Sinh tố', nameEn: 'Smoothie', slug: 'sinh-to', sortOrder: 3 },
  { id: 'juice', nameVi: 'Nước ép', nameEn: 'Fresh Juice', slug: 'nuoc-ep', sortOrder: 4 },
  { id: 'soda-yogurt', nameVi: 'Soda / Sữa chua', nameEn: 'Soda & Yogurt', slug: 'soda-sua-chua', sortOrder: 5 },
  { id: 'other', nameVi: 'Thức uống khác', nameEn: 'Other Drinks', slug: 'thuc-uong-khac', sortOrder: 6 },
  { id: 'food', nameVi: 'Đồ ăn no & Ăn vặt', nameEn: 'Food & Snacks', slug: 'do-an-vat', sortOrder: 7 },
];

export async function seedDatabase() {
  console.log('🌱 Starting clean, idempotent seed for Cẩm Cù House Editorial CMS...');

  // Read raw backup json
  const backupPath = path.resolve(process.cwd(), 'camcu_raw_backup.json');
  let backupData: any = {};
  if (fs.existsSync(backupPath)) {
    backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  }

  // 1. SiteSettings (Single-row global config)
  console.log('1. Seeding SiteSettings...');
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      brandNameVi: 'Cẩm Cù House',
      brandNameEn: 'Cẩm Cù House',
      taglineVi: 'Chốn dừng chân mộc mạc bên bờ suối đá',
      taglineEn: 'A rustic eco-sanctuary along rocky streams',
      addressVi: 'Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng (P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông cũ)',
      addressEn: 'Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong (Former Nghia Trung Ward, Gia Nghia City, Dak Nong)',
      hotline1: '0382 851 688',
      hotline2: '0774 659 000',
      email: 'thuynhu8788@gmail.com',
      operatingHoursVi: 'T2–T5: 07:00 – 18:00 | T6–CN: 07:00 – 22:00',
      operatingHoursEn: 'Mon–Thu: 07:00 – 18:00 | Fri–Sun: 07:00 – 22:00',
      googleMapsUrl: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
      facebookUrl: 'https://facebook.com/camcuhouse',
      tiktokUrl: 'https://tiktok.com/@camcuhouse',
      youtubeUrl: '',
      coordinates: '11.99° N, 107.69° E',
      enableSupportWidget: true,
      enableHotline: true,
      hotlineNumber: '0382851688',
      enableZalo: true,
      zaloUrl: 'https://zalo.me/0382851688',
      enableMessenger: true,
      messengerUrl: 'https://m.me/camcuhousedaknong',
      enableWhatsApp: true,
      whatsappUrl: 'https://wa.me/84382851688',
      metaTitleVi: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Gia Nghĩa, Đắk Nông',
      metaTitleEn: 'Cẩm Cù House — Streamside Eco-Sanctuary Café Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Không gian cà phê sinh thái trong lành nép bên dòng suối mát tự nhiên tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng. Cà phê rang mộc và thảo mộc xanh sạch.',
      metaDescEn: 'Eco-coffee sanctuary beside a natural mountain stream in Dong Gia Nghia, Lam Dong. Authentic wood-roasted basalt coffee and fresh botanical teas.',
      ogImageUrl: '/uploads/gallery/fig-01.jpg',
      notificationRecipient: 'thuynhu8788@gmail.com',
      rateLimitPerHour: 15,
      emergencyLockdown: false,
    },
    create: {
      id: 'default',
      brandNameVi: 'Cẩm Cù House',
      brandNameEn: 'Cẩm Cù House',
      taglineVi: 'Chốn dừng chân mộc mạc bên bờ suối đá',
      taglineEn: 'A rustic eco-sanctuary along rocky streams',
      addressVi: 'Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng (P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông cũ)',
      addressEn: 'Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong (Former Nghia Trung Ward, Gia Nghia City, Dak Nong)',
      hotline1: '0382 851 688',
      hotline2: '0774 659 000',
      email: 'thuynhu8788@gmail.com',
      operatingHoursVi: 'T2–T5: 07:00 – 18:00 | T6–CN: 07:00 – 22:00',
      operatingHoursEn: 'Mon–Thu: 07:00 – 18:00 | Fri–Sun: 07:00 – 22:00',
      googleMapsUrl: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
      facebookUrl: 'https://facebook.com/camcuhouse',
      tiktokUrl: 'https://tiktok.com/@camcuhouse',
      youtubeUrl: '',
      coordinates: '11.99° N, 107.69° E',
      enableSupportWidget: true,
      enableHotline: true,
      hotlineNumber: '0382851688',
      enableZalo: true,
      zaloUrl: 'https://zalo.me/0382851688',
      enableMessenger: true,
      messengerUrl: 'https://m.me/camcuhousedaknong',
      enableWhatsApp: true,
      whatsappUrl: 'https://wa.me/84382851688',
      metaTitleVi: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Gia Nghĩa, Đắk Nông',
      metaTitleEn: 'Cẩm Cù House — Streamside Eco-Sanctuary Café Dong Gia Nghia, Lam Dong',
      metaDescVi: 'Không gian cà phê sinh thái trong lành nép bên dòng suối mát tự nhiên tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng. Cà phê rang mộc và thảo mộc xanh sạch.',
      metaDescEn: 'Eco-coffee sanctuary beside a natural mountain stream in Dong Gia Nghia, Lam Dong. Authentic wood-roasted basalt coffee and fresh botanical teas.',
      ogImageUrl: '/uploads/gallery/fig-01.jpg',
      notificationRecipient: 'thuynhu8788@gmail.com',
      rateLimitPerHour: 15,
      emergencyLockdown: false,
    },
  });

  // 2. PageConfig (7 rows)
  console.log('2. Seeding PageConfig (7 pages)...');
  const pageConfigs = [
    {
      pageKey: 'home',
      enabled: true,
      seoTitleVi: 'Cẩm Cù House — Cà Phê Sinh Thái Bên Bờ Suối Gia Nghĩa, Đắk Nông',
      seoTitleEn: 'Cẩm Cù House — Streamside Eco-Sanctuary Café Dong Gia Nghia, Lam Dong',
      seoDescVi: 'Tận hưởng không gian suối mát tự nhiên bốn mùa, cà phê rang mộc bazan và thức uống thảo mộc lành sạch tại Hẻm 437 Hùng Vương, Đông Gia Nghĩa.',
      seoDescEn: 'Immerse in pure streamside mountain breeze, authentic wood-roasted basalt coffee, and wild botanical herbal teas.',
      sections: [
        {
          id: 'hero',
          key: 'hero',
          enabled: true,
          order: 1,
          layoutVariant: 'image-right',
          dataVi: {
            eyebrow: 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
            title: 'CẨM CÙ HOUSE',
            subtitle: 'Bên Dòng Suối Mát • Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng',
            tagline: 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.',
            description: 'Tận hưởng không gian suối mát rượi quanh năm, view suối tự nhiên, hương vị cà phê muối đậm đà rang mộc bazan Đăk Nông cùng các thức uống thảo mộc lành sạch cho tâm hồn.',
            primaryCtaText: 'Xem Thực Đơn Thảo Mộc',
            primaryCtaLink: '/thuc-don',
            secondaryCtaText: 'Chỉ Đường & Giờ Mở Cửa',
            secondaryCtaLink: '/lien-he',
          },
          dataEn: {
            eyebrow: 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY',
            title: 'CẨM CÙ HOUSE',
            subtitle: 'Beside Fresh Mountain Stream • Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong',
            tagline: 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.',
            description: 'Experience year-round cool streamside breezes, natural waterfall views, authentic wood-roasted Dak Nong basalt coffee, and wholesome botanical herbal drinks.',
            primaryCtaText: 'View Botanical Menu',
            primaryCtaLink: '/en/menu',
            secondaryCtaText: 'Directions & Hours',
            secondaryCtaLink: '/en/contact',
          },
          imageUrl: '/uploads/gallery/fig-01.jpg',
          showImage: true,
        },
        {
          id: 'philosophy',
          key: 'philosophy',
          enabled: true,
          order: 2,
          layoutVariant: 'cards-3',
          dataVi: {
            eyebrow: 'VỀ KHÔNG GIAN BÊN SUỐI',
            title: 'Nơi Nhịp Thở Chậm Lại Bên Dòng Suối Tự Nhiên',
            lead: 'Giữa lòng Đông Gia Nghĩa, Lâm Đồng, Cẩm Cù House ẩn mình dưới con dốc rợp bóng cây tại Hẻm 437 Hùng Vương, nép mình bên dòng suối nhỏ chảy róc rách bốn mùa.',
            story: 'Chúng tôi giữ lại nguyên vẹn nét hoang sơ của ghềnh đá, tán cây rừng và làn hơi nước mát lạnh để tạo nên một chốn dừng chân thanh sạch, bình yên đúng nghĩa cho bạn và người thương.',
          },
          dataEn: {
            eyebrow: 'ABOUT OUR STREAMSIDE SANCTUARY',
            title: 'Where Your Breath Slows Down by the Gentle Stream',
            lead: 'In the heart of Dong Gia Nghia, Lam Dong, Cẩm Cù House is nestled down a tree-shaded slope at Alley 437 Hung Vuong, sitting peacefully along a gentle natural stream flowing year-round.',
            story: 'We preserve the pristine basalt rocks, rainforest canopy, and cool water mists to create a truly pure, serene haven for you and your loved ones.',
          },
        },
        {
          id: 'featuredMenu',
          key: 'featuredMenu',
          enabled: true,
          order: 3,
          layoutVariant: 'grid-4',
          dataVi: {
            eyebrow: 'THỰC ĐƠN ĐẶC SẮC',
            title: 'Thức Uống Chọn Lọc Từ Đất Núi Lửa & Vườn Thảo Mộc',
            ctaText: 'Xem Toàn Bộ 67 Món Thực Đơn',
            ctaLink: '/thuc-don',
          },
          dataEn: {
            eyebrow: 'FEATURED TASTES',
            title: 'Curated Drinks from Basalt Soil & Garden Botanicals',
            ctaText: 'Explore All 67 Menu Items',
            ctaLink: '/en/menu',
          },
        },
        {
          id: 'featuredSpace',
          key: 'featuredSpace',
          enabled: true,
          order: 4,
          layoutVariant: 'curated-slider',
          dataVi: {
            eyebrow: 'KHÔNG GIAN SUỐI MÁT',
            title: 'Bản Khắc Thị Giác Bên Dòng Nước',
            ctaText: 'Khám Phá 30 Bản Khắc Không Gian',
            ctaLink: '/khong-gian',
          },
          dataEn: {
            eyebrow: 'COOL STREAM SANCTUARY',
            title: 'Visual Plates Along the Water',
            ctaText: 'Explore All 30 Spatial Plates',
            ctaLink: '/en/space',
          },
        },
        {
          id: 'reviews',
          key: 'reviews',
          enabled: true,
          order: 5,
          layoutVariant: 'review-cards',
          dataVi: {
            eyebrow: 'CẢM NHẬN KHÁCH QUÝ',
            title: 'Những Lời Gửi Gắm Từ Những Chuyến Ghé Thăm',
            subtitle: '100% Khách hàng đề xuất trải nghiệm bên suối',
          },
          dataEn: {
            eyebrow: 'GENUINE GUEST REVIEWS',
            title: 'Heartfelt Words from Streamside Visits',
            subtitle: '100% Recommended by genuine guests',
          },
        },
        {
          id: 'events',
          key: 'events',
          enabled: true,
          order: 6,
          layoutVariant: 'list-3',
          dataVi: {
            eyebrow: 'NHỊP SỐNG BÊN SUỐI',
            title: 'Hoạt Động & Mùa Vụ Hoa Nở',
            ctaText: 'Xem Tất Cả Tin Tức & FAQ',
            ctaLink: '/tin-tuc',
          },
          dataEn: {
            eyebrow: 'STREAMSIDE HAPPENINGS',
            title: 'Activities & Blossom Seasons',
            ctaText: 'View All News & FAQ',
            ctaLink: '/en/news',
          },
        },
        {
          id: 'ctaBanner',
          key: 'ctaBanner',
          enabled: true,
          order: 7,
          layoutVariant: 'banner-callout',
          dataVi: {
            title: 'Ghé Thăm Cẩm Cù House Cuối Tuần Này',
            desc: 'Thưởng thức cà phê mộc bazan, lắng nghe tiếng suối reo và tận hưởng không khí trong lành nguyên bản.',
            btnText: 'Xem Chỉ Đường (Google Maps)',
            btnLink: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
          },
          dataEn: {
            title: 'Visit Cẩm Cù House This Weekend',
            desc: 'Savor wood-roasted basalt coffee, listen to bubbling streams, and immerse in pristine cool nature.',
            btnText: 'Get Directions (Google Maps)',
            btnLink: 'https://maps.app.goo.gl/G6aP51qJ6aDabp676',
          },
        },
      ],
    },
    {
      pageKey: 'about',
      enabled: true,
      seoTitleVi: 'Giới Thiệu & Triết Lý Sinh Thái — Cẩm Cù House',
      seoTitleEn: 'About Us & Ecological Vision — Cẩm Cù House',
      seoDescVi: 'Hành trình khởi sinh dưới vòm hoa Cẩm Cù, triết lý Xanh - Lành - Thuần Khiết bên dòng suối mát Gia Nghĩa, Lâm Đồng.',
      seoDescEn: 'The awakening journey beneath wax plant vines, and our philosophy of Green, Wholesome, Pure by the stream.',
      sections: [
        {
          id: 'story',
          key: 'story',
          enabled: true,
          order: 1,
          layoutVariant: 'editorial-split',
          dataVi: {
            eyebrow: 'CÂU CHUYỆN KHỞI SINH',
            title: 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù',
            subtitle: 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc',
            content: 'Đông Gia Nghĩa, Lâm Đồng không chỉ có thiên nhiên xanh mát mà còn có những thung lũng xanh tĩnh lặng ẩn mình. Cẩm Cù House được sinh ra từ chính niềm say mê thiên nhiên và khát khao gìn giữ một khoảng trời xanh trong lành giữa lòng Đông Gia Nghĩa. Từng giàn lan Cẩm Cù bung nở những chùm hoa hình ngôi sao sáp dịu dàng soi bóng xuống dòng nước suối trong veo.',
            philosophy: 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết". Mỗi ly cà phê mộc là hương vị của đất bazan núi lửa, mỗi ấm trà thảo mộc là sự chắt chiu từ hoa lá vườn nhà. Không gian ở đây không có máy lạnh ngột ngạt hay tiếng còi xe, chỉ có gió ngàn, tiếng suối reo và tiếng cười của những buổi chuyện trò ấm cúng.',
          },
          dataEn: {
            eyebrow: 'ORIGIN STORY',
            title: 'The Awakening Journey Beneath the Wax Plant Vines',
            subtitle: 'A Story of Basalt Soil, Gentle Streams & Pure Wood-Roasted Coffee',
            content: 'Dong Gia Nghia, Lam Dong is blessed with pristine waterfalls and serene green valleys. Cẩm Cù House was born from our profound love for nature and a dream to preserve an untamed green haven in Dong Gia Nghia.',
            philosophy: 'Our philosophy is simple: "Green - Wholesome - Pure". Every cup of wood-roasted coffee carries the volcanic richness of basalt soil; every herbal teapot is carefully harvested from home garden botanicals.',
          },
          imageUrl: '/uploads/gallery/fig-01.jpg',
          showImage: true,
        },
        {
          id: 'vision',
          key: 'vision',
          enabled: true,
          order: 2,
          layoutVariant: 'cards-2',
          dataVi: {
            eyebrow: 'SỨ MỆNH & TẦM NHÌN',
            title: 'Tầm Nhìn & Sứ Mệnh Sinh Thái',
            desc: 'Trở thành điểm hẹn sinh thái biểu trưng của Đông Gia Nghĩa, Lâm Đồng — nơi gìn giữ vẻ đẹp nguyên bản của dòng suối rừng và tôn vinh nông sản thảo mộc tự nhiên.',
          },
          dataEn: {
            eyebrow: 'VISION & MISSION',
            title: 'Ecological Vision & Mission',
            desc: 'To be the premier ecological destination of Dong Gia Nghia, Lam Dong — preserving the pristine beauty of natural forest streams and celebrating wholesome organic botanicals.',
          },
        },
        {
          id: 'milestones',
          key: 'milestones',
          enabled: true,
          order: 3,
          layoutVariant: 'timeline-vertical',
          dataVi: {
            eyebrow: 'DẤU ẤN PHÁT TRIỂN',
            title: 'Những Cột Mốc Đáng Nhớ',
          },
          dataEn: {
            eyebrow: 'JOURNEY MILESTONES',
            title: 'Memorable Milestones',
          },
        },
        {
          id: 'team',
          key: 'team',
          enabled: true,
          order: 4,
          layoutVariant: 'team-grid',
          dataVi: {
            eyebrow: 'NHỮNG NGƯỜI BẠN ĐỒNG HÀNH',
            title: 'Đội Ngũ Phục Vụ Tận Tâm',
          },
          dataEn: {
            eyebrow: 'PEOPLE BEHIND CẨM CÙ',
            title: 'Dedicated Warm Team',
          },
        },
      ],
    },
    {
      pageKey: 'space',
      enabled: true,
      seoTitleVi: '30 Bản Khắc Không Gian Suối — Cẩm Cù House',
      seoTitleEn: '30 Streamside Spatial Plates — Cẩm Cù House',
      seoDescVi: 'Khám phá 30 bản khắc không gian sinh thái bên bờ suối đá: Chòi gỗ mộc, ban công suối, góc thổ cẩm và sân vườn BBQ.',
      seoDescEn: 'Explore 30 spatial plates along our rocky stream: rustic wooden huts, stream balconies, and leafy open sanctuary.',
      sections: [
        {
          id: 'intro',
          key: 'intro',
          enabled: true,
          order: 1,
          layoutVariant: 'heading-center',
          dataVi: {
            eyebrow: 'BỘ SƯU TẬP KHÔNG GIAN • BẢN KHẮC THỊ GIÁC',
            title: '30 Bản Khắc Không Gian Bên Bờ Suối Mát',
            subtitle: 'Nơi mỗi góc quán mộc mạc ghi lại vẻ đẹp tĩnh lặng của làn nước suối và vòm lá Cẩm Cù',
            intro: 'Khám phá trọn vẹn các bản khắc thị giác của Cẩm Cù House qua 4 phân khu: Bờ suối, Nhà gỗ, Sân vườn BBQ, và Góc trà tĩnh lặng.',
          },
          dataEn: {
            eyebrow: 'SPATIAL GALLERY • CURATED VISUAL PLATES',
            title: '30 Streamside Spatial Plates',
            subtitle: 'Where each rustic frame captures the quiet poetry of flowing water and wax plant canopies',
            intro: 'Explore all curated visual plates of Cẩm Cù House organized across 4 zones: Streamside, Wooden Cabins, BBQ Garden, and Tea Nook.',
          },
        },
        {
          id: 'zoneFilter',
          key: 'zoneFilter',
          enabled: true,
          order: 2,
          layoutVariant: 'zone-tabs',
          dataVi: {
            allLabel: 'Tất cả 30 bản khắc',
            zones: ['Bờ suối', 'Nhà gỗ', 'Sân vườn BBQ', 'Góc trà'],
          },
          dataEn: {
            allLabel: 'All 30 visual plates',
            zones: ['Streamside', 'Wooden Cabins', 'BBQ Garden', 'Tea Nook'],
          },
        },
        {
          id: 'galleryGrid',
          key: 'galleryGrid',
          enabled: true,
          order: 3,
          layoutVariant: 'grid-3-col',
          dataVi: {},
          dataEn: {},
        },
        {
          id: 'spaceCta',
          key: 'spaceCta',
          enabled: true,
          order: 4,
          layoutVariant: 'banner-callout',
          dataVi: {
            title: 'Bạn Muốn Đặt Chỗ Nhóm Hoặc Chụp Ảnh Bên Suối?',
            desc: 'Không gian mở tự nhiên sẵn sàng chào đón bạn. Hãy liên hệ Hotline để quán chuẩn bị chu đáo nhất.',
            btnText: 'Liên Hệ Hotline 038 285 1688',
            btnLink: 'tel:0382851688',
          },
          dataEn: {
            title: 'Planning a Group Visit or Streamside Photoshoot?',
            desc: 'Our natural open sanctuary is ready to welcome you. Contact our hotline for the best preparation.',
            btnText: 'Call Hotline 038 285 1688',
            btnLink: 'tel:0382851688',
          },
        },
      ],
    },
    {
      pageKey: 'menu',
      enabled: true,
      seoTitleVi: 'Thực Đơn 67 Món Thảo Mộc & Cà Phê Mộc — Cẩm Cù House',
      seoTitleEn: 'Botanical Menu 67 Items — Cẩm Cù House',
      seoDescVi: 'Thực đơn thanh sạch 67 món: Cà phê rang củi Đắk Nông, trà thảo mộc tươi hái mỗi sáng, sinh tố trái cây và điểm tâm ấm bụng.',
      seoDescEn: '67 pure botanical items: wood-roasted coffee, fresh herbal teas, smoothies, and wholesome morning breakfasts.',
      sections: [
        {
          id: 'intro',
          key: 'intro',
          enabled: true,
          order: 1,
          layoutVariant: 'heading-center',
          dataVi: {
            eyebrow: 'THỰC ĐƠN THẢO MỘC & CÀ PHÊ RANG MỘC',
            title: 'Thực Đơn Cẩm Cù House',
            subtitle: 'Hương Vị Bazan Đăk Nông & Thảo Mộc Thanh Mát',
            intro: '67 món thức uống và điểm tâm được chế biến từ nông sản tự nhiên, cà phê rang củi mộc và thảo mộc tươi mát.',
            notice: 'Phục vụ tại bàn sát suối • Không sử dụng phẩm màu hay hương liệu nhân tạo • Thảo mộc tươi hái mỗi sáng',
          },
          dataEn: {
            eyebrow: 'BOTANICAL HERBAL MENU & WOOD-ROASTED COFFEE',
            title: 'Cẩm Cù House Botanical Menu',
            subtitle: 'Flavors of Basalt Soil & Wholesome Fresh Herbs',
            intro: '67 drinks and artisanal breakfast dishes crafted from organic botanicals, wood-roasted coffee, and garden herbs.',
            notice: 'Served right beside the stream • Zero artificial flavors or coloring • Fresh herbs harvested every morning',
          },
        },
        {
          id: 'categoryFilter',
          key: 'categoryFilter',
          enabled: true,
          order: 2,
          layoutVariant: 'category-pills',
          dataVi: {
            allLabel: 'Tất cả 67 món',
          },
          dataEn: {
            allLabel: 'All 67 items',
          },
        },
        {
          id: 'menuShowcase',
          key: 'menuShowcase',
          enabled: true,
          order: 3,
          layoutVariant: 'editorial-list',
          dataVi: {},
          dataEn: {},
        },
        {
          id: 'bbqBanner',
          key: 'bbqBanner',
          enabled: true,
          order: 4,
          layoutVariant: 'banner-callout',
          dataVi: {
            title: 'Thưởng Thức Tiệc BBQ & Cà Phê Suối',
            desc: 'Đặt trước set tiệc BBQ bờ suối hoặc món mang về qua hotline trước 1 ngày để quán chuẩn bị tươi ngon nhất.',
            btnText: 'Đặt BBQ Qua Hotline 038 285 1688',
            btnLink: 'tel:0382851688',
          },
          dataEn: {
            title: 'Enjoy Streamside BBQ & Coffee',
            desc: 'Pre-order your streamside BBQ set or group orders 1 day in advance via hotline.',
            btnText: 'Reserve BBQ via Hotline',
            btnLink: 'tel:0382851688',
          },
        },
      ],
    },
    {
      pageKey: 'reviews',
      enabled: true,
      seoTitleVi: 'Cảm Nhận & Đánh Giá Khách Quý — Cẩm Cù House',
      seoTitleEn: 'Genuine Guest Reviews — Cẩm Cù House',
      seoDescVi: '100% Đề xuất từ khách ghé thăm Cẩm Cù House. Đọc cảm nhận chân thực về không gian suối và hương vị cà phê muối.',
      seoDescEn: '100% Recommended by genuine guests visiting Cẩm Cù House beside the stream.',
      sections: [
        {
          id: 'intro',
          key: 'intro',
          enabled: true,
          order: 1,
          layoutVariant: 'heading-center',
          dataVi: {
            eyebrow: 'CẢM NHẬN & ĐÁNH GIÁ THỰC TẾ',
            title: 'Những Lời Gửi Gắm Bên Dòng Suối',
            subtitle: '100% Đề xuất từ những vị khách quý ghé thăm Cẩm Cù House',
            intro: 'Mỗi tách cà phê, mỗi buổi chiều ngồi nghe tiếng suối là một kỷ niệm đẹp. Chúng tôi trân trọng từng chia sẻ và góp ý chân tình của bạn.',
          },
          dataEn: {
            eyebrow: 'GENUINE GUEST REVIEWS & STORIES',
            title: 'Heartfelt Words Beside the Stream',
            subtitle: '100% Recommended by genuine guests visiting Cẩm Cù House',
            intro: 'Every cup of coffee, every peaceful afternoon listening to the gentle brook is a cherished memory.',
          },
        },
        {
          id: 'trustMetrics',
          key: 'trustMetrics',
          enabled: true,
          order: 2,
          layoutVariant: 'trust-banner',
          dataVi: {
            score: '5.0 / 5.0',
            source: 'Đánh giá thực tế từ Google Maps Local Guides',
          },
          dataEn: {
            score: '5.0 / 5.0',
            source: 'Verified reviews from Google Maps Local Guides',
          },
        },
        {
          id: 'reviewList',
          key: 'reviewList',
          enabled: true,
          order: 3,
          layoutVariant: 'cards-masonry',
          dataVi: {},
          dataEn: {},
        },
        {
          id: 'submitForm',
          key: 'submitForm',
          enabled: true,
          order: 4,
          layoutVariant: 'form-box',
          dataVi: {
            title: 'Chia Sẻ Cảm Nhận Của Bạn',
            desc: 'Bạn đã ghé thăm Cẩm Cù House? Hãy để lại cảm nhận của bạn để chúng tôi phục vụ ngày một chu đáo hơn!',
          },
          dataEn: {
            title: 'Share Your Experience',
            desc: 'Have you visited Cẩm Cù House? Please leave your review so we can welcome you even better!',
          },
        },
      ],
    },
    {
      pageKey: 'news',
      enabled: true,
      seoTitleVi: 'Bản Tin Sinh Thái & Giải Đáp FAQ — Cẩm Cù House',
      seoTitleEn: 'Ecological Dispatch & FAQ — Cẩm Cù House',
      seoDescVi: 'Cập nhật lịch trình hoa nở, hoạt động kết nối và giải đáp thắc mắc về đường đi, bãi đỗ xe tại Cẩm Cù House.',
      seoDescEn: 'Updates on seasonal blooms, streamside activities, and answers regarding parking, directions, and hours.',
      sections: [
        {
          id: 'intro',
          key: 'intro',
          enabled: true,
          order: 1,
          layoutVariant: 'heading-center',
          dataVi: {
            eyebrow: 'BẢN TIN SINH THÁI & GIẢI ĐÁP',
            title: 'Tin Tức Hoạt Động & Câu Hỏi Thường Gặp',
            subtitle: 'Cập nhật nhịp sống bên suối và thông tin hướng dẫn chi tiết dành cho bạn',
            intro: 'Xem lịch trình các mùa vụ hoa nở và câu trả lời cho các thắc mắc về đường đi, thực đơn, bãi đỗ xe.',
          },
          dataEn: {
            eyebrow: 'ECOLOGICAL DISPATCH & FAQ',
            title: 'Events, News & Frequently Asked Questions',
            subtitle: 'Updates on streamside happenings and helpful guide notes for your visit',
            intro: 'Check schedules for seasonal blooms and clear answers regarding parking, menu, and directions.',
          },
        },
        {
          id: 'postsList',
          key: 'postsList',
          enabled: true,
          order: 2,
          layoutVariant: 'blog-cards',
          dataVi: {
            title: 'Tin Tức & Hoạt Động',
          },
          dataEn: {
            title: 'News & Activities',
          },
        },
        {
          id: 'faqAccordion',
          key: 'faqAccordion',
          enabled: true,
          order: 3,
          layoutVariant: 'accordion-clean',
          dataVi: {
            title: 'Câu Hỏi Thường Gặp',
          },
          dataEn: {
            title: 'Frequently Asked Questions',
          },
        },
      ],
    },
    {
      pageKey: 'contact',
      enabled: true,
      seoTitleVi: 'Chỉ Đường, Giờ Mở Cửa & Đặt Chỗ — Cẩm Cù House',
      seoTitleEn: 'Directions, Hours & Booking — Cẩm Cù House',
      seoDescVi: 'Chỉ đường chi tiết tới Hẻm 437 Hùng Vương, Đông Gia Nghĩa. Đặt bàn cà phê ngắm suối hoặc đặt tiệc BBQ bên bờ suối.',
      seoDescEn: 'Step-by-step directions to Alley 437 Hung Vuong, Dong Gia Nghia. Streamside table reservations and BBQ inquiries.',
      sections: [
        {
          id: 'intro',
          key: 'intro',
          enabled: true,
          order: 1,
          layoutVariant: 'heading-center',
          dataVi: {
            eyebrow: 'CHỈ ĐƯỜNG & KẾT NỐI',
            title: 'Ghé Thăm Cẩm Cù House',
            subtitle: 'Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng (P. Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông cũ)',
            intro: 'Quán nằm dưới con dốc rợp bóng cây xanh mát, chỉ cách trục đường Hùng Vương vài bước chân. Dòng suối tự nhiên uốn lượn ngay sau quán.',
          },
          dataEn: {
            eyebrow: 'DIRECTIONS & GET IN TOUCH',
            title: 'Visit Cẩm Cù House',
            subtitle: 'Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong (Former Nghia Trung Ward, Gia Nghia City, Dak Nong)',
            intro: 'Nestled down a tree-shaded slope just steps away from Hung Vuong street. The gentle natural stream flows right behind the café.',
          },
        },
        {
          id: 'quickInfo',
          key: 'quickInfo',
          enabled: true,
          order: 2,
          layoutVariant: 'cards-3',
          dataVi: {},
          dataEn: {},
        },
        {
          id: 'bookingForm',
          key: 'bookingForm',
          enabled: true,
          order: 3,
          layoutVariant: 'inquiry-form',
          dataVi: {
            title: 'Đặt Bàn, Tiệc BBQ Hoặc Gửi Tin Nhắn',
            desc: 'Quán phản hồi nhanh chóng qua Zalo hoặc điện thoại xác nhận trong 15 phút.',
          },
          dataEn: {
            title: 'Table Booking, BBQ Reservation & Inquiries',
            desc: 'We will confirm promptly via phone or Zalo within 15 minutes.',
          },
        },
        {
          id: 'mapSection',
          key: 'mapSection',
          enabled: true,
          order: 4,
          layoutVariant: 'full-map',
          dataVi: {
            title: 'Bản Đồ Chỉ Đường Trực Tiếp',
            note: 'Từ đường Hùng Vương rẽ vào Hẻm 437, đi thẳng 50m xuống dốc có biển chỉ dẫn gỗ Cẩm Cù House. Có bãi đỗ xe ô tô và xe máy rộng rãi.',
          },
          dataEn: {
            title: 'Interactive Google Map',
            note: 'From Hung Vuong street turn into Alley 437, drive 50m down the shaded slope following wooden signs. Spacious parking available for cars and motorcycles.',
          },
        },
      ],
    },
  ];

  for (const pc of pageConfigs) {
    await prisma.pageConfig.upsert({
      where: { pageKey: pc.pageKey },
      update: {
        enabled: pc.enabled,
        seoTitleVi: pc.seoTitleVi,
        seoTitleEn: pc.seoTitleEn,
        seoDescVi: pc.seoDescVi,
        seoDescEn: pc.seoDescEn,
        sections: pc.sections,
      },
      create: {
        pageKey: pc.pageKey,
        enabled: pc.enabled,
        seoTitleVi: pc.seoTitleVi,
        seoTitleEn: pc.seoTitleEn,
        seoDescVi: pc.seoDescVi,
        seoDescEn: pc.seoDescEn,
        sections: pc.sections,
      },
    });
  }

  // 3. Menu Categories
  console.log('3. Seeding MenuCategory (7 categories)...');
  for (const cat of CATEGORIES) {
    await prisma.menuCategory.upsert({
      where: { id: cat.id },
      update: {
        nameVi: cat.nameVi,
        nameEn: cat.nameEn,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        nameVi: cat.nameVi,
        nameEn: cat.nameEn,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });
  }

  // 4. MenuItem (67 items)
  console.log('4. Seeding MenuItem (67 items from raw backup)...');
  const backupMenuItems = backupData.menu_items || [];
  let itemIndex = 0;
  for (const item of backupMenuItems) {
    itemIndex++;
    let catId = item.category === 'others' ? 'other' : item.category;
    if (!CATEGORIES.some((c) => c.id === catId)) {
      catId = 'other';
    }

    // Lookup translation
    // Mapping keys: c1 -> cf-01, t1 -> tra-01, etc.
    let translationKey = item.id;
    if (item.id.startsWith('c')) {
      const num = parseInt(item.id.replace('c', ''), 10);
      translationKey = `cf-0${num}`;
    } else if (item.id.startsWith('t')) {
      const num = parseInt(item.id.replace('t', ''), 10);
      translationKey = `tra-${num < 10 ? '0' : ''}${num}`;
    } else if (item.id.startsWith('s')) {
      const num = parseInt(item.id.replace('s', ''), 10);
      translationKey = `st-0${num}`;
    } else if (item.id.startsWith('j')) {
      const num = parseInt(item.id.replace('j', ''), 10);
      translationKey = `ne-0${num}`;
    } else if (item.id.startsWith('sy')) {
      const num = parseInt(item.id.replace('sy', ''), 10);
      translationKey = `sd-0${num}`;
    } else if (item.id.startsWith('o')) {
      const num = parseInt(item.id.replace('o', ''), 10);
      translationKey = `ot-0${num}`;
    } else if (item.id.startsWith('f')) {
      const num = parseInt(item.id.replace('f', ''), 10);
      translationKey = `fd-${num < 10 ? '0' : ''}${num}`;
    }

    const tr = menuItemTranslations[translationKey] || {};

    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        categoryId: catId,
        sortOrder: itemIndex,
        nameVi: item.name,
        nameEn: tr.nameEn || item.name,
        descVi: item.description || '',
        descEn: tr.descriptionEn || item.description || '',
        priceVnd: item.price || 25000,
        priceDisplay: `${(item.price || 25000).toLocaleString('vi-VN')}đ`,
        imageUrl: item.image || undefined,
        isFeatured: itemIndex <= 8,
        isAvailable: true,
        isVisible: true,
        badgeVi: tr.highlightEn ? 'Signature' : undefined,
        badgeEn: tr.highlightEn || undefined,
        editorialNoteVi: tr.editorialNoteEn ? 'Rang mộc thủ công' : undefined,
        editorialNoteEn: tr.editorialNoteEn || undefined,
      },
      create: {
        id: item.id,
        categoryId: catId,
        sortOrder: itemIndex,
        nameVi: item.name,
        nameEn: tr.nameEn || item.name,
        descVi: item.description || '',
        descEn: tr.descriptionEn || item.description || '',
        priceVnd: item.price || 25000,
        priceDisplay: `${(item.price || 25000).toLocaleString('vi-VN')}đ`,
        imageUrl: item.image || undefined,
        isFeatured: itemIndex <= 8,
        isAvailable: true,
        isVisible: true,
        badgeVi: tr.highlightEn ? 'Signature' : undefined,
        badgeEn: tr.highlightEn || undefined,
        editorialNoteVi: tr.editorialNoteEn ? 'Rang mộc thủ công' : undefined,
        editorialNoteEn: tr.editorialNoteEn || undefined,
      },
    });
  }

  // 5. GalleryPlate (30 spatial photos)
  console.log('5. Seeding GalleryPlate (30 spatial photos)...');
  const backupSpaceItems = backupData.space_items || [];
  for (let i = 1; i <= 30; i++) {
    const code = `FIG. ${i < 10 ? '0' : ''}${i}`;
    const id = code;
    const backupItem = backupSpaceItems[i - 1] || {};
    const tr = spatialPlateTranslations[code] || {};

    let chapter = 1;
    let chapterTitleVi = 'Chương I — Lối Nhỏ Vào Vườn';
    let chapterTitleEn = 'Chapter I — The Wax Flower Path';
    let zoneTag = 'Bờ suối';

    if (i >= 1 && i <= 8) {
      chapter = 1;
      chapterTitleVi = 'Chương I — Lối Nhỏ Vào Vườn';
      chapterTitleEn = 'Chapter I — The Wax Flower Path';
      zoneTag = 'Góc trà';
    } else if (i >= 9 && i <= 16) {
      chapter = 2;
      chapterTitleVi = 'Chương II — Bên Bờ Suối Mát';
      chapterTitleEn = 'Chapter II — Beside the Cool Stream';
      zoneTag = 'Bờ suối';
    } else if (i >= 17 && i <= 24) {
      chapter = 3;
      chapterTitleVi = 'Chương III — Nhà Gỗ & Lửa Trại';
      chapterTitleEn = 'Chapter III — Wooden Cabins & Campfire';
      zoneTag = 'Nhà gỗ';
    } else {
      chapter = 4;
      chapterTitleVi = 'Chương IV — Sân Vườn BBQ & Hoàng Hôn';
      chapterTitleEn = 'Chapter IV — BBQ Garden & Twilight';
      zoneTag = 'Sân vườn BBQ';
    }

    const titleVi = backupItem.title || tr.titleEn || `Bản khắc không gian ${code}`;
    const titleEn = tr.titleEn || titleVi;
    const captionVi = backupItem.description || tr.descriptionEn || `Không gian sinh thái mộc mạc tại Cẩm Cù House.`;
    const captionEn = tr.descriptionEn || captionVi;
    const imageUrl = `/uploads/gallery/fig-${i < 10 ? '0' : ''}${i}.jpg`;

    await prisma.galleryPlate.upsert({
      where: { code },
      update: {
        titleVi,
        titleEn,
        captionVi,
        captionEn,
        zoneTag,
        imageUrl,
        sortOrder: i,
        isVisible: true,
        chapter,
        chapterTitleVi,
        chapterTitleEn,
      },
      create: {
        id,
        code,
        titleVi,
        titleEn,
        captionVi,
        captionEn,
        zoneTag,
        imageUrl,
        sortOrder: i,
        isVisible: true,
        chapter,
        chapterTitleVi,
        chapterTitleEn,
      },
    });
  }

  // 6. Post (Events & News)
  console.log('6. Seeding Post (Events & News)...');
  const posts = [
    {
      slug: 'mua-hoa-cam-cu-no-ro',
      titleVi: 'Mùa Hoa Cẩm Cù Nở Rộ Bên Dòng Suối Mát',
      titleEn: 'Wax Flowers in Full Bloom Beside the Stream',
      subtitleVi: 'Khám phá sắc hoa ngôi sao sáp tuyệt đẹp bung nở trong nắng sớm',
      subtitleEn: 'Admire the porcelain star blossoms glistening in early sunlight',
      dateLabelVi: 'Tháng 4 – Tháng 8 hàng năm',
      dateLabelEn: 'April – August yearly',
      contentVi: 'Mỗi năm khi tiết trời sang hạ, những giàn lan Cẩm Cù tại quán lại đồng loạt kết nụ và bung nở những chùm hoa hình ngôi sao sáp tinh xảo. Hương thơm thoang thoảng dịu nhẹ hòa quyện cùng làn hơi nước mát lạnh từ bờ suối tạo nên bầu không khí thư thái vô ngần.',
      contentEn: 'Every summer, the wax flower canopies burst into clusters of porcelain star blooms. The delicate fragrance blends with cool stream mists to produce an unforgettably tranquil ambiance.',
      badgeVi: 'Mùa vụ',
      badgeEn: 'Seasonal',
      imageUrl: '/uploads/gallery/fig-03.jpg',
      sortOrder: 1,
    },
    {
      slug: 'ca-phe-rang-moc-cui-truyen-thong',
      titleVi: 'Hương Vị Cà Phê Mộc Rang Củi Bazan Đắk Nông',
      titleEn: 'Wood-Roasted Basalt Coffee Heritage',
      subtitleVi: 'Giữ trọn hương vị nguyên bản của hạt cà phê Robusta chín mọng',
      subtitleEn: 'Preserving the raw integrity of ripe highland Robusta beans',
      dateLabelVi: 'Phục vụ hàng ngày',
      dateLabelEn: 'Served Daily',
      contentVi: 'Tại Cẩm Cù House, từng mẻ cà phê được tuyển chọn từ những cây cà phê Robusta lâu năm trên vùng đất đỏ núi lửa Gia Nghĩa. Hạt được rang bằng củi cà phê khô theo phương pháp thủ công, không tẩm ướp bơ hay hương liệu nhân tạo, đem lại vị đắng thanh thoát và hậu ngọt dài lâu.',
      contentEn: 'Each coffee batch is handpicked from mature highland trees in volcanic soil. Wood roasting without additives preserves an intense earthy sweetness.',
      badgeVi: 'Đặc sản',
      badgeEn: 'Specialty',
      imageUrl: '/uploads/gallery/fig-05.jpg',
      sortOrder: 2,
    },
    {
      slug: 'tiec-bbq-lua-trai-ben-suoi',
      titleVi: 'Tiệc BBQ & Lửa Trại Gia Đình Bên Bờ Suối',
      titleEn: 'Streamside BBQ & Campfire Gatherings',
      subtitleVi: 'Không gian ấm cúng cho các buổi sum họp cuối tuần',
      subtitleEn: 'Cozy weekend gatherings around glowing campfires',
      dateLabelVi: 'Thứ 6 – Chủ Nhật',
      dateLabelEn: 'Fri – Sun Evenings',
      contentVi: 'Khi hoàng hôn buông xuống thung lũng, ánh lửa bập bùng cùng hương thơm của các món nướng mộc mạc bên bờ suối mang đến cảm giác ấm áp và gắn kết. Vui lòng liên hệ trước ít nhất 1 ngày để quán chuẩn bị chu đáo nhất.',
      contentEn: 'As twilight settles over the valley, golden campfires and streamside BBQ aromas offer the perfect setting for family reunions.',
      badgeVi: 'Trải nghiệm',
      badgeEn: 'Experience',
      imageUrl: '/uploads/gallery/fig-12.jpg',
      sortOrder: 3,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        titleVi: p.titleVi,
        titleEn: p.titleEn,
        subtitleVi: p.subtitleVi,
        subtitleEn: p.subtitleEn,
        dateLabelVi: p.dateLabelVi,
        dateLabelEn: p.dateLabelEn,
        contentVi: p.contentVi,
        contentEn: p.contentEn,
        badgeVi: p.badgeVi,
        badgeEn: p.badgeEn,
        imageUrl: p.imageUrl,
        sortOrder: p.sortOrder,
        published: true,
      },
      create: {
        slug: p.slug,
        titleVi: p.titleVi,
        titleEn: p.titleEn,
        subtitleVi: p.subtitleVi,
        subtitleEn: p.subtitleEn,
        dateLabelVi: p.dateLabelVi,
        dateLabelEn: p.dateLabelEn,
        contentVi: p.contentVi,
        contentEn: p.contentEn,
        badgeVi: p.badgeVi,
        badgeEn: p.badgeEn,
        imageUrl: p.imageUrl,
        sortOrder: p.sortOrder,
        published: true,
      },
    });
  }

  // 7. FaqItem (4 items)
  console.log('7. Seeding FaqItem...');
  const faqs = [
    {
      id: 'faq-1',
      questionVi: 'Đường vào Cẩm Cù House như thế nào? Xe ô tô có vào được không?',
      questionEn: 'How are the directions to Cẩm Cù House? Can cars enter?',
      answerVi: 'Quán nằm tại Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa. Đường hẻm bê tông rộng rãi, xe ô tô 4-16 chỗ vào thẳng tận sân quán và có bãi đỗ xe quay đầu thoải mái.',
      answerEn: 'The café is at Alley 437 Hung Vuong. Wide concrete road allows 4-16 seater cars to drive directly into our spacious parking courtyard.',
      categoryVi: 'Đường đi & Đỗ xe',
      categoryEn: 'Directions & Parking',
      sortOrder: 1,
    },
    {
      id: 'faq-2',
      questionVi: 'Cẩm Cù House có phục vụ đồ ăn sáng và ăn trưa không?',
      questionEn: 'Does Cẩm Cù House serve breakfast and lunch?',
      answerVi: 'Có. Quán phục vụ điểm tâm sáng như Bò kho bánh mì, Bánh mì ốp la xúc xích, Mì Ý bò bằm và nhiều món ăn vặt phong phú suốt ngày.',
      answerEn: 'Yes. We serve breakfast and light lunch including Beef Stew Bread, sunny-side eggs with sausage, pasta, and wholesome snacks.',
      categoryVi: 'Thực đơn xanh sạch',
      categoryEn: 'Wholesome Menu',
      sortOrder: 2,
    },
    {
      id: 'faq-3',
      questionVi: 'Giờ mở cửa của quán như thế nào?',
      questionEn: 'What are the operating hours of the café?',
      answerVi: 'Quán mở cửa từ Thứ 2 đến Thứ 5: 07:00 – 18:00; Thứ 6 đến Chủ Nhật: 07:00 – 22:00.',
      answerEn: 'Monday to Thursday: 07:00 – 18:00; Friday to Sunday: 07:00 – 22:00.',
      categoryVi: 'Giờ mở cửa',
      categoryEn: 'Operating Hours',
      sortOrder: 3,
    },
    {
      id: 'faq-4',
      questionVi: 'Tôi muốn tổ chức tiệc BBQ hoặc họp nhóm thì cần liên hệ thế nào?',
      questionEn: 'How can I book streamside BBQ or private group gatherings?',
      answerVi: 'Vui lòng liên hệ Hotline 038 285 1688 hoặc nhắn Zalo trước ít nhất 1 ngày để quán chuẩn bị không gian và nguyên liệu tươi ngon nhất.',
      answerEn: 'Please contact our Hotline 038 285 1688 or Zalo at least 1 day in advance for optimal preparation.',
      categoryVi: 'Họp nhóm & Đặt tiệc',
      categoryEn: 'Groups & BBQ',
      sortOrder: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.upsert({
      where: { id: faq.id },
      update: {
        questionVi: faq.questionVi,
        questionEn: faq.questionEn,
        answerVi: faq.answerVi,
        answerEn: faq.answerEn,
        categoryVi: faq.categoryVi,
        categoryEn: faq.categoryEn,
        sortOrder: faq.sortOrder,
        published: true,
      },
      create: {
        id: faq.id,
        questionVi: faq.questionVi,
        questionEn: faq.questionEn,
        answerVi: faq.answerVi,
        answerEn: faq.answerEn,
        categoryVi: faq.categoryVi,
        categoryEn: faq.categoryEn,
        sortOrder: faq.sortOrder,
        published: true,
      },
    });
  }

  // 8. LegalPage
  console.log('8. Seeding LegalPage...');
  const legalPages = [
    {
      slug: 'chinh-sach-bao-mat',
      titleVi: 'Chính Sách Bảo Mật Thông Tin',
      titleEn: 'Privacy Policy',
      contentVi: 'Cẩm Cù House cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng khi gửi yêu cầu liên hệ hoặc đặt bàn tại website camcuhouse.online. Chúng tôi chỉ sử dụng thông tin để xác nhận lịch hẹn và nâng cao chất lượng dịch vụ, không chia sẻ cho bất kỳ bên thứ ba nào.',
      contentEn: 'Cẩm Cù House is committed to safeguarding personal information submitted via camcuhouse.online. We use your details solely for confirmation and customer care.',
      sortOrder: 1,
    },
    {
      slug: 'dieu-khoan-su-dung',
      titleVi: 'Điều Khoản & Quy Định Không Gian',
      titleEn: 'Terms & Space Guidelines',
      contentVi: 'Để bảo tồn nguyên vẹn hệ sinh thái tự nhiên và dòng suối trong lành, quý khách vui lòng giữ gìn vệ sinh chung, không xả rác xuống suối, và lưu ý an toàn cho các bạn nhỏ khi dạo chơi ven bờ suối.',
      contentEn: 'To protect our pristine streamside ecosystem, guests are kindly requested to preserve cleanliness, avoid littering, and supervise children near the stream.',
      sortOrder: 2,
    },
  ];

  for (const lp of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug: lp.slug },
      update: {
        titleVi: lp.titleVi,
        titleEn: lp.titleEn,
        contentVi: lp.contentVi,
        contentEn: lp.contentEn,
        sortOrder: lp.sortOrder,
        published: true,
      },
      create: {
        slug: lp.slug,
        titleVi: lp.titleVi,
        titleEn: lp.titleEn,
        contentVi: lp.contentVi,
        contentEn: lp.contentEn,
        sortOrder: lp.sortOrder,
        published: true,
      },
    });
  }

  // 9. Milestone
  console.log('9. Seeding Milestone...');
  const milestones = [
    {
      id: 'mile-1',
      titleVi: 'Khởi Sinh Ý Tưởng Dưới Vòm Suối Rừng',
      titleEn: 'Awakening Beside the Mountain Stream',
      dateLabelVi: 'Mùa xuân 2022',
      dateLabelEn: 'Spring 2022',
      summaryVi: 'Tìm thấy khu đất nguyên sơ bên dòng suối nhỏ tại Hẻm 437 Hùng Vương và ấp ủ giấc mơ sinh thái.',
      summaryEn: 'Discovering the pristine streamside land at Alley 437 Hung Vuong and dreaming of an ecological sanctuary.',
      sortOrder: 1,
    },
    {
      id: 'mile-2',
      titleVi: 'Gầy Dựng Giàn Lan Cẩm Cù Đầu Tiên',
      titleEn: 'Cultivating the First Wax Plant Canopy',
      dateLabelVi: 'Mùa thu 2023',
      dateLabelEn: 'Autumn 2023',
      summaryVi: 'Trồng những nhành hoa Cẩm Cù đầu tiên leo quanh cột gỗ và bắc cầu gỗ mộc qua bờ suối đá.',
      summaryEn: 'Planting initial wax plant vines over wooden beams and erecting natural timber footbridges.',
      sortOrder: 2,
    },
    {
      id: 'mile-3',
      titleVi: 'Chính Thức Đón Những Vị Khách Quý',
      titleEn: 'Welcoming Our First Cherished Guests',
      dateLabelVi: 'Năm 2024',
      dateLabelEn: 'Year 2024',
      summaryVi: 'Mở cửa đón tiếp khách du lịch và người dân địa phương ghé thưởng thức cà phê rang củi và trà thảo mộc.',
      summaryEn: 'Opening our doors to welcome visitors seeking authentic wood-roasted coffee and serene stream waters.',
      sortOrder: 3,
    },
  ];

  for (const m of milestones) {
    await prisma.milestone.upsert({
      where: { id: m.id },
      update: {
        titleVi: m.titleVi,
        titleEn: m.titleEn,
        dateLabelVi: m.dateLabelVi,
        dateLabelEn: m.dateLabelEn,
        summaryVi: m.summaryVi,
        summaryEn: m.summaryEn,
        sortOrder: m.sortOrder,
        published: true,
      },
      create: {
        id: m.id,
        titleVi: m.titleVi,
        titleEn: m.titleEn,
        dateLabelVi: m.dateLabelVi,
        dateLabelEn: m.dateLabelEn,
        summaryVi: m.summaryVi,
        summaryEn: m.summaryEn,
        sortOrder: m.sortOrder,
        published: true,
      },
    });
  }

  // 10. TeamMember
  console.log('10. Seeding TeamMember...');
  const team = [
    {
      id: 'team-1',
      nameVi: 'Thủy Như',
      nameEn: 'Thuy Nhu',
      roleVi: 'Chủ Sáng Lập & Chăm Sóc Vườn Cẩm Cù',
      roleEn: 'Founder & Botanical Curator',
      bioVi: 'Yêu thiên nhiên, đất bazan và từng nhành hoa dại bên suối.',
      bioEn: 'Devoted to preserving untamed highland greenery and indigenous flora.',
      avatarUrl: '/uploads/gallery/fig-06.jpg',
      sortOrder: 1,
    },
    {
      id: 'team-2',
      nameVi: 'Bác Ba',
      nameEn: 'Uncle Ba',
      roleVi: 'Nghệ Nhân Rang Cà Phê Củi Mộc',
      roleEn: 'Artisanal Wood-Roaster',
      bioVi: 'Hơn 25 năm kinh nghiệm rang cà phê củi mộc truyền thống Tây Nguyên.',
      bioEn: 'Over 25 years perfecting wood-roasted highland Robusta.',
      avatarUrl: '/uploads/gallery/fig-05.jpg',
      sortOrder: 2,
    },
  ];

  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        nameVi: member.nameVi,
        nameEn: member.nameEn,
        roleVi: member.roleVi,
        roleEn: member.roleEn,
        bioVi: member.bioVi,
        bioEn: member.bioEn,
        avatarUrl: member.avatarUrl,
        sortOrder: member.sortOrder,
        published: true,
      },
      create: {
        id: member.id,
        nameVi: member.nameVi,
        nameEn: member.nameEn,
        roleVi: member.roleVi,
        roleEn: member.roleEn,
        bioVi: member.bioVi,
        bioEn: member.bioEn,
        avatarUrl: member.avatarUrl,
        sortOrder: member.sortOrder,
        published: true,
      },
    });
  }

  // 11. CustomerReview (6 genuine reviews)
  console.log('11. Seeding CustomerReview (6 real Google Maps reviews)...');
  const backupReviews = backupData.reviews || [];
  for (const r of backupReviews) {
    await prisma.customerReview.upsert({
      where: { id: r.id },
      update: {
        authorName: r.author,
        rating: r.rating || 5,
        contentVi: r.textVi || '',
        contentEn: r.textEn || undefined,
        status: ReviewStatus.APPROVED,
        isFeatured: true,
        visitDate: r.publishedTimeVi || undefined,
      },
      create: {
        id: r.id,
        authorName: r.author,
        rating: r.rating || 5,
        contentVi: r.textVi || '',
        contentEn: r.textEn || undefined,
        status: ReviewStatus.APPROVED,
        isFeatured: true,
        visitDate: r.publishedTimeVi || undefined,
      },
    });
  }

  // 12. AdminUser (SUPER_ADMIN)
  console.log('12. Seeding AdminUser...');
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    // Generate secure initial password hash
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'CamCu@House2026';
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        passwordHash: hashPassword(initialPass),
        fullName: 'Quản Trị Viên Cẩm Cù',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('✓ Created initial super-admin account "admin"');
  }

  console.log('✅ Clean, idempotent seed completed successfully with ZERO data loss!');
}

async function main() {
  try {
    await seedDatabase();
  } catch (err) {
    console.error('❌ Error during database seed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Only execute directly when run as CLI script
if (require.main === module || process.argv[1]?.includes('seed.ts')) {
  main();
}
