import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(255),
    body: z.string().min(1),
    categoryId: z.number().min(1),
  });
}
