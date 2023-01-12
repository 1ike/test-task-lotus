export * from './types';

export enum SocketEvent {
  Connect = 'connect',
  JoinRoom = 'joinRoom',
  LeaveRoom = 'leaveRoom',
  Countdown = 'countdown',
  MakeNewBid = 'makeNewBid',
}
