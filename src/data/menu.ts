export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: "coffee" | "tea" | "smoothie" | "juice" | "soda-yogurt" | "others" | "food" | string;
  categoryName: string;
  tag?: string;
  description?: string;
  image?: string;
  isAvailable?: boolean;
  inStock?: boolean;
  priceFormatted?: string;
}

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
  tea: "/images/fruit-tea.png",
  smoothie: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80",
  juice: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80",
  "soda-yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
  others: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80",
  food: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
};

export function getMenuItemImage(item: MenuItem): string {
  if (item.image) return item.image;
  return CATEGORY_FALLBACK_IMAGES[item.category] || "/images/coffee-drink.png";
}

export const MENU_CATEGORIES = [
  { id: "all", name: "Tất Cả" },
  { id: "coffee", name: "Cà Phê Mộc" },
  { id: "tea", name: "Trà Thảo Mộc" },
  { id: "smoothie", name: "Sinh Tố" },
  { id: "juice", name: "Nước Ép" },
  { id: "soda-yogurt", name: "Soda & Sữa Chua" },
  { id: "others", name: "Đồ Uống Khác" },
  { id: "food", name: "Món Ăn Lành" },
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. CÀ PHÊ MỘC
  { id: "c1", name: "Cà phê đen / sữa", price: 20000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80", description: "Robusta Đắk Nông nguyên bản rang mộc thủ công" },
  { id: "c2", name: "Cà phê Sài Gòn", price: 25000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80", description: "Hương vị ngọt dịu nhẹ, đậm đà phong cách phương Nam" },
  { id: "c3", name: "Bạc xỉu", price: 25000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80", description: "Sữa thơm ngọt béo quyện chút cà phê nồng nàn" },
  { id: "c4", name: "Cacao sữa", price: 25000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", description: "Bột cacao nguyên chất hòa sữa ấm sánh mịn" },
  { id: "c5", name: "Cà phê muối Đắk Nông", price: 28000, category: "coffee", categoryName: "Cà Phê Mộc", tag: "Signature", image: "/images/coffee-drink.png", description: "Robusta Đắk Nông hòa quyện lớp kem béo mặn mòi, vị ngọt thanh lưu luyến" },
  { id: "c6", name: "Cà phê dừa xay", price: 28000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80", description: "Cốt dừa béo ngậy xay mịn cùng giọt cà phê đắng êm dịu" },
  { id: "c7", name: "Cacao kem muối", price: 28000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", description: "Lớp bọt muối mặn mòi kết hợp cacao đậm đà" },
  { id: "c8", name: "Cà phê kem trứng", price: 30000, category: "coffee", categoryName: "Cà Phê Mộc", tag: "Đặc biệt", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80", description: "Kem trứng đánh bông mịn như mây bên dòng suối" },
  { id: "c9", name: "Cacao kem trứng", price: 30000, category: "coffee", categoryName: "Cà Phê Mộc", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", description: "Vị đắng nhẹ thơm lừng hòa lớp kem trứng béo ngậy" },

  // 2. TRÀ THẢO MỘC & TRÀ TRÁI CÂY
  { id: "t1", name: "Trà gừng mật ong", price: 25000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80", description: "Gừng sẻ cay ấm kết hợp mật ong rừng cao nguyên" },
  { id: "t2", name: "Trà sữa truyền thống", price: 25000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1558857563-b37df2dd93b8?auto=format&fit=crop&w=400&q=80", description: "Vị trà đậm, sữa thanh béo vừa vặn" },
  { id: "t3", name: "Trà Lipton thảo mộc", price: 27000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80", description: "Kèm lát cam vàng và thảo mộc thơm lành" },
  { id: "t4", name: "Trà vải", price: 27000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80", description: "Trái vải mọng nước, hương thơm thanh tao ngọt mát" },
  { id: "t5", name: "Trà đào", price: 27000, category: "tea", categoryName: "Trà Thảo Mộc", image: "/images/fruit-tea.png", description: "Miếng đào giòn sần sật trong nền trà thanh thoát" },
  { id: "t6", name: "Trà sữa Thái xanh", price: 27000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1558857563-b37df2dd93b8?auto=format&fit=crop&w=400&q=80", description: "Hương trà xanh thơm mát béo ngậy" },
  { id: "t7", name: "Trà hoa cúc", price: 28000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80", description: "Hoa cúc sấy lạnh xoa dịu tinh thần, an thần ngủ ngon" },
  { id: "t8", name: "Hoa đu đủ mật ong", price: 28000, category: "tea", categoryName: "Trà Thảo Mộc", tag: "Best Seller", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80", description: "Hoa đu đủ đực ngâm mật ong rừng giúp thư thái, thanh giọng" },
  { id: "t9", name: "Trà đào cam sả", price: 30000, category: "tea", categoryName: "Trà Thảo Mộc", tag: "Thanh Mát", image: "/images/fruit-tea.png", description: "Trà ủ hương sả tươi đồi cao, từng lát cam vàng ươm mọng nước" },
  { id: "t10", name: "Trà sữa kem trứng", price: 30000, category: "tea", categoryName: "Trà Thảo Mộc", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80", description: "Trà sữa thơm quyện kem trứng vàng ươm sánh mượt" },

  // 3. SINH TỐ TƯƠI MÁT
  { id: "s1", name: "Sinh tố mãng cầu", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Chua ngọt sảng khoái từ mãng cầu xiêm tươi vườn" },
  { id: "s2", name: "Sinh tố sapoche", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Ngọt đượm tự nhiên, xay cùng sữa đặc béo ngậy" },
  { id: "s3", name: "Sinh tố xoài", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=400&q=80", description: "Xoài chín cây thơm ngát, sánh đặc hấp dẫn" },
  { id: "s4", name: "Sinh tố dừa", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80", description: "Cơm dừa non béo thơm xay đá mát lạnh" },
  { id: "s5", name: "Sinh tố bơ Đắk Nông", price: 28000, category: "smoothie", categoryName: "Sinh Tố", tag: "Đặc Sản", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Bơ sáp 034 nức tiếng đất đỏ Đắk Nông dẻo quánh" },
  { id: "s6", name: "Sinh tố đậu đỏ", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", description: "Đậu đỏ ninh mềm bùi béo tự nhiên" },
  { id: "s7", name: "Sinh tố việt quất / dâu", price: 28000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Vị dâu tây tươi mát bùng nổ năng lượng" },
  { id: "s8", name: "Sinh tố bơ sầu riêng", price: 33000, category: "smoothie", categoryName: "Sinh Tố", tag: "Đặc Sản VIP", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Bơ sáp béo quyện sầu riêng Ri6 thơm lừng nức tiếng" },
  { id: "s9", name: "Sinh tố hạt sen", price: 33000, category: "smoothie", categoryName: "Sinh Tố", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80", description: "Hạt sen Huế bùi thơm thanh nhiệt cơ thể" },

  // 4. NƯỚC ÉP TƯƠI ÉP LẠNH
  { id: "j1", name: "Nước ép táo", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80", description: "Táo giòn ngọt mát ép chậm giữ trọn vitamin" },
  { id: "j2", name: "Nước ép ổi", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=400&q=80", description: "Ổi ruột hồng giàu vitamin C và chất chống oxy hóa" },
  { id: "j3", name: "Nước ép cam", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80", description: "Cam vắt tươi ngọt thanh bổ dưỡng" },
  { id: "j4", name: "Nước ép thơm", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=400&q=80", description: "Dứa mật vàng ươm giải nhiệt ngày hè" },
  { id: "j5", name: "Nước ép chanh dây", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=400&q=80", description: "Chanh dây thơm lừng vị chua sảng khoái" },
  { id: "j6", name: "Nước ép cà rốt", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80", description: "Cà rốt tươi mát lành sáng mắt" },
  { id: "j7", name: "Nước ép dưa hấu", price: 30000, category: "juice", categoryName: "Nước Ép", image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=400&q=80", description: "Dưa hấu mọng nước đỏ tươi ngọt mát" },
  { id: "j8", name: "Nước ép cải kale", price: 30000, category: "juice", categoryName: "Nước Ép", tag: "Healthy", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80", description: "Cải xoăn hữu cơ giàu khoáng chất detox cơ thể" },
  { id: "j9", name: "Nước ép mix tùy chọn", price: 35000, category: "juice", categoryName: "Nước Ép", tag: "Theo Yêu Cầu", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80", description: "Phối hợp 2-3 loại trái cây tươi theo sở thích của bạn" },

  // 5. SODA & SỮA CHUA
  { id: "sy1", name: "Sữa chua dầm", price: 23000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", description: "Sữa chua nhà làm lên men tự nhiên mát lành" },
  { id: "sy2", name: "Sữa chua nếp cẩm", price: 27000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", description: "Nếp cẩm dẻo thơm quyện cùng sữa chua sánh mịn" },
  { id: "sy3", name: "Sữa chua chanh dây", price: 27000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", description: "Sốt chanh dây tự nấu chua ngọt kích thích vị giác" },
  { id: "sy4", name: "Sữa chua việt quất / dâu", price: 27000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", description: "Sốt quả mọng chua ngọt hòa quyện" },
  { id: "sy5", name: "Soda Atiso đỏ", price: 30000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80", description: "Hoa bụp giấm đỏ ruby sủi bọt mát lạnh" },
  { id: "sy6", name: "Soda chanh bạc hà", price: 30000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80", description: "Bạc hà the mát cùng chanh tươi giải nhiệt tuyệt đỉnh" },
  { id: "sy7", name: "Soda việt quất / dâu", price: 30000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80", description: "Sắc màu rực rỡ, vị sủi bọt đã khát" },
  { id: "sy8", name: "Sữa chua hạt đác", price: 30000, category: "soda-yogurt", categoryName: "Soda & Sữa Chua", tag: "Mát Lành", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80", description: "Hạt đác rim thơm dẻo dai hòa sữa chua mát lạnh" },

  // 6. THỨC UỐNG KHÁC
  { id: "o1", name: "Dừa tươi ướp lạnh suối", price: 22000, category: "others", categoryName: "Đồ Uống Khác", tag: "Sát Suối", image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80", description: "Dừa xiêm ngâm trực tiếp dưới dòng nước mát lạnh tự nhiên" },
  { id: "o2", name: "Chanh mật ong", price: 25000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80", description: "Chanh tươi mật ong thanh lọc cơ thể" },
  { id: "o3", name: "Chanh muối", price: 25000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80", description: "Chanh muối ủ chum sành truyền thống đậm đà" },
  { id: "o4", name: "Đá me", price: 27000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80", description: "Me ngào dẻo thơm bùi đậu phộng rang giòn" },
  { id: "o5", name: "Tắc xí muội", price: 27000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80", description: "Vị mặn ngọt thanh tao gợi nhớ ký ức tuổi thơ" },
  { id: "o6", name: "Dưa hấu tắc xay", price: 27000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=400&q=80", description: "Sự kết hợp độc đáo sảng khoái bất ngờ" },
  { id: "o7", name: "Matcha latte", price: 27000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80", description: "Trà xanh thanh khiết hòa cùng sữa tươi thơm mịn" },
  { id: "o8", name: "Matcha đậu đỏ", price: 30000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80", description: "Matcha nguyên chất kèm topping đậu đỏ bùi thơm" },
  { id: "o9", name: "Oreo đá xay", price: 30000, category: "others", categoryName: "Đồ Uống Khác", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", description: "Bánh quy Oreo xay cùng sữa và kem tươi béo ngậy" },

  // 7. MÓN ĂN LÀNH & ĂN VẶT
  { id: "f1", name: "Bánh tráng phơi sương + Sa tế", price: 12000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Bánh dẻo phơi sương sớm, sa tế cay nồng đậm vị" },
  { id: "f2", name: "Bánh tráng phơi sương + Ớt cay", price: 12000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Bánh tráng dẻo thơm cuộn muối ớt cay xé lưỡi" },
  { id: "f3", name: "Phô mai que", price: 20000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80", description: "Chiên vàng giòn rụm, phô mai kéo sợi thơm phức" },
  { id: "f4", name: "Khoai tây chiên", price: 20000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80", description: "Khoai tây giòn rụm chấm tương ớt cay nhẹ" },
  { id: "f5", name: "Cá viên", price: 20000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Cá viên chiên nóng hổi thơm ngon" },
  { id: "f6", name: "Bò viên", price: 20000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Bò viên chiên giòn dai ngon đậm vị" },
  { id: "f7", name: "Chả cá cốm", price: 25000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Cốm xanh thơm dẻo bọc chả cá ngọt mềm chiên vàng" },
  { id: "f8", name: "Hồ lô nướng", price: 25000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Viên hồ lô thơm nức tiêu rừng Tây Nguyên" },
  { id: "f9", name: "Xúc xích Đức", price: 25000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", description: "Xúc xích xông khói thơm lừng nướng giòn" },
  { id: "f10", name: "Bánh mì ốp la xúc xích", price: 30000, category: "food", categoryName: "Món Ăn Lành", tag: "Ăn Sáng", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80", description: "Bánh mì nướng than giòn rụm, 2 trứng lòng đào béo ngậy kèm xúc xích" },
  { id: "f11", name: "Mì Ý Spaghetti bò bằm", price: 35000, category: "food", categoryName: "Món Ăn Lành", image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=400&q=80", description: "Sợi mì dai mềm quyện sốt cà chua tươi và thịt bò bằm" },
  { id: "f12", name: "Bò kho + bánh mì", price: 45000, category: "food", categoryName: "Món Ăn Lành", tag: "Đặc Sản", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80", description: "Hầm thảo quả và quế hồi thơm phức, thịt nạm bò mềm thấm đượm gia vị núi rừng" },
  { id: "f13", name: "Cà ri gà + bánh mì", price: 45000, category: "food", categoryName: "Món Ăn Lành", tag: "Đặc Sản", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=80", description: "Thịt gà thả vườn thơm ngọt, nước cà ri béo ngậy nước cốt dừa" },
];
