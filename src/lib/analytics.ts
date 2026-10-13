/**
 * Lightweight Client & Server Event Analytics
 * Tracks: click_call, click_zalo, click_directions, view_menu
 * Stores locally & sends to /api/analytics
 */

export type TrackEventType = "click_call" | "click_zalo" | "click_directions" | "view_menu";

export interface AnalyticsCounts {
  click_call: number;
  click_zalo: number;
  click_directions: number;
  view_menu: number;
  periodDays: number;
}

const LOCAL_ANALYTICS_KEY = "camcu_analytics_events";

interface StoredEvent {
  event: TrackEventType;
  ts: number;
}

export function trackEvent(eventType: TrackEventType): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Update local storage buffer
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ event: eventType, ts: Date.now() });

    // Keep last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = list.filter((e) => e.ts >= cutoff);
    localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(filtered));

    // 2. Dispatch custom event for real-time admin sync
    window.dispatchEvent(new CustomEvent("camcu_analytics_tracked", { detail: { event: eventType } }));

    // 3. Send non-blocking beacon to /api/analytics
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", JSON.stringify({ event: eventType, ts: Date.now() }));
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: eventType, ts: Date.now() }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (e) {
    // Silently continue
  }
}

/**
 * Get 7-day stats from local buffer
 */
export function getLocalEventStats(days = 7): AnalyticsCounts {
  if (typeof window === "undefined") {
    return { click_call: 0, click_zalo: 0, click_directions: 0, view_menu: 0, periodDays: days };
  }

  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recent = list.filter((e) => e.ts >= cutoff);

    const counts: AnalyticsCounts = {
      click_call: 0,
      click_zalo: 0,
      click_directions: 0,
      view_menu: 0,
      periodDays: days,
    };

    for (const item of recent) {
      if (item.event in counts) {
        counts[item.event]++;
      }
    }

    return counts;
  } catch {
    return { click_call: 0, click_zalo: 0, click_directions: 0, view_menu: 0, periodDays: days };
  }
}
