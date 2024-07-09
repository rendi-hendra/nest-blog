import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { User } from '@prisma/client';
import { ProfileResponse } from '../model/profile.model';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ProfileService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createProfile(
    user: User,
    file: Express.Multer.File,
  ): Promise<ProfileResponse> {
    this.logger.debug(`ProfileService.create(${JSON.stringify(file)})`);
    // const createRequest: createProfileRequest = this.validationService.validate(
    //   ProfileValidation.CREATE,
    //   request,
    // );

    const totalProfileWithSameUserId = await this.prismaService.profile.count({
      where: {
        userId: user.id,
      },
    });

    if (totalProfileWithSameUserId != 0) {
      const fileName = await this.prismaService.profile.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (fileName.name) {
        const filePath = join(
          process.cwd(),
          './uploads/profile',
          fileName.name,
        );

        try {
          await fs.unlink(filePath); // Menghapus file dari sistem file
        } catch (err) {
          throw new NotFoundException('File not found');
        }
      }

      const profile = await this.prismaService.profile.update({
        where: {
          userId: user.id,
        },
        data: {
          name: file.filename,
        },
      });

      return {
        id: profile.id,
        name: profile.name,
        userId: profile.userId,
      };
    }

    if (totalProfileWithSameUserId == 0) {
      const profile = await this.prismaService.profile.create({
        data: {
          name: file.filename,
          ...{ userId: user.id },
        },
      });

      return {
        id: profile.id,
        name: profile.name,
        userId: profile.userId,
      };
    }
  }

  async delete(user: User): Promise<ProfileResponse> {
    const fileName = await this.prismaService.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    const filePath = join(process.cwd(), './uploads/profile', fileName.name);

    try {
      await fs.unlink(filePath); // Menghapus file dari sistem file
    } catch (err) {
      throw new NotFoundException('File not found');
    }

    const profile = await this.prismaService.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        name: null,
      },
    });
    return {
      id: profile.id,
      name: profile.name,
      userId: profile.userId,
    };
  }
}
