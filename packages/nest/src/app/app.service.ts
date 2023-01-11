import { Injectable } from '@nestjs/common';
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
} from '@lotus/shared';
import { participants } from '../assets/mockData';

const participantIDs = participants.map((p) => p.id);

const getRandomActiveParticipantID = (currentId: ParticipantID) => {
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

  constructor(private configService: ConfigService) {
    const countdownStartValue = this.configService.get<Countdown>('TIMER');
    const name = this.configService.get<RoomName>('ROOM_NAME');
    this.rooms = new Map();
    this.makeRoom({ name, countdownStartValue });
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  getPaticipants(roomName) {
    return participants; // stub
  }

  makeRoom({ name, countdownStartValue }: { name: RoomName; countdownStartValue: Countdown }) {
    this.rooms.set(name, {
      countdownBroadcast$: new Subject<BroadcastData>(),
      countdownStartValue,
    });

    return name;
  }

  init(server: Server) {
    this.rooms.forEach(({ countdownBroadcast$ }, roomName) => {
      this.startCountdown(roomName);

      countdownBroadcast$.subscribe((value) => {
        server.to(roomName).emit(SocketEvent.Countdown, value);
      });
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
