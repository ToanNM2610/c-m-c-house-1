'use client';

import React, { useState, useRef } from 'react';
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
  Globe,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PhilosophyCard } from '@/types';

export default function AdminCMSHome() {
  const { data, refreshData } = useApp();
  const c = data.content;

  // Active edit language tab
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  // Hero Section (VI)
  const [heroEyebrow, setHeroEyebrow] = useState(c?.heroEyebrow || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY');
  const [heroTitle, setHeroTitle] = useState(c?.heroTitle || 'CẨM CÙ');
  const [heroSubtitle, setHeroSubtitle] = useState(c?.heroSubtitle || 'HOUSE');
  const [heroTagline, setHeroTagline] = useState(c?.heroTagline || 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Gia Nghĩa');
  const [heroDescription, setHeroDescription] = useState(c?.heroDescription || 'Tận hưởng không gian suối mát rượi quanh năm, view suối tự nhiên, hương vị cà phê muối đậm đà rang mộc bazan Đăk Nông cùng các thức uống thảo mộc lành sạch cho tâm hồn.');
  const [showHero3DBean, setShowHero3DBean] = useState<boolean>(c?.showHero3DBean ?? true);

  // Hero Section (EN)
  const [heroEyebrowEn, setHeroEyebrowEn] = useState(c?.heroEyebrowEn || 'BOTANICAL ECO-COFFEE & STREAMSIDE SANCTUARY');
  const [heroTitleEn, setHeroTitleEn] = useState(c?.heroTitleEn || 'CẨM CÙ');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(c?.heroSubtitleEn || 'HOUSE');
  const [heroTaglineEn, setHeroTaglineEn] = useState(c?.heroTaglineEn || 'Eco-coffee sanctuary beside a natural stream — Fresh, serene, and harmonized with rainforest nature in the heart of Gia Nghia.');
  const [heroDescriptionEn, setHeroDescriptionEn] = useState(c?.heroDescriptionEn || 'Experience year-round cool streamside breezes, natural waterfall views, authentic wood-roasted Dak Nong basalt coffee, and wholesome botanical herbal drinks for peace of mind.');

  // Philosophy Section (VI)
  const [philosophyEyebrow, setPhilosophyEyebrow] = useState(c?.philosophyEyebrow || 'VỀ KHÔNG GIAN BÊN SUỐI');
  const [philosophyTitle, setPhilosophyTitle] = useState(c?.philosophyTitle || 'Bình Yên Bên Bờ Suối Tự Nhiên');
  const [philosophyLead, setPhilosophyLead] = useState(c?.philosophyLead || 'Nơi bạn tạm gác lại những ồn ào phố thị để lắng nghe tiếng suối reo và thở cùng cây lá.');
  const [philosophyStory, setPhilosophyStory] = useState(c?.philosophyStory || 'Được bao bọc bởi những rặng hoa Cẩm Cù bản địa và thảm thực vật xanh mát, Cẩm Cù House được thiết kế mộc mạc, tôn trọng dòng chảy tự nhiên của con suối Đăk Nông.');

  // Philosophy Section (EN)
  const [philosophyEyebrowEn, setPhilosophyEyebrowEn] = useState(c?.philosophyEyebrowEn || 'ABOUT OUR STREAMSIDE SANCTUARY');
  const [philosophyTitleEn, setPhilosophyTitleEn] = useState(c?.philosophyTitleEn || 'Where Your Breath Slows Down by the Gentle Stream');
  const [philosophyLeadEn, setPhilosophyLeadEn] = useState(c?.philosophyLeadEn || 'In the heart of Gia Nghia mountain town, Cẩm Cù House is nestled down a tree-shaded slope at Alley 437 Hung Vuong, sitting peacefully along a gentle natural stream.');
  const [philosophyStoryEn, setPhilosophyStoryEn] = useState(c?.philosophyStoryEn || 'We preserve the pristine basalt rocks, rainforest canopy, and cool water mists to create a truly pure, serene haven for you and your loved ones.');

  // Philosophy Cards
  const [cards, setCards] = useState<PhilosophyCard[]>(
    c?.philosophyCards?.length
      ? c.philosophyCards
      : [
          { title: 'Dòng Suối Tự Nhiên Mát Lành', titleEn: 'Cool Natural Mountain Stream', desc: 'Bờ suối uốn lượn róc rách suốt 4 mùa mang đến hơi sương tinh khôi, xua tan cái oi bức và mệt mỏi.', descEn: 'A winding brook flowing gently year-round brings pure fresh mist, washing away all worldly heat and exhaustion.', iconName: 'Droplets' },
          { title: 'Hương Vị Bazan Đăk Nông', titleEn: 'Dak Nong Basalt Soil Flavors', desc: 'Hạt cà phê Robusta tuyển chọn chín mọng trên vùng đất đỏ núi lửa, rang mộc giữ trọn hương nồng đậm đà.', descEn: 'Sun-ripened Robusta beans harvested from volcanic red soils, wood-roasted to preserve rich botanical depth.', iconName: 'Coffee' },
          { title: 'Vòm Lá & Hoa Lan Cẩm Cù', titleEn: 'Wax Flower Vines & Canopy', desc: 'Không gian ngập tràn sắc xanh sinh thái, nơi những chùm hoa Cẩm Cù bung nở dịu dàng trong nắng sớm.', descEn: 'A lush ecological canopy where porcelain wax flower clusters bloom gracefully in the morning sun.', iconName: 'Sprout' },
        ]
  );

  // Brand Story (VI)
  const [brandStoryTitle, setBrandStoryTitle] = useState(c?.brandStoryTitle || 'Hành Trình Khởi Sinh Dưới Vòm Hoa Cẩm Cù');
  const [brandStorySubtitle, setBrandStorySubtitle] = useState(c?.brandStorySubtitle || 'Câu Chuyện Về Đất Đỏ Bazan, Con Suối Nhỏ & Giọt Cà Phê Mộc');
  const [brandStoryContent, setBrandStoryContent] = useState(c?.brandStoryContent || 'Đăk Nông không chỉ có thác đổ hùng vĩ và bạt ngàn nương rẫy, mà còn có những thung lũng xanh tĩnh lặng ẩn mình. Cẩm Cù House được sinh ra từ chính niềm say mê thiên nhiên và khát khao gìn giữ một khoảng trời xanh trong lành giữa lòng Gia Nghĩa.');
  const [brandStoryPhilosophy, setBrandStoryPhilosophy] = useState(c?.brandStoryPhilosophy || 'Triết lý của chúng tôi rất giản dị: "Xanh - Lành - Thuần Khiết". Mỗi ly cà phê mộc là hương vị của đất bazan núi lửa, mỗi ấm trà thảo mộc là sự chắt chiu từ hoa lá vườn nhà.');
  const [brandStoryImageUrl, setBrandStoryImageUrl] = useState(c?.brandStoryImageUrl || '');

  // Brand Story (EN)
  const [brandStoryTitleEn, setBrandStoryTitleEn] = useState(c?.brandStoryTitleEn || 'The Awakening Journey Beneath the Wax Plant Vines');
  const [brandStorySubtitleEn, setBrandStorySubtitleEn] = useState(c?.brandStorySubtitleEn || 'A Story of Basalt Soil, Gentle Streams & Pure Wood-Roasted Coffee');
  const [brandStoryContentEn, setBrandStoryContentEn] = useState(c?.brandStoryContentEn || 'Dak Nong is blessed not only with majestic waterfalls and boundless plantations, but also serene green valleys. Cẩm Cù House was born from our profound love for nature and a dream to preserve an untamed green haven in Gia Nghia.');
  const [brandStoryPhilosophyEn, setBrandStoryPhilosophyEn] = useState(c?.brandStoryPhilosophyEn || 'Our philosophy is simple: "Green - Wholesome - Pure". Every cup of wood-roasted coffee carries the volcanic richness of basalt soil; every herbal teapot is carefully harvested from home garden botanicals.');

  const [isUploadingBrandImage, setIsUploadingBrandImage] = useState(false);
  const brandFileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleBrandImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      alert('Vui lòng chọn ảnh định dạng JPG, PNG, WebP hoặc AVIF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng ảnh vượt quá 10MB.');
      return;
    }

    setIsUploadingBrandImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'brand');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.data?.url) {
        setBrandStoryImageUrl(json.data.url);
      } else {
        alert(json.error || 'Lỗi tải ảnh');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối máy chủ');
    } finally {
      setIsUploadingBrandImage(false);
      if (brandFileInputRef.current) brandFileInputRef.current.value = '';
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

    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          philosophyEyebrow,
          philosophyEyebrowEn,
          philosophyTitle,
          philosophyTitleEn,
          philosophyLead,
          philosophyLeadEn,
          philosophyStory,
          philosophyStoryEn,
          philosophyCards: cards,
          brandStoryTitle,
          brandStoryTitleEn,
          brandStorySubtitle,
          brandStorySubtitleEn,
          brandStoryContent,
          brandStoryContentEn,
          brandStoryPhilosophy,
          brandStoryPhilosophyEn,
          brandStoryImageUrl,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        await refreshData();
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert('Có lỗi khi lưu nội dung CMS.');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <Layout className="w-4 h-4" />
            <span>HEADLESS CMS • BILINGUAL SONG NGỮ VI / EN</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Quản Lý Nội Dung Trang Chủ & Câu Chuyện Cẩm Cù
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa song ngữ Tiếng Việt và Tiếng Anh trực tiếp cho Hero, Triết lý suối và Câu chuyện thương hiệu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switch Tabs for CMS Editing */}
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

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
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

      {/* Section 1: Hero Magazine CMS */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Khu Vực 1: Botanical Magazine Hero ({activeLangTab.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tiêu đề lớn dạng tạp chí, khẩu hiệu và nội dung giới thiệu.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600">
            Đang sửa: {activeLangTab === 'vi' ? 'Tiếng Việt' : 'English'}
          </span>
        </div>

        {activeLangTab === 'vi' ? (
          /* Vietnamese Hero Fields */
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        ) : (
          /* English Hero Fields */
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Philosophy Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Khu Vực 2: Triết Lý Bên Dòng Suối ({activeLangTab.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phần giới thiệu không gian bình yên và 3 thẻ giá trị cốt lõi.
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* 3 Cards */}
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

      {/* Section 3: Brand Story (/khong-gian) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Khu Vực 3: Câu Chuyện Thương Hiệu (/khong-gian) ({activeLangTab.toUpperCase()})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toàn bộ bài viết về hành trình khởi sinh dưới vòm hoa Cẩm Cù và ảnh đại diện.
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
          </div>
        )}

        {/* Brand Story Image */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-mono font-semibold text-slate-700">
            Ảnh Minh Họa Câu Chuyện Quán:
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-32 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {brandStoryImageUrl ? (
                <img src={brandStoryImageUrl} alt="Brand" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="space-y-2 flex-1">
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
                  onChange={handleBrandImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => brandFileInputRef.current?.click()}
                  disabled={isUploadingBrandImage}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-200"
                >
                  {isUploadingBrandImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingBrandImage ? 'Đang tải ảnh...' : 'Chọn ảnh từ máy tính'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
