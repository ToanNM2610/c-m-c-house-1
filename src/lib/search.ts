/**
 * CẨM CÙ HOUSE — BỘ MÁY TÌM KIẾM TIẾNG VIỆT KHÔNG DẤU & CHUẨN HÓA (UNACCENTED SEARCH)
 * Hỗ trợ Drizzle ORM, Client State và API Endpoint cho Thực Đơn (67 món) & Không Gian (30 ảnh)
 */

import { db, isDbConnected, menuItemsTable, galleryItemsTable } from "@/lib/db";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { SPACE_ITEMS, SpaceItem } from "@/data/space";

/**
 * Bảng ánh xạ ký tự tiếng Việt có dấu sang không dấu
 */
const VIETNAMESE_MAP: Record<string, string> = {
  à: "a", á: "a", ả: "a", ã: "a", ạ: "a",
  ă: "a", ằ: "a", ắ: "a", ẳ: "a", ẵ: "a", ặ: "a",
  â: "a", ầ: "a", ấ: "a", ẩ: "a", ẫ: "a", ậ: "a",
  è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
  ê: "e", ề: "e", ế: "e", ể: "e", ễ: "e", ệ: "e",
  ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
  ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o",
  ô: "o", ồ: "o", ố: "o", ổ: "o", ỗ: "o", ộ: "o",
  ơ: "o", ờ: "o", ớ: "o", ở: "o", ỡ: "o", ợ: "o",
  ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
  ư: "u", ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ừ: "u", ứ: "u", ử: "u", ữ: "u", ự: "u",
  ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y",
  đ: "d",
  À: "a", Á: "a", Ả: "a", Ã: "a", Ạ: "a",
  Ă: "a", Ằ: "a", Ắ: "a", Ẳ: "a", Ẵ: "a", Ặ: "a",
  Â: "a", Ầ: "a", Ấ: "a", Ẩ: "a", Ẫ: "a", Ậ: "a",
  È: "e", É: "e", Ẻ: "e", Ẽ: "e", Ẹ: "e",
  Ê: "e", Ề: "e", Ế: "e", Ể: "e", Ễ: "e", Ệ: "e",
  Ì: "i", Í: "i", Ỉ: "i", Ĩ: "i", Ị: "i",
  Ò: "o", Ó: "o", Ỏ: "o", Õ: "o", Ọ: "o",
  Ô: "o", Ồ: "o", Ố: "o", Ổ: "o", Ỗ: "o", Ộ: "o",
  Ơ: "o", Ờ: "o", Ớ: "o", Ở: "o", Ỡ: "o", Ợ: "o",
  Ù: "u", Ú: "u", Ủ: "u", Ũ: "u", Ụ: "u",
  Ư: "u", Ừ: "u", Ứ: "u", Sử: "u", Ử: "u", Ữ: "u", Ự: "u",
  Ỳ: "y", Ý: "y", Ỷ: "y", Ỹ: "y", Ỵ: "y",
  Đ: "d",
};

/**
 * Xóa toàn bộ dấu tiếng Việt và chuẩn hóa chuỗi về chữ thường không dấu.
 * Xử lý cả dạng Unicode NFC lẫn NFD và các ký tự đặc biệt.
 */
export function removeVietnameseTones(str: string | null | undefined): string {
  if (!str) return "";

  // 1. Phân tách Unicode NFD để bóc các dấu kết hợp (combining diacritical marks)
  let normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 2. Chuyển đổi các ký tự có dấu còn lại qua bảng tra cứu
  normalized = normalized.replace(
    /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/g,
    (char) => VIETNAMESE_MAP[char] || char
  );

  // 3. Chuẩn hóa d/đ và chuyển chữ thường
  return normalized
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
}

/**
 * Tách truy vấn thành danh sách các từ khóa đơn (tokens)
 */
export function tokenizeQuery(query: string): string[] {
  const clean = removeVietnameseTones(query);
  return clean
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/g)
    .filter((token) => token.length > 0);
}

