/**
 * EditorialMenuData - Quản lý & bảo toàn dữ liệu 67 món của Cẩm Cù House
 * Nguồn đối chiếu duy nhất: camcu_raw_backup.json
 * Nguyên tắc: Thực đơn không dùng ảnh, không giỏ hàng, không số liệu giả.
 */

export const EXPECTED_MENU_COUNT = 67;

export const CATEGORY_DICTIONARY = Object.freeze({
  coffee: { vi: "Cà Phê Mộc", en: "Specialty Coffee" },
  tea: { vi: "Trà Thảo Mộc", en: "Herbal & Fruit Tea" },
  smoothie: { vi: "Sinh Tố", en: "Fresh Smoothies" },
  juice: { vi: "Nước Ép", en: "Cold-Pressed Juice" },
  "soda-yogurt": { vi: "Soda & Sữa Chua", en: "Soda & Artisan Yogurt" },
  others: { vi: "Đồ Uống Khác", en: "Refreshing Drinks" },
  food: { vi: "Món Ăn Lành", en: "Wholesome Bites & Food" },
});

export const TAG_DICTIONARY = Object.freeze({
  Signature: { vi: "Signature", en: "Signature" },
  "Đặc biệt": { vi: "Đặc biệt", en: "Special" },
  "Best Seller": { vi: "Bán chạy", en: "Best Seller" },
  "Thanh Mát": { vi: "Thanh mát", en: "Refreshing" },
  "Đặc Sản": { vi: "Đặc sản", en: "Highland Specialty" },
  "Đặc Sản VIP": { vi: "Đặc sản VIP", en: "Highland Premium" },
  Healthy: { vi: "Lành mạnh", en: "Healthy" },
  "Theo Yêu Cầu": { vi: "Theo yêu cầu", en: "Custom Blend" },
  "Mát Lành": { vi: "Mát lành", en: "Cool & Fresh" },
  "Sát Suối": { vi: "Sát suối", en: "Streamside" },
  "Ăn Sáng": { vi: "Ăn sáng", en: "Breakfast" },
});

/**
 * Nạp dữ liệu thực đơn 67 món từ camcu_raw_backup.json
 * Tự động loại bỏ hoàn toàn thuộc tính hình ảnh
 */
export async function loadEditorialMenuData(backupUrl = "/camcu_raw_backup.json") {
  try {
    let rawData = null;

    // Hỗ trợ cả môi trường Browser (fetch) và môi trường Node.js (fs)
    if (typeof window !== "undefined" && typeof fetch === "function") {
      const response = await fetch(backupUrl, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      rawData = await response.json();
    } else {
      // Môi trường Node / SSR
      try {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.resolve(process.cwd(), backupUrl.replace(/^\//, ""));
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          rawData = JSON.parse(content);
        } else {
          const rootFallback = path.resolve(process.cwd(), "camcu_raw_backup.json");
          if (fs.existsSync(rootFallback)) {
            rawData = JSON.parse(fs.readFileSync(rootFallback, "utf-8"));
          }
        }
      } catch {
        // Fallback fetch nếu có fetch toàn cục trong Node
        if (typeof fetch === "function" && backupUrl.startsWith("http")) {
          const res = await fetch(backupUrl);
          if (res.ok) rawData = await res.json();
        }
      }
    }

    const rawItems = Array.isArray(rawData?.menu_items)
      ? rawData.menu_items
      : Array.isArray(rawData?.menu)
        ? rawData.menu
        : Array.isArray(rawData?.items)
          ? rawData.items
          : [];

    if (rawItems.length === 0) {
      return {
        connected: false,
        statusLabel: "Chưa kết nối",
        categories: [],
        items: [],
        totalCount: 0,
      };
    }

    // Chuẩn hóa và loại bỏ hoàn toàn mọi trường hình ảnh để đảm bảo Thực Đơn thuần chữ (0 ảnh)
    const sanitizedItems = rawItems.map((item, index) => {
      const categoryKey = item.category || "others";
      const catDict = CATEGORY_DICTIONARY[categoryKey];
      const categoryVi = item.categoryName || catDict?.vi || item.categoryVi || "Danh mục";
      const categoryEn = catDict?.en || item.categoryEn || item.categoryName || "Category";

      const tagsVi = normalizeTags(item.tag || item.tagsVi || item.tags_vi || item.tags || item.label);
      const tagsEn = tagsVi.map((t) => TAG_DICTIONARY[t]?.en || t);

      return {
        id: item.id ?? `item-${index + 1}`,
        orderNumber: String(index + 1).padStart(2, "0"),
        category: categoryKey,
        categoryVi,
        categoryEn,
        nameVi: item.name ?? item.nameVi ?? "",
        nameEn: item.nameEn ?? item.name ?? "",
        descriptionVi: item.description ?? item.descriptionVi ?? "",
        descriptionEn: item.descriptionEn ?? item.description ?? "",
        price: typeof item.price === "number" ? item.price : parseInt(String(item.price), 10) || 0,
        priceDisplay: formatOriginalPrice(item.price ?? item.priceDisplay),
        tagsVi,
        tagsEn,
        inStock: item.inStock !== false,
      };
    });

    return {
      connected: true,
      statusLabel: "Đã kết nối",
      categories: groupItemsByCategory(sanitizedItems),
      items: sanitizedItems,
      totalCount: sanitizedItems.length,
    };
  } catch {
    return {
      connected: false,
      statusLabel: "Chưa kết nối",
      categories: [],
      items: [],
      totalCount: 0,
    };
  }
}

export function formatOriginalPrice(price) {
  if (price === undefined || price === null || price === "") {
    return "Chưa kết nối";
  }
  if (typeof price === "number") {
    return `${price.toLocaleString("vi-VN")}đ`;
  }
  const num = parseInt(String(price).replace(/[^\d]/g, ""), 10);
  if (!isNaN(num)) {
    return `${num.toLocaleString("vi-VN")}đ`;
  }
  return String(price);
}

export function normalizeTags(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map((t) => String(t).trim()).filter(Boolean);
  }
  return String(rawTags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function groupItemsByCategory(items) {
  const map = new Map();

  for (const item of items) {
    const key = item.category;
    if (!map.has(key)) {
      map.set(key, {
        id: slugifyCategory(key),
        categoryKey: key,
        titleVi: item.categoryVi,
        titleEn: item.categoryEn,
        items: [],
      });
    }
    map.get(key).items.push(item);
  }

  return Array.from(map.values());
}

export function slugifyCategory(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
