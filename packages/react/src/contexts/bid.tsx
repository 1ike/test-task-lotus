import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Bid, ParticipantID, SocketEvent, BroadcastData, NewBidRequest } from '@lotus/shared';
import { socket } from '../api';

type BidContextType = {
  bid?: Bid;
  requestNewBid?: (participantID: ParticipantID) => void;
};
export const BidContext = React.createContext<BidContextType>({});

export function BidProvider({ children }: PropsWithChildren) {
  const [bid, setBid] = useState<BidContextType['bid']>();

  const requestNewBid = useCallback(
    (participantID: ParticipantID) => {
      const params: NewBidRequest = {
        previousBidID: bid?.id,
        participantID,
      };
      socket.emit(SocketEvent.MakeNewBid, params);
    },
    [bid],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, (broadcastData: BroadcastData) => {
      if (broadcastData.bid && broadcastData.bid.id !== bid?.id) setBid(broadcastData.bid);
    });

    return () => {
      socket.removeAllListeners(SocketEvent.Countdown);
    };
  }, [bid, setBid]);

  const value = useMemo(
    () => ({
      bid,
      requestNewBid,
    }),
    [bid, requestNewBid],
  );

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}
