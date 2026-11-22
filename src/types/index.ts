export type CategoryId = 'coffee' | 'tea' | 'smoothie' | 'juice' | 'soda-yogurt' | 'other' | 'food';

export type ProductType = 'DRINK_FOOD' | 'BBQ_SET' | 'PACKAGED_GOODS';

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface ProductOption {
  labelVi: string;
  labelEn?: string;
  priceDelta: number; // +price in VND
}

export interface ProductOptionGroup {
  id: string;
  nameVi: string;
  nameEn?: string;
  type: 'SINGLE' | 'MULTIPLE';
  required: boolean;
  options: ProductOption[];
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
  sku?: string;
  productType?: ProductType;
  trackInventory?: boolean;
  stockQuantity?: number;
  allowOrdering?: boolean;
  optionGroups?: ProductOptionGroup[] | any;
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
  showStoryMilestones?: boolean;
  showTeamMembers?: boolean;
  visionTitle?: string;
  visionTitleEn?: string;
  visionDesc?: string;
  visionDescEn?: string;

  // Page 1 Home Section Toggles
  showFeaturedMenu?: boolean;
  showFeaturedSpace?: boolean;
  showFeaturedReviews?: boolean;
  showFeaturedEvents?: boolean;

  // Page 3: Không gian (/khong-gian)
  spaceEyebrow?: string;
  spaceEyebrowEn?: string;
  spaceTitle?: string;
  spaceTitleEn?: string;
  spaceSubtitle?: string;
  spaceSubtitleEn?: string;
  spaceIntro?: string;
  spaceIntroEn?: string;
  spaceHeroBanner?: string;

  // Page 4: Thực đơn (/thuc-don)
  menuEyebrow?: string;
  menuEyebrowEn?: string;
  menuTitle?: string;
  menuTitleEn?: string;
  menuSubtitle?: string;
  menuSubtitleEn?: string;
  menuIntro?: string;
  menuIntroEn?: string;
  menuNotice?: string;
  menuNoticeEn?: string;

  // Page 5: Khách hàng (/khach-hang)
  reviewsEyebrow?: string;
  reviewsEyebrowEn?: string;
  reviewsTitle?: string;
  reviewsTitleEn?: string;
  reviewsSubtitle?: string;
  reviewsSubtitleEn?: string;
  reviewsIntro?: string;
  reviewsIntroEn?: string;
  reviewsPrompt?: string;
  reviewsPromptEn?: string;

  // Page 6: Tin tức & FAQ (/tin-tuc)
  newsEyebrow?: string;
  newsEyebrowEn?: string;
  newsTitle?: string;
  newsTitleEn?: string;
  newsSubtitle?: string;
  newsSubtitleEn?: string;
  newsIntro?: string;
  newsIntroEn?: string;
  showNewsEvents?: boolean;
  showNewsFaq?: boolean;

  // Page 7: Liên hệ (/lien-he)
  contactEyebrow?: string;
  contactEyebrowEn?: string;
  contactTitle?: string;
  contactTitleEn?: string;
  contactSubtitle?: string;
  contactSubtitleEn?: string;
  contactIntro?: string;
  contactIntroEn?: string;
  contactBbqCallout?: string;
  contactBbqCalloutEn?: string;
  contactDirectionsNote?: string;
  contactDirectionsNoteEn?: string;

  // Page-Level Visibility Toggles (Module 1)
  showPageAbout?: boolean;
  showPageSpace?: boolean;
  showPageMenu?: boolean;
  showPageReviews?: boolean;
  showPageNews?: boolean;
  showPageContact?: boolean;

  showHeroSection?: boolean;
  showPhilosophySection?: boolean;

  // Universal Section Ordering
  homeSectionOrder?: string[];
  aboutSectionOrder?: string[];
  spaceSectionOrder?: string[];
  menuSectionOrder?: string[];
  reviewsSectionOrder?: string[];
  newsSectionOrder?: string[];
  contactSectionOrder?: string[];

  // Universal Section Layout Variants & Visibility
  sectionLayouts?: Record<string, string>;
  sectionVisibility?: Record<string, boolean>;

  // Additional section content fields
  heroLayout?: string;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaTextEn?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaTextEn?: string;
  heroSecondaryCtaLink?: string;
  heroCoverImage?: string;
  showHeroCoverImage?: boolean;
  heroCaption?: string;
  heroCaptionEn?: string;
  homeCtaBannerTitle?: string;
  homeCtaBannerTitleEn?: string;
  homeCtaBannerDesc?: string;
  homeCtaBannerDescEn?: string;
  homeCtaBannerBtnText?: string;
  homeCtaBannerBtnTextEn?: string;
  homeCtaBannerBtnLink?: string;
  showHomeCtaBanner?: boolean;

