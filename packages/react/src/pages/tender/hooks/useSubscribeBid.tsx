import { useCallback, useEffect } from 'react';

import { BroadcastData, SocketEvent } from '@lotus/shared';
import { socket } from '../../../api';
import { useAppDispatch } from '../../../state/store';
import { tenderActions } from '../state/tender';

export function useSubscribeBid() {
  const dispatch = useAppDispatch();

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      if (broadcastData.bid) {
        dispatch(tenderActions.setBid(broadcastData.bid));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);
}
