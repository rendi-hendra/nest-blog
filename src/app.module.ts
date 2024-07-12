import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryMolude } from './category/category.module';
import { RoleMolude } from './role/role.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    PostModule,
    ProfileModule,
    CategoryMolude,
    RoleMolude,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
