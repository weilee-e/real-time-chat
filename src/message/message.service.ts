import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(userId: number, roomId: number, text: string) {
    const data = await this.prisma.roomParticipants.findFirst({
      where: { roomIdP: roomId },
    });

    if (!data) {
      throw new BadRequestException('Room not found');
    }

    const user = await this.prisma.roomParticipants.findFirst({
      where: { userIdP: userId, roomIdP: roomId },
    });

    if (!user) {
      throw new BadRequestException('User is not participant on this room');
    }

    const save = await this.prisma.message.create({
      data: { authorId: userId, roomId: roomId, text: text },
    });

    return save.text;
  }

  async getMessage(roomId: number) {
    const data = await this.prisma.message.findMany({
      where: { roomId: roomId },
    });

    if (!data) {
      throw new BadRequestException('Room or messages not found');
    }

    return data;
  }
}
