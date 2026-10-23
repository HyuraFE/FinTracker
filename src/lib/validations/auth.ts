import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = loginSchema.extend({
  businessName: z.string().trim().min(1, 'Nama usaha wajib diisi').max(160),
});