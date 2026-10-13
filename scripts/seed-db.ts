import fs from "fs";
import path from "path";
import { isDbConnected, db } from "../src/lib/db";
import {
  settingsTable,
  openingHoursTable,
  menuCategoriesTable,
  menuItemsTable,
  galleryItemsTable,
  reviewsTable,
  contentBlocksTable,
} from "../src/lib/db/schema";

async function seedDatabase() {
  console.log("=== SEEDING CẨM CÙ HOUSE DATABASE (SECTION 13) ===");

  const backupPath = path.resolve(__dirname, "../camcu_raw_backup.json");
  const rawBackup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

  if (!isDbConnected || !db) {
    console.log("ℹ DATABASE_URL chưa được cấu hình. Dữ liệu đang được tải an toàn từ JSON backup.");
    console.log("✓ Sẵn sàng đồng bộ ngay khi chủ quán cung cấp connection string Neon Postgres.");
    return;
  }

  try {
    console.log("Đang kết nối cơ sở dữ liệu Neon Postgres...");

    // 1. Seed Settings
    console.log("-> Seeding settings...");
    await db.insert(settingsTable).values({
      id: "default",
      brandName: rawBackup.settings.brandName,
      taglineVi: rawBackup.settings.taglineVi,
      taglineEn: rawBackup.settings.taglineEn,
      address: rawBackup.settings.address,
      lat: String(rawBackup.settings.coordinates.lat),
      lng: String(rawBackup.settings.coordinates.lng),
      hotline1: rawBackup.settings.hotline1,
      hotline2: rawBackup.settings.hotline2,
      zalo: rawBackup.settings.zalo,
      email: rawBackup.settings.email,
      facebook: rawBackup.settings.socials.facebook,
      tiktok: rawBackup.settings.socials.tiktok,
      youtube: rawBackup.settings.socials.youtube,
      googleMaps: rawBackup.settings.socials.googleMaps,
      timezone: rawBackup.settings.timezone,
    }).onConflictDoNothing();

    // 2. Seed Opening Hours
    console.log("-> Seeding opening hours...");
    for (const h of rawBackup.opening_hours) {
      await db.insert(openingHoursTable).values({
        weekday: h.weekday,
        dayNameVi: h.dayNameVi,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isClosed: h.isClosed,
      }).onConflictDoNothing();
    }

    // 3. Seed Menu Categories
    console.log("-> Seeding menu categories (8 categories)...");
    for (let i = 0; i < rawBackup.menu_categories.length; i++) {
      const cat = rawBackup.menu_categories[i];
      await db.insert(menuCategoriesTable).values({
        id: cat.id,
        slug: cat.id,
        nameVi: cat.name,
        nameEn: cat.name, // or bilingual translation
        sort: i,
      }).onConflictDoNothing();
    }

    // 4. Seed Menu Items (All 67 items)
    console.log("-> Seeding menu items (67 items)...");
    for (let i = 0; i < rawBackup.menu_items.length; i++) {
      const item = rawBackup.menu_items[i];
      await db.insert(menuItemsTable).values({
        id: item.id,
        categoryId: item.category,
        nameVi: item.name,
        nameEn: item.name,
        descVi: item.description || "",
        descEn: item.description || "",
        price: item.price,
        badges: item.tag ? [item.tag.toLowerCase()] : [],
        isAvailable: item.inStock !== false,
        isFeatured: item.tag === "Signature",
        sort: i,
      }).onConflictDoNothing();
    }

    // 5. Seed Gallery Items (30 items)
    console.log("-> Seeding gallery items (30 items)...");
    for (let i = 0; i < rawBackup.space_items.length; i++) {
      const sp = rawBackup.space_items[i];
      await db.insert(galleryItemsTable).values({
        id: sp.id,
        url: sp.image,
        category: sp.category[0] || "stream",
        titleVi: sp.title,
        titleEn: sp.subtitle || sp.title,
        captionVi: sp.description || "",
        captionEn: sp.description || "",
        sort: i,
        isPublished: true,
      }).onConflictDoNothing();
    }

    // 6. Seed Reviews (6 reviews)
    console.log("-> Seeding reviews (6 reviews)...");
    for (const rev of rawBackup.reviews) {
      await db.insert(reviewsTable).values({
        id: rev.id,
        source: "google",
        author: rev.author,
        initial: rev.initial,
        rating: rev.rating,
        textVi: rev.textVi,
        textEn: rev.textEn,
        badgeTextVi: rev.badgeTextVi,
        badgeTextEn: rev.badgeTextEn,
        publishedAt: rev.publishedTimeVi,
      }).onConflictDoNothing();
    }

    console.log("✓ SEEDING COMPLETED SUCCESSFULLY!");
  } catch (err) {
    console.error("Lỗi khi seed database:", err);
  }
}

seedDatabase();
