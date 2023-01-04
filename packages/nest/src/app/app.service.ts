import { Injectable } from '@nestjs/common';
import { take, map, Subject, tap, Subscription, timer } from 'rxjs';
import { randomUUID } from 'crypto';
import { Server } from 'socket.io';

import { Countdown, Bid, NewBidRequest, ParticipantID, BroadcastData } from '@lotus/shared';
import { participants } from '../assets/mockData';

const countdownStartValue: Countdown = 15;

const participantIDs = participants.map((p) => p.id);

const getRandomActiveParticipantID = (currentId: ParticipantID) => {
  const filteredIDs = participantIDs.filter((id) => id !== currentId);
  return filteredIDs[Math.floor(Math.random() * filteredIDs.length)];
};

const getRandomCountdownValue = () =>
  Math.floor(
    countdownStartValue - Math.random() * (countdownStartValue - countdownStartValue * 0.1),
  );

@Injectable()
export class AppService {
  private bid: Bid;

  private server: Server;

  private countdownBroadcast$: Subject<BroadcastData>;

  private countdown$: Subscription;

  constructor() {
    this.countdownBroadcast$ = new Subject<BroadcastData>();
  }

  // eslint-disable-next-line class-methods-use-this
  getPaticipants() {
    return participants;
  }

  init(server: Server) {
    this.server = server;
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

    const randomCountdownBreakpoint = getRandomCountdownValue();
    this.countdown$ = timer(0, 1000)
      .pipe(
        take(countdownStartValue),
        map((value) => countdownStartValue - value),
        tap((value) => {
          console.log('value = ', value);
          if (randomCountdownBreakpoint === value) {
            const newBid = {
              previousBidID: this.bid.id,
              participantID: getRandomActiveParticipantID(this.bid.participantID),
            };
            console.log('newBid.participantID = ', newBid.participantID);
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
