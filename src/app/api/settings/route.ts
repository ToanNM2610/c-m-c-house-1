import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      return apiError('Không tìm thấy cấu hình quán', 404);
    }

    const formatted = {
      name: settings.name,
      tagline: settings.tagline,
      taglineEn: settings.taglineEn,
      address: settings.address,
      addressEn: settings.addressEn,
      hotlines: JSON.parse(settings.hotlines || '[]'),
      email: settings.email,
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
        googleMaps: settings.googleMapsUrl,
        facebook: settings.facebookUrl,
        tiktok: settings.tiktokUrl,
        youtube: settings.youtubeUrl,
      },
      announcement: settings.announcement,
      announcementEn: settings.announcementEn,
      footerDesc: settings.footerDesc,
      footerDescEn: settings.footerDescEn,
      defaultLanguage: settings.defaultLanguage || 'vi',
      defaultTheme: settings.defaultTheme || 'light',
      fontPreset: settings.fontPreset || 'sans-be-vietnam',
      lightBgHex: settings.lightBgHex || '#F6F3EC',
      lightAccentHex: settings.lightAccentHex || '#2E5A3C',
      darkBgHex: settings.darkBgHex || '#111915',
      darkAccentHex: settings.darkAccentHex || '#4C9A67',
      enableAnimations: settings.enableAnimations ?? true,
      motionIntensity: (settings as any).motionIntensity || 'VIVID',

      // Marketing & Tracking
      gaMeasurementId: settings.gaMeasurementId || '',
      gtmContainerId: settings.gtmContainerId || '',
      gscVerification: settings.gscVerification || '',
      facebookPixelId: settings.facebookPixelId || '',
      tiktokPixelId: settings.tiktokPixelId || '',

      // Quick Chat & Social
      enableQuickChat: settings.enableQuickChat ?? true,
      zaloUrl: settings.zaloUrl || '',
      messengerUrl: settings.messengerUrl || '',
      quickChatPhone: settings.quickChatPhone || '',
      enableSocialShare: settings.enableSocialShare ?? true,

      // Cinematic Intro Overlay Configuration (120fps)
      enableIntro: settings.enableIntro ?? true,
      introFrequency: settings.introFrequency || 'SESSION',
      introEyebrowVi: settings.introEyebrowVi || 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG',
      introEyebrowEn: settings.introEyebrowEn || 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG',
      introSubtitleVi: settings.introSubtitleVi || 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành',
      introSubtitleEn: settings.introSubtitleEn || 'Streamside Ecological Café — Clean & Lush Sanctuary',

      // Review Showcase Configuration (Module 4)
      reviewDisplayMode: (settings as any).reviewDisplayMode || 'AUTO_RANDOM',
      reviewAutoIntervalSec: (settings as any).reviewAutoIntervalSec ?? 6,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return apiError('Không thể tải cấu hình quán', 500);
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

    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.tagline !== undefined) dataToUpdate.tagline = body.tagline;
    if (body.taglineEn !== undefined) dataToUpdate.taglineEn = body.taglineEn;
    if (body.address !== undefined) dataToUpdate.address = body.address;
    if (body.addressEn !== undefined) dataToUpdate.addressEn = body.addressEn;
    if (body.hotlines !== undefined) dataToUpdate.hotlines = JSON.stringify(body.hotlines);
    if (body.email !== undefined) dataToUpdate.email = body.email;
    if (body.hours?.monThu !== undefined) dataToUpdate.monThuHours = body.hours.monThu;
    if (body.hours?.friSun !== undefined) dataToUpdate.friSunHours = body.hours.friSun;
    if (body.hours?.monThuEn !== undefined) dataToUpdate.monThuHoursEn = body.hours.monThuEn;
    if (body.hours?.friSunEn !== undefined) dataToUpdate.friSunHoursEn = body.hours.friSunEn;
    if (body.socialProof !== undefined) dataToUpdate.socialProof = body.socialProof;
    if (body.socialProofEn !== undefined) dataToUpdate.socialProofEn = body.socialProofEn;
    if (body.links?.googleMaps !== undefined) dataToUpdate.googleMapsUrl = body.links.googleMaps;
    if (body.links?.facebook !== undefined) dataToUpdate.facebookUrl = body.links.facebook;
    if (body.links?.tiktok !== undefined) dataToUpdate.tiktokUrl = body.links.tiktok;
    if (body.links?.youtube !== undefined) dataToUpdate.youtubeUrl = body.links.youtube;
    if (body.announcement !== undefined) dataToUpdate.announcement = body.announcement;
    if (body.announcementEn !== undefined) dataToUpdate.announcementEn = body.announcementEn;
    if (body.footerDesc !== undefined) dataToUpdate.footerDesc = body.footerDesc;
    if (body.footerDescEn !== undefined) dataToUpdate.footerDescEn = body.footerDescEn;
    if (body.defaultLanguage !== undefined) dataToUpdate.defaultLanguage = body.defaultLanguage;
    if (body.defaultTheme !== undefined) dataToUpdate.defaultTheme = body.defaultTheme;
    if (body.fontPreset !== undefined) {
      const allowedPresets = ['sans-be-vietnam', 'sans-jakarta', 'sans-inter', 'serif-editorial'];
      if (allowedPresets.includes(body.fontPreset)) {
        dataToUpdate.fontPreset = body.fontPreset;
      }
    }
    if (body.lightBgHex !== undefined) dataToUpdate.lightBgHex = body.lightBgHex;
    if (body.lightAccentHex !== undefined) dataToUpdate.lightAccentHex = body.lightAccentHex;
    if (body.darkBgHex !== undefined) dataToUpdate.darkBgHex = body.darkBgHex;
    if (body.darkAccentHex !== undefined) dataToUpdate.darkAccentHex = body.darkAccentHex;
    if (body.enableAnimations !== undefined) dataToUpdate.enableAnimations = Boolean(body.enableAnimations);
    if (body.motionIntensity !== undefined) {
      const allowed = ['OFF', 'SUBTLE', 'VIVID'];
      if (allowed.includes(body.motionIntensity)) {
        dataToUpdate.motionIntensity = body.motionIntensity;
      }
    }

    // Marketing & Tracking
    if (body.gaMeasurementId !== undefined) dataToUpdate.gaMeasurementId = body.gaMeasurementId;
    if (body.gtmContainerId !== undefined) dataToUpdate.gtmContainerId = body.gtmContainerId;
    if (body.gscVerification !== undefined) dataToUpdate.gscVerification = body.gscVerification;
    if (body.facebookPixelId !== undefined) dataToUpdate.facebookPixelId = body.facebookPixelId;
    if (body.tiktokPixelId !== undefined) dataToUpdate.tiktokPixelId = body.tiktokPixelId;

    // Quick Chat & Social
    if (body.enableQuickChat !== undefined) dataToUpdate.enableQuickChat = Boolean(body.enableQuickChat);
    if (body.zaloUrl !== undefined) dataToUpdate.zaloUrl = body.zaloUrl;
    if (body.messengerUrl !== undefined) dataToUpdate.messengerUrl = body.messengerUrl;
    if (body.quickChatPhone !== undefined) dataToUpdate.quickChatPhone = body.quickChatPhone;
    if (body.enableSocialShare !== undefined) dataToUpdate.enableSocialShare = Boolean(body.enableSocialShare);

    // Cinematic Intro Overlay Configuration (120fps)
    if (body.enableIntro !== undefined) dataToUpdate.enableIntro = Boolean(body.enableIntro);
    if (body.introFrequency !== undefined) dataToUpdate.introFrequency = body.introFrequency;
    if (body.introEyebrowVi !== undefined) dataToUpdate.introEyebrowVi = body.introEyebrowVi;
    if (body.introEyebrowEn !== undefined) dataToUpdate.introEyebrowEn = body.introEyebrowEn;
    if (body.introSubtitleVi !== undefined) dataToUpdate.introSubtitleVi = body.introSubtitleVi;
    if (body.introSubtitleEn !== undefined) dataToUpdate.introSubtitleEn = body.introSubtitleEn;

    // Review Showcase Configuration (Module 4)
    if (body.reviewDisplayMode !== undefined) {
      const allowedModes = ['AUTO_RANDOM', 'MANUAL'];
      if (allowedModes.includes(body.reviewDisplayMode)) {
        (dataToUpdate as any).reviewDisplayMode = body.reviewDisplayMode;
      }
    }
    if (body.reviewAutoIntervalSec !== undefined) {
      const sec = Math.min(30, Math.max(3, Number(body.reviewAutoIntervalSec) || 6));
      (dataToUpdate as any).reviewAutoIntervalSec = sec;
    }

    const updated = await prisma.storeSettings.update({
      where: { id: 'default' },
      data: dataToUpdate,
    });

    if (body.reviewDisplayMode !== undefined || body.reviewAutoIntervalSec !== undefined) {
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          category: 'CMS',
          action: 'UPDATE_REVIEW_SHOWCASE_SETTINGS',
          details: `Cập nhật cấu hình hiển thị đánh giá: Chế độ ${(dataToUpdate as any).reviewDisplayMode || updated.reviewDisplayMode}, Chu kỳ ${(dataToUpdate as any).reviewAutoIntervalSec || updated.reviewAutoIntervalSec}s`,
          adminUsername: user.username,
        },
      });
    }

    if (body.fontPreset !== undefined) {
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          category: 'CMS',
          action: 'UPDATE_FONT_PRESET',
          details: `Đổi phông chữ website sang preset: ${body.fontPreset}`,
          adminUsername: user.username,
        },
      });
    }

    const formatted = {
      name: updated.name,
      tagline: updated.tagline,
      taglineEn: updated.taglineEn,
      address: updated.address,
      addressEn: updated.addressEn,
      hotlines: JSON.parse(updated.hotlines || '[]'),
      email: updated.email,
      hours: {
        monThu: updated.monThuHours,
        friSun: updated.friSunHours,
        monThuEn: updated.monThuHoursEn,
        friSunEn: updated.friSunHoursEn,
        timezone: updated.timezone,
      },
      socialProof: updated.socialProof,
      socialProofEn: updated.socialProofEn,
      links: {
        googleMaps: updated.googleMapsUrl,
        facebook: updated.facebookUrl,
        tiktok: updated.tiktokUrl,
        youtube: updated.youtubeUrl,
      },
      announcement: updated.announcement,
      announcementEn: updated.announcementEn,
      footerDesc: updated.footerDesc,
      footerDescEn: updated.footerDescEn,
      defaultLanguage: updated.defaultLanguage,
      defaultTheme: updated.defaultTheme,
      fontPreset: updated.fontPreset || 'sans-be-vietnam',
      lightBgHex: updated.lightBgHex,
      lightAccentHex: updated.lightAccentHex,
      darkBgHex: updated.darkBgHex,
      darkAccentHex: updated.darkAccentHex,
      enableAnimations: updated.enableAnimations ?? true,
      motionIntensity: (updated as any).motionIntensity || 'VIVID',

      // Marketing & Tracking
      gaMeasurementId: updated.gaMeasurementId || '',
      gtmContainerId: updated.gtmContainerId || '',
      gscVerification: updated.gscVerification || '',
      facebookPixelId: updated.facebookPixelId || '',
      tiktokPixelId: updated.tiktokPixelId || '',

      // Quick Chat & Social
      enableQuickChat: updated.enableQuickChat ?? true,
      zaloUrl: updated.zaloUrl || '',
      messengerUrl: updated.messengerUrl || '',
      quickChatPhone: updated.quickChatPhone || '',
      enableSocialShare: updated.enableSocialShare ?? true,

      // Cinematic Intro Overlay Configuration (120fps)
      enableIntro: updated.enableIntro ?? true,
      introFrequency: updated.introFrequency || 'SESSION',
      introEyebrowVi: updated.introEyebrowVi || 'ĐÔNG GIA NGHĨA • LÂM ĐỒNG • HẺM 437 HÙNG VƯƠNG',
      introEyebrowEn: updated.introEyebrowEn || 'DONG GIA NGHIA • LAM DONG • ALLEY 437 HUNG VUONG',
      introSubtitleVi: updated.introSubtitleVi || 'Cà phê sinh thái bên bờ suối — Xanh sạch & Trong lành',
      introSubtitleEn: updated.introSubtitleEn || 'Streamside Ecological Café — Clean & Lush Sanctuary',

      // Review Showcase Configuration (Module 4)
      reviewDisplayMode: (updated as any).reviewDisplayMode || 'AUTO_RANDOM',
      reviewAutoIntervalSec: (updated as any).reviewAutoIntervalSec ?? 6,
    };

    return apiSuccess(formatted, { message: 'Cập nhật cấu hình quán thành công' });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return apiError(error.message || 'Lỗi cập nhật cấu hình quán', 500);
  }
}
