export const CAM_CU_HOUSE_INFO = {
  name: "Cẩm Cù House",
  tagline: "Cà phê sinh thái bên bờ suối — Xanh sạch, trong lành, hòa mình với thiên nhiên",
  category: "Quán cà phê sinh thái & Điểm tâm",
  priceRange: "$",
  priceDescription: "Giá bình dân, thân thiện (20.000đ – 45.000đ)",
  coordinates: {
    lat: 11.99,
    lng: 107.69,
    display: "11.99° N, 107.69° E",
  },
  rating: {
    recommendPercent: 100,
    totalReviews: 8,
    summary: "100% đề xuất (8 lượt đánh giá thực tế)",
  },
  address: {
    street: "Hẻm 437 Hùng Vương",
    ward: "Phường Nghĩa Trung",
    city: "TP. Gia Nghĩa",
    province: "Đắk Nông",
    fullAddress: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông",
  },
  contacts: {
    phones: ["0382851688", "0774659000"],
    formattedPhones: ["0382 851 688", "0774 659 000"],
    primaryTel: "tel:0382851688",
    secondaryTel: "tel:0774659000",
    email: "thuynhu8788@gmail.com",
  },
  openingHours: {
    timezone: "Asia/Ho_Chi_Minh",
    mondayToThursday: {
      open: "07:00",
      close: "18:00",
      label: "Thứ Hai – Thứ Năm: 07:00 – 18:00",
      openMinutes: 7 * 60,
      closeMinutes: 18 * 60,
    },
    fridayToSunday: {
      open: "07:00",
      close: "22:00",
      label: "Thứ Sáu – Chủ Nhật: 07:00 – 22:00",
      openMinutes: 7 * 60,
      closeMinutes: 22 * 60,
    },
  },
  amenities: [
    "View đẹp bên bờ suối",
    "Không gian sinh thái xanh sạch trong lành",
    "Chỗ ngồi ngoài trời hòa mình với thiên nhiên",
    "Nhận đặt bàn trước",
    "Phục vụ mang về (Takeaway)",
  ],
  socials: {
    googleMaps: "https://maps.app.goo.gl/G6aP51qJ6aDabp676",
    facebook: "https://www.facebook.com/share/1DVLMySW8H/",
    tiktok: "https://www.tiktok.com/@camcuhousedaknong?is_from_webapp=1&sender_device=pc",
    youtube: "https://www.youtube.com/@Cam_Cu_House",
  },
} as const;

export interface EditorialMenuItem {
  code: string;
  name: string;
  variants?: string[];
  note?: string;
  price?: number;
  badge?: "Signature" | "Best-seller" | "Green & Clean" | "Morning";
}

export interface EditorialMenuCategory {
  id: string;
  order: string;
  titleVi: string;
  titleEn: string;
  subtitle: string;
  items: EditorialMenuItem[];
}

