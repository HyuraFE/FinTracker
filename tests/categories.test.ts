import { describe, it, expect } from 'vitest';
import { categorySchema } from '@/lib/validations/finance';
describe('Category Validation', () => {
  it('allows valid category payload with income or expense type', () => {
    expect(categorySchema.safeParse({ name: 'Jasa Desain', type: 'income' }).success).toBe(true);
    expect(categorySchema.safeParse({ name: 'Bahan Baku', type: 'expense' }).success).toBe(true);
  });
  it('rejects invalid type or empty name', () => {
    expect(categorySchema.safeParse({ name: '', type: 'expense' }).success).toBe(false);
    expect(categorySchema.safeParse({ name: 'Valid', type: 'other' }).success).toBe(false);
  });
});
