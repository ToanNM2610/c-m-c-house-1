import { getStoreStatus as getRealtimeStoreStatus } from "@/lib/openingHours";

export const CAMCU_CONFIG = {
  name: "Cẩm Cù House",
  slogan: {
    vn: "Chốn Dừng Chân Mộc Mạc Bên Bờ Suối Đá",
    en: "A Rustic Retreat By The Rocky Stream",
  },
  location: {
    address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông",
    coordinates: {
      lat: 11.99,
      lng: 107.69,
      display: "11.99° N · 107.69° E",
    },
    altitude: "800m+",
  },
  contact: {
    hotlinePrimary: "038 285 1688",
    hotlineSecondary: "077 465 9000",
    zaloUrl: "https://zalo.me/0382851688",
    email: "thuynhu8788@gmail.com",
    facebook: "https://www.facebook.com/share/1DVLMySW8H/",
    tiktok: "https://www.tiktok.com/@camcuhousedaknong",
    youtube: "https://youtube.com/@Cam_Cu_House",
  },
  hours: {
    monThu: "07:00 – 18:00",
    friSun: "07:00 – 22:00",
    monToThu: {
      label: "Thứ Hai – Thứ Năm: 07:00 – 18:00",
      time: "07:00 – 18:00",
    },
    friToSun: {
      label: "Thứ Sáu – Chủ Nhật: 07:00 – 22:00",
      time: "07:00 – 22:00",
    },
  },
};

export function getStoreStatus() {
  const realtime = getRealtimeStoreStatus();
  return {
    ...realtime,
    isOpen: realtime.isOpen,
    closeLabel: realtime.closingTime || "18:00",
  };
}
