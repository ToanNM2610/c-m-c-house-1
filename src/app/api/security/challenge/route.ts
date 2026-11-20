import { NextResponse } from 'next/server';
import { generateMathChallenge } from '@/lib/antiSpam';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const challenge = generateMathChallenge();
    return NextResponse.json({
      success: true,
      data: challenge,
      challenge,
      question: challenge.question,
      token: challenge.token,
    });
  } catch (error) {
    console.error('GET /api/security/challenge error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tạo câu hỏi bảo mật. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

