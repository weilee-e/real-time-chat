import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/auth/jwt';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get messages by room id' })
  @Get(':roomId')
  @UseGuards(JwtGuard)
  getMessage(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.messageService.getMessage(roomId);
  }
}