export const EDITORIAL_MENU_DATA: EditorialMenuCategory[] = [
  {
    id: "ca-phe",
    order: "01",
    titleVi: "Cà Phê & Cacao",
    titleEn: "Coffee & Artisanal Cacao",
    subtitle: "Hương vị đậm đà phố núi Đắk Nông, rang xay nguyên chất",
    items: [
      { code: "CF-01", name: "Cà phê truyền thống", variants: ["Đen", "Sữa"], note: "Đậm vị cà phê Tây Nguyên", price: 20000 },
      { code: "CF-02", name: "Cà phê Sài Gòn", note: "Thơm béo, hậu vị êm", price: 25000 },
      { code: "CF-03", name: "Cà phê muối", badge: "Best-seller", note: "Lớp kem muối mặn dịu quyện cà phê đậm", price: 28000 },
      { code: "CF-04", name: "Cà phê dừa xay", badge: "Signature", note: "Cốt dừa béo bùi đá xay mát lạnh", price: 28000 },
      { code: "CF-05", name: "Cà phê kem trứng", note: "Kem trứng đánh bông sánh mịn", price: 30000 },
      { code: "CF-06", name: "Bạc xỉu", note: "Nhiều sữa ấm hoặc đá, dịu nhẹ", price: 25000 },
      { code: "CF-07", name: "Cacao sữa", note: "Cacao nguyên chất pha sữa", price: 25000 },
      { code: "CF-08", name: "Cacao kem muối", note: "Đậm vị cacao cùng lớp kem muối mịn", price: 28000 },
      { code: "CF-09", name: "Cacao kem trứng", note: "Béo thơm lớp kem trứng thủ công", price: 30000 },
    ],
  },
  {
    id: "tra",
    order: "02",
    titleVi: "Trà Thảo Mộc & Trà Sữa",
    titleEn: "Botanical Teas & Milk Teas",
    subtitle: "Thanh mát từ trái cây tươi và thảo mộc tự nhiên lành tính",
    items: [
      { code: "TR-01", name: "Trà gừng mật ong", badge: "Green & Clean", note: "Ấm bụng, thơm nồng gừng tươi & mật ong", price: 25000 },
      { code: "TR-02", name: "Trà Lipton thảo mộc", note: "Hương thảo mộc dịu mát", price: 27000 },
      { code: "TR-03", name: "Trà vải", note: "Thanh ngọt kèm trái vải giòn", price: 27000 },
      { code: "TR-04", name: "Trà đào", note: "Đào ngâm giòn thơm mát", price: 27000 },
      { code: "TR-05", name: "Trà đào cam sả", badge: "Best-seller", note: "Hương sả tươi, cam vàng và đào miếng", price: 28000 },
      { code: "TR-06", name: "Trà sữa Thái xanh", note: "Thơm đậm cốt trà Thái", price: 27000 },
      { code: "TR-07", name: "Trà sữa truyền thống", note: "Vị trà sữa cân bằng, dễ uống", price: 25000 },
      { code: "TR-08", name: "Trà sữa kem trứng", note: "Phủ lớp kem trứng béo ngậy", price: 32000 },
      { code: "TR-09", name: "Trà hoa cúc", badge: "Green & Clean", note: "Thư giãn tinh thần bên tiếng suối chảy", price: 28000 },
      { code: "TR-10", name: "Hoa đu đủ mật ong", badge: "Signature", note: "Thảo mộc quý ngâm mật ong rừng thanh lành", price: 35000 },
    ],
  },
  {
    id: "sinh-to",
    order: "03",
    titleVi: "Sinh Tố Trái Cây Tươi",
    titleEn: "Fresh Orchard Smoothies",
    subtitle: "Trái cây tươi chọn lọc, xay mịn giàu dinh dưỡng",
    items: [
      { code: "ST-01", name: "Sinh tố Mãng cầu", note: "Chua ngọt tự nhiên, giàu vitamin C", price: 35000 },
      { code: "ST-02", name: "Sinh tố Sapoche", note: "Ngọt dịu, sánh mịn", price: 30000 },
      { code: "ST-03", name: "Sinh tố Xoài", note: "Xoài chín vàng thơm lừng", price: 30000 },
      { code: "ST-04", name: "Sinh tố Dừa", note: "Cơm dừa non xay béo mát", price: 30000 },
      { code: "ST-05", name: "Sinh tố Bơ", badge: "Best-seller", note: "Bơ sáp dẻo mịn đặc trưng vùng đất Đắk Nông", price: 35000 },
      { code: "ST-06", name: "Sinh tố Đậu đỏ", note: "Bùi béo, thanh mát", price: 30000 },
      { code: "ST-07", name: "Sinh tố Việt quất / Dâu", variants: ["Việt quất", "Dâu"], note: "Chua dịu hương quả mọng", price: 35000 },
      { code: "ST-08", name: "Sinh tố Bơ sầu riêng", badge: "Signature", note: "Sự kết hợp hoàn hảo giữa bơ sáp và cơm sầu riêng", price: 45000 },
      { code: "ST-09", name: "Sinh tố Hạt sen", badge: "Green & Clean", note: "Thanh tâm, bùi ngọt tự nhiên", price: 35000 },
    ],
  },
  {
    id: "nuoc-ep",
    order: "04",
    titleVi: "Nước Ép Nguyên Chất",
    titleEn: "Cold-Pressed & Fresh Juices",
    subtitle: "Ép tươi 100% khi gọi món, giữ trọn dưỡng chất xanh sạch",
    items: [
      { code: "NE-01", name: "Nước ép Táo", note: "Thanh ngọt, dễ uống", price: 30000 },
      { code: "NE-02", name: "Nước ép Ổi", note: "Giàu vitamin C, thơm mát", price: 28000 },
      { code: "NE-03", name: "Nước ép Cam", note: "Cam tươi vắt nguyên chất", price: 30000 },
      { code: "NE-04", name: "Nước ép Thơm", note: "Chua ngọt sảng khoái", price: 28000 },
      { code: "NE-05", name: "Nước ép Chanh dây", note: "Thơm lừng, giải nhiệt tức thì", price: 25000 },
      { code: "NE-06", name: "Nước ép Cà rốt", note: "Giàu vitamin A, ngọt tự nhiên", price: 28000 },
      { code: "NE-07", name: "Nước ép Dưa hấu", note: "Mát lành cho ngày nắng", price: 25000 },
      { code: "NE-08", name: "Nước ép Cải Kale", badge: "Green & Clean", note: "Thức uống xanh detox, thanh lọc cơ thể", price: 35000 },
      { code: "NE-09", name: "Nước ép Mix tùy chọn", badge: "Signature", note: "Tự do kết hợp các loại quả và rau xanh theo sở thích", price: 35000 },
    ],
  },
  {
    id: "soda-sua-chua",
    order: "05",
    titleVi: "Soda & Sữa Chua",
    titleEn: "Sparkling Sodas & Artisan Yogurt",
    subtitle: "Sảng khoái bọt ga và sữa chua lên men tự nhiên tốt cho tiêu hóa",
    items: [
      { code: "SY-01", name: "Soda Atiso đỏ", badge: "Signature", note: "Sắc đỏ ruby thanh mát, chua dịu", price: 28000 },
      { code: "SY-02", name: "Soda chanh bạc hà", note: "Mát lạnh hương lá bạc hà tươi", price: 28000 },
      { code: "SY-03", name: "Soda Việt quất / Dâu", variants: ["Việt quất", "Dâu"], note: "Sủi tăm mát lạnh vị quả mọng", price: 28000 },
      { code: "SY-04", name: "Sữa chua dầm", note: "Sữa chua sánh mịn dầm đá mát lạnh", price: 25000 },
      { code: "SY-05", name: "Sữa chua nếp cẩm", note: "Nếp cẩm dẻo thơm quyện sữa chua", price: 28000 },
      { code: "SY-06", name: "Sữa chua chanh dây", note: "Hương chanh dây chua thanh quyến rũ", price: 28000 },
      { code: "SY-07", name: "Sữa chua Việt quất / Dâu", variants: ["Việt quất", "Dâu"], note: "Sữa chua kết hợp sốt quả mọng", price: 28000 },
      { code: "SY-08", name: "Sữa chua hạt đác", badge: "Best-seller", note: "Hạt đác rim giòn sần sật", price: 30000 },
    ],
  },
  {
    id: "other",
    order: "06",
    titleVi: "Thức Uống Khác & Đá Xay",
    titleEn: "Local Refreshers & Matcha",
    subtitle: "Những hương vị giải khát dân dã, gần gũi và Matcha Nhật Bản",
    items: [
      { code: "OT-01", name: "Đá me", note: "Me ngào chua ngọt kèm đậu phộng", price: 25000 },
      { code: "OT-02", name: "Tắc xí muội", note: "Thơm dịu, thanh giọng", price: 25000 },
      { code: "OT-03", name: "Dừa tươi", badge: "Green & Clean", note: "Nước dừa tươi mát lành tự nhiên", price: 30000 },
      { code: "OT-04", name: "Chanh mật ong", note: "Cân bằng vị giác, tốt cho cổ họng", price: 25000 },
      { code: "OT-05", name: "Chanh muối", note: "Đậm đà, bù khoáng ngày nắng", price: 25000 },
      { code: "OT-06", name: "Dưa hấu tắc xay", badge: "Signature", note: "Sự kết hợp độc đáo giữa dưa hấu ngọt và hương tắc thơm", price: 30000 },
      { code: "OT-07", name: "Matcha Latte", note: "Trà xanh Matcha quyện sữa tươi êm dịu", price: 30000 },
      { code: "OT-08", name: "Matcha đậu đỏ", note: "Matcha thơm chát nhẹ kèm hạt đậu đỏ bùi", price: 35000 },
      { code: "OT-09", name: "Oreo đá xay", note: "Bánh Oreo xay nhuyễn cùng kem sữa", price: 32000 },
    ],
  },
  {
    id: "food",
    order: "07",
    titleVi: "Điểm Tâm & Đồ Ăn Vặt",
    titleEn: "All-Day Bites & Local Snacks",
    subtitle: "Bữa sáng ấm bụng bên bờ suối và các món ăn vặt nhâm nhi cùng bạn bè",
    items: [
      { code: "FD-01", name: "Bánh mì ốp la xúc xích", badge: "Morning", note: "Bữa sáng gọn gàng, giàu năng lượng", price: 30000 },
      { code: "FD-02", name: "Mỳ Spaghetti", note: "Mỳ Ý sốt đậm đà", price: 35000 },
      { code: "FD-03", name: "Bò kho + Bánh mì", badge: "Best-seller", note: "Bò kho mềm thơm chấm bánh mì nóng giòn", price: 38000 },
      { code: "FD-04", name: "Cà ri gà + Bánh mì", badge: "Morning", note: "Cà ri béo thơm cốt dừa ăn kèm bánh mì", price: 38000 },
      { code: "FD-05", name: "Bánh tráng phơi sương", variants: ["+ Sa tế", "+ Ớt siêu cay"], badge: "Signature", note: "Món nhâm nhi bắt vị với 2 cấp độ cay", price: 25000 },
      { code: "FD-06", name: "Phô mai que", note: "Vỏ giòn rụm, nhân phô mai kéo sợi", price: 25000 },
      { code: "FD-07", name: "Khoai tây chiên", note: "Chiên vàng giòn nóng hổi", price: 25000 },
      { code: "FD-08", name: "Cá viên", note: "Món ăn vặt quen thuộc", price: 20000 },
      { code: "FD-09", name: "Bò viên", note: "Dai giòn, thơm vị bò", price: 25000 },
      { code: "FD-10", name: "Chả cá cốm", note: "Thơm hương cốm xanh, vỏ giòn dai", price: 25000 },
      { code: "FD-11", name: "Hồ lô", note: "Hồ lô nướng/chiên đậm vị", price: 25000 },
      { code: "FD-12", name: "Xúc xích Đức", note: "Xúc xích vỏ giòn, chấm tương ớt/cà", price: 25000 },
    ],
  },
];

