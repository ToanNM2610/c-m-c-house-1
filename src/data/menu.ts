export interface MenuItem {
  id: string;
  name: string;
  price: string;
  desc?: string;
  category: string;
  inStock: boolean;
  nameEn?: string;
  categoryEn?: string;
}

export const menuData: MenuItem[] = [
  // CÀ PHÊ
  { id: "c1", name: "Cà phê đen/sữa", nameEn: "Black / Milk Coffee", price: "20.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c2", name: "Cà phê sài gòn", nameEn: "Saigon Style Coffee", price: "25.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c3", name: "Cà phê muối", nameEn: "Salted Coffee", price: "28.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c4", name: "Cà phê dừa xay", nameEn: "Coconut Blended Coffee", price: "28.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c5", name: "Cà phê kem trứng", nameEn: "Egg Cream Coffee", price: "30.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c6", name: "Bạc xỉu", nameEn: "Bac Xiu (White Coffee)", price: "25.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c7", name: "Cacao sữa", nameEn: "Hot/Iced Milk Cocoa", price: "25.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c8", name: "Cacao kem muối", nameEn: "Salted Cream Cocoa", price: "28.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },
  { id: "c9", name: "Cacao kem trứng", nameEn: "Egg Cream Cocoa", price: "30.000đ", category: "CÀ PHÊ", categoryEn: "COFFEE", inStock: true },

  // TRÀ
  { id: "t1", name: "Trà gừng mật ong", nameEn: "Honey Ginger Tea", price: "25.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t2", name: "Trà Lipton thảo mộc", nameEn: "Herbal Lipton Tea", price: "27.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t3", name: "Trà vải", nameEn: "Lychee Tea", price: "27.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t4", name: "Trà đào", nameEn: "Peach Tea", price: "27.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t5", name: "Trà đào cam sả", nameEn: "Peach Orange Lemongrass Tea", price: "30.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t6", name: "Trà sữa Thái xanh", nameEn: "Thai Green Milk Tea", price: "27.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t7", name: "Trà sữa truyền thống", nameEn: "Traditional Milk Tea", price: "25.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t8", name: "Trà sữa kem trứng", nameEn: "Egg Cream Milk Tea", price: "30.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t9", name: "Trà hoa cúc", nameEn: "Chamomile Chrysanthemum Tea", price: "28.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },
  { id: "t10", name: "Hoa đu đủ mật ong", nameEn: "Papaya Flower Honey Tea", price: "28.000đ", category: "TRÀ", categoryEn: "TEA", inStock: true },

  // SINH TỐ
  { id: "st1", name: "Sinh tố Mãng cầu", nameEn: "Soursop Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st2", name: "Sinh tố Sapoche", nameEn: "Sapodilla (Sapoche) Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st3", name: "Sinh tố Xoài", nameEn: "Mango Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st4", name: "Sinh tố Dừa", nameEn: "Coconut Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st5", name: "Sinh tố Bơ", nameEn: "Avocado Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st6", name: "Sinh tố Đậu đỏ", nameEn: "Red Bean Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st7", name: "Sinh tố Việt quất/Dâu", nameEn: "Blueberry / Strawberry Smoothie", price: "28.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st8", name: "Sinh tố Bơ sầu riêng", nameEn: "Avocado Durian Smoothie", price: "33.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },
  { id: "st9", name: "Sinh tố Hạt sen", nameEn: "Lotus Seed Smoothie", price: "33.000đ", category: "SINH TỐ", categoryEn: "SMOOTHIES", inStock: true },

  // NƯỚC ÉP
  { id: "e1", name: "Nước ép Táo", nameEn: "Fresh Apple Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e2", name: "Nước ép Ổi", nameEn: "Fresh Guava Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e3", name: "Nước ép Cam", nameEn: "Fresh Orange Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e4", name: "Nước ép Thơm", nameEn: "Fresh Pineapple Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e5", name: "Nước ép Chanh dây", nameEn: "Passion Fruit Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e6", name: "Nước ép Cà rốt", nameEn: "Fresh Carrot Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e7", name: "Nước ép Dưa hấu", nameEn: "Fresh Watermelon Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e8", name: "Nước ép Cải kale", nameEn: "Kale Green Juice", price: "30.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },
  { id: "e9", name: "Nước ép Mix tùy chọn", nameEn: "Custom Mixed Juice", price: "35.000đ", category: "NƯỚC ÉP", categoryEn: "FRESH JUICE", inStock: true },

  // SODA / SỮA CHUA
  { id: "sd1", name: "Soda Atiso đỏ", nameEn: "Red Hibiscus Soda", price: "30.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sd2", name: "Soda chanh bạc hà", nameEn: "Mint Lime Soda", price: "30.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sd3", name: "Soda việt quất/dâu", nameEn: "Blueberry / Strawberry Soda", price: "30.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sc1", name: "Sữa chua dầm", nameEn: "Crushed Ice Yogurt", price: "23.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sc2", name: "Sữa chua nếp cẩm", nameEn: "Black Sticky Rice Yogurt", price: "27.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sc3", name: "Sữa chua chanh dây", nameEn: "Passion Fruit Yogurt", price: "27.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sc4", name: "Sữa chua việt quất/dâu", nameEn: "Blueberry / Strawberry Yogurt", price: "27.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },
  { id: "sc5", name: "Sữa chua hạt đác", nameEn: "Arenga Palm Seed Yogurt", price: "30.000đ", category: "SODA / SỮA CHUA", categoryEn: "SODA & YOGURT", inStock: true },

  // KHÁC
  { id: "k1", name: "Đá me", nameEn: "Iced Tamarind Drink", price: "27.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k2", name: "Tắc xí muội", nameEn: "Preserved Salted Plum Kumquat Drink", price: "27.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k3", name: "Dừa tươi", nameEn: "Fresh Young Coconut", price: "22.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k4", name: "Chanh mật ong", nameEn: "Honey Lemon Drink", price: "25.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k5", name: "Chanh muối", nameEn: "Preserved Salted Lime Drink", price: "25.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k6", name: "Dưa hấu tắc xay", nameEn: "Blended Watermelon & Kumquat", price: "27.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k7", name: "Matcha latte", nameEn: "Matcha Latte", price: "27.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k8", name: "Matcha đậu đỏ", nameEn: "Matcha Red Bean", price: "30.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },
  { id: "k9", name: "Oreo đá xay", nameEn: "Oreo Ice Blended", price: "30.000đ", category: "KHÁC", categoryEn: "OTHERS", inStock: true },

  // MÓN ĂN (FOOD)
  { id: "f1", name: "Bánh mì ốp la xúc xích", nameEn: "Baguette with Sunny-Side Up Eggs & Sausage", price: "30.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f2", name: "Mỳ Spaghetti", nameEn: "Spaghetti Bolognese", price: "35.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f3", name: "Bò kho + bánh mì", nameEn: "Vietnamese Beef Stew with Baguette", price: "45.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f4", name: "Cà ri gà + bánh mì", nameEn: "Chicken Curry with Baguette", price: "45.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f5", name: "Bánh tráng phơi sương + Sa tế", nameEn: "Dew-soaked Rice Paper with Chili Sate", price: "12.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f6", name: "Bánh tráng phơi sương + Ớt siêu cay", nameEn: "Dew-soaked Rice Paper with Extra Hot Chili", price: "12.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f7", name: "Phô mai que", nameEn: "Fried Mozzarella Sticks", price: "20.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f8", name: "Khoai tây chiên", nameEn: "Crispy French Fries", price: "20.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f9", name: "Cá viên", nameEn: "Fried Fish Balls", price: "20.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f10", name: "Bò viên", nameEn: "Fried Beef Balls", price: "20.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f11", name: "Chả cá cốm", nameEn: "Green Rice Flake Fish Cakes", price: "25.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f12", name: "Hồ lô", nameEn: "Grilled Gourd Sausages", price: "25.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
  { id: "f13", name: "Xúc xích Đức", nameEn: "German Sausages", price: "25.000đ", category: "MÓN ĂN", categoryEn: "FOOD & SNACKS", inStock: true },
];

export const getMenuByCategory = () => {
  const grouped = menuData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  return grouped;
};
