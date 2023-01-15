import { BroadcastData, SocketEvent } from '@lotus/shared';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '../../../api';

export type Countdown = number;

type CountdownContextType = {
  countdown?: Countdown;
};
export const CountdownContext = React.createContext<CountdownContextType>({});

export function CountdownProvider({ children }: PropsWithChildren) {
  const [countdown, setCountdownState] = useState<Countdown>();

  const handler = useCallback(
    (broadcastData: BroadcastData) => {
      setCountdownState(broadcastData.countdown);
    },
    [setCountdownState],
  );

  useEffect(() => {
    socket.on(SocketEvent.Countdown, handler);

    return () => {
      socket.off(SocketEvent.Countdown, handler);
    };
  }, [handler]);

  const value = useMemo(
    () => ({
      countdown,
    }),
    [countdown],
  );

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
}
