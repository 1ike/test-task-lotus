import { BroadcastData } from '@lotus/shared';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { BusEvent, eventBus } from '../api';

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
    ({ detail: broadcastData }: { detail: BroadcastData }) => {
      setCountdownState(broadcastData.countdown);
    },
    [setCountdownState],
  );

  useEffect(() => {
    eventBus.addListener<BroadcastData>(BusEvent.Countdown, listener);

    return () => {
      eventBus.removeListener<BroadcastData>(BusEvent.Countdown, listener);
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
