import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(4).max(255),
    body: z.string().min(4),
    categoryId: z.number().min(1),
  });
  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(4).max(255).optional(),
    body: z.string().min(4).optional(),
    categoryId: z.number().min(1).optional(),
  });
}
