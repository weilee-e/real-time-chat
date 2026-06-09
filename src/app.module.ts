import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user';

@Module({
  imports: [ChatModule, PrismaModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
