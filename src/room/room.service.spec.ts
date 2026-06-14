import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;

  const mockPrismaService = {
    room: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    roomParticipants: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new room', async () => {
    mockPrismaService.room.create.mockResolvedValue({ roomId: 1 });
    mockPrismaService.roomParticipants.create.mockResolvedValue({
      userIdP: 1,
      roomIdP: 1,
    });

    const result = await service.createRoom(1);

    expect(result).toEqual({ roomId: 1 });
    expect(mockPrismaService.room.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.roomParticipants.create).toHaveBeenCalledTimes(1);
  });
  it('should add new participant', async () => {
    mockPrismaService.room.findFirst.mockResolvedValue({ roomId: 1 });
    mockPrismaService.roomParticipants.findFirst.mockResolvedValue(null);
    mockPrismaService.roomParticipants.create.mockResolvedValue({
      userIdP: 1,
      roomIdP: 1,
    });

    const result = await service.joinRoom(1, 1);

    expect(result).toEqual({ userIdP: 1, roomIdP: 1 });
  });

  it('should throw BadRequestException if room not found', async () => {
    mockPrismaService.room.findFirst.mockResolvedValue(null);

    await expect(service.joinRoom(1, 99)).rejects.toThrow(BadRequestException);
  });
});
