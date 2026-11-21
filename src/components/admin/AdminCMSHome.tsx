'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Save,
  Check,
  RefreshCw,
  Layout,
  Eye,
  Sparkles,
  BookOpen,
  Upload,
  Camera,
  Image as ImageIcon,
  ExternalLink,
  UtensilsCrossed,
  Star,
  Newspaper,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { broadcastCmsSync } from '@/lib/cms-sync';
import { PhilosophyCard } from '@/types';

export type SubPageId =
  | 'page-home'
  | 'page-about'
  | 'page-space'
  | 'page-menu'
  | 'page-reviews'
  | 'page-news'
  | 'page-contact';

interface AdminCMSHomeProps {
  activeSubPage?: string;
}

interface SubPageConfig {
  id: SubPageId;
  labelVi: string;
  labelEn: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionVi: string;
  descriptionEn: string;
}

const SUB_PAGES: SubPageConfig[] = [
  {
    id: 'page-home',
    labelVi: '1. Trang chủ',
    labelEn: '1. Home',
    route: '/',
    icon: Layout,
    descriptionVi: 'Quản lý tiêu đề Hero, khẩu hiệu tạp chí, triết lý suối và các section nổi bật trên trang chủ.',
    descriptionEn: 'Manage Hero headline, magazine tagline, stream philosophy, and featured section toggles.',
  },
  {
    id: 'page-about',
    labelVi: '2. Giới thiệu',
    labelEn: '2. About',
    route: '/gioi-thieu',
    icon: BookOpen,
    descriptionVi: 'Quản lý câu chuyện thương hiệu hoa Cẩm Cù, tầm nhìn sinh thái, cột mốc và đội ngũ.',
    descriptionEn: 'Manage wax flower brand story, eco-vision & mission, milestones, and team toggles.',
  },
  {
    id: 'page-space',
    labelVi: '3. Không gian',
    labelEn: '3. Space',
    route: '/khong-gian',
    icon: Camera,
    descriptionVi: 'Quản lý tiêu đề thư viện 30 bản khắc không gian, mô tả và banner hình ảnh.',
    descriptionEn: 'Manage 30 spatial plates intro, chapter narratives, and hero banner.',
  },
  {
    id: 'page-menu',
    labelVi: '4. Thực đơn',
    labelEn: '4. Menu',
    route: '/thuc-don',
    icon: UtensilsCrossed,
    descriptionVi: 'Quản lý lời dẫn thực đơn 67 món thảo mộc & cà phê mộc bazan cùng thông báo phục vụ tại suối.',
    descriptionEn: 'Manage 67-item botanical menu intro, basalt coffee narrative, and streamside service notice.',
  },
  {
    id: 'page-reviews',
    labelVi: '5. Khách hàng',
    labelEn: '5. Reviews',
    route: '/khach-hang',
    icon: Star,
    descriptionVi: 'Quản lý tiêu đề trang đánh giá thực tế từ khách, lời cảm ơn và lời kêu gọi gửi đánh giá.',
    descriptionEn: 'Manage guest feedback showcase headings, thank-you statement, and review submission prompt.',
  },
  {
    id: 'page-news',
    labelVi: '6. Tin tức & FAQ',
    labelEn: '6. News & FAQ',
    route: '/tin-tuc',
    icon: Newspaper,
    descriptionVi: 'Quản lý tiêu đề trang sự kiện, giải đáp FAQ và bật/tắt hiển thị từng khu vực.',
    descriptionEn: 'Manage acoustic events & FAQ header copies, intro note, and visibility switches.',
  },
  {
    id: 'page-contact',
    labelVi: '7. Liên hệ',
    labelEn: '7. Contact',
    route: '/lien-he',
    icon: MapPin,
    descriptionVi: 'Quản lý thông tin chỉ đường, ghi chú tiệc BBQ suối và bãi đỗ xe ô tô tại Hẻm 437 Hùng Vương.',
    descriptionEn: 'Manage directions, streamside BBQ gathering notice, and parking guidance at Alley 437 Hung Vuong.',
  },
];

