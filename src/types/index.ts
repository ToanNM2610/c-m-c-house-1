export type CategoryId = 'coffee' | 'tea' | 'smoothie' | 'juice' | 'soda-yogurt' | 'other' | 'food';

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  nameEn?: string;
  vietnameseTitle: string;
  description: string;
  descriptionEn?: string;
  price: number; // Base price
  priceDisplay?: string;
  variants?: MenuItemVariant[];
  variantsEn?: MenuItemVariant[];
  highlight?: 'Best-seller' | 'Signature' | 'Đặc sản thảo mộc xanh sạch' | 'Đăk Nông mùa bơ sáp' | 'Signature béo ngậy' | 'Green Detox xanh sạch' | 'Hạt đác rim dẻo giòn' | 'Giải nhiệt bên suối' | 'Điểm tâm đậm đà' | string;
  highlightEn?: string;
  editorialNote?: string;
  editorialNoteEn?: string;
  moodTags?: ('alert' | 'warm' | 'refresh' | 'food')[];
  modelType?: 'coffee-cup' | 'iced-coffee' | 'herbal-tea' | 'smoothie-glass' | 'juice-glass' | 'soda-glass' | 'matcha-glass' | 'food-plate' | 'snack-basket';
  customGlbUrl?: string;
  photoUrl?: string;
  ingredients?: string[];
  inStock: boolean;
  orderCount?: number;
}

export interface PhilosophyCard {
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  iconName: string;
}

export interface SiteContent {
  id: string;
  heroEyebrow: string;
  heroEyebrowEn?: string;
  heroTitle: string;
  heroTitleEn?: string;
  heroSubtitle: string;
  heroSubtitleEn?: string;
  heroTagline: string;
  heroTaglineEn?: string;
  heroDescription: string;
  heroDescriptionEn?: string;
  showHero3DBean: boolean;
  philosophyEyebrow: string;
  philosophyEyebrowEn?: string;
  philosophyTitle: string;
  philosophyTitleEn?: string;
  philosophyLead: string;
  philosophyLeadEn?: string;
  philosophyStory: string;
  philosophyStoryEn?: string;
  philosophyCards: PhilosophyCard[];
  philosophyCardsEn?: PhilosophyCard[];
  brandStoryTitle: string;
  brandStoryTitleEn?: string;
  brandStorySubtitle: string;
  brandStorySubtitleEn?: string;
  brandStoryContent: string;
  brandStoryContentEn?: string;
  brandStoryPhilosophy: string;
  brandStoryPhilosophyEn?: string;
  brandStoryImageUrl?: string;
  visionTitle?: string;
  visionTitleEn?: string;
  visionDesc?: string;
  visionDescEn?: string;
}

export interface SpatialPlate {
  id: string; // "FIG. 01" to "FIG. 30"
  chapter: 1 | 2 | 3 | 4;
  chapterTitleVi: string;
  chapterTitleEn?: string;
  titleVi: string;
  titleEn?: string;
  locationVi: string;
  locationEn?: string;
  descriptionVi: string;
  descriptionEn?: string;
  imageUrl: string;
  customGlbUrl?: string;
  aspectRatio?: string;
}

export interface CafeEvent {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  dateOrSchedule: string;
  dateOrScheduleEn?: string;
  description: string;
  descriptionEn?: string;
  badge: string;
  badgeEn?: string;
  imageUrl?: string;
  active: boolean;
}

export interface CafeSettings {
  name: string;
  tagline: string;
  taglineEn?: string;
  address: string;
  addressEn?: string;
  hotlines: string[];
  email: string;
  hours: {
    monThu: string;
    friSun: string;
    monThuEn?: string;
    friSunEn?: string;
    timezone: string;
  };
  socialProof: string;
  socialProofEn?: string;
  links: {
    googleMaps: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  };
  announcement: string;
  announcementEn?: string;
  footerDesc?: string;
  footerDescEn?: string;
  defaultLanguage?: 'vi' | 'en';
  defaultTheme?: 'light' | 'dark' | 'auto';
  fontPreset?: 'sans-be-vietnam' | 'sans-jakarta' | 'sans-inter' | 'serif-editorial' | string;
  lightBgHex?: string;
  lightAccentHex?: string;
  darkBgHex?: string;
  darkAccentHex?: string;
  enableAnimations?: boolean;
  motionIntensity?: 'OFF' | 'SUBTLE' | 'VIVID' | string;

  // Marketing & Tracking
  gaMeasurementId?: string;
  gtmContainerId?: string;
  gscVerification?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;

