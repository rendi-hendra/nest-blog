import { z, ZodType } from 'zod';

export class ProfileValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
