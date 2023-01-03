import { Injectable } from '@nestjs/common';
import { interval, take, map, Subject, tap, Subscription } from 'rxjs';
import { Server } from 'socket.io';

import { ID, Countdown, Bid } from '@lotus/shared';
import { participants } from '../assets/mockData';

const countdownStartValue: Countdown = 120;

const participantIDs = participants.map((p) => p.id);

// prettier-ignore
const getRandomActiveParticipantID = () => participantIDs[
  Math.floor(Math.random() * participantIDs.length)
];

@Injectable()
export class AppService {
  private server: Server;

  private bid: Bid;

  private countdownBroadcast$: Subject<Countdown>;

  private countdown$: Subscription;

  constructor() {
    this.countdownBroadcast$ = new Subject<Countdown>();
  }

  // eslint-disable-next-line class-methods-use-this
  getPaticipants() {
    return participants;
  }

  init(server: Server) {
    this.setServer(server);
    this.startCountdown();

    this.countdownBroadcast$.subscribe((value) => {
      server.emit('jjj', value, value + 1);
    });
    setTimeout(() => {
      this.handleNewBid(getRandomActiveParticipantID());
    }, 1500);

    return this.countdownBroadcast$;
  }

  private setServer(server: Server) {
    this.server = server;
  }

  handleNewBid(id: ID) {
    this.setBid(id);
    this.startCountdown();
  }

  private setBid(id: ID) {
    this.bid = {
      id: 'sss',
      participantID: id,
    };
  }

  private startCountdown() {
    this.countdown$?.unsubscribe();

    this.countdown$ = interval(1000)
      .pipe(
        take(countdownStartValue),
        map((value) => countdownStartValue - value - 1),
        tap((value) => {
          console.log('value = ', value);
          this.countdownBroadcast$.next(value);
        }),
      )
      .subscribe();
  }

  // eslint-disable-next-line class-methods-use-this
  getData(): { message: string } {
    return { message: 'Welcome to nest!' };
  }
}
