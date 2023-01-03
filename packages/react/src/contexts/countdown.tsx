import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { socket } from '../api';

export type Countdown = number;

const initialCountdown = 120;

interface CountdownContextType {
  countdown: Countdown;
}
export const CountdownContext = React.createContext<CountdownContextType>({
  countdown: initialCountdown,
});

export function CountdownProvider({ children }: PropsWithChildren) {
  const [countdown, setCountdownState] = useState<Countdown>(initialCountdown);

  useEffect(() => {
    socket.on('countdown', (value) => {
      setCountdownState(value);
    });
  }, [setCountdownState]);

  const value = useMemo(
    () => ({
      countdown,
    }),
    [countdown],
  );

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
}
