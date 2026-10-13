import fs from "fs";
import path from "path";
import { MENU_ITEMS, MENU_CATEGORIES } from "../src/data/menu";
import { SPACE_ITEMS, SPACE_CATEGORIES } from "../src/data/space";
import galleryData from "../src/data/gallery.json";
import { translations } from "../src/lib/translations";

// Extract Google Reviews from source
const GOOGLE_REVIEWS = [
  {
    id: "rev-1",
    author: "Minh Quân Nguyễn",
    initial: "Q",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 6 (82 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 6 (82 reviews)",
    rating: 5,
    publishedTimeVi: "2 tuần trước",
    publishedTimeEn: "2 weeks ago",
    textVi: "Không gian bên suối siêu mát mẻ, nước chảy róc rách ngồi uống cà phê muối rất thư thái. Đường bê tông xe 7 chỗ vào tận sân quán rộng rãi. Chủ quán nhiệt tình, đồ uống giá chỉ 25k-40k mà vị rất đậm đà.",
    textEn: "The stream atmosphere is amazingly cool and tranquil; sipping salted coffee while listening to babbling water is pure bliss. Concrete road easily accommodates 7-seater cars right into the yard.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 45.000 đ/người",
    priceEn: "30,000 – 45,000 VND/person",
    recommendVi: "Cà phê muối, Trà đào cam sả",
    recommendEn: "Salted Coffee, Peach Lemongrass Tea",
    source: "google",
  },
  {
    id: "rev-2",
    author: "Hồng Hạnh (Hanh Leo)",
    initial: "H",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 5 (46 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 5 (46 reviews)",
    rating: 5,
    publishedTimeVi: "3 tuần trước",
    publishedTimeEn: "3 weeks ago",
    textVi: "Gia đình mình đi từ Buôn Ma Thuột về ghé quán ăn sáng uống cà phê. Quán có điểm tâm bò kho bánh mì và mì tôm rất ngon, các bé thích mê lội chân suối nước trong vắt. Rất đáng trải nghiệm khi đến Gia Nghĩa!",
    textEn: "Our family stopped by for breakfast and coffee. The beef stew bread and hot noodles were delicious, and our kids loved dipping their feet into the crystal stream water.",
    dineInVi: "Điểm tâm & Nước",
    dineInEn: "Breakfast & Drinks",
    priceVi: "40.000 – 60.000 đ/người",
    priceEn: "40,000 – 60,000 VND/person",
    recommendVi: "Bò kho bánh mì, Cà phê sữa rang củi",
    recommendEn: "Beef Stew Bread, Wood-fired Milk Coffee",
    source: "google",
  },
  {
    id: "rev-3",
    author: "Trần Đức Trọng",
    initial: "T",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 7 (140 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 7 (140 reviews)",
    rating: 5,
    publishedTimeVi: "1 tháng trước",
    publishedTimeEn: "1 month ago",
    textVi: "Một viên ngọc ẩn giữa Gia Nghĩa! Cà phê rang củi mộc chuẩn gu người sành, thơm nồng không hề có bơ hay hương liệu công nghiệp. Ngồi chòi gỗ ngắm đồi xanh ngút ngàn, gió mát rượi không cần máy lạnh.",
    textEn: "A hidden gem in Gia Nghia! Authentic wood-fired roasted coffee with pure robust aroma without artificial additives. Sitting in the wooden hut gazing at misty green hills is therapeutic.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "25.000 – 35.000 đ/người",
    priceEn: "25,000 – 35,000 VND/person",
    recommendVi: "Cà phê đen rang củi, Trà mộc hoa cúc",
    recommendEn: "Wood-fired Black Coffee, Chamomile Tea",
    source: "google",
  },
  {
    id: "rev-4",
    author: "Thùy Trang Travel",
    initial: "T",
    badgeType: "local_guide",
    badgeTextVi: "Local Guide • Cấp 4 (32 bài đánh giá)",
    badgeTextEn: "Local Guide • Level 4 (32 reviews)",
    rating: 5,
    publishedTimeVi: "1 tháng trước",
    publishedTimeEn: "1 month ago",
    textVi: "Góc check-in bờ suối chụp hình lên thơ mộng dã man. Ánh nắng rọi qua kẽ lá xuống mặt suối lung linh. Nhân viên và cô chú chủ quán dễ thương mộc mạc đúng chất người Đắk Nông.",
    textEn: "Picturesque stream photography spots with golden sunlight filtering through tree canopies. The owners are warmly hospitable with authentic Dak Nong sincerity.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 50.000 đ/người",
    priceEn: "30,000 – 50,000 VND/person",
    recommendVi: "Trà thảo mộc mật ong, Sinh tố bơ Đắk Nông",
    recommendEn: "Wild Honey Herbal Tea, Dak Nong Avocado Smoothie",
    source: "google",
  },
  {
    id: "rev-5",
    author: "Lê Văn Thắng",
    initial: "T",
    badgeType: "review_count",
    badgeTextVi: "19 bài đánh giá",
    badgeTextEn: "19 reviews",
    rating: 5,
    publishedTimeVi: "2 tháng trước",
    publishedTimeEn: "2 months ago",
    textVi: "Quán có bãi đỗ xe ô tô cực rộng, xe 16 chỗ vào quay đầu êm ru. Thích hợp cho đoàn du lịch nghỉ chân trên cung đường khám phá Đắk Nông. Đồ uống pha chế sạch sẽ, giá cả niêm yết rõ ràng.",
    textEn: "Spacious parking courtyard accommodating up to 16-seater vans comfortably. Perfect rest stop for travelers exploring Dak Nong. Clean prep station and transparent pricing.",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "30.000 – 40.000 đ/người",
    priceEn: "30,000 – 40,000 VND/person",
    recommendVi: "Cà phê sữa đá, Nước ép cam nguyên chất",
    recommendEn: "Iced Milk Coffee, Fresh Orange Juice",
    source: "google",
  },
  {
    id: "rev-6",
    author: "Thu Phương",
    initial: "P",
    badgeType: "review_count",
    badgeTextVi: "27 bài đánh giá • 14 ảnh",
    badgeTextEn: "27 reviews • 14 photos",
    rating: 5,
    publishedTimeVi: "1 tháng trước",
    publishedTimeEn: "1 month ago",
    textVi: "Quán giữ được nét mộc mạc nguyên bản của Tây Nguyên, rặng cây xanh mướt và tiếng suối róc rách xua tan mệt mỏi đường dài. Rất recommend mọi người ghé qua!",
    textEn: "Preserves the raw charm of the Central Highlands; verdant trees and babbling stream water wash away travel fatigue. Highly recommend!",
    dineInVi: "Dùng tại chỗ",
    dineInEn: "Dine-in",
    priceVi: "~40.000 đ/người",
    priceEn: "~40,000 VND/person",
    recommendVi: "Trà thảo mộc, Bò kho bánh mì",
    recommendEn: "Herbal Tea, Beef Stew Bread",
    source: "google",
  },
];

const STORE_SETTINGS = {
  brandName: "Cẩm Cù House",
  taglineVi: "Chốn dừng chân mộc mạc bên bờ suối đá",
  taglineEn: "A rustic eco-sanctuary along rocky streams",
  address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Tỉnh Đắk Nông",
  coordinates: {
    lat: 11.99,
    lng: 107.69,
    display: "11.99° N, 107.69° E",
  },
  hotline1: "038 285 1688",
  hotline2: "077 465 9000",
  zalo: "038 285 1688",
  email: "camcuhouse@gmail.com",
  socials: {
    facebook: "https://facebook.com/camcuhouse",
    tiktok: "https://tiktok.com/@camcuhouse",
    youtube: "",
    googleMaps: "https://maps.app.goo.gl/3Q8Yp7pM1X1Z7",
  },
  timezone: "Asia/Ho_Chi_Minh",
};

const OPENING_HOURS = [
  { weekday: 1, dayNameVi: "Thứ Hai", openTime: "07:00", closeTime: "18:00", isClosed: false },
  { weekday: 2, dayNameVi: "Thứ Ba", openTime: "07:00", closeTime: "18:00", isClosed: false },
  { weekday: 3, dayNameVi: "Thứ Tư", openTime: "07:00", closeTime: "18:00", isClosed: false },
  { weekday: 4, dayNameVi: "Thứ Năm", openTime: "07:00", closeTime: "18:00", isClosed: false },
  { weekday: 5, dayNameVi: "Thứ Sáu", openTime: "07:00", closeTime: "22:00", isClosed: false },
  { weekday: 6, dayNameVi: "Thứ Bảy", openTime: "07:00", closeTime: "22:00", isClosed: false },
  { weekday: 0, dayNameVi: "Chủ Nhật", openTime: "07:00", closeTime: "22:00", isClosed: false },
];

const masterData = {
  metadata: {
    exportedAt: new Date().toISOString(),
    storeName: "Cẩm Cù House",
    version: "1.0.0-initial",
    stats: {
      totalMenuItems: MENU_ITEMS.length,
      totalMenuCategories: MENU_CATEGORIES.length,
      totalSpaceItems: SPACE_ITEMS.length,
      totalGalleryPhotos: galleryData.length,
      totalReviews: GOOGLE_REVIEWS.length,
    },
  },
  settings: STORE_SETTINGS,
  opening_hours: OPENING_HOURS,
  menu_categories: MENU_CATEGORIES,
  menu_items: MENU_ITEMS,
  space_items: SPACE_ITEMS,
  gallery_items: galleryData,
  reviews: GOOGLE_REVIEWS,
  content_blocks: {
    vi: translations.vi,
    en: translations.en,
  },
};

const backupDir = path.resolve(__dirname, "../src/data/backup");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const backupPath = path.join(backupDir, "camcu_raw_backup.json");
fs.writeFileSync(backupPath, JSON.stringify(masterData, null, 2), "utf-8");

const rootBackupPath = path.resolve(__dirname, "../camcu_raw_backup.json");
fs.writeFileSync(rootBackupPath, JSON.stringify(masterData, null, 2), "utf-8");

console.log("Master Backup Exported Successfully!");
console.log("- Location 1:", backupPath);
console.log("- Location 2:", rootBackupPath);
console.log("- Total Menu Items:", masterData.metadata.stats.totalMenuItems);
console.log("- Total Space Items:", masterData.metadata.stats.totalSpaceItems);
console.log("- Total Gallery Photos:", masterData.metadata.stats.totalGalleryPhotos);
console.log("- Total Reviews:", masterData.metadata.stats.totalReviews);
