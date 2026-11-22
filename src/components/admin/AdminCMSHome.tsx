'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Save,
  Check,
  RefreshCw,
  Layout,
  Eye,
  EyeOff,
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
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
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
    descriptionVi: 'Quản lý 7 khu vực trang chủ, sắp xếp thứ tự hiển thị, bật/tắt từng section và kiểu bố cục.',
    descriptionEn: 'Manage 7 homepage sections, vertical ordering, visibility toggles, and layout styles.',
  },
  {
    id: 'page-about',
    labelVi: '2. Giới thiệu',
    labelEn: '2. About',
    route: '/gioi-thieu',
    icon: BookOpen,
    descriptionVi: 'Quản lý câu chuyện thương hiệu hoa Cẩm Cù, cam kết sinh thái, cột mốc và đội ngũ.',
    descriptionEn: 'Manage wax flower brand story, eco-commitments, milestones, and team sections.',
  },
  {
    id: 'page-space',
    labelVi: '3. Không gian',
    labelEn: '3. Space',
    route: '/khong-gian',
    icon: Camera,
    descriptionVi: 'Quản lý các phân khu trải nghiệm bờ suối, thư viện 30 bản khắc không gian và banner đặt chỗ.',
    descriptionEn: 'Manage streamside experience zones, 30 spatial plates gallery, and booking banner.',
  },
  {
    id: 'page-menu',
    labelVi: '4. Thực đơn',
    labelEn: '4. Menu',
    route: '/thuc-don',
    icon: UtensilsCrossed,
    descriptionVi: 'Quản lý triết lý pha chế 67 món thảo mộc & cà phê mộc bazan, tùy chọn hiển thị giá và nút giỏ hàng.',
    descriptionEn: 'Manage 67 botanical menu philosophy, price visibility, and cart button controls.',
  },
  {
    id: 'page-reviews',
    labelVi: '5. Khách hàng',
    labelEn: '5. Reviews',
    route: '/khach-hang',
    icon: Star,
    descriptionVi: 'Quản lý chỉ số hài lòng thực tế, danh sách đánh giá của khách và khung gửi cảm nhận mới.',
    descriptionEn: 'Manage guest satisfaction metrics, reviews showcase, and feedback submission box.',
  },
  {
    id: 'page-news',
    labelVi: '6. Tin tức & FAQ',
    labelEn: '6. News & FAQ',
    route: '/su-kien',
    icon: Newspaper,
    descriptionVi: 'Quản lý bản tin sinh thái, sự kiện hoạt động bên suối và bộ câu hỏi thường gặp FAQ.',
    descriptionEn: 'Manage eco-journal news, streamside happenings, and FAQ accordion section.',
  },
  {
    id: 'page-contact',
    labelVi: '7. Liên hệ',
    labelEn: '7. Contact',
    route: '/lien-he',
    icon: MapPin,
    descriptionVi: 'Quản lý hướng dẫn chỉ đường Hẻm 437 Hùng Vương, hotline, form liên hệ BBQ và bản đồ Google Maps.',
    descriptionEn: 'Manage directions to Alley 437 Hung Vuong, hotline cards, BBQ form, and Google Maps.',
  },
];

/**
 * Universal Section Card with Ordering & Visibility Controls
 */
