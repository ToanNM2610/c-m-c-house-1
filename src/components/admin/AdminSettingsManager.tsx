'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  RefreshCw,
  MapPin,
  Phone,
  Clock,
  Share2,
  Box,
  Palette,
  Globe,
  Sun,
  Moon,
  RotateCcw,
  Upload,
  Sparkles,
  Type,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminSettingsManager() {
  const { data, refreshData } = useApp();
  const s = data.settings;

  // Basic info (VI)
  const [name, setName] = useState(s.name);
  const [tagline, setTagline] = useState(s.tagline);
  const [address, setAddress] = useState(s.address);
  const [socialProof, setSocialProof] = useState(s.socialProof || '100% Đề xuất (8/8 Đánh giá)');
  const [hotline1, setHotline1] = useState(s.hotlines?.[0] || '0382 851 688');
  const [hotline2, setHotline2] = useState(s.hotlines?.[1] || '0774 659 000');
  const [email, setEmail] = useState(s.email);
  const [hoursMonThu, setHoursMonThu] = useState(s.hours.monThu);
  const [hoursFriSun, setHoursFriSun] = useState(s.hours.friSun);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(s.links.googleMaps);
  const [facebookUrl, setFacebookUrl] = useState(s.links.facebook);
  const [tiktokUrl, setTiktokUrl] = useState(s.links.tiktok);
  const [youtubeUrl, setYoutubeUrl] = useState(s.links.youtube);
  const [announcement, setAnnouncement] = useState(s.announcement || '');
  const [footerDesc, setFooterDesc] = useState(s.footerDesc || 'Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên giữa lòng Gia Nghĩa, Đăk Nông.');

  // English translation fields (EN)
  const [taglineEn, setTaglineEn] = useState(s.taglineEn || 'Botanical Eco-Coffee & Streamside Sanctuary — Fresh, serene, and harmonized with rainforest nature in the heart of Gia Nghia.');
  const [addressEn, setAddressEn] = useState(s.addressEn || 'Alley 437 Hung Vuong, Nghia Thanh Ward, Gia Nghia City, Dak Nong');
  const [hoursMonThuEn, setHoursMonThuEn] = useState(s.hours.monThuEn || 'Mon – Thu: 07:00 – 18:00');
  const [hoursFriSunEn, setHoursFriSunEn] = useState(s.hours.friSunEn || 'Fri – Sun: 07:00 – 22:00');
  const [socialProofEn, setSocialProofEn] = useState(s.socialProofEn || '100% Recommended (Based on 8/8 customer reviews)');
  const [announcementEn, setAnnouncementEn] = useState(s.announcementEn || 'Acoustic live music by the stream every Saturday evening (19:30 - 21:30)');
  const [footerDescEn, setFooterDescEn] = useState(s.footerDescEn || 'Eco-coffee sanctuary nestled beside a natural stream in Gia Nghia, Dak Nong. Wood-roasted coffee, fresh herbal teas, and tranquil rainforest canopy.');

  // Theme & Language defaults
  const [defaultLanguage, setDefaultLanguage] = useState<'vi' | 'en'>(s.defaultLanguage || 'vi');
  const [defaultTheme, setDefaultTheme] = useState<'light' | 'dark' | 'auto'>(s.defaultTheme || 'light');
  const [fontPreset, setFontPreset] = useState<string>(s.fontPreset || 'sans-be-vietnam');
  const [lightBgHex, setLightBgHex] = useState(s.lightBgHex || '#F6F3EC');
  const [lightAccentHex, setLightAccentHex] = useState(s.lightAccentHex || '#2E5A3C');
  const [darkBgHex, setDarkBgHex] = useState(s.darkBgHex || '#111915');
  const [darkAccentHex, setDarkAccentHex] = useState(s.darkAccentHex || '#4C9A67');
  const [enableAnimations, setEnableAnimations] = useState<boolean>(s.enableAnimations ?? true);
  const [motionIntensity, setMotionIntensity] = useState<'OFF' | 'SUBTLE' | 'VIVID'>(
    (s.motionIntensity as 'OFF' | 'SUBTLE' | 'VIVID') || (s.enableAnimations === false ? 'OFF' : 'VIVID')
  );

  // Cinematic Intro Overlay Configuration (120fps)
  const [enableIntro, setEnableIntro] = useState<boolean>(s.enableIntro ?? true);
  const [introFrequency, setIntroFrequency] = useState<string>(s.introFrequency || 'SESSION');
  const [introEyebrowVi, setIntroEyebrowVi] = useState<string>(s.introEyebrowVi || 'GIA NGHĨA • ĐĂK NÔNG • HẺM 437 HÙNG VƯƠNG');
  const [introEyebrowEn, setIntroEyebrowEn] = useState<string>(s.introEyebrowEn || 'GIA NGHĨA • ĐĂK NÔNG • ALLEY 437 HÙNG VƯƠNG');
  const [introSubtitleVi, setIntroSubtitleVi] = useState<string>(s.introSubtitleVi || 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành');
  const [introSubtitleEn, setIntroSubtitleEn] = useState<string>(s.introSubtitleEn || 'Streamside Ecological Café — Clean & Lush Sanctuary');

  // Media & 3D model uploader
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'models' | 'images'>('models');
  const [bindTargetItemId, setBindTargetItemId] = useState<string>(data.menu[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleResetColors = () => {
    setFontPreset('sans-be-vietnam');
    setLightBgHex('#F6F3EC');
    setLightAccentHex('#2E5A3C');
    setDarkBgHex('#111915');
    setDarkAccentHex('#4C9A67');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim(),
          taglineEn: taglineEn.trim(),
          address: address.trim(),
          addressEn: addressEn.trim(),
          socialProof: socialProof.trim(),
          socialProofEn: socialProofEn.trim(),
          hotlines: [hotline1.trim(), hotline2.trim()],
          email: email.trim(),
          hours: {
            monThu: hoursMonThu.trim(),
            friSun: hoursFriSun.trim(),
            monThuEn: hoursMonThuEn.trim(),
            friSunEn: hoursFriSunEn.trim(),
          },
          links: {
            googleMaps: googleMapsUrl.trim(),
            facebook: facebookUrl.trim(),
            tiktok: tiktokUrl.trim(),
            youtube: youtubeUrl.trim(),
          },
          announcement: announcement.trim(),
          announcementEn: announcementEn.trim(),
          footerDesc: footerDesc.trim(),
          footerDescEn: footerDescEn.trim(),
          defaultLanguage,
          defaultTheme,
          fontPreset,
          lightBgHex,
          lightAccentHex,
          darkBgHex,
          darkAccentHex,
          enableAnimations: motionIntensity !== 'OFF',
          motionIntensity,
          enableIntro,
          introFrequency,
          introEyebrowVi: introEyebrowVi.trim(),
          introEyebrowEn: introEyebrowEn.trim(),
          introSubtitleVi: introSubtitleVi.trim(),
          introSubtitleEn: introSubtitleEn.trim(),
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        await refreshData();
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert('Lỗi lưu cài đặt');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadSuccessUrl(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folder', uploadCategory === 'models' ? 'brand' : 'gallery');

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.url) {
        setUploadSuccessUrl(uploadData.url);

        // If a target menu item was chosen, bind it immediately
        if (bindTargetItemId) {
          const payload: any = { id: bindTargetItemId };
          if (uploadCategory === 'models') payload.customGlbUrl = uploadData.url;
          else payload.photoUrl = uploadData.url;

          await fetch(`/api/menu/${bindTargetItemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        await refreshData();
      } else {
        alert('Lỗi tải tệp: ' + (uploadData.error || 'Thất bại'));
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi gửi tệp lên máy chủ.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>CÀI ĐẶT TOÀN DIỆN • THÔNG TIN QUÁN, BILINGUAL & THEME CMS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Cài Đặt Cửa Hàng, Giao Diện Sáng/Tối & Ngôn Ngữ Song Ngữ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình màu sắc thương hiệu, ngôn ngữ mặc định (VI/EN), chế độ Sáng/Tối và thông tin hiển thị trên toàn site.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className={`px-6 py-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
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
          <span>{saving ? 'Đang lưu...' : savedSuccess ? 'Đã lưu cấu hình!' : 'Lưu Cài Đặt Toàn Quán'}</span>
        </button>
      </div>

      {/* PANEL: Giao diện Sáng/Tối & Ngôn ngữ Mặc định */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>1. Cấu Hình Giao Diện Sáng/Tối & Ngôn Ngữ Mặc Định</span>
          </h3>
          <button
            type="button"
            onClick={handleResetColors}
            className="text-xs font-mono text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục màu chuẩn Cẩm Cù</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ngôn ngữ mặc định khi khách truy cập:</span>
            </label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value as 'vi' | 'en')}
              className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="vi">Tiếng Việt (VI) — Mặc định</option>
              <option value="en">English (EN) — Quốc tế</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Chế độ giao diện mặc định:</span>
            </label>
            <select
              value={defaultTheme}
              onChange={(e) => setDefaultTheme(e.target.value as 'light' | 'dark' | 'auto')}
              className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="light">Chế độ Sáng (Ban ngày • Giấy mộc)</option>
              <option value="dark">Chế độ Tối (Đêm bên suối • Lung linh)</option>
              <option value="auto">Tự động theo thiết bị khách (Auto)</option>
            </select>
          </div>
        </div>

        {/* Phông Chữ Website (Typography Presets) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-600" />
              <span>Phông Chữ Website (Typography Presets):</span>
            </label>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Đang chọn: {fontPreset === 'sans-be-vietnam' ? 'Be Vietnam Pro (Mặc định)' : fontPreset === 'sans-jakarta' ? 'Plus Jakarta Sans' : fontPreset === 'sans-inter' ? 'Inter' : 'Cormorant Garamond'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Be Vietnam Pro */}
            <div
              onClick={() => {
                setFontPreset('sans-be-vietnam');
                document.documentElement.setAttribute('data-font', 'sans-be-vietnam');
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                fontPreset === 'sans-be-vietnam'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Be Vietnam Pro</span>
                {fontPreset === 'sans-be-vietnam' && (
                  <span className="p-1 bg-emerald-600 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 mb-1">
                Sans-serif • Chuẩn tiếng Việt
              </div>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Nét chữ không chân sắc nét, cân đối hình học, tối ưu hiển thị dấu thanh tiếng Việt.
              </p>
              <div
                className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-sm tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-be-vietnam), sans-serif' }}
              >
                Cẩm Cù House — Cà phê sinh thái bên bờ suối
              </div>
            </div>

            {/* Card 2: Plus Jakarta Sans */}
            <div
              onClick={() => {
                setFontPreset('sans-jakarta');
                document.documentElement.setAttribute('data-font', 'sans-jakarta');
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                fontPreset === 'sans-jakarta'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Plus Jakarta Sans</span>
                {fontPreset === 'sans-jakarta' && (
                  <span className="p-1 bg-emerald-600 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-blue-700 mb-1">
                Sans-serif • Hiện đại, mềm mại
              </div>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Đường nét bo tròn tinh tế, phong cách công nghệ cao cấp, thoáng mắt khi đọc lâu.
              </p>
              <div
                className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-sm tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
              >
                Cẩm Cù House — Cà phê sinh thái bên bờ suối
              </div>
            </div>

            {/* Card 3: Inter */}
            <div
              onClick={() => {
                setFontPreset('sans-inter');
                document.documentElement.setAttribute('data-font', 'sans-inter');
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                fontPreset === 'sans-inter'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Inter</span>
                {fontPreset === 'sans-inter' && (
                  <span className="p-1 bg-emerald-600 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-indigo-700 mb-1">
                Sans-serif • Doanh nghiệp tối giản
              </div>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Chuẩn mực thiết kế giao diện quốc tế, trung tính, rõ ràng trên mọi độ phân giải.
              </p>
              <div
                className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-sm tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Cẩm Cù House — Cà phê sinh thái bên bờ suối
              </div>
            </div>

            {/* Card 4: Cormorant Garamond */}
            <div
              onClick={() => {
                setFontPreset('serif-editorial');
                document.documentElement.setAttribute('data-font', 'serif-editorial');
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                fontPreset === 'serif-editorial'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">Cormorant Garamond</span>
                {fontPreset === 'serif-editorial' && (
                  <span className="p-1 bg-emerald-600 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] font-semibold text-amber-700 mb-1">
                Serif (Có chân) • Tạp chí cổ điển
              </div>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Nét thanh nét đậm hoài niệm, thanh lịch theo phong cách tạp chí nghệ thuật & văn học.
              </p>
              <div
                className="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base leading-snug"
                style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}
              >
                Cẩm Cù House — Cà phê sinh thái bên bờ suối
              </div>
            </div>
          </div>
        </div>

        {/* Color pickers */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Bảng màu thương hiệu có thể tùy chỉnh (Hex Code & Color Picker):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Light BG */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">Nền Sáng (Light Bg):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightBgHex}
                  onChange={(e) => setLightBgHex(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={lightBgHex}
                  onChange={(e) => setLightBgHex(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono uppercase border rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Light Accent */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">Điểm Nhấn Sáng (Light Accent):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightAccentHex}
                  onChange={(e) => setLightAccentHex(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={lightAccentHex}
                  onChange={(e) => setLightAccentHex(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono uppercase border rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Dark BG */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">Nền Tối Suối Đêm (Dark Bg):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkBgHex}
                  onChange={(e) => setDarkBgHex(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={darkBgHex}
                  onChange={(e) => setDarkBgHex(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono uppercase border rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Dark Accent */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">Điểm Nhấn Tối (Dark Accent):</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkAccentHex}
                  onChange={(e) => setDarkAccentHex(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={darkAccentHex}
                  onChange={(e) => setDarkAccentHex(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono uppercase border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Motion & Page Transitions Setting */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Hệ thống chuyển động & Cường độ hiệu ứng (120fps Living Motion System):</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                Điều chỉnh cường độ chuyển động sống động trên toàn bộ website công cộng: hiệu ứng chuyển động 2D mượt mà, phản hồi con trỏ, nút hút nam châm Magnetic Button và vệt sáng chuyển trang êm ái. Tự động tương thích với chuẩn <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">prefers-reduced-motion</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: VIVID */}
              <button
                type="button"
                onClick={() => {
                  setMotionIntensity('VIVID');
                  setEnableAnimations(true);
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  motionIntensity === 'VIVID'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${motionIntensity === 'VIVID' ? 'text-emerald-800' : 'text-slate-800'}`}>
                    Sống động 120fps (Vivid)
                  </span>
                  {motionIntensity === 'VIVID' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Đầy đủ hiệu ứng mượt mà, phản hồi con trỏ, hút nam châm & vệt sáng chuyển cảnh.
                </p>
              </button>

              {/* Option 2: SUBTLE */}
              <button
                type="button"
                onClick={() => {
                  setMotionIntensity('SUBTLE');
                  setEnableAnimations(true);
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  motionIntensity === 'SUBTLE'
                    ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${motionIntensity === 'SUBTLE' ? 'text-amber-800' : 'text-slate-800'}`}>
                    Nhẹ nhàng (Subtle)
                  </span>
                  {motionIntensity === 'SUBTLE' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Chuyển cảnh êm dịu, giảm 60% mật độ hạt, góc nghiêng micro-tilt ±2°, không hút chuột hay chao đảo.
                </p>
              </button>

              {/* Option 3: OFF */}
              <button
                type="button"
                onClick={() => {
                  setMotionIntensity('OFF');
                  setEnableAnimations(false);
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  motionIntensity === 'OFF'
                    ? 'bg-slate-100 border-slate-600 ring-2 ring-slate-600/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${motionIntensity === 'OFF' ? 'text-slate-900' : 'text-slate-800'}`}>
                    Tắt chuyển động (Off)
                  </span>
                  {motionIntensity === 'OFF' && (
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Chế độ tĩnh tối giản, 0% tải GPU/CPU cho chuyển động, hiển thị trang tức thì.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Intro Overlay Configuration (120fps) */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50/60 to-forest-50/50 border border-emerald-200/80">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Màn hình Intro Mở Màn Điện Ảnh (120fps Cinematic Intro Overlay):</span>
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                Trải nghiệm mở màn điện ảnh 2.4s với đồ họa vector hoa Cẩm Cù 8K siêu nét, hạt sương sáng High-DPI Canvas 120fps, chữ typographic trượt mở mượt mà và nút bỏ qua tức thì (ESC).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEnableIntro(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  enableIntro
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Bật Intro (120fps)
              </button>
              <button
                type="button"
                onClick={() => setEnableIntro(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  !enableIntro
                    ? 'bg-slate-700 text-white font-bold shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tắt Intro
              </button>

              <button
                type="button"
                onClick={() => window.open('/?previewIntro=1', '_blank')}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-1.5"
                title="Mở tab mới xem thử Intro bất kể phiên truy cập"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem thử Intro ↗</span>
              </button>
            </div>
          </div>

          {enableIntro && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
              {/* Frequency selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Tần suất phát màn hình mở màn (Intro Frequency):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    introFrequency === 'SESSION'
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="introFrequency"
                      value="SESSION"
                      checked={introFrequency === 'SESSION'}
                      onChange={() => setIntroFrequency('SESSION')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">1 lần mỗi phiên truy cập (Khuyên dùng)</span>
                      <span className="text-[11px] text-slate-500">
                        Chỉ phát khi khách hàng mở tab mới / phiên mới (lưu trong sessionStorage), không làm phiền khi duyệt web liên tục.
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    introFrequency === 'ALWAYS'
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="introFrequency"
                      value="ALWAYS"
                      checked={introFrequency === 'ALWAYS'}
                      onChange={() => setIntroFrequency('ALWAYS')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Mỗi lần tải lại trang chủ</span>
                      <span className="text-[11px] text-slate-500">
                        Phát lại intro mỗi lần người dùng bấm F5 hoặc tải lại trang chủ (dành cho chế độ trình diễn kiosk/triển lãm).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Eyebrow inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Dòng tiêu đề phụ trên (Eyebrow - Tiếng Việt):
                  </label>
                  <input
                    type="text"
                    value={introEyebrowVi}
                    onChange={(e) => setIntroEyebrowVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Dòng tiêu đề phụ trên (Eyebrow - English):
                  </label>
                  <input
                    type="text"
                    value={introEyebrowEn}
                    onChange={(e) => setIntroEyebrowEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG"
                  />
                </div>
              </div>

              {/* Subtitle inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Khẩu hiệu mở màn (Subtitle - Tiếng Việt):
                  </label>
                  <input
                    type="text"
                    value={introSubtitleVi}
                    onChange={(e) => setIntroSubtitleVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Khẩu hiệu mở màn (Subtitle - English):
                  </label>
                  <input
                    type="text"
                    value={introSubtitleEn}
                    onChange={(e) => setIntroSubtitleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Streamside Ecological Café — Clean & Lush Sanctuary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PANEL: Thông Tin Cơ Bản & Song Ngữ VI / EN */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>2. Thông Tin Cơ Bản & Song Ngữ (VI & EN)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Quán:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Huy Hiệu Đánh Giá (Social Proof - VI):</label>
            <input
              type="text"
              value={socialProof}
              onChange={(e) => setSocialProof(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Khẩu Hiệu Quán (Tagline - Tiếng Việt):</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 italic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline (English):</label>
            <input
              type="text"
              value={taglineEn}
              onChange={(e) => setTaglineEn(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 italic"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ Chi Tiết (Tiếng Việt):</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address (English):</label>
            <input
              type="text"
              value={addressEn}
              onChange={(e) => setAddressEn(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô Tả Chân Trang (Footer - Tiếng Việt):</label>
            <textarea
              rows={2}
              value={footerDesc}
              onChange={(e) => setFooterDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Footer Description (English):</label>
            <textarea
              rows={2}
              value={footerDescEn}
              onChange={(e) => setFooterDescEn(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hotline 1 (Ms. Thùy Như):</label>
            <input
              type="text"
              value={hotline1}
              onChange={(e) => setHotline1(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hotline 2 (Hỗ trợ khách):</label>
            <input
              type="text"
              value={hotline2}
              onChange={(e) => setHotline2(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Liên Hệ:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Hours & Social */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>3. Giờ Đón Khách (GMT+7) & Mạng Xã Hội</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Thứ Hai – Thứ Năm (VI):</label>
            <input
              type="text"
              value={hoursMonThu}
              onChange={(e) => setHoursMonThu(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mon – Thu (EN):</label>
            <input
              type="text"
              value={hoursMonThuEn}
              onChange={(e) => setHoursMonThuEn(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Thứ Sáu – Chủ Nhật (VI):</label>
            <input
              type="text"
              value={hoursFriSun}
              onChange={(e) => setHoursFriSun(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold text-emerald-700 border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fri – Sun (EN):</label>
            <input
              type="text"
              value={hoursFriSunEn}
              onChange={(e) => setHoursFriSunEn(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-bold text-emerald-700 border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link Google Maps:</label>
            <input
              type="text"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link Facebook Fanpage:</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link TikTok:</label>
            <input
              type="text"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Link YouTube:</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Thông Báo Nổi Bật (VI):</label>
            <input
              type="text"
              placeholder="Ví dụ: Đêm nhạc Acoustic mỗi tối thứ 7..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement (EN):</label>
            <input
              type="text"
              placeholder="e.g. Acoustic live music every Saturday night..."
              value={announcementEn}
              onChange={(e) => setAnnouncementEn(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Media & Image Uploader */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-600" />
          <span>4. Tải Lên Tệp Media & Hình Ảnh</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tải hình ảnh chất lượng cao lên máy chủ và gán trực tiếp cho món trong thực đơn.
        </p>

        <form onSubmit={handleUploadFile} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loại tệp tải lên:</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none"
              >
                <option value="models">Mô hình 3D (.glb, .gltf)</option>
                <option value="images">Hình ảnh (.jpg, .png, .webp)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gán trực tiếp cho món:</label>
              <select
                value={bindTargetItemId}
                onChange={(e) => setBindTargetItemId(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none"
              >
                <option value="">-- Không gán tự động --</option>
                {data.menu.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}: {m.vietnameseTitle} ({m.priceDisplay || `${m.price}đ`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn tệp từ máy:</label>
              <input
                type="file"
                accept={uploadCategory === 'models' ? '.glb,.gltf' : 'image/*'}
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-slate-400">
              Hỗ trợ hình ảnh PNG/JPG/WebP hoặc tệp đính kèm lên đến 10MB
            </span>
            <button
              type="submit"
              disabled={!uploadFile || isUploading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Đang tải lên...' : 'Bắt đầu Tải Lên'}</span>
            </button>
          </div>

          {uploadSuccessUrl && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-mono">
              ✓ Tệp đã tải lên thành công: <span className="font-bold">{uploadSuccessUrl}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
