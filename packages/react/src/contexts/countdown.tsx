import { BroadcastData, SocketEvent } from '@lotus/shared';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '../api';

export type Countdown = number;

const initialCountdown = 120;

type CountdownContextType = {
  countdown: Countdown;
};
export const CountdownContext = React.createContext<CountdownContextType>({
  countdown: initialCountdown,
});

export function CountdownProvider({ children }: PropsWithChildren) {
  const [countdown, setCountdownState] = useState<Countdown>(initialCountdown);

  const listener = useCallback(
    (broadcastData: BroadcastData) => {
      setCountdownState(broadcastData.countdown);
    },
    [setCountdownState],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, listener);

    return () => {
      socket.off(SocketEvent.Countdown, listener);
    };
  }, [listener]);

  const value = useMemo(
    () => ({
      countdown,
    }),
    [countdown],
  );

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
}
