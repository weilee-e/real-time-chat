import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user';
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ChatModule, PrismaModule, AuthModule, UserModule, RoomModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