function SectionCard({
  sectionId,
  title,
  subtitle,
  icon: Icon,
  enabled,
  onToggle,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  layoutVariant,
  layoutOptions,
  onChangeLayout,
  children,
}: {
  sectionId: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  onToggle: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  layoutVariant?: string;
  layoutOptions?: { value: string; label: string }[];
  onChangeLayout?: (val: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 shadow-sm ${
        enabled
          ? 'bg-white border-slate-200'
          : 'bg-slate-50/70 border-slate-200 opacity-80'
      }`}
    >
      {/* Section Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-800">{title}</h4>
              {!enabled && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Đang ẩn trên web
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Layout Variant Dropdown */}
          {layoutOptions && layoutOptions.length > 0 && onChangeLayout && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 hidden sm:inline">Kiểu bố cục:</span>
              <select
                value={layoutVariant || layoutOptions[0].value}
                onChange={(e) => onChangeLayout(e.target.value)}
                className="bg-transparent font-medium text-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Move Up / Move Down buttons */}
          {(onMoveUp || onMoveDown) && (
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-slate-600">
              <button
                type="button"
                disabled={!canMoveUp}
                onClick={onMoveUp}
                className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Di chuyển lên trên"
                aria-label="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={!canMoveDown}
                onClick={onMoveDown}
                className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Di chuyển xuống dưới"
                aria-label="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ON / OFF Switch */}
          <button
            type="button"
            onClick={onToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              enabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-xs'
                : 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{enabled ? 'Đang hiển thị' : 'Đang ẩn'}</span>
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className={`p-5 sm:p-6 space-y-5 transition-opacity ${!enabled ? 'opacity-60' : ''}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * Page-Level Visibility Toggle Card for Pages 2 to 7
 */
function PageVisibilityCard({
  pageTitle,
  enabled,
  onToggle,
}: {
  pageTitle: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        enabled
          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
          : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            enabled ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-300 text-slate-600'
          }`}
        >
          {enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-sm font-bold">
            Hiển thị trang &quot;{pageTitle}&quot; trên Menu Web (Navbar & Footer)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {enabled
              ? 'Trang đang hiển thị công khai trên thanh điều hướng chính và chân trang.'
              : 'Trang đang ẩn khỏi Navbar và Footer (đường dẫn trực tiếp vẫn hoạt động nếu cần truy cập).'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 ${
          enabled
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-white' : 'bg-slate-500'}`} />
        <span>{enabled ? 'Bật (Đang hiện trên Menu)' : 'Tắt (Đang ẩn khỏi Menu)'}</span>
      </button>
    </div>
  );
}

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

  // ---------------- Page-Level Visibility Toggles (Pages 2-7) ----------------
  const [showPageAbout, setShowPageAbout] = useState<boolean>(c?.showPageAbout ?? true);
  const [showPageSpace, setShowPageSpace] = useState<boolean>(c?.showPageSpace ?? true);
  const [showPageMenu, setShowPageMenu] = useState<boolean>(c?.showPageMenu ?? true);
  const [showPageReviews, setShowPageReviews] = useState<boolean>(c?.showPageReviews ?? true);
  const [showPageNews, setShowPageNews] = useState<boolean>(c?.showPageNews ?? true);
  const [showPageContact, setShowPageContact] = useState<boolean>(c?.showPageContact ?? true);

  // ---------------- Universal Section Orders ----------------
  const [homeOrder, setHomeOrder] = useState<string[]>(
    c?.homeSectionOrder?.length
      ? c.homeSectionOrder
      : ['hero', 'philosophy', 'featuredMenu', 'featuredSpace', 'featuredReviews', 'featuredEvents', 'ctaBanner']
  );
  const [aboutOrder, setAboutOrder] = useState<string[]>(
    c?.aboutSectionOrder?.length
      ? c.aboutSectionOrder
      : ['banner', 'brandStory', 'commitments', 'milestones', 'team']
  );
  const [spaceOrder, setSpaceOrder] = useState<string[]>(
    c?.spaceSectionOrder?.length
      ? c.spaceSectionOrder
      : ['header', 'zones', 'gallery', 'cta']
  );
  const [menuOrder, setMenuOrder] = useState<string[]>(
    c?.menuSectionOrder?.length
      ? c.menuSectionOrder
      : ['header', 'filterAndSearch', 'dietaryNote', 'bbqBanner']
  );
  const [reviewsOrder, setReviewsOrder] = useState<string[]>(
    c?.reviewsSectionOrder?.length
      ? c.reviewsSectionOrder
      : ['header', 'reviewsList', 'submissionForm']
  );
  const [newsOrder, setNewsOrder] = useState<string[]>(
    c?.newsSectionOrder?.length
      ? c.newsSectionOrder
      : ['header', 'newsEvents', 'faqAccordion']
  );
  const [contactOrder, setContactOrder] = useState<string[]>(
    c?.contactSectionOrder?.length
      ? c.contactSectionOrder
      : ['header', 'quickInfo', 'contactForm', 'mapEmbed']
  );

  // ---------------- Universal Section Layouts & Visibility Maps ----------------
  const [sectionLayouts, setSectionLayouts] = useState<Record<string, string>>(
    (c?.sectionLayouts as Record<string, string>) || {}
  );
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>(
    (c?.sectionVisibility as Record<string, boolean>) || {}
  );

  const moveSection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    direction: 'up' | 'down'
  ) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const next = [...list];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setList(next);
  };

  const isSectionEnabled = (key: string) => sectionVisibility[key] !== false;

  const toggleSection = (key: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  const changeLayoutVariant = (key: string, variant: string) => {
    setSectionLayouts((prev) => ({
      ...prev,
      [key]: variant,
    }));
  };

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
  const [menuShowPrices, setMenuShowPrices] = useState<boolean>(c?.menuShowPrices ?? true);
  const [menuShowAddToCart, setMenuShowAddToCart] = useState<boolean>(c?.menuShowAddToCart ?? true);

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

  // ---------------- Page 6: Tin tuc & FAQ (/su-kien) ----------------
  const [newsEyebrow, setNewsEyebrow] = useState(c?.newsEyebrow || 'BẢN TIN SINH THÁI & GIẢI ĐÁP');
  const [newsEyebrowEn, setNewsEyebrowEn] = useState(c?.newsEyebrowEn || 'ECOLOGICAL DISPATCH & FAQ');
  const [newsTitle, setNewsTitle] = useState(c?.newsTitle || 'Tin Tức Hoạt Động & Câu Hỏi Thường Gặp');
  const [newsTitleEn, setNewsTitleEn] = useState(c?.newsTitleEn || 'Events, News & Frequently Asked Questions');
  const [newsSubtitle, setNewsSubtitle] = useState(c?.newsSubtitle || 'Cập nhật nhịp sống bên suối và thông tin hướng dẫn chi tiết dành cho bạn');
  const [newsSubtitleEn, setNewsSubtitleEn] = useState(c?.newsSubtitleEn || 'Updates on streamside happenings and helpful guide notes for your visit');
  const [newsIntro, setNewsIntro] = useState(c?.newsIntro || 'Xem lịch trình các hoạt động âm nhạc, mùa vụ hoa nở và câu trả lời cho các thắc mắc về đường đi, thực đơn, bãi đỗ xe.');
  const [newsIntroEn, setNewsIntroEn] = useState(c?.newsIntroEn || 'Check schedules for music sessions, seasonal blooms, and clear answers regarding parking, menu, and directions.');
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
          // Page-Level Visibility Toggles (Module 1)
          showPageAbout,
          showPageSpace,
          showPageMenu,
          showPageReviews,
          showPageNews,
          showPageContact,

          // Universal Section Orders
          homeSectionOrder: homeOrder,
          aboutSectionOrder: aboutOrder,
          spaceSectionOrder: spaceOrder,
          menuSectionOrder: menuOrder,
          reviewsSectionOrder: reviewsOrder,
          newsSectionOrder: newsOrder,
          contactSectionOrder: contactOrder,

          // Universal Layout Variants & Visibility
          sectionLayouts,
          sectionVisibility,

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
          menuShowPrices,
          menuShowAddToCart,

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
            Tự do sắp xếp thứ tự khu vực (Move Up/Down), bật/tắt hiển thị từng section, thay đổi kiểu bố cục và biên tập song ngữ 100%.
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
          {homeOrder.map((sectionId, idx) => {
            if (sectionId === 'hero') {
              return (
                <SectionCard
                  key="hero"
                  sectionId="hero"
                  title={`Khu Vực ${idx + 1}: Botanical Magazine Hero (${activeLangTab.toUpperCase()})`}
                  subtitle="Dòng chữ thương hiệu lớn, khẩu hiệu suối và đoạn giới thiệu mở đầu trang chủ."
                  icon={Sparkles}
                  enabled={isSectionEnabled('home-hero')}
                  onToggle={() => toggleSection('home-hero')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['home-hero'] || 'split-right'}
                  layoutOptions={[
                    { value: 'split-right', label: 'Ảnh bên phải' },
                    { value: 'split-left', label: 'Ảnh bên trái' },
                    { value: 'full-cover', label: 'Nền toàn khung' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('home-hero', val)}
                >
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
                </SectionCard>
              );
            }

            if (sectionId === 'philosophy') {
              return (
                <SectionCard
                  key="philosophy"
                  sectionId="philosophy"
                  title={`Khu Vực ${idx + 1}: Triết Lý Bên Dòng Suối (${activeLangTab.toUpperCase()})`}
                  subtitle="Lời dẫn về không gian nguyên bản, 3 thẻ giá trị suối mát & cà phê mộc bazan."
                  icon={BookOpen}
                  enabled={isSectionEnabled('home-philosophy')}
                  onToggle={() => toggleSection('home-philosophy')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['home-philosophy'] || '3-cols'}
                  layoutOptions={[
                    { value: '3-cols', label: '3 cột thẻ' },
                    { value: '2-cols', label: '2 cột tạp chí' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('home-philosophy', val)}
                >
                  {activeLangTab === 'vi' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Dòng Eyebrow:</label>
                          <input
                            type="text"
                            value={philosophyEyebrow}
                            onChange={(e) => setPhilosophyEyebrow(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Tiêu Đề Khu Vực:</label>
                          <input
                            type="text"
                            value={philosophyTitle}
                            onChange={(e) => setPhilosophyTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Câu Dẫn Mở Đầu (Lead):</label>
                        <input
                          type="text"
                          value={philosophyLead}
                          onChange={(e) => setPhilosophyLead(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 italic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Đoạn Văn Câu Chuyện Suối:</label>
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
                      {cards.map((card, cardIdx) => (
                        <div key={cardIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <span className="text-[11px] font-mono text-emerald-700 font-bold block">
                            Thẻ 0{cardIdx + 1}
                          </span>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              {activeLangTab === 'vi' ? 'Tiêu đề thẻ (VI):' : 'Card Title (EN):'}
                            </label>
                            <input
                              type="text"
                              value={activeLangTab === 'vi' ? card.title : (card.titleEn || '')}
                              onChange={(e) =>
                                handleCardChange(cardIdx, activeLangTab === 'vi' ? 'title' : 'titleEn', e.target.value)
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
                                handleCardChange(cardIdx, activeLangTab === 'vi' ? 'desc' : 'descEn', e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'featuredMenu') {
              return (
                <SectionCard
                  key="featuredMenu"
                  sectionId="featuredMenu"
                  title={`Khu Vực ${idx + 1}: Thực Đơn Nổi Bật (Menu Preview)`}
                  subtitle="Hiển thị các món cà phê mộc và thức uống thảo mộc best-seller trên trang chủ."
                  icon={UtensilsCrossed}
                  enabled={isSectionEnabled('home-featuredMenu') && showFeaturedMenu}
                  onToggle={() => {
                    toggleSection('home-featuredMenu');
                    setShowFeaturedMenu(!showFeaturedMenu);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['home-featuredMenu'] || '3-cols'}
                  layoutOptions={[
                    { value: '3-cols', label: 'Lưới 3 cột' },
                    { value: 'compact', label: 'Danh sách tinh gọn' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('home-featuredMenu', val)}
                >
                  <p className="text-xs text-slate-600">
                    Phần này tự động lấy các món được đánh dấu nổi bật từ <strong>Thực Đơn 7 Danh Mục (67 món)</strong>. Bạn có thể thay đổi kiểu hiển thị lưới 3 cột hoặc danh sách tinh gọn phía trên.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'featuredSpace') {
              return (
                <SectionCard
                  key="featuredSpace"
                  sectionId="featuredSpace"
                  title={`Khu Vực ${idx + 1}: Không Gian 30 Bản Khắc (Gallery Preview)`}
                  subtitle="Xem trước các bản khắc không gian suối mát và vòm lá Cẩm Cù."
                  icon={Camera}
                  enabled={isSectionEnabled('home-featuredSpace') && showFeaturedSpace}
                  onToggle={() => {
                    toggleSection('home-featuredSpace');
                    setShowFeaturedSpace(!showFeaturedSpace);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['home-featuredSpace'] || 'masonry'}
                  layoutOptions={[
                    { value: 'masonry', label: 'Lưới tạp chí' },
                    { value: 'carousel', label: 'Băng chuyền ngang' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('home-featuredSpace', val)}
                >
                  <p className="text-xs text-slate-600">
                    Khu vực trích xuất 6 bản khắc tiêu biểu từ <strong>Thư Viện 30 Bản Khắc Không Gian</strong> kèm hiệu ứng mở ảnh sắc nét.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'featuredReviews') {
              return (
                <SectionCard
                  key="featuredReviews"
                  sectionId="featuredReviews"
                  title={`Khu Vực ${idx + 1}: Đánh Giá Khách Hàng (Testimonials Preview)`}
                  subtitle="Các lời cảm nhận thực tế từ thực khách ghé quán đã được phê duyệt."
                  icon={Star}
                  enabled={isSectionEnabled('home-featuredReviews') && showFeaturedReviews}
                  onToggle={() => {
                    toggleSection('home-featuredReviews');
                    setShowFeaturedReviews(!showFeaturedReviews);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Phần đánh giá hiển thị carousel xoay vòng các nhận xét 5 sao thực tế từ khách hàng kèm chỉ số đề xuất của quán.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'featuredEvents') {
              return (
                <SectionCard
                  key="featuredEvents"
                  sectionId="featuredEvents"
                  title={`Khu Vực ${idx + 1}: Bản Tin & Sự Kiện (News Preview)`}
                  subtitle="Các chương trình nông sản, mùa hoa cẩm cù nở và thông tin hoạt động."
                  icon={Newspaper}
                  enabled={isSectionEnabled('home-featuredEvents') && showFeaturedEvents}
                  onToggle={() => {
                    toggleSection('home-featuredEvents');
                    setShowFeaturedEvents(!showFeaturedEvents);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Hiển thị các bài viết và sự kiện đang hoạt động từ danh mục Bản Tin & Sự Kiện.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'ctaBanner') {
              return (
                <SectionCard
                  key="ctaBanner"
                  sectionId="ctaBanner"
                  title={`Khu Vực ${idx + 1}: Banner Kêu Gọi Hành Động (CTA Banner)`}
                  subtitle="Khối banner chân trang kêu gọi khách ghé thăm hoặc gọi điện đặt chỗ BBQ bên suối."
                  icon={MapPin}
                  enabled={isSectionEnabled('home-ctaBanner')}
                  onToggle={() => toggleSection('home-ctaBanner')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < homeOrder.length - 1}
                  onMoveUp={() => moveSection(homeOrder, setHomeOrder, idx, 'up')}
                  onMoveDown={() => moveSection(homeOrder, setHomeOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Banner hành động chân trang chứa 2 nút chính: Gọi Hotline (0382 851 688) và Mở Google Maps chỉ đường đến Hẻm 437 Hùng Vương.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 2: GIỚI THIỆU (/gioi-thieu)
      ========================================================================= */}
      {currentSubPage === 'page-about' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Giới thiệu"
            enabled={showPageAbout}
            onToggle={() => setShowPageAbout(!showPageAbout)}
          />

          {aboutOrder.map((sectionId, idx) => {
            if (sectionId === 'banner') {
              return (
                <SectionCard
                  key="banner"
                  sectionId="banner"
                  title={`Khu Vực ${idx + 1}: Banner Đầu Trang Giới Thiệu`}
                  subtitle="Tiêu đề trang, phụ đề và lời dẫn mở đầu của trang giới thiệu."
                  icon={Sparkles}
                  enabled={isSectionEnabled('about-banner')}
                  onToggle={() => toggleSection('about-banner')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < aboutOrder.length - 1}
                  onMoveUp={() => moveSection(aboutOrder, setAboutOrder, idx, 'up')}
                  onMoveDown={() => moveSection(aboutOrder, setAboutOrder, idx, 'down')}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Tiêu Đề Trang (VI):' : 'Page Title (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? brandStoryTitle : brandStoryTitleEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setBrandStoryTitle(e.target.value) : setBrandStoryTitleEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Phụ Đề In Nghiêng (VI):' : 'Subtitle (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? brandStorySubtitle : brandStorySubtitleEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setBrandStorySubtitle(e.target.value) : setBrandStorySubtitleEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'brandStory') {
              return (
                <SectionCard
                  key="brandStory"
                  sectionId="brandStory"
                  title={`Khu Vực ${idx + 1}: Câu Chuyện Thương Hiệu Cẩm Cù House`}
                  subtitle="Đoạn văn tự sự về con suối, giọt cà phê mộc và ảnh đại diện thương hiệu."
                  icon={BookOpen}
                  enabled={isSectionEnabled('about-brandStory')}
                  onToggle={() => toggleSection('about-brandStory')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < aboutOrder.length - 1}
                  onMoveUp={() => moveSection(aboutOrder, setAboutOrder, idx, 'up')}
                  onMoveDown={() => moveSection(aboutOrder, setAboutOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['about-brandStory'] || 'split-left'}
                  layoutOptions={[
                    { value: 'split-left', label: 'Ảnh trái - Chữ phải' },
                    { value: 'split-right', label: 'Chữ trái - Ảnh phải' },
                    { value: 'single-col', label: '1 cột tạp chí' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('about-brandStory', val)}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Nội dung câu chuyện (VI):' : 'Brand Story Paragraph (EN):'}
                      </label>
                      <textarea
                        rows={4}
                        value={activeLangTab === 'vi' ? brandStoryContent : brandStoryContentEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setBrandStoryContent(e.target.value) : setBrandStoryContentEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Triết lý sinh thái (VI):' : 'Eco Philosophy (EN):'}
                      </label>
                      <textarea
                        rows={3}
                        value={activeLangTab === 'vi' ? brandStoryPhilosophy : brandStoryPhilosophyEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setBrandStoryPhilosophy(e.target.value) : setBrandStoryPhilosophyEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>

                    {/* Image uploader */}
                    <div className="pt-2">
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-2">
                        Ảnh Minh Họa Câu Chuyện (Vercel Blob):
                      </label>
                      <div className="flex items-center gap-4">
                        {brandStoryImageUrl && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img src={brandStoryImageUrl} alt="Story Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <input
                            ref={brandFileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'story', (url) => setBrandStoryImageUrl(url))}
                          />
                          <button
                            type="button"
                            onClick={() => brandFileInputRef.current?.click()}
                            disabled={uploadingField === 'story'}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1.5 border border-slate-200"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingField === 'story' ? 'Đang tải...' : 'Tải ảnh mới'}</span>
                          </button>
                          <p className="text-[11px] text-slate-500">Định dạng JPG, PNG, WebP (tối đa 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'commitments') {
              return (
                <SectionCard
                  key="commitments"
                  sectionId="commitments"
                  title={`Khu Vực ${idx + 1}: Tầm Nhìn & Sứ Mệnh Sinh Thái`}
                  subtitle="Tuyên ngôn bảo tồn thiên nhiên và cam kết nông sản sạch."
                  icon={Sparkles}
                  enabled={isSectionEnabled('about-commitments')}
                  onToggle={() => toggleSection('about-commitments')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < aboutOrder.length - 1}
                  onMoveUp={() => moveSection(aboutOrder, setAboutOrder, idx, 'up')}
                  onMoveDown={() => moveSection(aboutOrder, setAboutOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Tiêu Đề Tầm Nhìn (VI):' : 'Vision Title (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? visionTitle : visionTitleEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setVisionTitle(e.target.value) : setVisionTitleEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Nội Dung Tầm Nhìn (VI):' : 'Vision Statement (EN):'}
                      </label>
                      <textarea
                        rows={2}
                        value={activeLangTab === 'vi' ? visionDesc : visionDescEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setVisionDesc(e.target.value) : setVisionDescEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'milestones') {
              return (
                <SectionCard
                  key="milestones"
                  sectionId="milestones"
                  title={`Khu Vực ${idx + 1}: Cột Mốc Hành Trình (Milestones Block)`}
                  subtitle="Dòng thời gian các bước phát triển của Cẩm Cù House."
                  icon={Layers}
                  enabled={isSectionEnabled('about-milestones') && showStoryMilestones}
                  onToggle={() => {
                    toggleSection('about-milestones');
                    setShowStoryMilestones(!showStoryMilestones);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < aboutOrder.length - 1}
                  onMoveUp={() => moveSection(aboutOrder, setAboutOrder, idx, 'up')}
                  onMoveDown={() => moveSection(aboutOrder, setAboutOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['about-milestones'] || 'timeline-vertical'}
                  layoutOptions={[
                    { value: 'timeline-vertical', label: 'Dòng thời gian dọc' },
                    { value: 'cards-horizontal', label: 'Thẻ ngang' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('about-milestones', val)}
                >
                  <p className="text-xs text-slate-600">
                    Khu vực tự động kết nối và hiển thị dữ liệu từ tab <strong>Cột Mốc & Đội Ngũ</strong> trong Module 1.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'team') {
              return (
                <SectionCard
                  key="team"
                  sectionId="team"
                  title={`Khu Vực ${idx + 1}: Đội Ngũ Cẩm Cù (Team Members Block)`}
                  subtitle="Giới thiệu những người bạn đồng hành bên dòng suối."
                  icon={BookOpen}
                  enabled={isSectionEnabled('about-team') && showTeamMembers}
                  onToggle={() => {
                    toggleSection('about-team');
                    setShowTeamMembers(!showTeamMembers);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < aboutOrder.length - 1}
                  onMoveUp={() => moveSection(aboutOrder, setAboutOrder, idx, 'up')}
                  onMoveDown={() => moveSection(aboutOrder, setAboutOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Khu vực tự động kết nối và hiển thị các thành viên từ tab <strong>Cột Mốc & Đội Ngũ</strong>.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 3: KHÔNG GIAN (/khong-gian)
      ========================================================================= */}
      {currentSubPage === 'page-space' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Không gian"
            enabled={showPageSpace}
            onToggle={() => setShowPageSpace(!showPageSpace)}
          />

          {spaceOrder.map((sectionId, idx) => {
            if (sectionId === 'header') {
              return (
                <SectionCard
                  key="header"
                  sectionId="header"
                  title={`Khu Vực ${idx + 1}: Header & Lời Dẫn Bộ Sưu Tập Không Gian`}
                  subtitle="Tiêu đề, dòng dẫn và mô tả mở đầu thư viện 30 bản khắc không gian."
                  icon={Camera}
                  enabled={isSectionEnabled('space-header')}
                  onToggle={() => toggleSection('space-header')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < spaceOrder.length - 1}
                  onMoveUp={() => moveSection(spaceOrder, setSpaceOrder, idx, 'up')}
                  onMoveDown={() => moveSection(spaceOrder, setSpaceOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Dòng Eyebrow (VI):' : 'Eyebrow (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? spaceEyebrow : spaceEyebrowEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setSpaceEyebrow(e.target.value) : setSpaceEyebrowEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Tiêu Đề Trang (VI):' : 'Title (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? spaceTitle : spaceTitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setSpaceTitle(e.target.value) : setSpaceTitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Phụ Đề (VI):' : 'Subtitle (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? spaceSubtitle : spaceSubtitleEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setSpaceSubtitle(e.target.value) : setSpaceSubtitleEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Đoạn Văn Giới Thiệu (VI):' : 'Intro Narrative (EN):'}
                      </label>
                      <textarea
                        rows={3}
                        value={activeLangTab === 'vi' ? spaceIntro : spaceIntroEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setSpaceIntro(e.target.value) : setSpaceIntroEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'zones') {
              return (
                <SectionCard
                  key="zones"
                  sectionId="zones"
                  title={`Khu Vực ${idx + 1}: Các Phân Khu Trải Nghiệm (Bờ suối, Nhà gỗ, Sân BBQ, Góc trà)`}
                  subtitle="Phân khu trực quan hướng dẫn khách chọn vị trí ngồi ưa thích."
                  icon={Layers}
                  enabled={isSectionEnabled('space-zones')}
                  onToggle={() => toggleSection('space-zones')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < spaceOrder.length - 1}
                  onMoveUp={() => moveSection(spaceOrder, setSpaceOrder, idx, 'up')}
                  onMoveDown={() => moveSection(spaceOrder, setSpaceOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['space-zones'] || 'alternating'}
                  layoutOptions={[
                    { value: 'alternating', label: 'Thẻ xen kẽ' },
                    { value: '2-cols', label: 'Lưới 2 cột' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('space-zones', val)}
                >
                  <p className="text-xs text-slate-600">
                    Phần này giới thiệu 4 phân khu chủ đạo: <strong>Bờ Suối Đá</strong>, <strong>Nhà Gỗ Mộc</strong>, <strong>Sân Vườn BBQ</strong> và <strong>Góc Trà Lan Cẩm Cù</strong>.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'gallery') {
              return (
                <SectionCard
                  key="gallery"
                  sectionId="gallery"
                  title={`Khu Vực ${idx + 1}: Thư Viện 30 Bản Khắc Không Gian (Spatial Gallery)`}
                  subtitle="Bộ sưu tập ảnh chất lượng cao 30 góc quán bên suối mát."
                  icon={Camera}
                  enabled={isSectionEnabled('space-gallery')}
                  onToggle={() => toggleSection('space-gallery')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < spaceOrder.length - 1}
                  onMoveUp={() => moveSection(spaceOrder, setSpaceOrder, idx, 'up')}
                  onMoveDown={() => moveSection(spaceOrder, setSpaceOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['space-gallery'] || 'masonry'}
                  layoutOptions={[
                    { value: 'masonry', label: 'Lưới Masonry' },
                    { value: 'grid-3', label: 'Lưới đều 3 cột' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('space-gallery', val)}
                >
                  <p className="text-xs text-slate-600">
                    Dữ liệu 30 bản khắc được quản lý đồng bộ tại tab <strong>Thư Viện 30 Bản Khắc</strong> của Module 1.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'cta') {
              return (
                <SectionCard
                  key="cta"
                  sectionId="cta"
                  title={`Khu Vực ${idx + 1}: Banner Đặt Chỗ & Chụp Ảnh Nghệ Thuật`}
                  subtitle="Banner liên hệ đặt góc bàn view suối hoặc chụp hình lưu niệm."
                  icon={Sparkles}
                  enabled={isSectionEnabled('space-cta')}
                  onToggle={() => toggleSection('space-cta')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < spaceOrder.length - 1}
                  onMoveUp={() => moveSection(spaceOrder, setSpaceOrder, idx, 'up')}
                  onMoveDown={() => moveSection(spaceOrder, setSpaceOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Nút hành động chuyển tiếp nhanh tới hotline 038 285 1688 và chỉ đường Google Maps.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 4: THỰC ĐƠN (/thuc-don)
      ========================================================================= */}
      {currentSubPage === 'page-menu' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Thực đơn"
            enabled={showPageMenu}
            onToggle={() => setShowPageMenu(!showPageMenu)}
          />

          {menuOrder.map((sectionId, idx) => {
            if (sectionId === 'header') {
              return (
                <SectionCard
                  key="header"
                  sectionId="header"
                  title={`Khu Vực ${idx + 1}: Header & Triết Lý Pha Chế (67 Món)`}
                  subtitle="Tiêu đề, dòng dẫn và thông báo phục vụ tại suối."
                  icon={UtensilsCrossed}
                  enabled={isSectionEnabled('menu-header')}
                  onToggle={() => toggleSection('menu-header')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < menuOrder.length - 1}
                  onMoveUp={() => moveSection(menuOrder, setMenuOrder, idx, 'up')}
                  onMoveDown={() => moveSection(menuOrder, setMenuOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Dòng Eyebrow (VI):' : 'Eyebrow (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? menuEyebrow : menuEyebrowEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setMenuEyebrow(e.target.value) : setMenuEyebrowEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Tiêu Đề Thực Đơn (VI):' : 'Title (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? menuTitle : menuTitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setMenuTitle(e.target.value) : setMenuTitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Phụ Đề (VI):' : 'Subtitle (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? menuSubtitle : menuSubtitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setMenuSubtitle(e.target.value) : setMenuSubtitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Thông Báo Phục Vụ Tại Suối (VI):' : 'Streamside Notice (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? menuNotice : menuNoticeEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setMenuNotice(e.target.value) : setMenuNoticeEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Lời Dẫn Giới Thiệu (VI):' : 'Intro Text (EN):'}
                      </label>
                      <textarea
                        rows={2}
                        value={activeLangTab === 'vi' ? menuIntro : menuIntroEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setMenuIntro(e.target.value) : setMenuIntroEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'filterAndSearch') {
              return (
                <SectionCard
                  key="filterAndSearch"
                  sectionId="filterAndSearch"
                  title={`Khu Vực ${idx + 1}: Thanh Lọc Danh Mục & Tùy Chọn Hiển Thị`}
                  subtitle="Tùy biến hiển thị giá tiền, nút Thêm vào giỏ và bố cục tab thực đơn."
                  icon={Layers}
                  enabled={isSectionEnabled('menu-filterAndSearch')}
                  onToggle={() => toggleSection('menu-filterAndSearch')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < menuOrder.length - 1}
                  onMoveUp={() => moveSection(menuOrder, setMenuOrder, idx, 'up')}
                  onMoveDown={() => moveSection(menuOrder, setMenuOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['menu-filterAndSearch'] || 'tabs-horizontal'}
                  layoutOptions={[
                    { value: 'tabs-horizontal', label: 'Tab ngang' },
                    { value: 'grouped', label: 'Danh sách phân nhóm' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('menu-filterAndSearch', val)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Hiển Thị Giá Tiền Món</span>
                        <span className="text-[11px] text-slate-500">Show Item Prices (VND/USD)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMenuShowPrices(!menuShowPrices)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          menuShowPrices ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            menuShowPrices ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Nút &quot;Thêm vào giỏ&quot;</span>
                        <span className="text-[11px] text-slate-500">Add to Cart Button</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMenuShowAddToCart(!menuShowAddToCart)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          menuShowAddToCart ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            menuShowAddToCart ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'dietaryNote') {
              return (
                <SectionCard
                  key="dietaryNote"
                  sectionId="dietaryNote"
                  title={`Khu Vực ${idx + 1}: Ghi Chú Nguyên Liệu & Khẩu Vị`}
                  subtitle="Thông tin nguồn gốc nông sản hữu cơ, cà phê rang củi và thảo mộc tự nhiên."
                  icon={Sparkles}
                  enabled={isSectionEnabled('menu-dietaryNote')}
                  onToggle={() => toggleSection('menu-dietaryNote')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < menuOrder.length - 1}
                  onMoveUp={() => moveSection(menuOrder, setMenuOrder, idx, 'up')}
                  onMoveDown={() => moveSection(menuOrder, setMenuOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Phần ghi chú khẳng định tiêu chuẩn không phẩm màu hay chất tạo mùi nhân tạo, phục vụ sức khỏe thực khách.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'bbqBanner') {
              return (
                <SectionCard
                  key="bbqBanner"
                  sectionId="bbqBanner"
                  title={`Khu Vực ${idx + 1}: Banner Đặt Tiệc BBQ & Gọi Mang Về (Takeaway)`}
                  subtitle="Hộp liên hệ đặt tiệc nướng BBQ bờ suối và đóng gói mang về."
                  icon={UtensilsCrossed}
                  enabled={isSectionEnabled('menu-bbqBanner')}
                  onToggle={() => toggleSection('menu-bbqBanner')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < menuOrder.length - 1}
                  onMoveUp={() => moveSection(menuOrder, setMenuOrder, idx, 'up')}
                  onMoveDown={() => moveSection(menuOrder, setMenuOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Chứa số hotline gọi trước để pha chế sẵn hoặc chuẩn bị tiệc BBQ bờ suối không phải chờ đợi.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 5: KHÁCH HÀNG (/khach-hang)
      ========================================================================= */}
      {currentSubPage === 'page-reviews' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Khách hàng"
            enabled={showPageReviews}
            onToggle={() => setShowPageReviews(!showPageReviews)}
          />

          {reviewsOrder.map((sectionId, idx) => {
            if (sectionId === 'header') {
              return (
                <SectionCard
                  key="header"
                  sectionId="header"
                  title={`Khu Vực ${idx + 1}: Header & Chỉ Số Hài Lòng`}
                  subtitle="Tiêu đề trang cảm nhận thực khách và lời mở đầu."
                  icon={Star}
                  enabled={isSectionEnabled('reviews-header')}
                  onToggle={() => toggleSection('reviews-header')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < reviewsOrder.length - 1}
                  onMoveUp={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Dòng Eyebrow (VI):' : 'Eyebrow (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? reviewsEyebrow : reviewsEyebrowEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setReviewsEyebrow(e.target.value) : setReviewsEyebrowEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Tiêu Đề Trang (VI):' : 'Title (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? reviewsTitle : reviewsTitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setReviewsTitle(e.target.value) : setReviewsTitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Phụ Đề (VI):' : 'Subtitle (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? reviewsSubtitle : reviewsSubtitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setReviewsSubtitle(e.target.value) : setReviewsSubtitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Lời Kêu Gọi Viết Cảm Nhận (VI):' : 'Review Prompt (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? reviewsPrompt : reviewsPromptEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setReviewsPrompt(e.target.value) : setReviewsPromptEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Đoạn Văn Giới Thiệu (VI):' : 'Intro Text (EN):'}
                      </label>
                      <textarea
                        rows={2}
                        value={activeLangTab === 'vi' ? reviewsIntro : reviewsIntroEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setReviewsIntro(e.target.value) : setReviewsIntroEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'reviewsList') {
              return (
                <SectionCard
                  key="reviewsList"
                  sectionId="reviewsList"
                  title={`Khu Vực ${idx + 1}: Danh Sách Đánh Giá Thực Tế`}
                  subtitle="Hiển thị lưới các cảm nhận đã duyệt của khách hàng ghé thăm quán."
                  icon={Star}
                  enabled={isSectionEnabled('reviews-reviewsList')}
                  onToggle={() => toggleSection('reviews-reviewsList')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < reviewsOrder.length - 1}
                  onMoveUp={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['reviews-reviewsList'] || '2-cols'}
                  layoutOptions={[
                    { value: '2-cols', label: 'Lưới 2 cột' },
                    { value: '3-cols', label: 'Lưới 3 cột' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('reviews-reviewsList', val)}
                >
                  <p className="text-xs text-slate-600">
                    Đánh giá được quản lý, duyệt và lọc spam an toàn tại <strong>Hộp Thư, Đánh Giá & Tiếp Thị</strong> (Module 3).
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'submissionForm') {
              return (
                <SectionCard
                  key="submissionForm"
                  sectionId="submissionForm"
                  title={`Khu Vực ${idx + 1}: Khung Gửi Đánh Giá Mới`}
                  subtitle="Form cho phép thực khách để lại cảm nhận, xếp hạng sao và ngày ghé thăm."
                  icon={Sparkles}
                  enabled={isSectionEnabled('reviews-submissionForm')}
                  onToggle={() => toggleSection('reviews-submissionForm')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < reviewsOrder.length - 1}
                  onMoveUp={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(reviewsOrder, setReviewsOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Form được tích hợp sẵn Anti-Spam Shield (Honeypot + Proof-of-Work Challenge) để ngăn chặn bot spam tự động.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 6: TIN TỨC & FAQ (/su-kien)
      ========================================================================= */}
      {currentSubPage === 'page-news' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Tin tức & FAQ"
            enabled={showPageNews}
            onToggle={() => setShowPageNews(!showPageNews)}
          />

          {newsOrder.map((sectionId, idx) => {
            if (sectionId === 'header') {
              return (
                <SectionCard
                  key="header"
                  sectionId="header"
                  title={`Khu Vực ${idx + 1}: Header Trang Tin Tức & FAQ`}
                  subtitle="Tiêu đề, dòng dẫn và mô tả nhịp sống bên suối."
                  icon={Newspaper}
                  enabled={isSectionEnabled('news-header')}
                  onToggle={() => toggleSection('news-header')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < newsOrder.length - 1}
                  onMoveUp={() => moveSection(newsOrder, setNewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(newsOrder, setNewsOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Dòng Eyebrow (VI):' : 'Eyebrow (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? newsEyebrow : newsEyebrowEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setNewsEyebrow(e.target.value) : setNewsEyebrowEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Tiêu Đề Trang (VI):' : 'Title (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? newsTitle : newsTitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setNewsTitle(e.target.value) : setNewsTitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Phụ Đề (VI):' : 'Subtitle (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? newsSubtitle : newsSubtitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setNewsSubtitle(e.target.value) : setNewsSubtitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Đoạn Văn Giới Thiệu (VI):' : 'Intro Text (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? newsIntro : newsIntroEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setNewsIntro(e.target.value) : setNewsIntroEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'newsEvents') {
              return (
                <SectionCard
                  key="newsEvents"
                  sectionId="newsEvents"
                  title={`Khu Vực ${idx + 1}: Tin Tức & Hoạt Động Bên Suối`}
                  subtitle="Hiển thị danh sách các bài viết nhịp sống và sự kiện bên dòng suối."
                  icon={Newspaper}
                  enabled={isSectionEnabled('news-newsEvents') && showNewsEvents}
                  onToggle={() => {
                    toggleSection('news-newsEvents');
                    setShowNewsEvents(!showNewsEvents);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < newsOrder.length - 1}
                  onMoveUp={() => moveSection(newsOrder, setNewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(newsOrder, setNewsOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['news-newsEvents'] || 'cards-grid'}
                  layoutOptions={[
                    { value: 'cards-grid', label: 'Lưới thẻ' },
                    { value: 'list-horizontal', label: 'Danh sách ngang' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('news-newsEvents', val)}
                >
                  <p className="text-xs text-slate-600">
                    Bài viết tin tức và chương trình được quản lý tại tab <strong>Bản Tin & Sự Kiện</strong>.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'faqAccordion') {
              return (
                <SectionCard
                  key="faqAccordion"
                  sectionId="faqAccordion"
                  title={`Khu Vực ${idx + 1}: Câu Hỏi Thường Gặp (FAQ Accordion)`}
                  subtitle="Bộ câu hỏi giải đáp chi tiết về đường đi, giờ mở cửa và thực đơn."
                  icon={HelpCircle}
                  enabled={isSectionEnabled('news-faqAccordion') && showNewsFaq}
                  onToggle={() => {
                    toggleSection('news-faqAccordion');
                    setShowNewsFaq(!showNewsFaq);
                  }}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < newsOrder.length - 1}
                  onMoveUp={() => moveSection(newsOrder, setNewsOrder, idx, 'up')}
                  onMoveDown={() => moveSection(newsOrder, setNewsOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Các câu hỏi FAQ được quản lý và biên tập tại mục <strong>Trang Pháp Lý & FAQ</strong>.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* =========================================================================
          PAGE 7: LIÊN HỆ (/lien-he)
      ========================================================================= */}
      {currentSubPage === 'page-contact' && (
        <div className="space-y-6">
          <PageVisibilityCard
            pageTitle="Liên hệ"
            enabled={showPageContact}
            onToggle={() => setShowPageContact(!showPageContact)}
          />

          {contactOrder.map((sectionId, idx) => {
            if (sectionId === 'header') {
              return (
                <SectionCard
                  key="header"
                  sectionId="header"
                  title={`Khu Vực ${idx + 1}: Header & Hướng Dẫn Di Chuyển Hẻm 437 Hùng Vương`}
                  subtitle="Tiêu đề, phụ đề và ghi chú bãi đậu xe ô tô / xe máy."
                  icon={MapPin}
                  enabled={isSectionEnabled('contact-header')}
                  onToggle={() => toggleSection('contact-header')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < contactOrder.length - 1}
                  onMoveUp={() => moveSection(contactOrder, setContactOrder, idx, 'up')}
                  onMoveDown={() => moveSection(contactOrder, setContactOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Dòng Eyebrow (VI):' : 'Eyebrow (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? contactEyebrow : contactEyebrowEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setContactEyebrow(e.target.value) : setContactEyebrowEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Tiêu Đề Trang (VI):' : 'Title (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? contactTitle : contactTitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setContactTitle(e.target.value) : setContactTitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Địa Chỉ Quán (VI):' : 'Address Subtitle (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? contactSubtitle : contactSubtitleEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setContactSubtitle(e.target.value) : setContactSubtitleEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs italic"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          {activeLangTab === 'vi' ? 'Hướng Dẫn Vào Hẻm & Đỗ Xe (VI):' : 'Parking Guidance (EN):'}
                        </label>
                        <input
                          type="text"
                          value={activeLangTab === 'vi' ? contactDirectionsNote : contactDirectionsNoteEn}
                          onChange={(e) =>
                            activeLangTab === 'vi' ? setContactDirectionsNote(e.target.value) : setContactDirectionsNoteEn(e.target.value)
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Đoạn Văn Giới Thiệu Đường Đi (VI):' : 'Intro Text (EN):'}
                      </label>
                      <textarea
                        rows={2}
                        value={activeLangTab === 'vi' ? contactIntro : contactIntroEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setContactIntro(e.target.value) : setContactIntroEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'quickInfo') {
              return (
                <SectionCard
                  key="quickInfo"
                  sectionId="quickInfo"
                  title={`Khu Vực ${idx + 1}: Thẻ Thông Tin Liên Hệ Nhanh`}
                  subtitle="Hotline, Giờ mở cửa Thứ 2–5 07:00–18:00 & Thứ 6–CN 07:00–22:00."
                  icon={MapPin}
                  enabled={isSectionEnabled('contact-quickInfo')}
                  onToggle={() => toggleSection('contact-quickInfo')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < contactOrder.length - 1}
                  onMoveUp={() => moveSection(contactOrder, setContactOrder, idx, 'up')}
                  onMoveDown={() => moveSection(contactOrder, setContactOrder, idx, 'down')}
                  layoutVariant={sectionLayouts['contact-quickInfo'] || '3-cols'}
                  layoutOptions={[
                    { value: '3-cols', label: '3 cột' },
                    { value: '2-cols-map', label: '2 cột kèm bản đồ' },
                  ]}
                  onChangeLayout={(val) => changeLayoutVariant('contact-quickInfo', val)}
                >
                  <p className="text-xs text-slate-600">
                    Hiển thị các khối thông tin cốt lõi: <strong>Hotline: 038 285 1688 / 077 465 9000</strong>, <strong>Giờ Đón Khách</strong> và <strong>Tọa độ 11.99° N, 107.69° E</strong>.
                  </p>
                </SectionCard>
              );
            }

            if (sectionId === 'contactForm') {
              return (
                <SectionCard
                  key="contactForm"
                  sectionId="contactForm"
                  title={`Khu Vực ${idx + 1}: Form Gửi Lời Nhắn & Đặt Tiệc BBQ`}
                  subtitle="Form liên hệ trực tiếp gửi về hòm thư Admin và thông báo qua Gmail SMTP."
                  icon={Sparkles}
                  enabled={isSectionEnabled('contact-contactForm')}
                  onToggle={() => toggleSection('contact-contactForm')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < contactOrder.length - 1}
                  onMoveUp={() => moveSection(contactOrder, setContactOrder, idx, 'up')}
                  onMoveDown={() => moveSection(contactOrder, setContactOrder, idx, 'down')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        {activeLangTab === 'vi' ? 'Ghi Chú Đặt BBQ & Đoàn Đông (VI):' : 'BBQ Notice (EN):'}
                      </label>
                      <input
                        type="text"
                        value={activeLangTab === 'vi' ? contactBbqCallout : contactBbqCalloutEn}
                        onChange={(e) =>
                          activeLangTab === 'vi' ? setContactBbqCallout(e.target.value) : setContactBbqCalloutEn(e.target.value)
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                </SectionCard>
              );
            }

            if (sectionId === 'mapEmbed') {
              return (
                <SectionCard
                  key="mapEmbed"
                  sectionId="mapEmbed"
                  title={`Khu Vực ${idx + 1}: Bản Đồ Google Maps Nhúng`}
                  subtitle="Bản đồ tương tác chỉ đường chính xác tới Hẻm 437 Hùng Vương."
                  icon={MapPin}
                  enabled={isSectionEnabled('contact-mapEmbed')}
                  onToggle={() => toggleSection('contact-mapEmbed')}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < contactOrder.length - 1}
                  onMoveUp={() => moveSection(contactOrder, setContactOrder, idx, 'up')}
                  onMoveDown={() => moveSection(contactOrder, setContactOrder, idx, 'down')}
                >
                  <p className="text-xs text-slate-600">
                    Bản đồ nhúng Google Maps với tọa độ chính xác 11.98634, 107.69421 cùng nút điều hướng trực tiếp bằng Google Maps app.
                  </p>
                </SectionCard>
              );
            }

            return null;
          })}
        </div>
      )}
    </form>
  );
}