/**
 * Kiểm tra xem target có khớp với toàn bộ các từ trong query hay không (AND-matching)
 */
export function matchesVietnameseSearch(
  targets: (string | null | undefined)[],
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return true;

  // Ghép các chuỗi mục tiêu và chuẩn hóa không dấu
  const normalizedTargets = targets
    .filter((t): t is string => Boolean(t))
    .map((t) => removeVietnameseTones(t))
    .join(" ");

  // Kiểm tra từng token phải có mặt trong chuỗi mục tiêu
  return tokens.every((token) => normalizedTargets.includes(token));
}

/**
 * Tính điểm khớp độ liên quan (Relevance Scoring)
 * Điểm càng cao thứ hạng càng ưu tiên hiển thị trước.
 */
export function scoreVietnameseSearch(
  title: string,
  description: string = "",
  category: string = "",
  query: string
): number {
  if (!query || !query.trim()) return 0;

  const cleanQuery = removeVietnameseTones(query);
  const cleanTitle = removeVietnameseTones(title);
  const cleanDesc = removeVietnameseTones(description);
  const cleanCat = removeVietnameseTones(category);

  let score = 0;

  // 1. Khớp chính xác 100% tiêu đề
  if (cleanTitle === cleanQuery) {
    score += 100;
  }
  // 2. Tiêu đề bắt đầu bằng từ khóa tìm kiếm
  else if (cleanTitle.startsWith(cleanQuery)) {
    score += 80;
  }
  // 3. Tiêu đề chứa nguyên cụm từ khóa liên tục
  else if (cleanTitle.includes(cleanQuery)) {
    score += 60;
  }

  // 4. Kiểm tra các tokens đơn lẻ
  const tokens = tokenizeQuery(query);
  let matchedTokens = 0;
  for (const token of tokens) {
    if (cleanTitle.includes(token)) {
      matchedTokens++;
      score += 15;
    } else if (cleanDesc.includes(token)) {
      score += 5;
    } else if (cleanCat.includes(token)) {
      score += 8;
    }
  }

  // Thưởng điểm nếu tất cả các tokens đều xuất hiện trong tiêu đề
  if (tokens.length > 1 && matchedTokens === tokens.length) {
    score += 25;
  }

  return score;
}

/**
 * Lọc và xếp hạng danh sách thực đơn theo truy vấn tìm kiếm tiếng Việt không dấu
 */
export function searchMenuItemsLocally<T extends { name: string; description?: string; category: string; categoryName?: string; tag?: string }>(
  items: T[],
  query: string,
  categoryFilter?: string
): T[] {
  let list = items;

  // Lọc theo danh mục nếu có
  if (categoryFilter && categoryFilter !== "all") {
    list = list.filter((i) => i.category === categoryFilter);
  }

  if (!query || !query.trim()) {
    return list;
  }

  // Lọc các món thỏa mãn toàn bộ tokens tìm kiếm
  const matched = list.filter((item) =>
    matchesVietnameseSearch(
      [item.name, item.description, item.category, item.categoryName, item.tag],
      query
    )
  );

  // Xếp hạng theo độ liên quan
  return matched.sort((a, b) => {
    const catStrA = a.categoryName ? `${a.category} ${a.categoryName}` : a.category;
    const catStrB = b.categoryName ? `${b.category} ${b.categoryName}` : b.category;
    const scoreA = scoreVietnameseSearch(a.name, a.description, catStrA, query);
    const scoreB = scoreVietnameseSearch(b.name, b.description, catStrB, query);
    return scoreB - scoreA;
  });
}

/**
 * Lọc và xếp hạng không gian quán theo truy vấn tìm kiếm tiếng Việt không dấu
 */
