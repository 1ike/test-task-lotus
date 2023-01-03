import { NewBidRequest } from '@lotus/shared';
import {
  MessageBody,
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
    const countdownBroadcast$ = this.appService.init();

    countdownBroadcast$.subscribe((value) => {
      server.emit('countdown', value);
    });
    setTimeout(() => {
      this.appService.handleNewBid({ participantID: 2, previousBidID: null });
    }, 1000);
  }

  @SubscribeMessage('getPaticipants')
  getPaticipants(): string {
    return JSON.stringify(this.appService.getPaticipants());
  }

  @SubscribeMessage('newBidRequest')
  handleNewBid(@MessageBody() newBidRequest: NewBidRequest) {
    const newBid = this.appService.handleNewBid(newBidRequest);
    if (newBid) this.server.emit('newBid');
  }
}
