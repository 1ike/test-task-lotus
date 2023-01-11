import { JoinRoomRequest, NewBidRequest, RoomName, SocketEvent } from '@lotus/shared';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage(SocketEvent.JoinRoom)
  joinRoom(@MessageBody() roomName: RoomName, @ConnectedSocket() client: Socket): string {
    client.join(roomName);

    const responseData: JoinRoomRequest = {
      participants: this.appService.getPaticipants(roomName),
    };

    return JSON.stringify(responseData);
  }

  @SubscribeMessage(SocketEvent.MakeNewBid)
  handleNewBid(@MessageBody() newBidRequest: NewBidRequest) {
    this.appService.handleNewBid(newBidRequest);
  }
}
