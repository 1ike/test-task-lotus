import { useCallback, useEffect, useState } from 'react';

import { Bid, BroadcastData, SocketEvent } from '@lotus/shared';
import { socket } from '../../../../../api';

export function useBid() {
  const [bid, setBid] = useState<Bid>();

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      if (broadcastData.bid?.id !== bid?.id) {
        setBid(broadcastData.bid);
      }
    },
    [setBid, bid],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);

  return bid;
}
