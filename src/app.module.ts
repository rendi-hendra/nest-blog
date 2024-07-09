import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [CommonModule, UserModule, PostModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
