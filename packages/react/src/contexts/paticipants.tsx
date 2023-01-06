import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Participants, SocketEvent } from '@lotus/shared';

import { socket } from '../api';

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
    () =>
      socket.emit(SocketEvent.GetPaticipants, undefined, (json: string) => {
        setLoading(false);
        setParticipantsState(JSON.parse(json));
      }),
    [setLoading, setParticipantsState],
  );

  useEffect(() => {
    socket.on(SocketEvent.Connect, listener);

    return () => {
      socket.off(SocketEvent.Connect, listener);
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