  // Quick Chat
  enableQuickChat?: boolean;
  zaloUrl?: string;
  messengerUrl?: string;
  quickChatPhone?: string;
  enableSocialShare?: boolean;

  // Cinematic Intro Overlay Configuration (120fps)
  enableIntro?: boolean;
  introFrequency?: 'SESSION' | 'ALWAYS' | string;
  introEyebrowVi?: string;
  introEyebrowEn?: string;
  introSubtitleVi?: string;
  introSubtitleEn?: string;

  // Review Showcase Configuration (Module 4)
  reviewDisplayMode?: 'AUTO_RANDOM' | 'MANUAL' | string;
  reviewAutoIntervalSec?: number;

  // Section visibility toggles (Module 3 - Admin ON/OFF)
  showEventsSection?: boolean;
  showHighlightsSection?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  nameEn?: string | null;
  role: string;
  roleEn?: string | null;
  bio: string;
  bioEn?: string | null;
  avatarUrl?: string | null;
  orderIndex: number;
  active: boolean;
}

export interface HighlightStory {
  id: string;
  title: string;
  titleEn?: string | null;
  category: string;
  categoryEn?: string | null;
  date: string;
  dateEn?: string | null;
  summary: string;
  summaryEn?: string | null;
  content: string;
  contentEn?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  badgeEn?: string | null;
  orderIndex: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  questionEn?: string | null;
  answer: string;
  answerEn?: string | null;
  category: string;
  categoryEn?: string | null;
  orderIndex: number;
  published: boolean;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  content: string;
  contentEn?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
}

export interface MediaAsset {
  id: string;
  url: string;
  folder: string;
  filename: string;
  fileType: string;
  fileSize: number;
  altVi?: string | null;
  altEn?: string | null;
  createdAt: string | Date;
}

export interface PageSeo {
  id: string;
  route: string;
  metaTitleVi: string;
  metaTitleEn?: string | null;
  metaDescVi: string;
  metaDescEn?: string | null;
  h1Vi?: string | null;
  h1En?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
}

export interface RedirectRule {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  isActive: boolean;
  hitCount: number;
}

export interface ContactSubmission {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  status: 'NEW' | 'READ' | 'RESOLVED' | 'SPAM';
  emailStatus?: 'NOT_CONFIGURED' | 'SENT' | 'FAILED' | 'DISABLED';
  emailSentTo?: string | null;
  emailError?: string | null;
  repliedAt?: string | Date | null;
  createdAt: string | Date;
}

export interface GmailConfigData {
  id: string;
  isEnabled: boolean;
  senderName: string;
  senderEmail: string;
  hasAppPassword: boolean;
  maskedPassword?: string;
  autoReplyEnabled: boolean;
  autoReplySubject: string;
  autoReplyBody: string;
  updatedAt?: string | Date;
}

export interface GmailRecipientItem {
  id: string;
  email: string;
  label: string;
  receiveSubjects: string;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface GuestComment {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  visitDate?: string | null;
  status: 'PENDING' | 'APPROVED' | 'HIDDEN' | 'SPAM';
  isFeatured: boolean;
  createdAt: string | Date;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  category: 'AUTH' | 'CMS' | 'SEO' | 'SECURITY' | 'SYSTEM';
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  adminUsername?: string | null;
  createdAt: string | Date;
}

export interface DatabaseSchema {
  settings: CafeSettings;
  content: SiteContent;
  menu: MenuItem[];
  spatialPlates: SpatialPlate[];
  events: CafeEvent[];
  teamMembers?: TeamMember[];
  stories?: HighlightStory[];
  faqs?: FaqItem[];
  staticPages?: StaticPage[];
  lastUpdated: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'SEO_MANAGER';

export interface AdminUserSafe {
  id: string;
  username: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ==========================================
// ANTI-SPAM & RATE LIMITING SYSTEM (MODULE 4)
// ==========================================

export interface AntiSpamConfigData {
  id?: string;
  isEnabled: boolean;
  emergencyLockdown: boolean;
  requireHumanChallenge: boolean;
  cooldownSeconds: number;
  maxPerTenMinutes: number;
  maxPerDay: number;
  globalMaxPerFiveMinutes: number;
  maxGmailPerHour: number;
  maxLinksAllowed: number;
  minFillSeconds: number;
  blockedKeywords: string;
  totalBlockedCount?: number;
  currentlyBannedIps?: number;
  gmailSentLastHour?: number;
  updatedAt?: string | Date;
}

export interface BlockedIpItem {
  id: string;
  ip: string;
  ipMasked?: string;
  reason: string;
  strikes: number;
  blockedUntil: string | Date | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

