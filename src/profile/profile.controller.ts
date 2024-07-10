import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname, join } from 'path';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../common/auth.guard';
import { ProfileResponse } from '../model/profile.model';
import { WebResponse } from '../model/web.model';
import { Response } from 'express';

@Controller('/api/profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, callback) => {
          const uniqueSuffix = nanoid(8); // Menghasilkan string acak dengan panjang tertentu
          const ext = extname(file.originalname);
          const filename = `profile${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Auth() user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg|image/png',
        })
        .build(),
    )
    file: Express.Multer.File,
  ): Promise<WebResponse<ProfileResponse>> {
    const result = await this.profileService.createProfile(user, file);

    return {
      data: result,
    };
  }

  @Get('/:filename')
  async getFile(
    @Auth() user: User,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads/profile', filename);
    try {
      return res.sendFile(filePath);
    } catch (err) {
      throw new HttpException(`Profil not found`, 404);
    }
  }

  @Delete()
  @HttpCode(200)
  async delete(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.profileService.delete(user);
    return {
      data: true,
    };
  }
}
