import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from '../model/role.model';
import { RoleValidation } from './role.validation';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async checkRoleMustExists(roleId: number): Promise<Role> {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      throw new HttpException('Role not found', 404);
    }

    return role;
  }

  async create(request: CreateRoleRequest): Promise<RoleResponse> {
    this.logger.debug(`Create new role ${JSON.stringify(request)}`);

    const createRequest: CreateRoleRequest = this.validationService.validate(
      RoleValidation.CREATE,
      request,
    );

    let role = await this.prismaService.role.findFirst({
      where: {
        name: request.name,
      },
    });

    if (role) {
      throw new HttpException('Role already exists', 400);
    }

    role = await this.prismaService.role.create({
      data: createRequest,
    });

    return {
      id: role.id,
      name: role.name,
    };
  }

  async get(): Promise<RoleResponse[]> {
    const roles = await this.prismaService.role.findMany();

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  async update(request: UpdateRoleRequest): Promise<RoleResponse> {
    this.logger.debug(`Update new role ${JSON.stringify(request)}`);

    const updateRequest: UpdateRoleRequest = this.validationService.validate(
      RoleValidation.UPDATE,
      request,
    );

    let role = await this.checkRoleMustExists(request.id);

    const roleName = await this.prismaService.role.findFirst({
      where: {
        name: request.name,
      },
    });

    if (roleName) {
      throw new HttpException('Role already exists', 400);
    }

    role = await this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: updateRequest,
    });

    return {
      id: role.id,
      name: role.name,
    };
  }

  async delete(roleId: number): Promise<RoleResponse> {
    await this.checkRoleMustExists(roleId);

    const role = await this.prismaService.role.delete({
      where: {
        id: roleId,
      },
    });

    return {
      id: role.id,
      name: role.name,
    };
  }
}
