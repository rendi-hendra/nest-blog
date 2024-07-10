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
import { CategoryService } from './category.service';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import { WebResponse } from '../model/web.model';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { RoleGuard } from '../common/role.guard';
import { Roles } from '../common/role.decorator';
import { AuthGuard } from '../common/auth.guard';

@UseGuards(RoleGuard)
@Controller('/api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async get(): Promise<WebResponse<CategoryResponse[]>> {
    const result = await this.categoryService.get();
    return {
      data: result,
    };
  }

  @Post()
  @Roles(['Admin', 'Super Admin'])
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() request: CreateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.create(user, request);
    return {
      data: result,
    };
  }

  @Put('/:categoryId')
  @Roles(['Admin', 'Super Admin'])
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    request.id = categoryId;
    const result = await this.categoryService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:categoryId')
  @Roles(['Admin', 'Super Admin'])
  @HttpCode(200)
  async delete(
    @Auth() user: User,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<boolean>> {
    await this.categoryService.delete(user, categoryId);
    return {
      data: true,
    };
  }
}
