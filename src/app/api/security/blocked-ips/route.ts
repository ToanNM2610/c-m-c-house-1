import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { banCache } from '@/lib/antiSpam';

export const dynamic = 'force-dynamic';

// GET /api/security/blocked-ips - list blocked IPs
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, ['SUPER_ADMIN', 'EDITOR']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { ipAddress: { contains: search } },
        { reason: { contains: search } },
      ];
    }

    const blockedIps = await prisma.blockedIp.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: blockedIps,
      total: blockedIps.length,
    });
  } catch (error) {
    console.error('GET /api/security/blocked-ips error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi tải danh sách IP bị chặn' },
      { status: 500 }
    );
  }
}

// POST /api/security/blocked-ips - manually block an IP
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, ['SUPER_ADMIN', 'EDITOR']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const body = await request.json();
    const { ipAddress, reason, strikeCount, blockedUntil, isPermanent } = body;

    if (!ipAddress || typeof ipAddress !== 'string' || !ipAddress.trim()) {
      return NextResponse.json(
        { success: false, error: 'Địa chỉ IP không được để trống' },
        { status: 400 }
      );
    }

    const trimmedIp = ipAddress.trim();
    let expiryDate: Date | null = null;

    if (isPermanent) {
      expiryDate = null;
    } else if (blockedUntil) {
      expiryDate = new Date(blockedUntil);
      if (isNaN(expiryDate.getTime())) {
        expiryDate = null;
      }
    }

    const record = await prisma.blockedIp.upsert({
      where: { ipAddress: trimmedIp },
      update: {
        reason: reason || 'Chặn thủ công bởi quản trị viên',
        strikeCount: typeof strikeCount === 'number' ? strikeCount : 5,
        isPermanent: Boolean(isPermanent),
        blockedUntil: isPermanent ? null : expiryDate,
      },
      create: {
        ipAddress: trimmedIp,
        reason: reason || 'Chặn thủ công bởi quản trị viên',
        strikeCount: typeof strikeCount === 'number' ? strikeCount : 5,
        isPermanent: Boolean(isPermanent),
        blockedUntil: isPermanent ? null : expiryDate,
      },
    });

    // Update in-memory ban cache
    banCache.set(trimmedIp, {
      isBlocked: true,
      blockedUntil: expiryDate ? expiryDate.getTime() : null,
      isPermanent: Boolean(isPermanent),
      reason: record.reason || undefined,
      cachedAt: Date.now(),
    });

    // Log to SystemLog
    await prisma.systemLog.create({
      data: {
        level: 'WARN',
        category: 'SECURITY',
        action: 'IP_MANUALLY_BLOCKED',
        details: `IP ${trimmedIp} bị chặn bởi @${authResult.user.username}: ${record.reason}`,
        adminUsername: authResult.user.username,
        ipAddress: trimmedIp,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã chặn địa chỉ IP ${trimmedIp} thành công`,
      data: record,
    });
  } catch (error) {
    console.error('POST /api/security/blocked-ips error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi thêm IP vào danh sách chặn' },
      { status: 500 }
    );
  }
}

// DELETE /api/security/blocked-ips - unblock an IP
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, ['SUPER_ADMIN', 'EDITOR']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { searchParams } = new URL(request.url);
    let ipAddress = searchParams.get('ip') || searchParams.get('ipAddress');
    let id = searchParams.get('id');

    // Also check body if not found in query string
    if (!ipAddress && !id) {
      try {
        const body = await request.json();
        ipAddress = body?.ipAddress || body?.ip;
        id = body?.id;
      } catch {
        // Body was empty or not JSON, query params took precedence
      }
    }

    if (!ipAddress && !id) {
      return NextResponse.json(
        { success: false, error: 'Cần cung cấp địa chỉ IP hoặc ID bản ghi cần mở khóa' },
        { status: 400 }
      );
    }

    let deletedRecord;
    if (id) {
      deletedRecord = await prisma.blockedIp.delete({
        where: { id },
      }).catch(() => null);
    } else if (ipAddress) {
      deletedRecord = await prisma.blockedIp.delete({
        where: { ipAddress: ipAddress.trim() },
      }).catch(() => null);
    }

    const targetIp = (deletedRecord?.ipAddress || ipAddress || '').trim();

    // Clear from in-memory cache
    if (targetIp) {
      banCache.delete(targetIp);
    }

    // Log to SystemLog
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        category: 'SECURITY',
        action: 'IP_MANUALLY_UNBLOCKED',
        details: `IP ${targetIp} đã được mở khóa bởi @${authResult.user.username}`,
        adminUsername: authResult.user.username,
        ipAddress: targetIp,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã mở khóa địa chỉ IP ${targetIp} thành công`,
    });
  } catch (error) {
    console.error('DELETE /api/security/blocked-ips error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi mở khóa IP' },
      { status: 500 }
    );
  }
}

