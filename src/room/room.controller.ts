import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtGuard } from 'src/auth/jwt';
import { Request } from 'express';

type AuthRequest = Request & { user: { id: number } };

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('createRoom')
  @UseGuards(JwtGuard)
  createRoom(@Req() req: AuthRequest) {
    return this.roomService.createRoom(req.user.id);
  }

  @Post(':roomId/join')
  @UseGuards(JwtGuard)
  joinRoom(
    @Req() req: AuthRequest,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.roomService.joinRoom(req.user.id, roomId);
  }

  @Get()
  @UseGuards(JwtGuard)
  getRooms(@Req() req: AuthRequest) {
    return this.roomService.getRooms(req.user.id);
  }
}