export function searchSpaceItemsLocally<T extends { title: string; description?: string; subtitle?: string; category: string | string[] }>(
  items: T[],
  query: string,
  categoryFilter?: string
): T[] {
  let list = items;

  // Lọc theo danh mục nếu có
  if (categoryFilter && categoryFilter !== "all") {
    list = list.filter((i) =>
      Array.isArray(i.category) ? i.category.includes(categoryFilter) : i.category === categoryFilter
    );
  }

  if (!query || !query.trim()) {
    return list;
  }

  // Lọc các không gian thỏa mãn tìm kiếm
  const matched = list.filter((item) => {
    const catStr = Array.isArray(item.category) ? item.category.join(" ") : item.category;
    return matchesVietnameseSearch([item.title, item.description, item.subtitle, catStr], query);
  });

  // Xếp hạng theo độ liên quan
  return matched.sort((a, b) => {
    const catStrA = Array.isArray(a.category) ? a.category.join(" ") : a.category;
    const catStrB = Array.isArray(b.category) ? b.category.join(" ") : b.category;
    const scoreA = scoreVietnameseSearch(a.title, a.description, catStrA, query);
    const scoreB = scoreVietnameseSearch(b.title, b.description, catStrB, query);
    return scoreB - scoreA;
  });
}

/**
 * Truy vấn thực đơn kết hợp Drizzle ORM (nếu kết nối DB) với bộ lọc không dấu
 */
export async function searchMenuItemsFromDb(
  query: string = "",
  options?: { category?: string; availableOnly?: boolean }
): Promise<MenuItem[]> {
  try {
    if (isDbConnected && db) {
      // Truy vấn từ Drizzle ORM
      const rows = await db.select().from(menuItemsTable);
      if (rows && rows.length > 0) {
        let mapped: MenuItem[] = rows.map((r) => {
          const staticItem = MENU_ITEMS.find((m) => m.id === r.id);
          return {
            id: r.id,
            name: r.nameVi,
            category: r.categoryId,
            categoryName: staticItem?.categoryName || r.categoryId,
            price: r.price,
            description: r.descVi || "",
            tag: staticItem?.tag,
            image: staticItem?.image || "",
            inStock: r.isAvailable,
          };
        });

        if (options?.availableOnly) {
          mapped = mapped.filter((i) => i.inStock);
        }

        return searchMenuItemsLocally(mapped, query, options?.category);
      }
    }
  } catch (error) {
    console.warn("[Search] Drizzle query fallback to static MENU_ITEMS:", error);
  }

  // Fallback an toàn vào MENU_ITEMS tĩnh (67 món nguyên bản)
  let items = MENU_ITEMS;
  if (options?.availableOnly) {
    items = items.filter((i) => i.inStock !== false);
  }
  return searchMenuItemsLocally(items, query, options?.category);
}

/**
 * Truy vấn không gian quán kết hợp Drizzle ORM (nếu kết nối DB) với bộ lọc không dấu
 */
export async function searchGalleryItemsFromDb(
  query: string = "",
  options?: { category?: string }
): Promise<SpaceItem[]> {
  try {
    if (isDbConnected && db) {
      const rows = await db.select().from(galleryItemsTable);
      if (rows && rows.length > 0) {
        const mapped: SpaceItem[] = rows.map((r) => {
          const staticItem = SPACE_ITEMS.find((s) => s.id === r.id);
          return {
            id: r.id,
            title: r.titleVi,
            subtitle: staticItem?.subtitle || r.titleEn || "",
            description: r.captionVi || "",
            category: [r.category],
            tag: staticItem?.tag || "",
            image: r.url,
          };
        });

        return searchSpaceItemsLocally(mapped, query, options?.category);
      }
    }
  } catch (error) {
    console.warn("[Search] Drizzle gallery query fallback to static SPACE_ITEMS:", error);
  }

  // Fallback an toàn vào SPACE_ITEMS tĩnh (30 ảnh nguyên bản)
  return searchSpaceItemsLocally(SPACE_ITEMS, query, options?.category);
}
