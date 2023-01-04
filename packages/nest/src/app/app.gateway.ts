import { NewBidRequest, SocketEvent } from '@lotus/shared';
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
    const countdownBroadcast$ = this.appService.init(server);

    countdownBroadcast$.subscribe((value) => {
      server.emit(SocketEvent.Countdown, value);
    });
    setTimeout(() => {
      this.appService.handleNewBid({ participantID: 2, previousBidID: null });
    }, 1000);
  }

  @SubscribeMessage(SocketEvent.GetPaticipants)
  getPaticipants(): string {
    return JSON.stringify(this.appService.getPaticipants());
  }

  @SubscribeMessage(SocketEvent.MakeNewBid)
  handleNewBid(@MessageBody() newBidRequest: NewBidRequest) {
    this.appService.handleNewBid(newBidRequest);
  }
}
