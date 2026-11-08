import { MENU_ITEMS, MenuItem } from "@/data/menu";

export const EXPECTED_MENU_COUNT = 67;

export interface EditorialMenuItem {
  id: string;
  orderNumber: string;
  category: string;
  categoryVi: string;
  categoryEn: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  price: number;
  priceDisplay: string;
  tagsVi: string[];
  tagsEn: string[];
  inStock: boolean;
}

export interface EditorialCategory {
  id: string;
  categoryKey: string;
  titleVi: string;
  titleEn: string;
  items: EditorialMenuItem[];
}

export interface EditorialMenuState {
  connected: boolean;
  statusLabel: string;
  categories: EditorialCategory[];
  items: EditorialMenuItem[];
  totalCount: number;
}

export const CATEGORY_DICTIONARY: Record<string, { vi: string; en: string }> = Object.freeze({
  coffee: { vi: "Cà Phê Mộc", en: "Specialty Coffee" },
  tea: { vi: "Trà Thảo Mộc", en: "Herbal & Fruit Tea" },
  smoothie: { vi: "Sinh Tố", en: "Fresh Smoothies" },
  juice: { vi: "Nước Ép", en: "Cold-Pressed Juice" },
  "soda-yogurt": { vi: "Soda & Sữa Chua", en: "Soda & Artisan Yogurt" },
  others: { vi: "Đồ Uống Khác", en: "Refreshing Drinks" },
  food: { vi: "Món Ăn Lành", en: "Wholesome Bites & Food" },
});

export const TAG_DICTIONARY: Record<string, { vi: string; en: string }> = Object.freeze({
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

export function formatOriginalPrice(price: number | string | undefined | null): string {
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

export function normalizeTags(rawTags: unknown): string[] {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map((t) => String(t).trim()).filter(Boolean);
  }
  return String(rawTags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function slugifyCategory(text: string): string {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function groupItemsByCategory(items: EditorialMenuItem[]): EditorialCategory[] {
  const map = new Map<string, EditorialCategory>();

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
    map.get(key)!.items.push(item);
  }

  return Array.from(map.values());
}

/**
 * Nạp trực tiếp 67 món từ nguồn đã đối soát 100% không ảnh
 */
export function getEditorialMenuState(menuList: MenuItem[] = MENU_ITEMS): EditorialMenuState {
  if (!menuList || menuList.length === 0) {
    return {
      connected: false,
      statusLabel: "Chưa kết nối",
      categories: [],
      items: [],
      totalCount: 0,
    };
  }

  const sanitizedItems: EditorialMenuItem[] = menuList.map((item, index) => {
    const categoryKey = item.category || "others";
    const catDict = CATEGORY_DICTIONARY[categoryKey];
    const categoryVi = item.categoryName || catDict?.vi || "Danh mục";
    const categoryEn = catDict?.en || item.categoryName || "Category";

    const tagsVi = normalizeTags(item.tag);
    const tagsEn = tagsVi.map((t) => TAG_DICTIONARY[t]?.en || t);

    return {
      id: item.id ?? `item-${index + 1}`,
      orderNumber: String(index + 1).padStart(2, "0"),
      category: categoryKey,
      categoryVi,
      categoryEn,
      nameVi: item.name,
      nameEn: item.name, // Giữ nguyên tên món có dấu
      descriptionVi: item.description ?? "",
      descriptionEn: item.description ?? "",
      price: typeof item.price === "number" ? item.price : parseInt(String(item.price), 10) || 0,
      priceDisplay: formatOriginalPrice(item.price),
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
}
