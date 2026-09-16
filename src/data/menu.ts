export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceFormatted: string;
  price?: number;
  inStock?: boolean;
}

export const REAL_MENU_DATA: MenuItem[] = [
  // ================= CÀ PHÊ =================
  { id: "cf-1", name: "Cà phê đen/sữa", category: "Cà Phê", priceFormatted: "20.000 VNĐ" },
  { id: "cf-2", name: "Cà phê sài gòn", category: "Cà Phê", priceFormatted: "25.000 VNĐ" },
  { id: "cf-3", name: "Cà phê muối", category: "Cà Phê", priceFormatted: "28.000 VNĐ" },
  { id: "cf-4", name: "Cà phê dừa xay", category: "Cà Phê", priceFormatted: "28.000 VNĐ" },
  { id: "cf-5", name: "Cà phê kem trứng", category: "Cà Phê", priceFormatted: "30.000 VNĐ" },
  { id: "cf-6", name: "Bạc xỉu", category: "Cà Phê", priceFormatted: "25.000 VNĐ" },
  { id: "cf-7", name: "Cacao sữa", category: "Cà Phê", priceFormatted: "25.000 VNĐ" },
  { id: "cf-8", name: "Cacao kem muối", category: "Cà Phê", priceFormatted: "28.000 VNĐ" },
  { id: "cf-9", name: "Cacao kem trứng", category: "Cà Phê", priceFormatted: "30.000 VNĐ" },

  // ================= TRÀ =================
  { id: "tr-1", name: "Trà gừng mật ong", category: "Trà", priceFormatted: "25.000 VNĐ" },
  { id: "tr-2", name: "Trà Lipton thảo mộc", category: "Trà", priceFormatted: "27.000 VNĐ" },
  { id: "tr-3", name: "Trà vải", category: "Trà", priceFormatted: "27.000 VNĐ" },
  { id: "tr-4", name: "Trà đào", category: "Trà", priceFormatted: "27.000 VNĐ" },
  { id: "tr-5", name: "Trà đào cam sả", category: "Trà", priceFormatted: "30.000 VNĐ" },
  { id: "tr-6", name: "Trà sữa Thái xanh", category: "Trà", priceFormatted: "27.000 VNĐ" },
  { id: "tr-7", name: "Trà sữa truyền thống", category: "Trà", priceFormatted: "25.000 VNĐ" },
  { id: "tr-8", name: "Trà sữa kem trứng", category: "Trà", priceFormatted: "30.000 VNĐ" },
  { id: "tr-9", name: "Trà hoa cúc", category: "Trà", priceFormatted: "28.000 VNĐ" },
  { id: "tr-10", name: "Hoa đu đủ mật ong", category: "Trà", priceFormatted: "28.000 VNĐ" },

  // ================= SINH TỐ =================
  { id: "st-1", name: "Mãng cầu", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-2", name: "Sapoche", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-3", name: "Xoài", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-4", name: "Dừa", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-5", name: "Bơ", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-6", name: "Đậu đỏ", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-7", name: "Việt quất/dâu", category: "Sinh Tố", priceFormatted: "28.000 VNĐ" },
  { id: "st-8", name: "Bơ sầu riêng", category: "Sinh Tố", priceFormatted: "33.000 VNĐ" },
  { id: "st-9", name: "Hạt sen", category: "Sinh Tố", priceFormatted: "33.000 VNĐ" },

  // ================= NƯỚC ÉP =================
  { id: "ne-1", name: "Táo", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-2", name: "Ổi", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-3", name: "Cam", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-4", name: "Thơm", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-5", name: "Chanh dây", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-6", name: "Cà rốt", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-7", name: "Dưa hấu", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-8", name: "Cải kale", category: "Nước Ép", priceFormatted: "30.000 VNĐ" },
  { id: "ne-9", name: "Mix tùy chọn", category: "Nước Ép", priceFormatted: "35.000 VNĐ" },

  // ================= SODA / SỮA CHUA =================
  { id: "sd-1", name: "Soda Atiso đỏ", category: "Soda / Sữa Chua", priceFormatted: "30.000 VNĐ" },
  { id: "sd-2", name: "Soda chanh bạc hà", category: "Soda / Sữa Chua", priceFormatted: "30.000 VNĐ" },
  { id: "sd-3", name: "Soda việt quất / dâu", category: "Soda / Sữa Chua", priceFormatted: "30.000 VNĐ" },
  { id: "sd-4", name: "Sữa chua dầm", category: "Soda / Sữa Chua", priceFormatted: "23.000 VNĐ" },
  { id: "sd-5", name: "Sữa chua nếp cẩm", category: "Soda / Sữa Chua", priceFormatted: "27.000 VNĐ" },
  { id: "sd-6", name: "Sữa chua chanh dây", category: "Soda / Sữa Chua", priceFormatted: "27.000 VNĐ" },
  { id: "sd-7", name: "Sữa chua việt quất/dâu", category: "Soda / Sữa Chua", priceFormatted: "27.000 VNĐ" },
  { id: "sd-8", name: "Sữa chua hạt đác", category: "Soda / Sữa Chua", priceFormatted: "30.000 VNĐ" },

  // ================= MÓN KHÁC =================
  { id: "ot-1", name: "Đá me", category: "Món Khác", priceFormatted: "27.000 VNĐ" },
  { id: "ot-2", name: "Tắc xí muội", category: "Món Khác", priceFormatted: "27.000 VNĐ" },
  { id: "ot-3", name: "Dừa tươi", category: "Món Khác", priceFormatted: "22.000 VNĐ" },
  { id: "ot-4", name: "Chanh mật ong", category: "Món Khác", priceFormatted: "25.000 VNĐ" },
  { id: "ot-5", name: "Chanh muối", category: "Món Khác", priceFormatted: "25.000 VNĐ" },
  { id: "ot-6", name: "Dưa hấu tắc xay", category: "Món Khác", priceFormatted: "27.000 VNĐ" },
  { id: "ot-7", name: "Matcha latte", category: "Món Khác", priceFormatted: "27.000 VNĐ" },
  { id: "ot-8", name: "Matcha đậu đỏ", category: "Món Khác", priceFormatted: "30.000 VNĐ" },
  { id: "ot-9", name: "Oreo đá xay", category: "Món Khác", priceFormatted: "30.000 VNĐ" },

  // ================= MÓN ĂN (FOOD) =================
  { id: "fd-1", name: "Bánh mì ốp la xúc xích", category: "Món Ăn (Food)", priceFormatted: "30.000 VNĐ" },
  { id: "fd-2", name: "Mỳ Spaghetti", category: "Món Ăn (Food)", priceFormatted: "35.000 VNĐ" },
  { id: "fd-3", name: "Bò kho + bánh mì", category: "Món Ăn (Food)", priceFormatted: "45.000 VNĐ" },
  { id: "fd-4", name: "Cà ri gà + bánh mì", category: "Món Ăn (Food)", priceFormatted: "45.000 VNĐ" },
  { id: "fd-5", name: "Bánh tráng phơi sương + Sa tế", category: "Món Ăn (Food)", priceFormatted: "12.000 VNĐ" },
  { id: "fd-6", name: "Bánh tráng phơi sương + Ớt siêu cay", category: "Món Ăn (Food)", priceFormatted: "12.000 VNĐ" },
  { id: "fd-7", name: "Phô mai que", category: "Món Ăn (Food)", priceFormatted: "20.000 VNĐ" },
  { id: "fd-8", name: "Khoai tây chiên", category: "Món Ăn (Food)", priceFormatted: "20.000 VNĐ" },
  { id: "fd-9", name: "Cá viên", category: "Món Ăn (Food)", priceFormatted: "20.000 VNĐ" },
  { id: "fd-10", name: "Bò viên", category: "Món Ăn (Food)", priceFormatted: "20.000 VNĐ" },
  { id: "fd-11", name: "Chả cá cốm", category: "Món Ăn (Food)", priceFormatted: "25.000 VNĐ" },
  { id: "fd-12", name: "Hồ lô", category: "Món Ăn (Food)", priceFormatted: "25.000 VNĐ" },
  { id: "fd-13", name: "Xúc xích Đức", category: "Món Ăn (Food)", priceFormatted: "25.000 VNĐ" },
];
