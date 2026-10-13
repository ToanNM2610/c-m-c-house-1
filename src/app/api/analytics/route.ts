import { NextRequest, NextResponse } from "next/server";

interface StoredEvent {
  event: string;
  ts: number;
}

// In-memory buffer for server runtime
let serverEventsBuffer: StoredEvent[] = [];

export async function POST(req: NextRequest) {
  try {
    let body: any = null;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = text ? JSON.parse(text) : null;
    }

    if (body && body.event) {
      serverEventsBuffer.push({
        event: String(body.event),
        ts: Number(body.ts) || Date.now(),
      });

      // Keep last 10,000 events
      if (serverEventsBuffer.length > 10000) {
        serverEventsBuffer = serverEventsBuffer.slice(-5000);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = serverEventsBuffer.filter((e) => e.ts >= cutoff);

  const counts: Record<string, number> = {
    click_call: 0,
    click_zalo: 0,
    click_directions: 0,
    view_menu: 0,
  };

  for (const item of recent) {
    if (item.event in counts) {
      counts[item.event]++;
    }
  }

  return NextResponse.json({
    success: true,
    stats: counts,
    periodDays: 7,
  });
}
