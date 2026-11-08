/**
 * AtmosphereEngine - Quản lý nhịp thời gian & thời tiết thực tại Cẩm Cù House
 * Tọa độ: 11.99° N, 107.69° E (Gia Nghĩa, Đắk Nông)
 */

export type AtmospherePhase = "dawn" | "day" | "dusk" | "night";

export interface GiaNghiaTimeInfo {
  hour: number;
  minute: number;
  totalMinutes: number;
  dayOfWeek: number;
  formattedTime: string;
}

export interface StoreOpenStatus {
  isOpen: boolean;
  closingTime: string;
  scheduleTextVi: string;
  scheduleTextEn: string;
}

export interface GiaNghiaWeatherInfo {
  connected: boolean;
  temperatureLabel: string;
  temperatureVal: number | null;
  isRainy: boolean;
  conditionVi: string;
  conditionEn: string;
}

export const STORE_CONSTANTS = Object.freeze({
  name: "Cẩm Cù House", // Luôn có dấu ở cả VN và EN
  address: "Hẻm 437 Hùng Vương, Phường Nghĩa Trung, TP. Gia Nghĩa, Đắk Nông",
  coordinates: {
    lat: 11.99,
    lng: 107.69,
    display: "11.99° N, 107.69° E",
  },
  hotlines: {
    primary: "038 285 1688",
    primaryTel: "tel:0382851688",
    secondary: "077 465 9000",
    secondaryTel: "tel:0774659000",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=11.99,107.69",
});

export function getGiaNghiaTime(now = new Date()): GiaNghiaTimeInfo {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hour = parseInt(map.hour, 10) % 24;
  const minute = parseInt(map.minute, 10);
  const totalMinutes = hour * 60 + minute;

  const dayMap: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  const dayOfWeek = dayMap[map.weekday] ?? now.getDay();

  return {
    hour,
    minute,
    totalMinutes,
    dayOfWeek,
    formattedTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

/**
 * Xác định pha khí quyển trong ngày tại Gia Nghĩa:
 * - dawn: 07:00 – 10:29 (Sương sớm cao nguyên)
 * - day:  10:30 – 16:29 (Nắng đồi trong trẻo)
 * - dusk: 16:30 – 18:29 (Hoàng hôn phố núi)
 * - night: 18:30 – 06:59 (Đèn vàng dưới hiên)
 */
export function getAtmospherePhase(totalMinutes: number): AtmospherePhase {
  if (totalMinutes >= 420 && totalMinutes < 630) return "dawn";
  if (totalMinutes >= 630 && totalMinutes < 990) return "day";
  if (totalMinutes >= 990 && totalMinutes < 1110) return "dusk";
  return "night";
}

export function getAtmospherePhaseName(phase: AtmospherePhase, locale: "vi" | "en" = "vi"): string {
  switch (phase) {
    case "dawn":
      return locale === "en" ? "Highland Dawn Mist" : "Sương Sớm Cao Nguyên";
    case "day":
      return locale === "en" ? "Clear Highland Sunlight" : "Nắng Đồi Trong Trẻo";
    case "dusk":
      return locale === "en" ? "Mountain Sunset" : "Hoàng Hôn Phố Núi";
    case "night":
      return locale === "en" ? "Lanterns by the Stream" : "Đèn Vàng Dưới Hiên";
  }
}

/**
 * Kiểm tra trạng thái hoạt động:
 * - Thứ 2–5 (1..4): 07:00 (420) – 18:00 (1080)
 * - Thứ 6–CN (5,6,0): 07:00 (420) – 22:00 (1320)
 */
export function getStoreOpenStatus(dayOfWeek: number, totalMinutes: number): StoreOpenStatus {
  const isWeekendSchedule = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  const openMinutes = 7 * 60; // 07:00
  const closeMinutes = isWeekendSchedule ? 22 * 60 : 18 * 60;

  const isOpen = totalMinutes >= openMinutes && totalMinutes < closeMinutes;
  const closingTime = isWeekendSchedule ? "22:00" : "18:00";

  return {
    isOpen,
    closingTime,
    scheduleTextVi: "Thứ 2–5 07:00–18:00 | Thứ 6–CN 07:00–22:00",
    scheduleTextEn: "Mon–Thu 07:00–18:00 | Fri–Sun 07:00–22:00",
  };
}

/**
 * Lấy thời tiết thực tế tại Gia Nghĩa (11.99° N, 107.69° E).
 * Nếu lỗi hoặc chưa kết nối: trả về đúng trạng thái "Chưa kết nối", không giả lập số.
 */
export async function fetchGiaNghiaWeather(signal?: AbortSignal): Promise<GiaNghiaWeatherInfo> {
  const endpoint =
    "https://api.open-meteo.com/v1/forecast?latitude=11.99&longitude=107.69&current=temperature_2m,weather_code&timezone=Asia%2FBangkok";

  try {
    const res = await fetch(endpoint, { signal, cache: "no-store" });
    if (!res.ok) throw new Error("Weather API non-200");
    const data = await res.json();

    if (
      !data ||
      !data.current ||
      typeof data.current.temperature_2m !== "number"
    ) {
      throw new Error("Invalid payload");
    }

    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;

    return {
      connected: true,
      temperatureLabel: `${temp}°C`,
      temperatureVal: temp,
      isRainy: code >= 51 && code <= 99,
      conditionVi: mapWeatherCodeVi(code),
      conditionEn: mapWeatherCodeEn(code),
    };
  } catch {
    return {
      connected: false,
      temperatureLabel: "Chưa kết nối",
      temperatureVal: null,
      isRainy: false,
      conditionVi: "Chưa kết nối",
      conditionEn: "Disconnected",
    };
  }
}

export function mapWeatherCodeVi(code: number): string {
  if (code === 0) return "Trời quang";
  if (code >= 1 && code <= 3) return "Mây nhẹ";
  if (code === 45 || code === 48) return "Sương mù cao nguyên";
  if (code >= 51 && code <= 67) return "Mưa phùn";
  if (code >= 80 && code <= 99) return "Mưa rào";
  return "Khí hậu ôn hòa";
}

export function mapWeatherCodeEn(code: number): string {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Highland mist";
  if (code >= 51 && code <= 67) return "Light drizzle";
  if (code >= 80 && code <= 99) return "Rain showers";
  return "Mild highland air";
}
