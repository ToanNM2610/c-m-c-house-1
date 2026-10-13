import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";

// 1. Settings (1 row singleton)
export const settingsTable = pgTable("settings", {
  id: text("id").primaryKey().default("default"),
  brandName: text("brand_name").notNull().default("Cẩm Cù House"),
  taglineVi: text("tagline_vi").notNull(),
  taglineEn: text("tagline_en").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull().default("11.99"),
  lng: text("lng").notNull().default("107.69"),
  hotline1: text("hotline1").notNull().default("038 285 1688"),
  hotline2: text("hotline2").notNull().default("077 465 9000"),
  zalo: text("zalo").notNull().default("038 285 1688"),
  email: text("email").notNull().default("camcuhouse@gmail.com"),
  facebook: text("facebook").default(""),
  tiktok: text("tiktok").default(""),
  youtube: text("youtube").default(""),
  googleMaps: text("google_maps").default("https://maps.app.goo.gl/3Q8Yp7pM1X1Z7"),
  timezone: text("timezone").notNull().default("Asia/Ho_Chi_Minh"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. Opening Hours
export const openingHoursTable = pgTable("opening_hours", {
  weekday: integer("weekday").primaryKey(), // 0: Sunday, 1: Monday, ... 6: Saturday
  dayNameVi: text("day_name_vi").notNull(),
  openTime: text("open_time").notNull(), // e.g. "07:00"
  closeTime: text("close_time").notNull(), // e.g. "18:00" or "22:00"
  isClosed: boolean("is_closed").notNull().default(false),
});

// 3. Closures (Holidays / Emergency Closures)
export const closuresTable = pgTable("closures", {
  id: text("id").primaryKey(),
  dateFrom: text("date_from").notNull(), // YYYY-MM-DD
  dateTo: text("date_to").notNull(), // YYYY-MM-DD
  reasonVi: text("reason_vi").notNull(),
  reasonEn: text("reason_en").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. Status Override (Single Source of Truth)
export const statusOverrideTable = pgTable("status_override", {
  id: text("id").primaryKey().default("current"),
  mode: text("mode").notNull().default("auto"), // 'auto' | 'open' | 'closed' | 'closing_early'
  until: text("until"), // ISO timestamp string until when the override is valid
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 5. Announcement (Max 1 active at a time)
export const announcementsTable = pgTable("announcements", {
  id: text("id").primaryKey(),
  textVi: text("text_vi").notNull(),
  textEn: text("text_en").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 6. Menu Categories
export const menuCategoriesTable = pgTable("menu_categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  nameVi: text("name_vi").notNull(),
  nameEn: text("name_en").notNull(),
  sort: integer("sort").notNull().default(0),
});

// 7. Menu Items (All 67 items)
export const menuItemsTable = pgTable("menu_items", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull(),
  nameVi: text("name_vi").notNull(),
  nameEn: text("name_en").notNull(),
  descVi: text("desc_vi").default(""),
  descEn: text("desc_en").default(""),
  price: integer("price").notNull(), // Price in VND integer
  badges: json("badges").$type<string[]>().default([]), // 'signature', 'new', etc.
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 8. Media Assets
export const mediaAssetsTable = pgTable("media_assets", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  width: integer("width"),
  height: integer("height"),
  blurDataUrl: text("blur_data_url"),
  altVi: text("alt_vi").default(""),
  altEn: text("alt_en").default(""),
  bytes: integer("bytes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 9. Gallery Items (Space Photos & Eco-Sanctuary Moments)
export const galleryItemsTable = pgTable("gallery_items", {
  id: text("id").primaryKey(),
  assetId: text("asset_id"),
  url: text("url").notNull(),
  category: text("category").notNull(), // stream | wooden-terrace | checkin | workspace
  titleVi: text("title_vi").notNull(),
  titleEn: text("title_en").notNull(),
  captionVi: text("caption_vi").default(""),
  captionEn: text("caption_en").default(""),
  sort: integer("sort").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 10. Reviews (Google Reviews)
export const reviewsTable = pgTable("reviews", {
  id: text("id").primaryKey(),
  source: text("source").notNull().default("google"),
  externalId: text("external_id"),
  author: text("author").notNull(),
  initial: text("initial").default(""),
  rating: integer("rating").notNull().default(5),
  textVi: text("text_vi").notNull(),
  textEn: text("text_en").notNull(),
  badgeTextVi: text("badge_text_vi"),
  badgeTextEn: text("badge_text_en"),
  publishedAt: text("published_at"),
  sourceUrl: text("source_url"),
  syncedAt: timestamp("synced_at").defaultNow(),
});

// 11. Content Blocks (Fixed Content of the 5 Core Pages)
export const contentBlocksTable = pgTable("content_blocks", {
  id: text("id").primaryKey(),
  page: text("page").notNull(), // 'common' | 'home' | 'about' | 'space' | 'menu' | 'contact'
  key: text("key").notNull(),
  valueVi: text("value_vi").notNull(),
  valueEn: text("value_en").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 12. Admin Users (Auth credentials + TOTP 2FA)
export const adminUsersTable = pgTable("admin_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  totpSecret: text("totp_secret"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});
