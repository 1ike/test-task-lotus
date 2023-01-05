import { BroadcastData, NewBidRequest, SocketEvent } from '@lotus/shared';
import io from 'socket.io-client';

const socket = io('http://localhost:3333');

export enum BusEvent {
  SetParticipants = 'setParticipants',
  Countdown = 'countdown',
  MakeBid = 'makeBid',
}

class EventBus extends EventTarget {
  addListener<D>(event: BusEvent, handler: (event: CustomEvent<D>) => void) {
    this.addEventListener(event, handler as EventListener);
  }

  removeListener<D>(event: BusEvent, handler: (event: CustomEvent<D>) => void) {
    this.removeEventListener(event, handler as EventListener);
  }

  dispatch<D>(event: BusEvent, data: D) {
    const customEvent = new CustomEvent(event, {
      detail: data,
    });
    this.dispatchEvent(customEvent);
  }
}

export const eventBus = new EventBus();

eventBus.addListener<NewBidRequest>(BusEvent.MakeBid, ({ detail: newBidRequest }) => {
  socket.emit(SocketEvent.MakeNewBid, newBidRequest);
});

socket.on('connect', () => {
  socket.emit(SocketEvent.GetPaticipants, undefined, (json: string) => {
    eventBus.dispatch(BusEvent.SetParticipants, JSON.parse(json));
  });
});

socket.on(SocketEvent.Countdown, (broadcastData: BroadcastData) => {
  eventBus.dispatch(BusEvent.Countdown, broadcastData);
});
