import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Bid, ParticipantID, BroadcastData, NewBidRequest } from '@lotus/shared';
import { BusEvent, eventBus } from '../api';

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
      eventBus.dispatch(BusEvent.MakeBid, params);
    },
    [bid],
  );

  const listener = useCallback(
    ({ detail: broadcastData }: { detail: BroadcastData }) => {
      if (broadcastData.bid && broadcastData.bid.id !== bid?.id) setBid(broadcastData.bid);
    },
    [setBid, bid],
  );

  useEffect(() => {
    eventBus.addListener<BroadcastData>(BusEvent.Countdown, listener);

    return () => {
      eventBus.removeListener<BroadcastData>(BusEvent.Countdown, listener);
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
