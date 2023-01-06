import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Bid, ParticipantID, BroadcastData, NewBidRequest, SocketEvent } from '@lotus/shared';
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

  const listener = useCallback(
    (broadcastData: BroadcastData) => {
      if (broadcastData.bid && broadcastData.bid.id !== bid?.id) setBid(broadcastData.bid);
    },
    [setBid, bid],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, listener);

    return () => {
      socket.off(SocketEvent.Countdown, listener);
    };
  }, [listener]);

  const value = useMemo(
    () => ({
      bid,
      requestNewBid,
    }),
    [bid, requestNewBid],
  );

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}
