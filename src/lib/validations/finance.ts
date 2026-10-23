import { z } from 'zod';

const uuid = z.string().uuid();

export const transactionSchema = z.object({
  date: z.string().date(),
  amount: z.coerce.number().finite().positive('Nominal harus lebih besar dari 0'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  type: z.enum(['income', 'expense']),
  category_id: uuid.optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nama kategori wajib diisi').max(80),
  type: z.enum(['income', 'expense']),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
});

export const profileSchema = z.object({
  full_name: z.string().trim().max(120).optional(),
  business_name: z.string().trim().max(160).optional(),
  low_balance_threshold: z.coerce.number().finite().nonnegative().nullable().optional(),
});
