import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameEmail = await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
      include: { role: true },
    });

    return {
      name: user.name,
      email: user.email,
      role: user.role.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    // eslint-disable-next-line prefer-const
    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
      include: { role: true },
    });

    if (!user) {
      throw new HttpException('Email or Password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or Password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        email: loginRequest.email,
      },
      include: { role: true },
      data: {
        token: uuid(),
      },
    });
    return {
      name: user.name,
      email: user.email,
      role: user.role.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: user.roleId,
      },
    });

    return {
      name: user.name,
      email: user.email,
      role: role.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      include: { role: true },
      data: user,
    });

    return {
      name: result.name,
      email: result.email,
      role: result.role.name,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      include: { role: true },
      data: {
        token: null,
      },
    });
    return {
      name: result.name,
      email: result.email,
      role: result.role.name,
    };
  }

  async getProfile(user: User) {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    const filePath = join(process.cwd(), 'uploads/profile', profile.name);

    return filePath;
  }
}
