/**
 * Single Source of Truth for Store Operational Status (Asia/Ho_Chi_Minh / GMT+7)
 * Implements strict precedence: status_override (with 'until' expiry) -> closures -> opening_hours
 */

export type StoreState = "open" | "closing_soon" | "closed";
export type OverrideMode = "auto" | "open" | "closed" | "closing_early";

export interface StatusOverrideData {
  mode: OverrideMode;
  until?: string | null; // ISO timestamp string
}

export interface ClosureData {
  date_from: string; // YYYY-MM-DD
  date_to: string;   // YYYY-MM-DD
  reason_vi?: string;
  reason_en?: string;
}

export interface OpeningHourData {
  weekday: number; // 0: Sunday, 1..6: Mon..Sat
  open_time: string; // "07:00"
  close_time: string; // "18:00" | "22:00"
  is_closed?: boolean;
}

export interface StoreStatusResult {
  state: StoreState;
  label_vi: string;
  label_en: string;
  closes_at?: string;
  opens_at?: string;
  schedule_vi: string;
  schedule_en: string;
  today_hours: string;
  minutes_remaining?: number;
  mode: OverrideMode;
}

export const DEFAULT_OPENING_HOURS: OpeningHourData[] = [
  { weekday: 1, open_time: "07:00", close_time: "18:00", is_closed: false },
  { weekday: 2, open_time: "07:00", close_time: "18:00", is_closed: false },
  { weekday: 3, open_time: "07:00", close_time: "18:00", is_closed: false },
  { weekday: 4, open_time: "07:00", close_time: "18:00", is_closed: false },
  { weekday: 5, open_time: "07:00", close_time: "22:00", is_closed: false },
  { weekday: 6, open_time: "07:00", close_time: "22:00", is_closed: false },
  { weekday: 0, open_time: "07:00", close_time: "22:00", is_closed: false },
];

/**
 * Convert any Date to Vietnam GMT+7 time components
 */
export function getVietnamDate(inputDate?: Date | string | number): {
  date: Date;
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0..6
  hours: number;
  minutes: number;
  dateString: string; // YYYY-MM-DD
  timeString: string; // HH:mm
} {
  const d = inputDate ? new Date(inputDate) : new Date();
  const vnStr = d.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  const vnDate = new Date(vnStr);

  const year = vnDate.getFullYear();
  const month = vnDate.getMonth() + 1;
  const day = vnDate.getDate();
  const dayOfWeek = vnDate.getDay();
  const hours = vnDate.getHours();
  const minutes = vnDate.getMinutes();

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const min = String(minutes).padStart(2, "0");

  return {
    date: vnDate,
    year,
    month,
    day,
    dayOfWeek,
    hours,
    minutes,
    dateString: `${year}-${mm}-${dd}`,
    timeString: `${hh}:${min}`,
  };
}

/**
 * Main Status Function: getStatus(now)
 */
export function getStatus(
  now?: Date | string | number,
  options?: {
    override?: StatusOverrideData | null;
    closures?: ClosureData[];
    hours?: OpeningHourData[];
  }
): StoreStatusResult {
  const vn = getVietnamDate(now);
  const nowTime = now ? new Date(now).getTime() : Date.now();

  const isWeekendGroup = vn.dayOfWeek === 0 || vn.dayOfWeek === 5 || vn.dayOfWeek === 6;
  const schedule_vi = isWeekendGroup ? "Thứ 6 – CN: 07:00 – 22:00" : "Thứ 2 – T5: 07:00 – 18:00";
  const schedule_en = isWeekendGroup ? "Fri – Sun: 07:00 – 22:00" : "Mon – Thu: 07:00 – 18:00";
  const defaultCloseTime = isWeekendGroup ? "22:00" : "18:00";
  const today_hours = `07:00 – ${defaultCloseTime}`;

  // 1. Check status_override (with until expiry check)
  const override = options?.override;
  if (override && override.mode && override.mode !== "auto") {
    let isExpired = false;
    if (override.until) {
      const untilTime = new Date(override.until).getTime();
      if (!isNaN(untilTime) && nowTime >= untilTime) {
        isExpired = true;
      }
    }

    if (!isExpired) {
      if (override.mode === "open") {
        return {
          state: "open",
          label_vi: "Đang mở cửa",
          label_en: "Open Now",
          closes_at: defaultCloseTime,
          schedule_vi,
          schedule_en,
          today_hours,
          mode: "open",
        };
      }
      if (override.mode === "closed") {
        return {
          state: "closed",
          label_vi: "Tạm đóng cửa",
          label_en: "Temporarily Closed",
          opens_at: "07:00",
          schedule_vi,
          schedule_en,
          today_hours,
          mode: "closed",
        };
      }
      if (override.mode === "closing_early") {
        return {
          state: "closing_soon",
          label_vi: "Sắp đóng cửa",
          label_en: "Closing Soon",
          closes_at: defaultCloseTime,
          schedule_vi,
          schedule_en,
          today_hours,
          mode: "closing_early",
        };
      }
    }
  }

  // 2. Check Closures (Emergency / Holidays)
  const closures = options?.closures || [];
  for (const c of closures) {
    if (vn.dateString >= c.date_from && vn.dateString <= c.date_to) {
      return {
        state: "closed",
        label_vi: c.reason_vi || "Tạm nghỉ lễ",
        label_en: c.reason_en || "Holiday Closure",
        opens_at: "07:00",
        schedule_vi,
        schedule_en,
        today_hours,
        mode: "auto",
      };
    }
  }

  // 3. Check Opening Hours
  const hoursList = options?.hours || DEFAULT_OPENING_HOURS;
  const todayConfig = hoursList.find((h) => h.weekday === vn.dayOfWeek) || {
    weekday: vn.dayOfWeek,
    open_time: "07:00",
    close_time: defaultCloseTime,
    is_closed: false,
  };

  if (todayConfig.is_closed) {
    return {
      state: "closed",
      label_vi: "Đã đóng cửa",
      label_en: "Closed Today",
      opens_at: "07:00",
      schedule_vi,
      schedule_en,
      today_hours: "Nghỉ",
      mode: "auto",
    };
  }

  const [openH, openM] = todayConfig.open_time.split(":").map(Number);
  const [closeH, closeM] = todayConfig.close_time.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const currentMinutes = vn.hours * 60 + vn.minutes;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const remaining = closeMinutes - currentMinutes;
    if (remaining <= 30) {
      return {
        state: "closing_soon",
        label_vi: `Sắp đóng (${remaining}p)`,
        label_en: `Closing (${remaining}m)`,
        closes_at: todayConfig.close_time,
        schedule_vi,
        schedule_en,
        today_hours: `07:00 – ${todayConfig.close_time}`,
        minutes_remaining: remaining,
        mode: "auto",
      };
    }

    return {
      state: "open",
      label_vi: "Đang mở cửa",
      label_en: "Open Now",
      closes_at: todayConfig.close_time,
      schedule_vi,
      schedule_en,
      today_hours: `07:00 – ${todayConfig.close_time}`,
      mode: "auto",
    };
  }

  return {
    state: "closed",
    label_vi: "Đã đóng cửa",
    label_en: "Closed",
    opens_at: "07:00",
    closes_at: todayConfig.close_time,
    schedule_vi,
    schedule_en,
    today_hours: `07:00 – ${todayConfig.close_time}`,
    mode: "auto",
  };
}
