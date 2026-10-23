import { describe, it, expect } from 'vitest';
import { transactionSchema, categorySchema } from '@/lib/validations/finance';
describe('Validation Schemas', () => {
 it('validates a valid transaction', () => expect(transactionSchema.safeParse({date:'2026-10-23',amount:50000,description:'Beli kertas printer',type:'expense',category_id:'123e4567-e89b-12d3-a456-426614174000'}).success).toBe(true));
 it('rejects negative or zero amount', () => { expect(transactionSchema.safeParse({date:'2026-10-23',amount:0,type:'expense'}).success).toBe(false); expect(transactionSchema.safeParse({date:'2026-10-23',amount:-5000,type:'expense'}).success).toBe(false); });
 it('validates category types', () => expect(categorySchema.safeParse({name:'Jasa',type:'income'}).success).toBe(true));
});
