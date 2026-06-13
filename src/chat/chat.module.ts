import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { JwtModule } from '@nestjs/jwt';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    MessageModule,
    RoomModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
