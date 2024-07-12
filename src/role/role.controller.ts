import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from '../common/role.decorator';
import {
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from '../model/role.model';
import { WebResponse } from '../model/web.model';
import { RoleGuard } from '../common/role.guard';
import { AuthGuard } from '../common/auth.guard';

@UseGuards(RoleGuard)
@Controller('/api/roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @HttpCode(200)
  @Roles(['Super Admin'])
  async create(
    @Body() request: CreateRoleRequest,
  ): Promise<WebResponse<RoleResponse>> {
    const result = await this.roleService.create(request);
    return {
      data: result,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async get(): Promise<WebResponse<RoleResponse[]>> {
    const result = await this.roleService.get();
    return {
      data: result,
    };
  }

  @Put('/:roleId')
  @HttpCode(200)
  @Roles(['Super Admin'])
  async update(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() request: UpdateRoleRequest,
  ): Promise<WebResponse<RoleResponse>> {
    request.id = roleId;
    const result = await this.roleService.update(request);
    return {
      data: result,
    };
  }

  @Delete('/:roleId')
  @Roles(['Super Admin'])
  @HttpCode(200)
  async remove(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<WebResponse<boolean>> {
    await this.roleService.delete(roleId);
    return {
      data: true,
    };
  }
}
