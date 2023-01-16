import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Bid, ParticipantID, BroadcastData, NewBidRequest, SocketEvent } from '@lotus/shared';
import { socket } from '../../../api';

type BidContextType = {
  bid?: Bid;
  requestNewBid?: (participantID: ParticipantID) => void;
};
export const BidContext = React.createContext<BidContextType>({});

export function BidProvider({ children }: PropsWithChildren) {
  const [bid, setBid] = useState<BidContextType['bid']>();

  const { roomName } = useParams();

  const requestNewBid = useCallback(
    (participantID: ParticipantID) => {
      if (!roomName) return;

      const params: NewBidRequest = {
        previousBidID: bid?.id,
        participantID,
        roomName,
      };
      socket.emit(SocketEvent.MakeNewBid, params);
    },
    [bid, roomName],
  );

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      if (broadcastData.bid?.id !== bid?.id) setBid(broadcastData.bid);
    },
    [setBid, bid],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);

  const value = useMemo(
    () => ({
      bid,
      requestNewBid,
    }),
    [bid, requestNewBid],
  );

  return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
}
