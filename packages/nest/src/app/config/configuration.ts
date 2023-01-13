import { Countdown, RoomName } from '@lotus/shared';

export type Config = {
  PORT: number;
  API_PREFIX: string;
  TIMER: Countdown;
  ROOM_NAME: RoomName;
};

export default (): Config => ({
  PORT: parseInt(process.env.NX_SERVER_PORT || '', 10) || 3333,
  API_PREFIX: process.env.NX_API_PREFIX?.trim() || 'api',
  TIMER: parseInt(process.env.NX_TIMER || '', 10) || 120,
  ROOM_NAME: process.env.NX_ROOM_NAME?.trim() || '123',
});
