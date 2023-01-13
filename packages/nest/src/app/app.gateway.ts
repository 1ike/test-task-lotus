import { JoinRoomResponse, NewBidRequest, RoomName, SocketEvent } from '@lotus/shared';
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
  server!: Server;

  constructor(private readonly appService: AppService) {}

  afterInit(server: Server) {
    this.appService.init(server);
  }

  @SubscribeMessage(SocketEvent.JoinRoom)
  joinRoom(@MessageBody() roomName: RoomName, @ConnectedSocket() client: Socket): string {
    client.join(roomName);

    const responseData: JoinRoomResponse = {
      participants: this.appService.getPaticipants(roomName),
    };

    return JSON.stringify(responseData);
  }

  // eslint-disable-next-line class-methods-use-this
  @SubscribeMessage(SocketEvent.LeaveRoom)
  leaveRoom(@MessageBody() roomName: RoomName, @ConnectedSocket() client: Socket): void {
    client.leave(roomName);
  }

  @SubscribeMessage(SocketEvent.MakeNewBid)
  handleNewBid(@MessageBody() newBidRequest: NewBidRequest) {
    this.appService.handleNewBid(newBidRequest);
  }
}