  aboutCommitments?: any[];

  spaceZones?: any[];
  spaceCtaTitle?: string;
  spaceCtaTitleEn?: string;
  spaceCtaDesc?: string;
  spaceCtaDescEn?: string;
  spaceCtaBtnText?: string;
  spaceCtaBtnTextEn?: string;
  showSpaceCta?: boolean;
  showSpaceFilterBar?: boolean;

  menuShowPrices?: boolean;
  menuShowAddToCart?: boolean;
  menuDietaryNote?: string;
  menuDietaryNoteEn?: string;
  menuCurrencyNote?: string;
  menuCurrencyNoteEn?: string;
  menuBbqBannerTitle?: string;
  menuBbqBannerTitleEn?: string;
  menuBbqBannerDesc?: string;
  menuBbqBannerDescEn?: string;
  menuBbqBannerBtnText?: string;
  menuBbqBannerBtnTextEn?: string;
  showMenuBbqBanner?: boolean;

  reviewsTrustScore?: string;
  reviewsTrustScoreEn?: string;
  reviewsThankYou?: string;
  reviewsThankYouEn?: string;

  newsContactPrompt?: string;
  newsContactPromptEn?: string;

  contactQuickInfoLayout?: string;
  contactMapCaption?: string;
  contactMapCaptionEn?: string;
  contactMapEmbedUrl?: string;
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

  // International Contacts & Currency
  whatsappUrl?: string;
  instagramUrl?: string;
  usdExchangeRate?: number;
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

// ==========================================
// E-COMMERCE SUITE & CUSTOMER TYPES
// ==========================================

export type FulfillmentType = 'DELIVERY' | 'PICKUP' | 'DINE_IN_BBQ';
export type PaymentMethod = 'VIETQR' | 'COD' | 'VNPAY' | 'MOMO' | 'CARD';
export type PaymentStatus = 'UNPAID' | 'PENDING_VERIFY' | 'PAID' | 'REFUNDED' | 'FAILED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
export type DiscountType = 'PERCENT' | 'FIXED' | 'FREE_SHIP';

export interface CustomerSafe {
  id: string;
  email: string;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  totalSpent: number;
  orderCount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CustomerAddressItem {
  id: string;
  customerId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  wardDistrict: string;
  provinceCity: string;
  note?: string | null;
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SelectedOptionSnapshot {
  groupNameVi: string;
  groupNameEn?: string;
  labelVi: string;
  labelEn?: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique cart entry key
  menuItemId: string;
  nameVi: string;
  nameEn?: string;
  unitPrice: number; // base price + options priceDelta
  basePrice: number;
  quantity: number;
  selectedOptions?: SelectedOptionSnapshot[];
  itemNote?: string;
  productType?: ProductType;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  menuItemId?: string | null;
  itemNameVi: string;
  itemNameEn?: string | null;
  unitPrice: number;
  quantity: number;
  selectedOptions?: SelectedOptionSnapshot[] | any;
  itemNote?: string | null;
  lineTotal: number;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  customerId?: string | null;
  customer?: CustomerSafe | null;
  fulfillmentType: FulfillmentType;
  scheduledTime?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress?: string | null;
  customerNote?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  voucherCode?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string | null;
  paidAt?: string | Date | null;
  orderStatus: OrderStatus;
  adminNote?: string | null;
  cancelReason?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItemRecord[];
}

export interface VoucherRecord {
  id: string;
  code: string;
  nameVi: string;
  nameEn?: string | null;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount: number;
  usageLimit?: number | null;
  usedCount: number;
  startsAt?: string | Date | null;
  expiresAt?: string | Date | null;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ShippingZoneRecord {
  id: string;
  nameVi: string;
  nameEn?: string | null;
  fee: number;
  freeShipThreshold?: number | null;
  estimatedTimeVi?: string | null;
  estimatedTimeEn?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CommerceSettingsRecord {
  id: string;
  commerceEnabled: boolean;
  enableDelivery: boolean;
  enablePickup: boolean;
  enableDineInBbq: boolean;
  enableCod: boolean;
  enableVietQr: boolean;
  enableEwallet: boolean;
  enableCard: boolean;
  bankId: string;
  bankAccountNo: string;
  bankAccountName: string;
  vietQrTemplate: string;
  webhookSecret?: string | null;
  defaultFreeShipThreshold: number;
  orderNotificationEmail?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface NewsletterSubscriberRecord {
  id: string;
  email: string;
  locale: string;
  isActive: boolean;
  createdAt: string | Date;
}


