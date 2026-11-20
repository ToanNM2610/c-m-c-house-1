import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { sendTestEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// POST /api/gmail/test - test SMTP credentials and send test email
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { targetEmail } = body;

    const result = await sendTestEmail(targetEmail);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('POST /api/gmail/test error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Lỗi khi gửi email thử nghiệm' },
      { status: 500 }
    );
  }
}