export default function AdminCMSHome({ activeSubPage }: AdminCMSHomeProps) {
  const { data, refreshData } = useApp();
  const c = data.content;

  // Active sub-page tab
  const [currentSubPage, setCurrentSubPage] = useState<SubPageId>(() => {
    if (activeSubPage && SUB_PAGES.some((p) => p.id === activeSubPage)) {
      return activeSubPage as SubPageId;
    }
    return 'page-home';
  });

  // Sync external activeSubPage prop when sidebar navigates
  useEffect(() => {
    if (activeSubPage && SUB_PAGES.some((p) => p.id === activeSubPage)) {
      setCurrentSubPage(activeSubPage as SubPageId);
    }
  }, [activeSubPage]);

  // Active edit language tab ('vi' or 'en')
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  // Saving states
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ---------------- Page 1: Trang chu (/) ----------------
  const [heroEyebrow, setHeroEyebrow] = useState(c?.heroEyebrow || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY');
  const [heroEyebrowEn, setHeroEyebrowEn] = useState(c?.heroEyebrowEn || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY');
  const [heroTitle, setHeroTitle] = useState(c?.heroTitle || 'CẨM CÙ HOUSE');
  const [heroTitleEn, setHeroTitleEn] = useState(c?.heroTitleEn || 'CẨM CÙ HOUSE');
  const [heroSubtitle, setHeroSubtitle] = useState(c?.heroSubtitle || 'Bên Dòng Suối Mát • Hẻm 437 Hùng Vương, Đông Gia Nghĩa, Lâm Đồng');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(c?.heroSubtitleEn || 'Beside Fresh Mountain Stream • Alley 437 Hung Vuong, Dong Gia Nghia, Lam Dong');
  const [heroTagline, setHeroTagline] = useState(c?.heroTagline || 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Đông Gia Nghĩa, Lâm Đồng.');
  const [heroTaglineEn, setHeroTaglineEn] = useState(c?.heroTaglineEn || 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Dong Gia Nghia, Lam Dong.');
  const [heroDescription, setHeroDescription] = useState(c?.heroDescription || 'Tận hưởng không gian suối mát rượi quanh năm, view suối tự nhiên, hương vị cà phê muối đậm đà rang mộc bazan Đăk Nông cùng các thức uống thảo mộc lành sạch cho tâm hồn.');
  const [heroDescriptionEn, setHeroDescriptionEn] = useState(c?.heroDescriptionEn || 'Experience year-round cool streamside breezes, natural waterfall views, authentic wood-roasted Dak Nong basalt coffee, and wholesome botanical herbal drinks for peace of mind.');
  const [showHero3DBean, setShowHero3DBean] = useState<boolean>(c?.showHero3DBean ?? true);

  // Home Featured Section Toggles
  const [showFeaturedMenu, setShowFeaturedMenu] = useState<boolean>(c?.showFeaturedMenu ?? true);
  const [showFeaturedSpace, setShowFeaturedSpace] = useState<boolean>(c?.showFeaturedSpace ?? true);
  const [showFeaturedReviews, setShowFeaturedReviews] = useState<boolean>(c?.showFeaturedReviews ?? true);
  const [showFeaturedEvents, setShowFeaturedEvents] = useState<boolean>(c?.showFeaturedEvents ?? true);

  // Philosophy Section (Home)
  const [philosophyEyebrow, setPhilosophyEyebrow] = useState(c?.philosophyEyebrow || 'VỀ KHÔNG GIAN BÊN SUỐI');
  const [philosophyEyebrowEn, setPhilosophyEyebrowEn] = useState(c?.philosophyEyebrowEn || 'ABOUT OUR STREAMSIDE SANCTUARY');
  const [philosophyTitle, setPhilosophyTitle] = useState(c?.philosophyTitle || 'Nơi Nhịp Thở Chậm Lại Bên Dòng Suối Tự Nhiên');
  const [philosophyTitleEn, setPhilosophyTitleEn] = useState(c?.philosophyTitleEn || 'Where Your Breath Slows Down by the Gentle Stream');
  const [philosophyLead, setPhilosophyLead] = useState(c?.philosophyLead || 'Giữa lòng Đông Gia Nghĩa, Lâm Đồng, Cẩm Cù House ẩn mình dưới con dốc rợp bóng cây tại Hẻm 437 Hùng Vương, nép mình bên dòng suối nhỏ chảy róc rách bốn mùa.');
  const [philosophyLeadEn, setPhilosophyLeadEn] = useState(c?.philosophyLeadEn || 'In the heart of Dong Gia Nghia, Lam Dong, Cẩm Cù House is nestled down a tree-shaded slope at Alley 437 Hung Vuong, sitting peacefully along a gentle natural stream flowing year-round.');
  const [philosophyStory, setPhilosophyStory] = useState(c?.philosophyStory || 'Chúng tôi giữ lại nguyên vẹn nét hoang sơ của ghềnh đá, tán cây rừng và làn hơi nước mát lạnh để tạo nên một chốn dừng chân thanh sạch, bình yên đúng nghĩa cho bạn và người thương.');
  const [philosophyStoryEn, setPhilosophyStoryEn] = useState(c?.philosophyStoryEn || 'We preserve the pristine basalt rocks, rainforest canopy, and cool water mists to create a truly pure, serene haven for you and your loved ones.');
  const [cards, setCards] = useState<PhilosophyCard[]>(
    c?.philosophyCards?.length
      ? c.philosophyCards
      : [
          { title: 'Dòng Suối Tự Nhiên Mát Lành', titleEn: 'Cool Natural Mountain Stream', desc: 'Bờ suối uốn lượn róc rách suốt 4 mùa mang đến hơi sương tinh khôi, xua tan cái oi bức và mệt mỏi.', descEn: 'A winding brook flowing gently year-round brings pure fresh mist, washing away all worldly heat and exhaustion.', iconName: 'Droplets' },
          { title: 'Hương Vị Bazan Đăk Nông', titleEn: 'Dak Nong Basalt Soil Flavors', desc: 'Hạt cà phê Robusta tuyển chọn chín mọng trên vùng đất đỏ núi lửa, rang mộc giữ trọn hương nồng đậm đà.', descEn: 'Sun-ripened Robusta beans harvested from volcanic red soils, wood-roasted to preserve rich botanical depth.', iconName: 'Coffee' },
          { title: 'Vòm Lá & Hoa Lan Cẩm Cù', titleEn: 'Wax Flower Vines & Canopy', desc: 'Không gian ngập tràn sắc xanh sinh thái, nơi những chùm hoa Cẩm Cù bung nở dịu dàng trong nắng sớm.', descEn: 'A lush ecological canopy where porcelain wax flower clusters bloom gracefully in the morning sun.', iconName: 'Sprout' },
        ]
  );

  // ---------------- Page 2: Gioi thieu (/gioi-thieu) ----------------
  const [brandStoryTitle, setBrandStoryTitle] = useState(c?.brandStoryTitle || 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù');
  const [brandStoryTitleEn, setBrandStoryTitleEn] = useState(c?.brandStoryTitleEn || 'The Awakening Journey Beneath the Wax Plant Vines');
  const [brandStorySubtitle, setBrandStorySubtitle] = useState(c?.brandStorySubtitle || 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc');
  const [brandStorySubtitleEn, setBrandStorySubtitleEn] = useState(c?.brandStorySubtitleEn || 'A Story of Basalt Soil, Gentle Streams & Pure Wood-Roasted Coffee');
  const [brandStoryContent, setBrandStoryContent] = useState(c?.brandStoryContent || 'Đông Gia Nghĩa, Lâm Đồng không chỉ có thiên nhiên xanh mát mà còn có những thung lũng xanh tĩnh lặng ẩn mình. Cẩm Cù House được sinh ra từ chính niềm say mê thiên nhiên và khát khao gìn giữ một khoảng trời xanh trong lành giữa lòng Đông Gia Nghĩa. Từng giàn lan Cẩm Cù bung nở những chùm hoa hình ngôi sao sáp dịu dàng soi bóng xuống dòng nước suối trong veo.');
  const [brandStoryContentEn, setBrandStoryContentEn] = useState(c?.brandStoryContentEn || 'Dong Gia Nghia, Lam Dong is blessed with pristine waterfalls and serene green valleys. Cẩm Cù House was born from our profound love for nature and a dream to preserve an untamed green haven in Dong Gia Nghia. Star-shaped porcelain wax flowers bloom gracefully over the crystal-clear streams.');
  const [brandStoryPhilosophy, setBrandStoryPhilosophy] = useState(c?.brandStoryPhilosophy || 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết". Mỗi ly cà phê mộc là hương vị của đất bazan núi lửa, mỗi ấm trà thảo mộc là sự chắt chiu từ hoa lá vườn nhà. Không gian ở đây không có máy lạnh ngột ngạt hay tiếng còi xe, chỉ có gió ngàn, tiếng suối reo và tiếng cười của những buổi chuyện trò ấm cúng.');
  const [brandStoryPhilosophyEn, setBrandStoryPhilosophyEn] = useState(c?.brandStoryPhilosophyEn || 'Our philosophy is simple: "Green - Wholesome - Pure". Every cup of wood-roasted coffee carries the volcanic richness of basalt soil; every herbal teapot is carefully harvested from home garden botanicals. No noisy air conditioners or traffic honks—only mountain breeze, babbling water, and warm laughter.');
  const [brandStoryImageUrl, setBrandStoryImageUrl] = useState(c?.brandStoryImageUrl || '/uploads/gallery/fig-01.jpg');
  const [showStoryMilestones, setShowStoryMilestones] = useState<boolean>(c?.showStoryMilestones ?? true);
  const [showTeamMembers, setShowTeamMembers] = useState<boolean>(c?.showTeamMembers ?? true);
  const [visionTitle, setVisionTitle] = useState(c?.visionTitle || 'Tầm Nhìn & Sứ Mệnh Sinh Thái');
  const [visionTitleEn, setVisionTitleEn] = useState(c?.visionTitleEn || 'Ecological Vision & Mission');
  const [visionDesc, setVisionDesc] = useState(c?.visionDesc || 'Trở thành điểm hẹn sinh thái biểu trưng của Đông Gia Nghĩa, Lâm Đồng — nơi gìn giữ vẻ đẹp nguyên bản của dòng suối rừng và tôn vinh nông sản thảo mộc tự nhiên.');
  const [visionDescEn, setVisionDescEn] = useState(c?.visionDescEn || 'To be the premier ecological destination of Dong Gia Nghia, Lam Dong — preserving the pristine beauty of natural forest streams and celebrating wholesome organic botanicals.');

  // ---------------- Page 3: Khong gian (/khong-gian) ----------------
  const [spaceEyebrow, setSpaceEyebrow] = useState(c?.spaceEyebrow || 'BỘ SƯU TẬP KHÔNG GIAN • BẢN KHẮC THỊ GIÁC');
  const [spaceEyebrowEn, setSpaceEyebrowEn] = useState(c?.spaceEyebrowEn || 'SPATIAL GALLERY • CURATED VISUAL PLATES');
  const [spaceTitle, setSpaceTitle] = useState(c?.spaceTitle || '30 Bản Khắc Không Gian Bên Bờ Suối Mát');
  const [spaceTitleEn, setSpaceTitleEn] = useState(c?.spaceTitleEn || '30 Streamside Spatial Plates');
  const [spaceSubtitle, setSpaceSubtitle] = useState(c?.spaceSubtitle || 'Nơi mỗi góc quán mộc mạc ghi lại vẻ đẹp tĩnh lặng của làn nước suối và vòm lá Cẩm Cù');
  const [spaceSubtitleEn, setSpaceSubtitleEn] = useState(c?.spaceSubtitleEn || 'Where each rustic frame captures the quiet poetry of flowing water and wax plant canopies');
  const [spaceIntro, setSpaceIntro] = useState(c?.spaceIntro || 'Khám phá trọn vẹn các bản khắc thị giác của Cẩm Cù House qua 4 chương không gian: Lối nhỏ vào vườn, Bên bờ suối mát, Hương vị xanh sạch và Hoàng hôn buông.');
  const [spaceIntroEn, setSpaceIntroEn] = useState(c?.spaceIntroEn || 'Explore all curated visual plates of Cẩm Cù House organized across 4 chapters: The Wax Flower Path, Beside the Cool Stream, Wholesome Pure Flavors, and Twilight.');
  const [spaceHeroBanner, setSpaceHeroBanner] = useState(c?.spaceHeroBanner || '/uploads/gallery/fig-01.jpg');

  // ---------------- Page 4: Thuc don (/thuc-don) ----------------
  const [menuEyebrow, setMenuEyebrow] = useState(c?.menuEyebrow || 'THỰC ĐƠN THẢO MỘC & CÀ PHÊ RANG MỘC');
  const [menuEyebrowEn, setMenuEyebrowEn] = useState(c?.menuEyebrowEn || 'BOTANICAL HERBAL MENU & WOOD-ROASTED COFFEE');
  const [menuTitle, setMenuTitle] = useState(c?.menuTitle || 'Thực Đơn Cẩm Cù House');
  const [menuTitleEn, setMenuTitleEn] = useState(c?.menuTitleEn || 'Cẩm Cù House Botanical Menu');
  const [menuSubtitle, setMenuSubtitle] = useState(c?.menuSubtitle || 'Hương Vị Bazan Đăk Nông & Thảo Mộc Thanh Mát');
  const [menuSubtitleEn, setMenuSubtitleEn] = useState(c?.menuSubtitleEn || 'Flavors of Basalt Soil & Wholesome Fresh Herbs');
  const [menuIntro, setMenuIntro] = useState(c?.menuIntro || '67 món thức uống và điểm tâm được chế biến từ nông sản tự nhiên, cà phê rang củi mộc và thảo mộc tươi mát.');
  const [menuIntroEn, setMenuIntroEn] = useState(c?.menuIntroEn || '67 drinks and artisanal breakfast dishes crafted from organic botanicals, wood-roasted coffee, and garden herbs.');
  const [menuNotice, setMenuNotice] = useState(c?.menuNotice || 'Phục vụ tại bàn sát suối • Không sử dụng phẩm màu hay hương liệu nhân tạo • Thảo mộc tươi hái mỗi sáng');
  const [menuNoticeEn, setMenuNoticeEn] = useState(c?.menuNoticeEn || 'Served right beside the stream • Zero artificial flavors or coloring • Fresh herbs harvested every morning');

  // ---------------- Page 5: Khach hang (/khach-hang) ----------------
  const [reviewsEyebrow, setReviewsEyebrow] = useState(c?.reviewsEyebrow || 'CẢM NHẬN & ĐÁNH GIÁ THỰC TẾ');
  const [reviewsEyebrowEn, setReviewsEyebrowEn] = useState(c?.reviewsEyebrowEn || 'GENUINE GUEST REVIEWS & STORIES');
  const [reviewsTitle, setReviewsTitle] = useState(c?.reviewsTitle || 'Những Lời Gửi Gắm Bên Dòng Suối');
  const [reviewsTitleEn, setReviewsTitleEn] = useState(c?.reviewsTitleEn || 'Heartfelt Words Beside the Stream');
  const [reviewsSubtitle, setReviewsSubtitle] = useState(c?.reviewsSubtitle || '100% Đề xuất từ những vị khách quý ghé thăm Cẩm Cù House');
  const [reviewsSubtitleEn, setReviewsSubtitleEn] = useState(c?.reviewsSubtitleEn || '100% Recommended by genuine guests visiting Cẩm Cù House');
  const [reviewsIntro, setReviewsIntro] = useState(c?.reviewsIntro || 'Mỗi tách cà phê, mỗi buổi chiều ngồi nghe tiếng suối là một kỷ niệm đẹp. Chúng tôi trân trọng từng chia sẻ và góp ý chân tình của bạn.');
  const [reviewsIntroEn, setReviewsIntroEn] = useState(c?.reviewsIntroEn || 'Every cup of coffee, every peaceful afternoon listening to the gentle brook is a cherished memory. We treasure every heartfelt guest review.');
  const [reviewsPrompt, setReviewsPrompt] = useState(c?.reviewsPrompt || 'Bạn đã ghé thăm Cẩm Cù House? Hãy để lại cảm nhận của bạn để chúng tôi phục vụ ngày một chu đáo hơn!');
  const [reviewsPromptEn, setReviewsPromptEn] = useState(c?.reviewsPromptEn || 'Have you visited Cẩm Cù House? Please leave your review so we can welcome you even better!');

  // ---------------- Page 6: Tin tuc & FAQ (/tin-tuc) ----------------
  const [newsEyebrow, setNewsEyebrow] = useState(c?.newsEyebrow || 'BẢN TIN SINH THÁI & GIẢI ĐÁP');
  const [newsEyebrowEn, setNewsEyebrowEn] = useState(c?.newsEyebrowEn || 'ECOLOGICAL DISPATCH & FAQ');
  const [newsTitle, setNewsTitle] = useState(c?.newsTitle || 'Tin Tức Hoạt Động & Câu Hỏi Thường Gặp');
  const [newsTitleEn, setNewsTitleEn] = useState(c?.newsTitleEn || 'Events, News & Frequently Asked Questions');
  const [newsSubtitle, setNewsSubtitle] = useState(c?.newsSubtitle || 'Cập nhật nhịp sống bên suối và thông tin hướng dẫn chi tiết dành cho bạn');
  const [newsSubtitleEn, setNewsSubtitleEn] = useState(c?.newsSubtitleEn || 'Updates on streamside happenings and helpful guide notes for your visit');
  const [newsIntro, setNewsIntro] = useState(c?.newsIntro || 'Xem lịch trình các hoạt động âm nhạc, mùa vụ hoa nở và câu trả lời cho các thắc mắc về đường đi, thực đơn, bãi đỗ xe.');
  const [newsIntroEn, setNewsIntroEn] = useState(c?.newsIntroEn || 'Check schedules for acoustic sessions, seasonal blooms, and clear answers regarding parking, menu, and directions.');
  const [showNewsEvents, setShowNewsEvents] = useState<boolean>(c?.showNewsEvents ?? true);
  const [showNewsFaq, setShowNewsFaq] = useState<boolean>(c?.showNewsFaq ?? true);

  // ---------------- Page 7: Lien he (/lien-he) ----------------
  const [contactEyebrow, setContactEyebrow] = useState(c?.contactEyebrow || 'CHỈ ĐƯỜNG & KẾT NỐI');
  const [contactEyebrowEn, setContactEyebrowEn] = useState(c?.contactEyebrowEn || 'DIRECTIONS & GET IN TOUCH');
  const [contactTitle, setContactTitle] = useState(c?.contactTitle || 'Ghé Thăm Cẩm Cù House');
  const [contactTitleEn, setContactTitleEn] = useState(c?.contactTitleEn || 'Visit Cẩm Cù House');
  const [contactSubtitle, setContactSubtitle] = useState(c?.contactSubtitle || 'Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông');
  const [contactSubtitleEn, setContactSubtitleEn] = useState(c?.contactSubtitleEn || 'Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City, Dak Nong');
  const [contactIntro, setContactIntro] = useState(c?.contactIntro || 'Quán nằm dưới con dốc rợp bóng cây xanh mát, chỉ cách trục đường Hùng Vương vài bước chân. Dòng suối tự nhiên uốn lượn ngay sau quán.');
  const [contactIntroEn, setContactIntroEn] = useState(c?.contactIntroEn || 'Nestled down a tree-shaded slope just steps away from Hung Vuong street. The gentle natural stream flows right behind the café.');
  const [contactBbqCallout, setContactBbqCallout] = useState(c?.contactBbqCallout || 'Tiệc BBQ bên bờ suối & Đặt chỗ đoàn: Vui lòng liên hệ Hotline trước ít nhất 1 ngày để quán chuẩn bị chu đáo nhất.');
  const [contactBbqCalloutEn, setContactBbqCalloutEn] = useState(c?.contactBbqCalloutEn || 'Streamside BBQ & Group gatherings: Please contact our Hotline at least 1 day in advance for optimal preparation.');
  const [contactDirectionsNote, setContactDirectionsNote] = useState(c?.contactDirectionsNote || 'Từ đường Hùng Vương rẽ vào Hẻm 437, đi thẳng 50m xuống dốc có biển chỉ dẫn gỗ Cẩm Cù House. Có bãi đỗ xe ô tô và xe máy rộng rãi.');
  const [contactDirectionsNoteEn, setContactDirectionsNoteEn] = useState(c?.contactDirectionsNoteEn || 'From Hung Vuong street turn into Alley 437, drive 50m down the shaded slope following wooden signs. Spacious parking available for cars and motorcycles.');

  // Upload state & refs
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const brandFileInputRef = useRef<HTMLInputElement>(null);
  const spaceFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: string,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      setErrorMessage('Vui lòng chọn ảnh định dạng JPG, PNG, WebP hoặc AVIF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh vượt quá 10MB.');
      return;
    }

    setUploadingField(folder);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data?.url) {
        onSuccess(json.data.url);
      } else {
        setErrorMessage(json.error || 'Lỗi tải ảnh lên Vercel Blob');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể kết nối máy chủ để tải ảnh.');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleCardChange = (index: number, field: keyof PhilosophyCard, value: string) => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          // Page 1
          heroEyebrow,
          heroEyebrowEn,
          heroTitle,
          heroTitleEn,
          heroSubtitle,
          heroSubtitleEn,
          heroTagline,
          heroTaglineEn,
          heroDescription,
          heroDescriptionEn,
          showHero3DBean,
          showFeaturedMenu,
          showFeaturedSpace,
          showFeaturedReviews,
          showFeaturedEvents,
          philosophyEyebrow,
          philosophyEyebrowEn,
          philosophyTitle,
          philosophyTitleEn,
          philosophyLead,
          philosophyLeadEn,
          philosophyStory,
          philosophyStoryEn,
          philosophyCards: cards,

          // Page 2
          brandStoryTitle,
          brandStoryTitleEn,
          brandStorySubtitle,
          brandStorySubtitleEn,
          brandStoryContent,
          brandStoryContentEn,
          brandStoryPhilosophy,
          brandStoryPhilosophyEn,
          brandStoryImageUrl,
          showStoryMilestones,
          showTeamMembers,
          visionTitle,
          visionTitleEn,
          visionDesc,
          visionDescEn,

          // Page 3
          spaceEyebrow,
          spaceEyebrowEn,
          spaceTitle,
          spaceTitleEn,
          spaceSubtitle,
          spaceSubtitleEn,
          spaceIntro,
          spaceIntroEn,
          spaceHeroBanner,

          // Page 4
          menuEyebrow,
          menuEyebrowEn,
          menuTitle,
          menuTitleEn,
          menuSubtitle,
          menuSubtitleEn,
          menuIntro,
          menuIntroEn,
          menuNotice,
          menuNoticeEn,

          // Page 5
          reviewsEyebrow,
          reviewsEyebrowEn,
          reviewsTitle,
          reviewsTitleEn,
          reviewsSubtitle,
          reviewsSubtitleEn,
          reviewsIntro,
          reviewsIntroEn,
          reviewsPrompt,
          reviewsPromptEn,

          // Page 6
          newsEyebrow,
          newsEyebrowEn,
          newsTitle,
          newsTitleEn,
          newsSubtitle,
          newsSubtitleEn,
          newsIntro,
          newsIntroEn,
          showNewsEvents,
          showNewsFaq,

          // Page 7
          contactEyebrow,
          contactEyebrowEn,
          contactTitle,
          contactTitleEn,
          contactSubtitle,
          contactSubtitleEn,
          contactIntro,
          contactIntroEn,
          contactBbqCallout,
          contactBbqCalloutEn,
          contactDirectionsNote,
          contactDirectionsNoteEn,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSavedSuccess(true);
        await refreshData();
        broadcastCmsSync('content');
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setErrorMessage(json.error || 'Có lỗi khi lưu nội dung CMS.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  const activePageConfig = SUB_PAGES.find((p) => p.id === currentSubPage) || SUB_PAGES[0];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <Layout className="w-4 h-4" />
            <span>HEADLESS CMS • 7 STOREFRONT PAGES (BILINGUAL VI & EN)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản Lý Giao Diện & Nội Dung 7 Trang Website
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Biên tập trực quan toàn bộ câu chữ, tiêu đề, đoạn văn và ảnh bìa cho tất cả 7 trang storefront của Cẩm Cù House.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Switch Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveLangTab('vi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLangTab === 'vi'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tiếng Việt (VI)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLangTab === 'en'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English (EN)
            </button>
          </div>

          {/* Quick live storefront preview link */}
          <a
            href={activePageConfig.route}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-200 transition-colors"
            title={`Mở xem ${activePageConfig.labelVi} ở tab mới`}
          >
            <span>Xem trang thật</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </a>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Đang lưu...' : savedSuccess ? 'Đã lưu CSDL!' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {/* 7-Page Pill Bar Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto [scrollbar-width:none]">
        <div className="flex items-center gap-1.5 min-w-max">
          {SUB_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = currentSubPage === page.id;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => setCurrentSubPage(page.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{page.labelVi}</span>
                <span className={`text-[10px] font-mono opacity-80 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {page.route}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error / Feedback Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-mono animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Nội dung CMS đã được lưu vào CSDL và đồng bộ qua EventSource thành công!</span>
          </div>
          <span className="text-[10px] text-emerald-600">{"Đã kích hoạt revalidatePath('/')"}</span>
        </div>
      )}

      {/* Subpage Banner Info Header */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            {React.createElement(activePageConfig.icon, { className: 'w-4 h-4' })}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              Đang chỉnh sửa: {activePageConfig.labelVi} ({activePageConfig.route})
            </h3>
            <p className="text-[11px] text-slate-500">{activePageConfig.descriptionVi}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
            Ngôn ngữ: {activeLangTab === 'vi' ? 'Tiếng Việt' : 'English'}
          </span>
          <a
            href={activePageConfig.route}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>Mở trang ↗</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          PAGE 1: TRANG CHỦ (/)
      ========================================================================= */}
      {currentSubPage === 'page-home' && (
        <div className="space-y-6">
          {/* Section: Hero Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Khu Vực 1: Botanical Magazine Hero ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dòng chữ thương hiệu lớn, khẩu hiệu suối và đoạn giới thiệu mở đầu trang chủ.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Dòng Eyebrow Nhỏ (Trên cùng):
                    </label>
                    <input
                      type="text"
                      value={heroEyebrow}
                      onChange={(e) => setHeroEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Tiêu Đề Lớn (Hero Title):
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Phụ Đề In Nghiêng (Hero Subtitle):
                    </label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 italic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Khẩu Hiệu Hero (Tagline):
                    </label>
                    <input
                      type="text"
                      value={heroTagline}
                      onChange={(e) => setHeroTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                    Đoạn Văn Mô Tả Giới Thiệu (Hero Description):
                  </label>
                  <textarea
                    rows={3}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Eyebrow Top Line (EN):
                    </label>
                    <input
                      type="text"
                      value={heroEyebrowEn}
                      onChange={(e) => setHeroEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Hero Title (EN):
                    </label>
                    <input
                      type="text"
                      value={heroTitleEn}
                      onChange={(e) => setHeroTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Hero Subtitle Italic (EN):
                    </label>
                    <input
                      type="text"
                      value={heroSubtitleEn}
                      onChange={(e) => setHeroSubtitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 italic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      Hero Tagline (EN):
                    </label>
                    <input
                      type="text"
                      value={heroTaglineEn}
                      onChange={(e) => setHeroTaglineEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                    Hero Description (EN):
                  </label>
                  <textarea
                    rows={3}
                    value={heroDescriptionEn}
                    onChange={(e) => setHeroDescriptionEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Toggle Hero 3D Bean / Photo Card */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Hiển Thị Khung Ảnh Bìa Hero 01 Bên Suối:
                </span>
                <span className="text-[11px] text-slate-500">
                  Bật/tắt khung ảnh bìa biên tập 2D ở cột bên phải Hero trên trang chủ.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHero3DBean(!showHero3DBean)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  showHero3DBean ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    showHero3DBean ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section: Homepage Featured Blocks Visibility Toggles */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Bật / Tắt Các Khối Nổi Bật Trên Trang Chủ</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm soát hiển thị các section preview trên trang chủ (`/`).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Khối Thực Đơn Nổi Bật</span>
                  <span className="text-[11px] text-slate-500">Menu Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeaturedMenu(!showFeaturedMenu)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showFeaturedMenu ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showFeaturedMenu ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Khối Bản Khắc Không Gian</span>
                  <span className="text-[11px] text-slate-500">Spatial Figures Preview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeaturedSpace(!showFeaturedSpace)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showFeaturedSpace ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showFeaturedSpace ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Khối Đánh Giá Khách Hàng</span>
                  <span className="text-[11px] text-slate-500">Testimonials Carousel</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeaturedReviews(!showFeaturedReviews)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showFeaturedReviews ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showFeaturedReviews ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Khối Hoạt Động & Sự Kiện</span>
                  <span className="text-[11px] text-slate-500">Live Acoustic & Events</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeaturedEvents(!showFeaturedEvents)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showFeaturedEvents ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showFeaturedEvents ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Philosophy */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Khu Vực 2: Triết Lý Bên Dòng Suối ({activeLangTab.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phần giới thiệu không gian bình yên và 3 thẻ giá trị sinh thái cốt lõi.
              </p>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow:</label>
                    <input
                      type="text"
                      value={philosophyEyebrow}
                      onChange={(e) => setPhilosophyEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Mục:</label>
                    <input
                      type="text"
                      value={philosophyTitle}
                      onChange={(e) => setPhilosophyTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Dòng Dẫn Ý Nghĩa (Lead):</label>
                  <input
                    type="text"
                    value={philosophyLead}
                    onChange={(e) => setPhilosophyLead(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Văn Triết Lý (Story):</label>
                  <textarea
                    rows={2}
                    value={philosophyStory}
                    onChange={(e) => setPhilosophyStory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={philosophyEyebrowEn}
                      onChange={(e) => setPhilosophyEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Section Title (EN):</label>
                    <input
                      type="text"
                      value={philosophyTitleEn}
                      onChange={(e) => setPhilosophyTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Lead Sentence (EN):</label>
                  <input
                    type="text"
                    value={philosophyLeadEn}
                    onChange={(e) => setPhilosophyLeadEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Story Paragraph (EN):</label>
                  <textarea
                    rows={2}
                    value={philosophyStoryEn}
                    onChange={(e) => setPhilosophyStoryEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 3 Philosophy Cards */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                3 Thẻ Triết Lý Sinh Thái (Philosophy Cards):
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <span className="text-[11px] font-mono text-emerald-700 font-bold block">
                      Thẻ 0{idx + 1}
                    </span>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {activeLangTab === 'vi' ? 'Tiêu đề thẻ (VI):' : 'Card Title (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? card.title : (card.titleEn || '')}
                        onChange={(e) =>
                          handleCardChange(idx, activeLangTab === 'vi' ? 'title' : 'titleEn', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {activeLangTab === 'vi' ? 'Nội dung mô tả (VI):' : 'Card Description (EN):'}
                      </label>
                      <textarea
                        rows={3}
                        value={activeLangTab === 'vi' ? card.desc : (card.descEn || '')}
                        onChange={(e) =>
                          handleCardChange(idx, activeLangTab === 'vi' ? 'desc' : 'descEn', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2: GIỚI THIỆU (/gioi-thieu)
      ========================================================================= */}
      {currentSubPage === 'page-about' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Câu Chuyện Thương Hiệu & Tầm Nhìn Sinh Thái ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bài viết về hành trình khởi sinh dưới vòm hoa Cẩm Cù và tầm nhìn bảo tồn suối tự nhiên.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Bài Viết:</label>
                    <input
                      type="text"
                      value={brandStoryTitle}
                      onChange={(e) => setBrandStoryTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Phụ Đề Khơi Gợi:</label>
                    <input
                      type="text"
                      value={brandStorySubtitle}
                      onChange={(e) => setBrandStorySubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Nội Dung Chi Tiết:</label>
                  <textarea
                    rows={4}
                    value={brandStoryContent}
                    onChange={(e) => setBrandStoryContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tóm Tắt Triết Lý Hoạt Động:</label>
                  <textarea
                    rows={2}
                    value={brandStoryPhilosophy}
                    onChange={(e) => setBrandStoryPhilosophy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Tầm Nhìn Sinh Thái:</label>
                    <input
                      type="text"
                      value={visionTitle}
                      onChange={(e) => setVisionTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Mô Tả Tầm Nhìn & Sứ Mệnh:</label>
                    <textarea
                      rows={2}
                      value={visionDesc}
                      onChange={(e) => setVisionDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Article Title (EN):</label>
                    <input
                      type="text"
                      value={brandStoryTitleEn}
                      onChange={(e) => setBrandStoryTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Subtitle (EN):</label>
                    <input
                      type="text"
                      value={brandStorySubtitleEn}
                      onChange={(e) => setBrandStorySubtitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Detailed Narrative (EN):</label>
                  <textarea
                    rows={4}
                    value={brandStoryContentEn}
                    onChange={(e) => setBrandStoryContentEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Philosophy Summary (EN):</label>
                  <textarea
                    rows={2}
                    value={brandStoryPhilosophyEn}
                    onChange={(e) => setBrandStoryPhilosophyEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Vision Title (EN):</label>
                    <input
                      type="text"
                      value={visionTitleEn}
                      onChange={(e) => setVisionTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Vision & Mission Description (EN):</label>
                    <textarea
                      rows={2}
                      value={visionDescEn}
                      onChange={(e) => setVisionDescEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Brand Story Image Upload */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-mono font-semibold text-slate-700">
                Ảnh Minh Họa Câu Chuyện Quán:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-32 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {brandStoryImageUrl ? (
                    <img src={brandStoryImageUrl} alt="Brand Story" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <input
                    type="text"
                    value={brandStoryImageUrl}
                    onChange={(e) => setBrandStoryImageUrl(e.target.value)}
                    placeholder="/uploads/brand/story-banner.jpg..."
                    className="w-full px-3 py-2 text-xs border rounded-xl font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={brandFileInputRef}
                      onChange={(e) => handleImageUpload(e, 'brand', (url) => setBrandStoryImageUrl(url))}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => brandFileInputRef.current?.click()}
                      disabled={uploadingField === 'brand'}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-200"
                    >
                      {uploadingField === 'brand' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploadingField === 'brand' ? 'Đang tải ảnh lên Blob...' : 'Chọn ảnh từ máy tính'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Toggles on Giới thiệu */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Hiển Thị Cột Mốc Lịch Sử</span>
                  <span className="text-[11px] text-slate-500">Milestone timeline</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStoryMilestones(!showStoryMilestones)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showStoryMilestones ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showStoryMilestones ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Hiển Thị Danh Sách Đội Ngũ</span>
                  <span className="text-[11px] text-slate-500">Team members showcase</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTeamMembers(!showTeamMembers)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showTeamMembers ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showTeamMembers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 3: KHÔNG GIAN (/khong-gian)
      ========================================================================= */}
      {currentSubPage === 'page-space' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Trang Bộ Sưu Tập 30 Bản Khắc Không Gian ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tiêu đề, dòng dẫn và banner mở đầu cho trang khám phá 30 bản khắc thị giác 4 chương.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow:</label>
                    <input
                      type="text"
                      value={spaceEyebrow}
                      onChange={(e) => setSpaceEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Trang:</label>
                    <input
                      type="text"
                      value={spaceTitle}
                      onChange={(e) => setSpaceTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Phụ (Subtitle):</label>
                  <input
                    type="text"
                    value={spaceSubtitle}
                    onChange={(e) => setSpaceSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Dẫn Mở Đầu (Intro Narrative):</label>
                  <textarea
                    rows={3}
                    value={spaceIntro}
                    onChange={(e) => setSpaceIntro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={spaceEyebrowEn}
                      onChange={(e) => setSpaceEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Page Title (EN):</label>
                    <input
                      type="text"
                      value={spaceTitleEn}
                      onChange={(e) => setSpaceTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Subtitle (EN):</label>
                  <input
                    type="text"
                    value={spaceSubtitleEn}
                    onChange={(e) => setSpaceSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Intro Narrative (EN):</label>
                  <textarea
                    rows={3}
                    value={spaceIntroEn}
                    onChange={(e) => setSpaceIntroEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Hero Banner Upload for Space Page */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-mono font-semibold text-slate-700">
                Ảnh Bìa Hero Trang Không Gian:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-32 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {spaceHeroBanner ? (
                    <img src={spaceHeroBanner} alt="Space Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <input
                    type="text"
                    value={spaceHeroBanner}
                    onChange={(e) => setSpaceHeroBanner(e.target.value)}
                    placeholder="/uploads/gallery/fig-01.jpg..."
                    className="w-full px-3 py-2 text-xs border rounded-xl font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={spaceFileInputRef}
                      onChange={(e) => handleImageUpload(e, 'gallery', (url) => setSpaceHeroBanner(url))}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => spaceFileInputRef.current?.click()}
                      disabled={uploadingField === 'gallery'}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-200"
                    >
                      {uploadingField === 'gallery' ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploadingField === 'gallery' ? 'Đang tải ảnh...' : 'Chọn ảnh banner từ máy tính'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 4: THỰC ĐƠN (/thuc-don)
      ========================================================================= */}
      {currentSubPage === 'page-menu' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                  <span>Trang Thực Đơn 67 Món Thảo Mộc & Cà Phê Mộc ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý các đoạn văn tiêu đề, câu chuyện đất bazan và cam kết phục vụ tại bàn sát suối.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow Thực Đơn:</label>
                    <input
                      type="text"
                      value={menuEyebrow}
                      onChange={(e) => setMenuEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Trang:</label>
                    <input
                      type="text"
                      value={menuTitle}
                      onChange={(e) => setMenuTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Phụ (Subtitle):</label>
                  <input
                    type="text"
                    value={menuSubtitle}
                    onChange={(e) => setMenuSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Văn Giới Thiệu (Intro):</label>
                  <textarea
                    rows={2}
                    value={menuIntro}
                    onChange={(e) => setMenuIntro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Cam Kết / Lưu Ý Phục Vụ (Notice):</label>
                  <input
                    type="text"
                    value={menuNotice}
                    onChange={(e) => setMenuNotice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Menu Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={menuEyebrowEn}
                      onChange={(e) => setMenuEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Menu Title (EN):</label>
                    <input
                      type="text"
                      value={menuTitleEn}
                      onChange={(e) => setMenuTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Menu Subtitle (EN):</label>
                  <input
                    type="text"
                    value={menuSubtitleEn}
                    onChange={(e) => setMenuSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Menu Intro Narrative (EN):</label>
                  <textarea
                    rows={2}
                    value={menuIntroEn}
                    onChange={(e) => setMenuIntroEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Service & Freshness Notice (EN):</label>
                  <input
                    type="text"
                    value={menuNoticeEn}
                    onChange={(e) => setMenuNoticeEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 5: KHÁCH HÀNG (/khach-hang)
      ========================================================================= */}
      {currentSubPage === 'page-reviews' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <span>Trang Cảm Nhận & Đánh Giá Khách Hàng ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tiêu đề tôn vinh cảm nhận thật của thực khách và lời mời viết cảm nhận lưu bút.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow:</label>
                    <input
                      type="text"
                      value={reviewsEyebrow}
                      onChange={(e) => setReviewsEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Trang:</label>
                    <input
                      type="text"
                      value={reviewsTitle}
                      onChange={(e) => setReviewsTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Phụ (Subtitle):</label>
                  <input
                    type="text"
                    value={reviewsSubtitle}
                    onChange={(e) => setReviewsSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Dẫn Tri Ân (Intro):</label>
                  <textarea
                    rows={3}
                    value={reviewsIntro}
                    onChange={(e) => setReviewsIntro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Lời Mời Gửi Cảm Nhận (Prompt):</label>
                  <input
                    type="text"
                    value={reviewsPrompt}
                    onChange={(e) => setReviewsPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={reviewsEyebrowEn}
                      onChange={(e) => setReviewsEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Title (EN):</label>
                    <input
                      type="text"
                      value={reviewsTitleEn}
                      onChange={(e) => setReviewsTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Subtitle (EN):</label>
                  <input
                    type="text"
                    value={reviewsSubtitleEn}
                    onChange={(e) => setReviewsSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Gratitude Narrative (EN):</label>
                  <textarea
                    rows={3}
                    value={reviewsIntroEn}
                    onChange={(e) => setReviewsIntroEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Submission Callout Prompt (EN):</label>
                  <input
                    type="text"
                    value={reviewsPromptEn}
                    onChange={(e) => setReviewsPromptEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 6: TIN TỨC & FAQ (/tin-tuc)
      ========================================================================= */}
      {currentSubPage === 'page-news' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>Trang Tin Tức Hoạt Động & Câu Hỏi Thường Gặp FAQ ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cập nhật lịch trình các sự kiện bên suối và các câu hỏi thường gặp về đường đi, giờ mở cửa.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow:</label>
                    <input
                      type="text"
                      value={newsEyebrow}
                      onChange={(e) => setNewsEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Trang:</label>
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Phụ (Subtitle):</label>
                  <input
                    type="text"
                    value={newsSubtitle}
                    onChange={(e) => setNewsSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Văn Hướng Dẫn (Intro):</label>
                  <textarea
                    rows={3}
                    value={newsIntro}
                    onChange={(e) => setNewsIntro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={newsEyebrowEn}
                      onChange={(e) => setNewsEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Title (EN):</label>
                    <input
                      type="text"
                      value={newsTitleEn}
                      onChange={(e) => setNewsTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Subtitle (EN):</label>
                  <input
                    type="text"
                    value={newsSubtitleEn}
                    onChange={(e) => setNewsSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 italic focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Intro Narrative (EN):</label>
                  <textarea
                    rows={3}
                    value={newsIntroEn}
                    onChange={(e) => setNewsIntroEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Section Toggles */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Hiển Thị Mục Sự Kiện & Hoạt Động</span>
                  <span className="text-[11px] text-slate-500">Live sessions & activities section</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewsEvents(!showNewsEvents)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showNewsEvents ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showNewsEvents ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Hiển Thị Khối Câu Hỏi Thường Gặp (FAQ)</span>
                  <span className="text-[11px] text-slate-500">Accordion FAQ section</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewsFaq(!showNewsFaq)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    showNewsFaq ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      showNewsFaq ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 7: LIÊN HỆ (/lien-he)
      ========================================================================= */}
      {currentSubPage === 'page-contact' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Trang Chỉ Đường & Kết Nối Liên Hệ ({activeLangTab.toUpperCase()})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Địa chỉ chính xác, hướng dẫn xuống dốc Hẻm 437 Hùng Vương, bãi đỗ xe và lưu ý tiệc BBQ suối.
                </p>
              </div>
            </div>

            {activeLangTab === 'vi' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow:</label>
                    <input
                      type="text"
                      value={contactEyebrow}
                      onChange={(e) => setContactEyebrow(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Trang:</label>
                    <input
                      type="text"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Địa Chỉ Chi Tiết (Subtitle):</label>
                  <input
                    type="text"
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Văn Giới Thiệu Con Dốc (Intro):</label>
                  <textarea
                    rows={2}
                    value={contactIntro}
                    onChange={(e) => setContactIntro(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Lưu Ý Tiệc BBQ Bên Suối & Đặt Chỗ Đoàn:</label>
                  <textarea
                    rows={2}
                    value={contactBbqCallout}
                    onChange={(e) => setContactBbqCallout(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Hướng Dẫn Chỉ Đường & Bãi Đỗ Xe Ô Tô:</label>
                  <textarea
                    rows={2}
                    value={contactDirectionsNote}
                    onChange={(e) => setContactDirectionsNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Eyebrow (EN):</label>
                    <input
                      type="text"
                      value={contactEyebrowEn}
                      onChange={(e) => setContactEyebrowEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Title (EN):</label>
                    <input
                      type="text"
                      value={contactTitleEn}
                      onChange={(e) => setContactTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Full Address (Subtitle EN):</label>
                  <input
                    type="text"
                    value={contactSubtitleEn}
                    onChange={(e) => setContactSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Slope & Stream Location Intro (EN):</label>
                  <textarea
                    rows={2}
                    value={contactIntroEn}
                    onChange={(e) => setContactIntroEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Streamside BBQ & Group Reservation Notice (EN):</label>
                  <textarea
                    rows={2}
                    value={contactBbqCalloutEn}
                    onChange={(e) => setContactBbqCalloutEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Driving Directions & Parking Guidance (EN):</label>
                  <textarea
                    rows={2}
                    value={contactDirectionsNoteEn}
                    onChange={(e) => setContactDirectionsNoteEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating/Sticky Save Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Mọi thay đổi trên cả 7 trang sẽ được lưu vào CSDL và đồng bộ ngay lập tức tới khách ghé thăm web.</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full sm:w-auto px-7 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            savedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Đang lưu CSDL...' : savedSuccess ? 'Đã lưu CSDL thành công!' : 'Lưu Thay Đổi Nội Dung'}</span>
        </button>
      </div>
    </form>
  );
}
