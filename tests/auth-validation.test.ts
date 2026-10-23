import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
describe('Auth Validation Schemas', () => {
  it('validates email and password requirements', () => { expect(loginSchema.safeParse({email:'user@example.com',password:'password123'}).success).toBe(true); expect(loginSchema.safeParse({email:'invalid',password:'123'}).success).toBe(false); });
  it('requires business name on register', () => { expect(registerSchema.safeParse({email:'user@example.com',password:'password123',businessName:'Toko Makmur'}).success).toBe(true); expect(registerSchema.safeParse({email:'user@example.com',password:'password123',businessName:''}).success).toBe(false); });
});
