import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
        include: {
          role: true,
        },
      });

      if (user) {
        return roles.indexOf(user.role.name) != -1;
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
