import { BroadcastData, SocketEvent } from '@lotus/shared';
import { useCallback, useEffect } from 'react';
import { socket } from '../../../api';
import { useAppDispatch } from '../../../state/store';
import { tenderActions } from '../state/tender';

export function useSubscribeCountdown() {
  const dispatch = useAppDispatch();

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      dispatch(tenderActions.setCountdown(broadcastData.countdown));
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
