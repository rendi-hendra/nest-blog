import { z, ZodType } from 'zod';

export class RoleValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
  });
  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
  });

  static readonly UPDATE_ROLE: ZodType = z.object({
    roleId: z.number().min(1).optional(),
  });
}
