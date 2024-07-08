import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deletePosts();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        name: 'test',
        email: 'test@example.com',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });
  }

  async createPost() {
    const user = await this.getUser();
    await this.prismaService.post.create({
      data: {
        title: 'Test post',
        body: 'test',
        slug: 'test-post',
        userId: user.id,
        categoryId: 1,
        createdAt: 'test',
      },
    });
  }

  async getPost() {
    return await this.prismaService.post.findFirst({
      where: {
        body: 'test',
      },
    });
  }

  async deletePosts() {
    await this.prismaService.post.deleteMany({
      where: {
        body: 'test',
      },
    });
  }
}
