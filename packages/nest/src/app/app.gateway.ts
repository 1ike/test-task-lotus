import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { AppService } from './app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {}

  afterInit(server: Server) {
    this.appService.init(server);
  }

  @SubscribeMessage('getPaticipants')
  getPaticipants(): string {
    return JSON.stringify(this.appService.getPaticipants());
  }

  @SubscribeMessage('newBid')
  handleNewBid(): string {
    return JSON.stringify(this.appService.getPaticipants());
  }
}
