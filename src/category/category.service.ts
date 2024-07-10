import { Injectable, Inject, HttpException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { User } from '@prisma/client';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { CategoryValidation } from './category.validation';
// import { CategoryResponse } from 'src/model/category.model';

@Injectable()
export class CategoryService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(
    user: User,
    request: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    const createRequest: CreateCategoryRequest =
      this.validationService.validate(CategoryValidation.CREATE, request);

    const category = await this.prismaService.category.create({
      data: createRequest,
    });

    return {
      id: category.id,
      name: category.name,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(): Promise<CategoryResponse[]> {
    return await this.prismaService.category.findMany();
  }

  async update(
    user: User,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const updateRequest: UpdateCategoryRequest =
      this.validationService.validate(CategoryValidation.UPDATE, request);

    let category = await this.prismaService.category.findFirst({
      where: {
        id: request.id,
      },
    });

    if (!category) {
      throw new HttpException('Category is not found', 404);
    }

    category = await this.prismaService.category.update({
      where: {
        id: category.id,
      },
      data: updateRequest,
    });

    return {
      id: category.id,
      name: category.name,
    };
  }

  async delete(user: User, categoryId: number): Promise<CategoryResponse> {
    let category = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new HttpException('Category is not found', 404);
    }

    category = await this.prismaService.category.delete({
      where: {
        id: category.id,
      },
    });

    return {
      id: category.id,
      name: category.name,
    };
  }
}
