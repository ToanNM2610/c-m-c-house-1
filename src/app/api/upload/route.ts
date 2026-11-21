import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_MODEL_EXTENSIONS = ['.glb', '.gltf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị để tải tệp lên', 401);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const requestedFolder = ((formData.get('folder') as string) || (formData.get('category') as string) || 'gallery').toLowerCase().trim();

    if (!file) {
      return apiError('Chưa chọn tệp để tải lên', 400);
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return apiError('Kích thước tệp vượt quá giới hạn 10MB. Vui lòng nén hoặc chọn tệp nhỏ hơn.', 400);
    }

    // Sanitize folder
    let targetFolder = 'gallery';
    if (['gallery', 'events', 'brand', 'models', 'images'].includes(requestedFolder)) {
      targetFolder = requestedFolder;
    }

    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase();
    const fileMimeType = file.type?.toLowerCase() || '';

    // MIME type validation
    if (targetFolder === 'models') {
      if (!ALLOWED_MODEL_EXTENSIONS.includes(ext)) {
        return apiError('Tệp 3D không hợp lệ. Vui lòng tải định dạng .glb hoặc .gltf.', 400);
      }
    } else {
      const isAllowedMime = ALLOWED_IMAGE_TYPES.includes(fileMimeType);
      const isAllowedExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
      if (!isAllowedMime && !isAllowedExt) {
        return apiError('Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh định dạng JPG, PNG, WebP hoặc AVIF.', 400);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Collision-proof filename
    const rawBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeBase = rawBase.length > 0 ? rawBase.slice(0, 40) : 'media';
    const safeExt = ext.length > 0 ? ext : '.jpg';
    const uniqueFileName = `${safeBase}-${Date.now()}${safeExt}`;

    let publicUrl: string;

    // Check if Vercel Blob storage is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobPath = `${targetFolder}/${uniqueFileName}`;
      const blob = await put(blobPath, buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: fileMimeType || undefined,
      });
      publicUrl = blob.url;
    } else {
      // Local development fallback
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${targetFolder}/${uniqueFileName}`;
    }

    // Persist to MediaAsset table in database
    try {
      await prisma.mediaAsset.create({
        data: {
          url: publicUrl,
          folder: targetFolder,
          filename: uniqueFileName,
          fileType: fileMimeType || 'image/jpeg',
          fileSize: buffer.length,
          altVi: originalName,
          altEn: originalName,
        },
      });
    } catch (assetErr) {
      console.warn('Could not record MediaAsset in DB:', assetErr);
    }

    return apiSuccess({
      url: publicUrl,
      fileName: uniqueFileName,
      folder: targetFolder,
      size: buffer.length,
    }, { message: 'Tải tệp lên thành công' }, 201);
  } catch (error: any) {
    console.error('File upload error:', error);
    return apiError(error.message || 'Lỗi xử lý tải tệp lên máy chủ', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return apiError('Yêu cầu xác thực tài khoản quản trị', 401);
    }

    const body = await request.json();
    const { plateId, imageUrl, customGlbUrl } = body;

    if (!plateId) {
      return apiError('Thiếu mã hình ảnh không gian (plateId)', 400);
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (imageUrl) dataToUpdate.imageUrl = imageUrl;
    if (customGlbUrl !== undefined) dataToUpdate.customGlbUrl = customGlbUrl;

    const updated = await prisma.spatialFigure.update({
      where: { id: plateId },
      data: dataToUpdate,
    });

    return apiSuccess(updated, { message: 'Gắn liên kết media vào không gian thành công' });
  } catch (error: any) {
    console.error('Error binding media to spatial figure:', error);
    return apiError(error.message || 'Lỗi gắn media vào không gian', 500);
  }
}
