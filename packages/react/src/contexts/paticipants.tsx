import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Participants } from '@lotus/shared';

import { BusEvent, eventBus } from '../api';

const initialParticipants: Participants = [];
const initialLoading = true;

type ParticipantsContextType = {
  participants: Participants;
  loading: boolean;
};
export const ParticipantsContext = React.createContext<ParticipantsContextType>({
  participants: initialParticipants,
  loading: initialLoading,
});

export function ParticipantsProvider({ children }: PropsWithChildren) {
  const [participants, setParticipantsState] = useState<Participants>(initialParticipants);

  const [loading, setLoading] = useState(initialLoading);

  const listener = useCallback(
    ({ detail: data }: { detail: Participants }) => {
      setLoading(false);
      setParticipantsState(data);
    },
    [setLoading, setParticipantsState],
  );

  useEffect(() => {
    eventBus.addListener<Participants>(BusEvent.SetParticipants, listener);

    return () => {
      eventBus.removeListener<Participants>(BusEvent.SetParticipants, listener);
    };
  }, [listener]);

  const value = useMemo(
    () => ({
      participants,
      loading,
    }),
    [participants, loading],
  );

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>;
}
