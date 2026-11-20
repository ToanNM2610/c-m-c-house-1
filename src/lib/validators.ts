import { z } from 'zod';

export const MenuItemPatchSchema = z.object({
  inStock: z.boolean().optional(),
  price: z.coerce.number().min(0).optional(),
  priceDisplay: z.string().optional(),
  customGlbUrl: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export const StoreSettingsPatchSchema = z.object({
  name: z.string().optional(),
  tagline: z.string().optional(),
  address: z.string().optional(),
  hotlines: z.array(z.string()).optional(),
  email: z.string().email().optional(),
  monThuHours: z.string().optional(),
  friSunHours: z.string().optional(),
  announcement: z.string().optional(),
});
