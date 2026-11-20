import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth';
import { logAction } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'EDITOR', 'SEO_MANAGER']);
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const path = body?.path || '/';

    revalidatePath(path, 'layout');

    await logAction({
      level: 'INFO',
      action: 'CACHE_PURGE',
      actor: auth.user.username,
      details: `Purged cache for path: ${path} (layout)`,
    });

    return apiSuccess({ path, revalidatedAt: new Date().toISOString() }, `Đã làm mới bộ nhớ đệm cho ${path}`);
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return apiError('Lỗi làm mới bộ nhớ đệm', 500);
  }
}

