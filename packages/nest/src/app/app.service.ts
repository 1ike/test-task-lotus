import { BadRequestException, Injectable } from '@nestjs/common';
import { take, map, Subject, tap, Subscription, timer } from 'rxjs';
import { randomUUID } from 'crypto';

import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';

import {
  Countdown,
  Bid,
  NewBidRequest,
  ParticipantID,
  BroadcastData,
  RoomName,
  SocketEvent,
  CreateRoomRequest,
} from '@lotus/shared';
import { participants } from '../assets/mockData';
import { Config } from './config/configuration';

const participantIDs = participants.map((p) => p.id);

const getRandomActiveParticipantID = (currentId?: ParticipantID) => {
  const filteredIDs = participantIDs.filter((id) => id !== currentId);
  return filteredIDs[Math.floor(Math.random() * filteredIDs.length)];
};

const getRandomCountdownValue = (countdownStartValue: Countdown) =>
  Math.floor(
    countdownStartValue - Math.random() * (countdownStartValue - countdownStartValue * 0.1),
  );

type Room = {
  countdownBroadcast$: Subject<BroadcastData>;
  countdownStartValue: Countdown;
  countdown$?: Subscription;
  bid?: Bid;
};

@Injectable()
export class AppService {
  private rooms: Map<RoomName, Room>;

  private readonly TIMER: Countdown;

  private readonly DEFAULT_ROOM_NAME: RoomName;

  private server!: Server;

  constructor(private configService: ConfigService<Config>) {
    const name = this.configService.get('ROOM_NAME', { infer: true })!;
    this.DEFAULT_ROOM_NAME = name;
    const countdownStartValue = this.configService.get('TIMER', { infer: true })!;
    this.TIMER = countdownStartValue;
    this.rooms = new Map();
    this.createRoom({ name, countdownStartValue });
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  getParticipants(roomName: RoomName) {
    return participants; // stub
  }

  createRoom({ name, countdownStartValue = this.TIMER }: CreateRoomRequest) {
    if (this.rooms.has(name)) throw new BadRequestException('Уже есть комната с таким именем.');

    const countdownBroadcast$ = new Subject<BroadcastData>();

    this.rooms.set(name, {
      countdownBroadcast$,
      countdownStartValue,
    });

    this.launchRoom(name, countdownBroadcast$);

    return name;
  }

  findAllRoomNames(): RoomName[] {
    return Array.from(this.rooms.keys());
  }

  deleteRoom(roomName: RoomName) {
    if (roomName === this.DEFAULT_ROOM_NAME) {
      throw new BadRequestException('Эту комнату нельзя удалить.');
    }

    this.rooms.delete(roomName);
    return roomName;
  }

  init(server: Server) {
    this.server = server;

    this.rooms.forEach(({ countdownBroadcast$ }, roomName) => {
      this.launchRoom(roomName, countdownBroadcast$);
    });
  }

  private launchRoom(roomName: RoomName, countdownBroadcast$: Subject<BroadcastData>) {
    this.startCountdown(roomName);

    countdownBroadcast$.subscribe((value) => {
      this.server.to(roomName).emit(SocketEvent.Countdown, value);
    });
  }

  handleNewBid(newBidRequest: NewBidRequest) {
    const room = this.rooms.get(newBidRequest.roomName);

    if (!room) return;

    const { bid } = room;

    if (bid && bid.id !== newBidRequest.previousBidID) return;

    room.bid = {
      id: randomUUID(),
      participantID: newBidRequest.participantID,
    };

    this.startCountdown(newBidRequest.roomName);
  }

  private startCountdown(roomName: RoomName) {
    const room = this.rooms.get(roomName);

    if (!room) return;

    const { bid } = room;

    room.countdown$?.unsubscribe();

    const randomCountdownBreakpoint = getRandomCountdownValue(room.countdownStartValue);
    room.countdown$ = timer(0, 1000)
      .pipe(
        take(room.countdownStartValue),
        map((value) => room.countdownStartValue - value),
        tap((value) => {
          if (randomCountdownBreakpoint === value) {
            const newBid = {
              previousBidID: bid?.id,
              participantID: getRandomActiveParticipantID(bid?.participantID),
              roomName,
            };
            this.handleNewBid(newBid);
          } else {
            room.countdownBroadcast$.next({
              countdown: value,
              bid,
            });
          }
        }),
      )
      .subscribe();
  }
}