export interface SpatialPhotoItem {
  id: string;
  figureCode: string;
  orderNumber: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  chapter: number;
}

export interface SpatialChapter {
  chapter: number;
  romanNum: string;
  titleVi: string;
  titleEn: string;
  rangeLabel: string;
  photos: SpatialPhotoItem[];
}

export const SPATIAL_CHAPTERS: SpatialChapter[] = [
  {
    chapter: 1,
    romanNum: "Chương I",
    titleVi: "Ngưỡng Cửa & Lối Nhỏ Hẻm 437",
    titleEn: "Threshold & Lane 437 Pathway",
    rangeLabel: "FIG. 01 — 07",
    photos: [
      { id: "sp1", figureCode: "FIG. 01", orderNumber: "01", title: "Chòi Gỗ Mộc Ngắm Đồi Xanh", subtitle: "Hiên Gỗ Nhìn Thung Lũng", description: "Hiên gỗ lợp lá thoáng đãng phóng tầm mắt ra thung lũng Đắk Nông lộng gió ban mai.", image: "/uploads/gallery/1788250253551-943009233.jpg", chapter: 1 },
      { id: "sp2", figureCode: "FIG. 02", orderNumber: "02", title: "Ban Công Suối Đón Gió Chiều", subtitle: "Lan Can Mộc Ven Suối", description: "Bàn tròn thư thái bên lan can mộc mạc nhìn xuống bờ suối róc rách đón gió chiều mát rượi.", image: "/uploads/gallery/1788250253554-875120458.jpg", chapter: 1 },
      { id: "sp3", figureCode: "FIG. 03", orderNumber: "03", title: "Băng Ghế Mộc Bên Vườn Hoa Vàng", subtitle: "Góc Check-in Rực Rỡ", description: "Ghế gỗ và nón lá thơ mộng dưới tán hoa chuông vàng rực rỡ bên triền đồi suối mát.", image: "/uploads/gallery/1788250253557-29323827.jpg", chapter: 1 },
      { id: "sp4", figureCode: "FIG. 04", orderNumber: "04", title: "Góc Bình Yên Dưới Tán Rừng", subtitle: "Khoảng Lặng Thiên Nhiên", description: "Điểm đọc sách và check-in rợp bóng cây xanh mát lành bên tiếng chim muông ríu rít.", image: "/uploads/gallery/1788250253560-200373033.jpg", chapter: 1 },
      { id: "sp5", figureCode: "FIG. 05", orderNumber: "05", title: "Tán Cây Xanh Mát Bên Dòng Suối", subtitle: "Bóng Râm Bờ Suối", description: "Không gian ngoài trời với bóng cây xanh mướt che chở cho những cuộc trò chuyện an yên bên suối.", image: "/uploads/gallery/1788250253562-580915883.jpg", chapter: 1 },
      { id: "sp6", figureCode: "FIG. 06", orderNumber: "06", title: "Góc Thổ Cẩm & Lồng Đèn Sắc Màu", subtitle: "Không Gian Văn Hóa", description: "Điểm nhấn hoa văn thổ cẩm Tây Nguyên kết hợp lồng đèn ấm cúng tạo góc check-in đậm đà bản sắc.", image: "/uploads/gallery/1788250253564-115851131.jpg", chapter: 1 },
      { id: "sp7", figureCode: "FIG. 07", orderNumber: "07", title: "Ban Công Cờ Đỏ & Ghế Bar Ngắm Đồi", subtitle: "Tầm Nhìn Cao Nguyên", description: "Dãy ghế bar gỗ hướng ra đồi xanh bạt ngàn, nơi ngắm mây trôi và nhâm nhi tách cà phê nguyên chất.", image: "/uploads/gallery/1788250253566-618481408.jpg", chapter: 1 },
    ],
  },
  {
    chapter: 2,
    romanNum: "Chương II",
    titleVi: "Bàn Ngoài Trời Bên Bờ Suối Mát",
    titleEn: "Outdoor Creekside Seating",
    rangeLabel: "FIG. 08 — 16",
    photos: [
      { id: "sp8", figureCode: "FIG. 08", orderNumber: "08", title: "Hoa Đào Nở Rộ Bên Ban Công Đón Nắng", subtitle: "Sắc Xuân Vùng Cao", description: "Cành đào hồng thắm khoe sắc bên bờ rào gỗ mộc, đón những tia nắng sớm trong trẻo của Gia Nghĩa.", image: "/uploads/gallery/1788250253568-69250175.jpg", chapter: 2 },
      { id: "sp9", figureCode: "FIG. 09", orderNumber: "09", title: "Chòi Gỗ Mái Trong Suốt Bên Suối", subtitle: "Không Gian Mở Bên Dòng Chảy", description: "Chòi nghỉ chân sát mép nước với mái lấy sáng tự nhiên, lắng nghe trọn vẹn bản hòa ca của suối đá.", image: "/uploads/gallery/1788250253570-358232239.jpg", chapter: 2 },
      { id: "sp10", figureCode: "FIG. 10", orderNumber: "10", title: "Hiên Mái Lá & Bàn Dài Làm Việc", subtitle: "Góc Co-working Giữa Thiên Nhiên", description: "Bàn gỗ mộc dài dưới mái lá mát rượi, lý tưởng cho những buổi làm việc sáng tạo hay họp mặt bạn bè.", image: "/uploads/gallery/1788250253572-915114239.jpg", chapter: 2 },
      { id: "sp11", figureCode: "FIG. 11", orderNumber: "11", title: "Ban Công Cờ Đỏ Bay Cao Giữa Đại Ngàn", subtitle: "Tự Hào Non Sông", description: "Lá cờ đỏ sao vàng tung bay kiêu hãnh trên ban công gỗ giữa nền trời xanh và rừng cây bạt ngàn.", image: "/uploads/gallery/1788250253574-977351820.jpg", chapter: 2 },
      { id: "sp12", figureCode: "FIG. 12", orderNumber: "12", title: "Ấm Áp Bên Lửa Trại Đêm Ven Suối", subtitle: "Đêm Lửa Trại Cao Nguyên", description: "Khu vực bếp lửa bập bùng xua tan cái lạnh sương đêm vùng cao, nơi du khách quây quần bên ấm trà nóng.", image: "/uploads/gallery/1788250253576-148814823.jpg", chapter: 2 },
      { id: "sp13", figureCode: "FIG. 13", orderNumber: "13", title: "Sắc Màu Thổ Cẩm & Dù Hoa Cẩm Cù", subtitle: "Góc Thư Thái Dưới Dù", description: "Những chiếc nệm ngồi hoa văn bản địa đặt dưới tán dù che mát rượi, tạo chốn nghỉ ngơi êm ái.", image: "/uploads/gallery/1788250253578-396525469.jpg", chapter: 2 },
      { id: "sp14", figureCode: "FIG. 14", orderNumber: "14", title: "Chòi Mộc Nhà Cù & Giàn Hoa Giấy Tím", subtitle: "Nét Đẹp Dân Dã", description: "Mái chòi gỗ mộc mạc nép mình dưới giàn hoa giấy tím biếc, mang đến cảm giác thân thuộc như trở về nhà.", image: "/uploads/gallery/1788250253579-355700743.jpg", chapter: 2 },
      { id: "sp15", figureCode: "FIG. 15", orderNumber: "15", title: "Ghế Vàng Thư Thái Dưới Bóng Cây Râm", subtitle: "Góc Đọc Sách Tĩnh Lặng", description: "Chiếc ghế màu vàng nổi bật giữa màu xanh của lá, nơi bạn có thể thả mình theo từng trang sách yêu thích.", image: "/uploads/gallery/1788250253581-551654423.jpg", chapter: 2 },
      { id: "sp16", figureCode: "FIG. 16", orderNumber: "16", title: "Dù Tím Cẩm Cù House & Xích Đu Gỗ", subtitle: "Góc Vui Đùa Thơ Mộng", description: "Chiếc xích đu gỗ đung đưa dưới tán dù tím đặc trưng của quán, điểm dừng chân yêu thích của mọi du khách.", image: "/uploads/gallery/1788250253583-466696218.jpg", chapter: 2 },
    ],
  },
  {
    chapter: 3,
    romanNum: "Chương III",
    titleVi: "Góc Xanh Sinh Thái & Hoa Cẩm Cù",
    titleEn: "Verdant Eco-Corner & Hoya Blooms",
    rangeLabel: "FIG. 17 — 23",
    photos: [
      { id: "sp17", figureCode: "FIG. 17", orderNumber: "17", title: "Đường Lát Đá Cờ Đỏ & Hàng Dong Riềng", subtitle: "Lối Mòn Quanh Co", description: "Con đường đá nhỏ uốn lượn rợp bóng hoa dong riềng dẫn lối du khách len lỏi khám phá mọi ngóc ngách của quán.", image: "/uploads/gallery/1788250253585-162974099.jpg", chapter: 3 },
      { id: "sp18", figureCode: "FIG. 18", orderNumber: "18", title: "Bàn Dài Cắm Trại Dưới Tán Tre Ngà", subtitle: "Phong Cách Dã Ngoại", description: "Bàn ghế dã ngoại xếp ngay ngắn dưới lũy tre râm mát, tạo không gian thư giãn như đang trong một chuyến cắm trại.", image: "/uploads/gallery/1788250253587-81750666.jpg", chapter: 3 },
      { id: "sp19", figureCode: "FIG. 19", orderNumber: "19", title: "Bàn Giếng Cổ Nệm Thổ Cẩm Dưới Nắng Sớm", subtitle: "Góc Hoài Niệm", description: "Bàn gỗ tái chế từ giếng xưa kết hợp đệm ngồi êm ái, đón những giọt nắng sớm xuyên qua kẽ lá.", image: "/uploads/gallery/1788250253590-409844081.jpg", chapter: 3 },
      { id: "sp20", figureCode: "FIG. 20", orderNumber: "20", title: "Vườn Hoa Anh Đào & Lối Đi Lát Đá", subtitle: "Khung Cảnh Thơ Mộng", description: "Những đóa hoa anh đào nở rộ soi bóng xuống thảm cỏ xanh mướt dọc lối đi đá cuội tự nhiên.", image: "/uploads/gallery/1788250253592-73071293.jpg", chapter: 3 },
      { id: "sp21", figureCode: "FIG. 21", orderNumber: "21", title: "Hiên Lá Nhiệt Đới & Hàng Cờ Tổ Quốc", subtitle: "Sắc Màu Quê Hương", description: "Không gian hiên quán trang hoàng rực rỡ với cờ đỏ sao vàng cùng những chậu cây xanh tươi tốt.", image: "/uploads/gallery/1788250253595-367274421.jpg", chapter: 3 },
      { id: "sp22", figureCode: "FIG. 22", orderNumber: "22", title: "Biển Hiệu Vàng Tiệm Cà Phê Nhà Cù", subtitle: "Điểm Nhận Diện Thân Thương", description: "Biển hiệu gỗ sơn vàng mộc mạc chào đón quý khách bước vào chốn bình yên tách biệt với ồn ào phố thị.", image: "/uploads/gallery/1788250253597-677832947.jpg", chapter: 3 },
      { id: "sp23", figureCode: "FIG. 23", orderNumber: "23", title: "Bàn Gỗ Dài Dưới Tán Cây Mít Cổ Thụ", subtitle: "Bóng Mát Trăm Năm", description: "Bàn tiệc gỗ dài nằm dưới gốc mít xum xuê trĩu quả, chốn sum vầy lý tưởng cho gia đình và nhóm bạn bè.", image: "/uploads/gallery/1788250253600-584656525.jpg", chapter: 3 },
    ],
  },
  {
    chapter: 4,
    romanNum: "Chương IV",
    titleVi: "Hoàng Hôn & Ánh Đèn Đêm Cuối Tuần (Thứ 6 – Chủ Nhật mở đến 22h)",
    titleEn: "Dusk & Weekend Night Lanterns (Fri–Sun open till 22h)",
    rangeLabel: "FIG. 24 — 30",
    photos: [
      { id: "sp24", figureCode: "FIG. 24", orderNumber: "24", title: "Bếp Lửa Trại & Khóm Hoa Huệ Cam Bên Suối", subtitle: "Hoàng Hôn Cao Nguyên", description: "Ánh lửa vàng ấm áp kết hợp sắc hoa huệ cam nở rộ ven suối trong ánh chiều tà bình dị.", image: "/uploads/gallery/1788250253602-486743244.jpg", chapter: 4 },
      { id: "sp25", figureCode: "FIG. 25", orderNumber: "25", title: "Góc Du Ca Gia Nghĩa Bên Tường Củi Mộc", subtitle: "Âm Vang Phố Núi", description: "Không gian giao lưu âm nhạc mộc mạc bên bức tường xếp củi khô, nơi cất lên những giai điệu acoustic êm đềm.", image: "/uploads/gallery/1788250253605-481608936.jpg", chapter: 4 },
      { id: "sp26", figureCode: "FIG. 26", orderNumber: "26", title: "Góc Thưởng Trà Dưới Gốc Cây Ven Suối", subtitle: "Chốn Thiền Định", description: "Bộ bàn ghế gỗ đơn sơ nép mình dưới gốc cây cổ thụ, nơi tâm hồn được tĩnh lặng lắng nghe tiếng suối reo.", image: "/uploads/gallery/1788250253607-878531206.jpg", chapter: 4 },
      { id: "sp27", figureCode: "FIG. 27", orderNumber: "27", title: "Bàn Gỗ Kẻ Sọc Bên Bờ Suối & Bụi Dong Riềng", subtitle: "Góc Nhìn Cận Cảnh Suối", description: "Vị trí ngồi sát mép nước nhất quán, nơi bạn có thể chạm tay vào làn nước suối mát lạnh và ngắm nhìn đàn cá bơi lội.", image: "/uploads/gallery/1788250253610-67011063.jpg", chapter: 4 },
      { id: "sp28", figureCode: "FIG. 28", orderNumber: "28", title: "Gian Bếp Mộc Bắp Ngô Cẩm Cù House", subtitle: "Hương Vị Đồng Quê", description: "Góc bếp củi truyền thống treo đầy bắp ngô vàng óng, tái hiện nét sinh hoạt văn hóa dân dã của đồng bào Tây Nguyên.", image: "/uploads/gallery/1788250253612-490050258.jpg", chapter: 4 },
      { id: "sp29", figureCode: "FIG. 29", orderNumber: "29", title: "Mái Nhà Tranh Cổ Điển Nhìn Ra Bờ Suối Xanh", subtitle: "Kiến Trúc Sinh Thái", description: "Những nếp nhà lợp lá tranh truyền thống hòa mình hoàn hảo vào cảnh sắc thiên nhiên xanh tươi bao quanh.", image: "/uploads/gallery/1788250253614-227589611.jpg", chapter: 4 },
      { id: "sp30", figureCode: "FIG. 30", orderNumber: "30", title: "Bàn Khăn Thổ Cẩm Dưới Tán Hoa Đào & Bếp Cũ", subtitle: "Góc Bình Yên Hoàn Hảo", description: "Khép lại hành trình với góc ngồi ngập tràn hoa sắc thổ cẩm và sắc hồng đào, đọng lại dư vị an yên khó phai.", image: "/uploads/gallery/1788250253618-436325211.jpg", chapter: 4 },
    ],
  },
];

