import { Injectable } from '@nestjs/common';
import { take, map, Subject, tap, Subscription, timer } from 'rxjs';
import { randomUUID } from 'crypto';

import { ConfigService } from '@nestjs/config';

import { Countdown, Bid, NewBidRequest, ParticipantID, BroadcastData } from '@lotus/shared';
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

@Injectable()
export class AppService {
  private readonly TIMER: Countdown;

  private bid: Bid;

  private countdownBroadcast$: Subject<BroadcastData>;

  private countdown$: Subscription;

  constructor(private configService: ConfigService) {
    this.countdownBroadcast$ = new Subject<BroadcastData>();
    this.TIMER = this.configService.get<Countdown>('TIMER');
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
    if (this.bid && this.bid.id !== newBidRequest.previousBidID) return;

    this.bid = {
      id: randomUUID(),
      participantID: newBidRequest.participantID,
    };

    this.startCountdown();
  }

  private startCountdown() {
    this.countdown$?.unsubscribe();

    const countdownStartValue = this.TIMER;

    const randomCountdownBreakpoint = getRandomCountdownValue(countdownStartValue);
    this.countdown$ = timer(0, 1000)
      .pipe(
        take(countdownStartValue),
        map((value) => countdownStartValue - value),
        tap((value) => {
          if (randomCountdownBreakpoint === value) {
            const newBid = {
              previousBidID: this.bid.id,
              participantID: getRandomActiveParticipantID(this.bid.participantID),
            };
            this.handleNewBid(newBid);
          } else {
            this.countdownBroadcast$.next({
              countdown: value,
              bid: this.bid,
            });
          }
        }),
      )
      .subscribe();
  }
}
