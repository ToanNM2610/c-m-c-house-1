import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, locale = 'vi' } = body;

    if (!email || typeof email !== 'string') {
      return apiError('Vui lòng cung cấp địa chỉ email hợp lệ', 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 120) {
      return apiError('Địa chỉ email không đúng định dạng', 400);
    }

    // Check duplicate
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
        return apiSuccess({ subscribed: true }, 'Chào mừng bạn trở lại với bản tin Cẩm Cù House!');
      }
      return apiSuccess({ alreadySubscribed: true }, 'Email của bạn đã được đăng ký trong danh sách nhận tin từ trước.');
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        locale: locale === 'en' ? 'en' : 'vi',
        isActive: true,
      },
    });

    return apiSuccess({ subscribed: true }, 'Đăng ký nhận bản tin sinh thái Cẩm Cù House thành công! Cảm ơn bạn.');
  } catch (error) {
    console.error('[Newsletter Subscriber Error]:', error);
    return apiError('Không thể đăng ký nhận tin vào lúc này', 500);
  }
}

