import { BroadcastData, Countdown, SocketEvent } from '@lotus/shared';
import { useCallback, useEffect, useState } from 'react';
import { socket } from '../../../../../../../api';

export function useCountdown() {
  const [countdown, setCountdown] = useState<Countdown>();

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      setCountdown(broadcastData.countdown);
    },
    [setCountdown],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);

  return countdown;
}
