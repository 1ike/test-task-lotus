import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { participants } from '../assets/mockData';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getPaticipants')
  handleMe(): string {
    return JSON.stringify(participants);
  }
}
