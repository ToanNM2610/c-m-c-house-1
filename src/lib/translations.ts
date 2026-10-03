/**
 * Comprehensive Bilingual Translation Dictionary (Vietnamese <-> English)
 * Polished for Specialty Coffee, Eco-Tourism & Highland Sanctuary Hospitality.
 */

export type Locale = "vi" | "en";

export interface TranslationDictionary {
  common: {
    brandName: string;
    brandTagline: string;
    brandSubtitle: string;
    coordinates: string;
    openGoogleMaps: string;
    callHotline: string;
    callToOrder: string;
    viewMenu: string;
    exploreStream: string;
    getDirections: string;
    viewLarger: string;
    noticeBoard: string;
    openingHoursGMT: string;
    themeLabel: string;
    admin: string;
    allRightsReserved: string;
    curatedByNature: string;
    addressFull: string;
    carParkingNote: string;
    soldOut: string;
    soldOutToday: string;
  };
  nav: {
    home: string;
    about: string;
    space: string;
    menu: string;
    contact: string;
    openNow: string;
    closed: string;
    closingSoon: string;
    temporarilyClosed: string;
    seeYouTomorrow: string;
  };
  home: {
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroDescription: string;
    badgeRecommended: string;
    badgePrice: string;
    badgeOrganic: string;
    tempText: string;
    windText: string;
    waterText: string;
    streamEcoSpace: string;
    heroCardTitle: string;
    heroCardDesc: string;
    pillarsHeading: string;
    pillarsSubheading: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
  };
  menu: {
    badge: string;
    title: string;
    subtitle: string;
    pureSpring: string;
    dailyFresh: string;
    noAdditives: string;
    searchPlaceholder: string;
    menuListHeading: string;
    menuListSubheading: string;
    signatureTag: string;
    signatureTitle: string;
    signatureHeading: string;
    signatureDesc: string;
    categories: Record<string, string>;
  };
  space: {
    badge: string;
    title: string;
    subtitle: string;
    playAudio: string;
    muteAudio: string;
    categories: Record<string, string>;
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    hoyaFlower: string;
    pureStream: string;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    coordinatesTitle: string;
    openingHoursTitle: string;
    hotlineTitle: string;
    addressTitle: string;
    quickLinksTitle: string;
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  vi: {
    common: {
      brandName: "Cẩm Cù House",
      brandTagline: "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá",
      brandSubtitle: "coffee & Food • Gia Nghĩa",
      coordinates: "Tọa độ 11.99° N, 107.69° E • Gia Nghĩa, Đắk Nông",
      openGoogleMaps: "Mở Google Maps",
      callHotline: "Gọi Hotline",
      callToOrder: "Gọi Hotline Gọi Món",
      viewMenu: "Xem Thực Đơn 50+ Món",
      exploreStream: "Khám Phá Góc Suối",
      getDirections: "Chỉ Đường Tới Quán",
      viewLarger: "Xem lớn",
      noticeBoard: "Bảng Tin Quán",
      openingHoursGMT: "Giờ Mở Cửa (GMT+7)",
      themeLabel: "Giao diện:",
      admin: "Quản Trị Viên",
      allRightsReserved: "© 2026 Cẩm Cù House coffee & Food. All rights reserved.",
      curatedByNature: "Thiết kế theo dòng chảy thiên nhiên Gia Nghĩa • Đắk Nông",
      addressFull: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, Thành phố Gia Nghĩa, Tỉnh Đắk Nông",
      carParkingNote: "Đường bê tông rộng, xe ô tô 4 – 16 chỗ vào quay đầu tận sân quán.",
      soldOut: "Tạm Hết",
      soldOutToday: "Tạm Hết Hôm Nay",
    },
    nav: {
      home: "Trang Chủ",
      about: "Câu Chuyện",
      space: "Không Gian Suối",
      menu: "Thực Đơn",
      contact: "Chỉ Đường & Liên Hệ",
      openNow: "Đang mở cửa",
      closed: "Đã đóng cửa",
      closingSoon: "Sắp đến giờ đóng cửa",
      temporarilyClosed: "Tạm nghỉ",
      seeYouTomorrow: "Quán đã đóng cửa • Hẹn gặp bạn lúc 07:00 ngày mai",
    },
    home: {
      heroTitleLine1: "CẨM CÙ HOUSE",
      heroTitleLine2: "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá",
      heroDescription:
        "Thưởng thức tách cà phê Robusta rang củi nguyên bản, lắng nghe dòng suối róc rách giữa thung lũng xanh thanh bình miền cao nguyên Đắk Nông.",
      badgeRecommended: "100% Đề Xuất Hài Lòng",
      badgePrice: "Mức Giá Bình Dân (20k - 45k)",
      badgeOrganic: "Nguyên Liệu Xanh Sạch",
      tempText: "23°C",
      windText: "Gió mát nhẹ",
      waterText: "Nước trong veo",
      streamEcoSpace: "Không Gian Sinh Thái Suối Reo",
      heroCardTitle: "Chòi Gỗ Mộc Ngắm Đồi Xanh & Hiên Suối Thanh Bình",
      heroCardDesc: "Hiên gỗ lợp lá thoáng đãng phóng tầm mắt ra thung lũng Đắk Nông lộng gió ban mai.",
      pillarsHeading: "Vì Sao Chọn Cẩm Cù House?",
      pillarsSubheading: "Bốn giá trị mộc mạc làm nên trải nghiệm an yên bên bờ suối",
      pillar1Title: "Suối Nguồn Tự Nhiên Mát Lạnh",
      pillar1Desc: "Dòng suối đá tự nhiên chảy quanh năm từ thượng nguồn Gia Nghĩa, nước trong vắt và mát lạnh 20-22°C.",
      pillar2Title: "Cà Phê Robusta Rang Củi Mộc",
      pillar2Desc: "Những hạt cà phê chín mọng từ đất đỏ bazan Đắk Nông, rang củi theo phương pháp thủ công đậm đà nguyên bản.",
      pillar3Title: "Thực Đơn 50+ Món Tự Nhiên",
      pillar3Desc: "Hơn 50 món thức uống thanh mát và điểm tâm sáng đặc sản núi rừng, từ cà phê muối đến trà thảo mộc mật ong.",
      pillar4Title: "Không Gian Mộc Mạc Thư Thái",
      pillar4Desc: "Bàn ghế gỗ mộc nép mình dưới bóng cây râm mát, nơi tâm hồn lắng lại sau những ồn ào phố thị.",
    },
    menu: {
      badge: "Ẩm Thực Tự Nhiên & Nông Sản Bản Địa Gia Nghĩa",
      title: "Thực Đơn Mộc Mạc • Thức Uống Xanh & Món Ăn Lành",
      subtitle:
        "Mỗi món nước hay món ăn đều trọn vẹn hương vị mộc mạc, chế biến từ nông sản Đắk Nông tươi rói, kết hợp cùng không gian tiếng suối róc rách trong trẻo.",
      pureSpring: "Nước Suối Nguồn Mát",
      dailyFresh: "Nông Sản Trong Ngày",
      noAdditives: "Không Phụ Gia Hóa Học",
      searchPlaceholder: "Tìm món nhanh...",
      menuListHeading: "Danh Sách Món",
      menuListSubheading: "Giá niêm yết đã bao gồm phục vụ tại bàn sát bờ suối",
      signatureTag: "Món Được Yêu Thích Nhất",
      signatureTitle: "Signature: Cà Phê Muối Đắk Nông",
      signatureHeading: "Cà Phê Muối Gia Nghĩa & Trà Hoa Đu Đủ Rừng",
      signatureDesc:
        "Được ủ từ hạt Robusta chín mọng rang than củi, lớp kem muối biển béo ngậy mặn ngọt cân bằng hoàn hảo. Ngoài ra, ấm trà hoa đu đủ đực ngâm mật ong rừng luôn là sự lựa chọn thanh giọng, an lành nhất bên dòng suối mát.",
      categories: {
        all: "Tất Cả",
        coffee: "Cà Phê Mộc",
        tea: "Trà Thảo Mộc",
        smoothie: "Sinh Tố",
        juice: "Nước Ép",
        "soda-yogurt": "Soda & Sữa Chua",
        others: "Đồ Uống Khác",
        food: "Món Ăn Lành",
      },
    },
    space: {
      badge: "Không Gian Sinh Thái Suối Reo",
      title: "Khám Phá Góc Suối Mát Lành Gia Nghĩa",
      subtitle:
        "Dừng chân trên những phiến đá cuội, lắng nghe tiếng suối reo hòa cùng tiếng chim rừng và đón những cơn gió cao nguyên mát rượi.",
      playAudio: "Bật Tiếng Suối",
      muteAudio: "Tắt Tiếng Suối",
      categories: {
        all: "Tất Cả Không Gian",
        stream: "Bờ Suối Tự Nhiên",
        "wooden-terrace": "Hiên Gỗ & Chòi Mộc",
        checkin: "Góc Check-in & Cảnh Quan",
        workspace: "Bàn Ghế Làm Việc / Đọc Sách",
      },
    },
    about: {
      badge: "Tâm Tình Từ Cao Nguyên",
      title: "Câu Chuyện Cẩm Cù",
      subtitle: "Chốn Bình Yên Giữa Đất Ngàn",
      description:
        "Khởi nguồn từ tình yêu với thiên nhiên Gia Nghĩa và khát khao gìn giữ một khoảng xanh trong trẻo cho lữ khách ghé chân, buông bỏ muộn phiền để hòa nhịp cùng suối ngàn.",
      hoyaFlower: "Loài hoa Hoya bền bỉ",
      pureStream: "Suối nguồn tự nhiên 100%",
    },
    contact: {
      badge: "Khu Ẩm Thực & Cà Phê Sinh Thái Bên Suối • Gia Nghĩa",
      title: "Từ Gia Nghĩa, Cẩm Cù House Chờ Đón Bạn",
      subtitle:
        "Một chốn bình yên giấu mình bên dòng suối mát rượi, rất dễ tìm với đường ô tô rộng thoáng vào tận hiên quán. Mở Google Maps hoặc gọi hotline để được đón tiếp chu đáo nhất!",
      coordinatesTitle: "Tọa độ cao nguyên",
      openingHoursTitle: "Giờ Mở Cửa & Hotline",
      hotlineTitle: "Hotline Đón Tiếp:",
      addressTitle: "Địa Chỉ & Kết Nối",
      quickLinksTitle: "Điều Hướng Nhanh",
    },
  },
  en: {
    common: {
      brandName: "Cam Cu House",
      brandTagline: "A Rustic Retreat by the Rock Stream",
      brandSubtitle: "coffee & Food • Gia Nghia",
      coordinates: "Coordinates 11.99° N, 107.69° E • Gia Nghia, Dak Nong",
      openGoogleMaps: "Open Google Maps",
      callHotline: "Call Hotline",
      callToOrder: "Call Hotline to Order",
      viewMenu: "View 50+ Menu Items",
      exploreStream: "Explore the Stream",
      getDirections: "Get Directions",
      viewLarger: "View larger",
      noticeBoard: "Notice Board",
      openingHoursGMT: "Opening Hours (GMT+7)",
      themeLabel: "Theme:",
      admin: "Admin Portal",
      allRightsReserved: "© 2026 Cam Cu House coffee & Food. All rights reserved.",
      curatedByNature: "Crafted following the natural flow of Gia Nghia • Dak Nong",
      addressFull: "Alley 437 Hung Vuong, Nghia Trung Ward, Gia Nghia City, Dak Nong Province",
      carParkingNote: "Wide paved access road; 4 to 16-seater cars can park and turn around directly in our courtyard.",
      soldOut: "Sold Out",
      soldOutToday: "Sold Out Today",
    },
    nav: {
      home: "Home",
      about: "Our Story",
      space: "Stream Sanctuary",
      menu: "Menu",
      contact: "Directions & Contact",
      openNow: "Open Now",
      closed: "Closed",
      closingSoon: "Closing Soon",
      temporarilyClosed: "Temporarily Closed",
      seeYouTomorrow: "Currently Closed • See you tomorrow at 07:00",
    },
    home: {
      heroTitleLine1: "CAM CU HOUSE",
      heroTitleLine2: "A Rustic Retreat by the Rock Stream",
      heroDescription:
        "Savor authentic firewood-roasted Robusta coffee while listening to the tranquil stream murmur through the lush valleys of the Đắk Nông highlands.",
      badgeRecommended: "100% Recommended",
      badgePrice: "Affordable Prices (20k - 45k)",
      badgeOrganic: "Farm-Fresh Ingredients",
      tempText: "23°C",
      windText: "Gentle Highland Breeze",
      waterText: "Crystal Clear Stream",
      streamEcoSpace: "Murmuring Stream Eco Sanctuary",
      heroCardTitle: "Rustic Wooden Deck with Hillside View & Serene Stream",
      heroCardDesc: "An airy thatched wooden terrace overlooking the breezy Dak Nong valley in the morning mist.",
      pillarsHeading: "Why Cam Cu House?",
      pillarsSubheading: "Four authentic qualities creating our serene riverside retreat",
      pillar1Title: "Natural Cool Pebble Stream",
      pillar1Desc: "Year-round natural crystal-clear spring water originating from Gia Nghia mountains, refreshing at 20-22°C.",
      pillar2Title: "Firewood-Roasted Robusta Coffee",
      pillar2Desc: "Ripe Robusta coffee cherries from fertile Dak Nong volcanic soils, artisanal firewood-roasted for deep richness.",
      pillar3Title: "50+ Farm-Fresh Offerings",
      pillar3Desc: "A diverse collection of refreshing beverages and local mountain breakfasts, from salted cream coffee to wild honey teas.",
      pillar4Title: "Tranquil Eco-Sanctuary",
      pillar4Desc: "Rustic wooden seating tucked under generous tree shade, where your mind unwinds away from bustling city life.",
    },
    menu: {
      badge: "Natural Cuisine & Gia Nghia Highland Harvest",
      title: "Rustic Menu • Green Sips & Wholesome Bites",
      subtitle:
        "Every drink and dish carries the pure, unpretentious flavors of fresh Dak Nong produce, accompanied by the gentle melody of the stream.",
      pureSpring: "Chilled Spring Water",
      dailyFresh: "Daily Fresh Harvest",
      noAdditives: "No Artificial Additives",
      searchPlaceholder: "Search menu...",
      menuListHeading: "Menu Offerings",
      menuListSubheading: "Listed prices include table service right beside the stream",
      signatureTag: "Most Loved Signature",
      signatureTitle: "Signature: Dak Nong Salt Coffee",
      signatureHeading: "Gia Nghia Salt Coffee & Wild Papaya Flower Tea",
      signatureDesc:
        "Brewed from ripe Robusta beans roasted over firewood, paired with a velvety layer of sweet-and-savory sea salt cream. Plus soothing highland male papaya flower tea infused with wild honey.",
      categories: {
        all: "All Items",
        coffee: "Specialty Coffee",
        tea: "Herbal & Fruit Tea",
        smoothie: "Fresh Smoothies",
        juice: "Cold-Pressed Juice",
        "soda-yogurt": "Soda & Artisan Yogurt",
        others: "Refreshing Drinks",
        food: "Wholesome Bites & Food",
      },
    },
    space: {
      badge: "Stream Sanctuary",
      title: "Explore the Serene Stream of Gia Nghia",
      subtitle:
        "Step onto natural pebbles, listen to the bubbling brook harmonize with forest birds, and embrace the crisp highland breeze.",
      playAudio: "Play Stream Sound",
      muteAudio: "Mute Stream Sound",
      categories: {
        all: "All Spaces",
        stream: "Natural Stream",
        "wooden-terrace": "Wooden Terraces & Pavilions",
        checkin: "Scenic Photo Spots",
        workspace: "Co-working & Reading Nooks",
      },
    },
    about: {
      badge: "Heartfelt Tale from the Highlands",
      title: "The Story of Cam Cu",
      subtitle: "A Peaceful Haven in the Highlands",
      description:
        "Born from a deep love for Gia Nghia's wilderness and a desire to preserve a pristine green haven where wanderers can leave their worries behind and tune into the river flow.",
      hoyaFlower: "Resilient Hoya Blossoms",
      pureStream: "100% Natural Stream Spring",
    },
    contact: {
      badge: "Eco Coffee & Food Sanctuary Beside Stream • Gia Nghia",
      title: "From Gia Nghia, Cam Cu House Welcomes You",
      subtitle:
        "A peaceful retreat hidden beside the crystal stream, easily accessible by car right to our courtyard. Open Google Maps or call our hotline for the warmest welcome!",
      coordinatesTitle: "Highland Coordinates",
      openingHoursTitle: "Opening Hours & Hotline",
      hotlineTitle: "Reception Hotline:",
      addressTitle: "Address & Connect",
      quickLinksTitle: "Quick Navigation",
    },
  },
};

/**
 * Format Realtime Store Status in selected language
 */
export function getStoreStatusI18n(
  status: {
    status: "open" | "closing_soon" | "closed";
    badgeType: "open" | "closing_soon" | "closed";
    closingTime: string;
    scheduleText: string;
    overrideMode: string;
    minutesRemaining?: number;
    isOpen: boolean;
  },
  locale: Locale
) {
  const isEn = locale === "en";

  let scheduleText = status.scheduleText;
  if (isEn) {
    scheduleText = scheduleText
      .replace("Thứ 2 - T5:", "Mon - Thu:")
      .replace("Thứ 6 - CN:", "Fri - Sun:");
  }

  if (status.overrideMode === "force_open") {
    return {
      shortBadge: isEn ? "Open Now" : "Đang mở cửa",
      badgeText: isEn
        ? "🟢 Open Now • Welcoming guests at manager's discretion"
        : "🟢 Đang mở cửa đón khách • Mở cửa linh hoạt theo quản lý",
      scheduleText,
    };
  }

  if (status.overrideMode === "force_closed") {
    return {
      shortBadge: isEn ? "Temporarily Closed" : "Tạm nghỉ",
      badgeText: isEn
        ? "🔴 Temporarily Closed • Special notice or preparing service"
        : "🔴 Quán tạm đóng cửa • Tạm nghỉ đột xuất hoặc chuẩn bị đón khách",
      scheduleText,
    };
  }

  if (status.status === "closing_soon") {
    const diff = status.minutesRemaining || 30;
    return {
      shortBadge: isEn ? `Closing (${diff}m)` : `Sắp đóng (${diff}p)`,
      badgeText: isEn
        ? `🟡 Closing soon (${diff} mins left) • Closes at ${status.closingTime}`
        : `🟡 Sắp đến giờ đóng cửa (còn ${diff} phút) • Đóng lúc ${status.closingTime}`,
      scheduleText,
    };
  }

  if (status.status === "open") {
    return {
      shortBadge: isEn ? "Open Now" : "Đang mở cửa",
      badgeText: isEn
        ? `🟢 Open Now • Welcoming guests until ${status.closingTime}`
        : `🟢 Đang mở cửa đón khách • Đóng cửa lúc ${status.closingTime}`,
      scheduleText,
    };
  }

  return {
    shortBadge: isEn ? "Closed" : "Đã đóng cửa",
    badgeText: isEn
      ? "🔴 Currently Closed • See you tomorrow at 07:00"
      : "🔴 Quán đã đóng cửa • Hẹn gặp bạn lúc 07:00 ngày mai",
    scheduleText,
  };
}
