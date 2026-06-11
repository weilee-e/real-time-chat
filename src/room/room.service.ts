import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(userId: number) {
    const data = await this.prisma.room.create({
      data: { createdById: userId },
    });

    await this.prisma.roomParticipants.create({
      data: { userIdP: userId, roomIdP: data.roomId },
    });

    return { roomId: data.roomId };
  }

  async joinRoom(userId: number, roomId: number) {
    const data = await this.prisma.room.findFirst({ where: { roomId } });

    if (!data) {
      throw new BadRequestException('Room not found');
    }

    const alreadyJoined = await this.prisma.roomParticipants.findFirst({
      where: { userIdP: userId, roomIdP: roomId },
    });

    if (alreadyJoined) {
      throw new BadRequestException('Already in this room');
    }

    const newParticipant = await this.prisma.roomParticipants.create({
      data: { userIdP: userId, roomIdP: roomId },
    });

    return newParticipant;
  }

  async getRooms(userId: number) {
    const data = await this.prisma.roomParticipants.findMany({
      where: { userIdP: userId },
      include: { room: true },
    });

    if (!data) {
      throw new BadRequestException('User not create any rooms');
    }

    return data;
  }
}
