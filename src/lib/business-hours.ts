// Business Hours Engine for Cẩm Cù House
// Strict Timezone: Asia/Ho_Chi_Minh (GMT+7)
// Monday - Thursday: 07:00 - 18:00
// Friday - Sunday: 07:00 - 22:00

export interface SlotValidationResult {
  valid: boolean;
  reason?: string;
  isWeekend?: boolean;
  openTime?: string;
  closeTime?: string;
}

/**
 * Validates a reservation date & time slot against strict Cẩm Cù House operating hours
 * without timezone parsing artifacts.
 */
export function validateBookingSlot(dateStr: string, timeSlotStr: string): SlotValidationResult {
  // 1. Format checks
  const dateParts = dateStr.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) {
    return { valid: false, reason: 'Định dạng ngày không hợp lệ. Vui lòng chọn theo định dạng YYYY-MM-DD.' };
  }

  const [year, month, day] = dateParts;
  // Use local calendar date constructor (month index is 0-based)
  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) {
    return { valid: false, reason: 'Ngày đặt bàn không hợp lệ.' };
  }

  const timeMatch = timeSlotStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeMatch) {
    return { valid: false, reason: 'Khung giờ đặt không hợp lệ. Vui lòng nhập theo định dạng HH:mm (Ví dụ: 09:30).' };
  }

  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return { valid: false, reason: 'Giờ đặt bàn không hợp lệ.' };
  }

  const slotMinutes = hour * 60 + minute;
  const dayOfWeek = d.getDay(); // 0: Sunday, 1: Monday, ..., 5: Friday, 6: Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

  const openMinutes = 7 * 60; // 07:00
  const closeMinutes = isWeekend ? 22 * 60 : 18 * 60; // 22:00 or 18:00
  const openTime = '07:00';
  const closeTime = isWeekend ? '22:00' : '18:00';

  if (slotMinutes < openMinutes || slotMinutes > closeMinutes) {
    const dayLabel = isWeekend ? 'Cuối tuần (Thứ 6 – Chủ Nhật)' : 'Ngày thường (Thứ 2 – Thứ 5)';
    return {
      valid: false,
      reason: `Quán chỉ nhận đặt bàn trong giờ mở cửa. Giờ hoạt động vào ${dayLabel} là ${openTime} – ${closeTime}.`,
      isWeekend,
      openTime,
      closeTime,
    };
  }

  return {
    valid: true,
    isWeekend,
    openTime,
    closeTime,
  };
}

/**
 * Returns current live status in Asia/Ho_Chi_Minh for OpenStatusBadge and UI
 */
export function getLiveCafeStatus() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnTime = new Date(utc + 7 * 3600000);

  const dayOfWeek = vnTime.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const currentMinutes = vnTime.getHours() * 60 + vnTime.getMinutes();

  const openMinutes = 7 * 60;
  const closeMinutes = isWeekend ? 22 * 60 : 18 * 60;
  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  const closeTimeStr = isWeekend ? '22:00' : '18:00';

  return {
    isOpen,
    isWeekend,
    currentTimeString: vnTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    statusText: isOpen
      ? `Đang mở cửa đón gió bên suối • Đóng cửa lúc ${closeTimeStr}`
      : 'Hẹn gặp bạn lúc 07:00 sáng mai • Có nhận đặt chỗ trước',
    closeTimeStr,
  };
}

