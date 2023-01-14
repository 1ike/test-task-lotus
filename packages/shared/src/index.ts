export * from './types';

export enum SocketEvent {
  Connect = 'connect',
  ConnectError = 'connect_error',
  Disconnect = 'disconnect',
  JoinRoom = 'joinRoom',
  LeaveRoom = 'leaveRoom',
  Countdown = 'countdown',
  MakeNewBid = 'makeNewBid',
}

export const regexStringRawName = String.raw`^[А-Яа-яЁё\s0-9_-]+$`;
export const regexStringRawCountdownStartValue = String.raw`^[0-9]+$`;
