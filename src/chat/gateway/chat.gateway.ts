import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { RoomService } from 'src/room/room.service';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: number;
  };
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly jwt: JwtService,
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket & { data: { userId: number } }) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      const payload = this.jwt.verify<{ sub: number; email: string }>(token);
      (client as AuthenticatedSocket).data.userId = payload.sub;
      console.log(`Client connected: ${client.id}, userId: ${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: AuthenticatedSocket, roomId: number) {
    const room = await this.roomService.getRoomById(roomId);
    if (!room) {
      client.emit('roomError', 'Room not found');
      return;
    }

    const isParticipant = await this.roomService.isParticipant(
      client.data.userId,
      roomId,
    );
    if (!isParticipant) {
      client.emit('roomError', 'You are not a participant of this room');
      return;
    }

    client.join(roomId.toString());

    const history = await this.messageService.getMessage(roomId);
    client.emit('history', history);

    return roomId;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { roomId: number; text: string },
  ) {
    const authClient = client as AuthenticatedSocket;
    const userId = authClient.data.userId;

    const message = await this.messageService.saveMessage(
      userId,
      payload.roomId,
      payload.text,
    );

    this.server.to(payload.roomId.toString()).emit('newMessage', message);
  }
}
