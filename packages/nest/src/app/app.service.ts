import { Injectable } from '@nestjs/common';
import { interval, take, map, Subject, tap, Subscription } from 'rxjs';
import { randomUUID } from 'crypto';

import { Countdown, Bid, NewBidRequest } from '@lotus/shared';
import { participants } from '../assets/mockData';

const countdownStartValue: Countdown = 12;

const participantIDs = participants.map((p) => p.id);

const getRandomActiveParticipantID = () =>
  participantIDs[Math.floor(Math.random() * participantIDs.length)];

const getRandomCountdownValue = () =>
  Math.floor(
    countdownStartValue - Math.random() * (countdownStartValue - countdownStartValue * 0.1),
  );

@Injectable()
export class AppService {
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

  init() {
    this.startCountdown();

    return this.countdownBroadcast$;
  }

  handleNewBid(newBidRequest: NewBidRequest) {
    if (this.bid && this.bid.id !== newBidRequest.previousBidID) return undefined;

    this.bid = {
      id: randomUUID(),
      participantID: newBidRequest.participantID,
    };

    this.startCountdown();

    return this.bid;
  }

  private startCountdown() {
    this.countdown$?.unsubscribe();

    const randomCountdownBreakpoint = getRandomCountdownValue();

    this.countdown$ = interval(1000)
      .pipe(
        take(countdownStartValue),
        map((value) => countdownStartValue - value - 1),
        tap((value) => {
          if (randomCountdownBreakpoint === value) {
            this.handleNewBid({
              previousBidID: this.bid.id,
              participantID: getRandomActiveParticipantID(),
            });
          }
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
