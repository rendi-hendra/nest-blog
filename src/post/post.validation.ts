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

  static readonly SEARCH: ZodType = z.object({
    title: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
