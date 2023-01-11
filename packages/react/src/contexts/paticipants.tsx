import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Participants, SocketEvent, JoinRoomRequest } from '@lotus/shared';
import { useParams } from 'react-router-dom';

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

  const { roomName } = useParams();

  const listener = useCallback(() => {
    socket.emit(SocketEvent.JoinRoom, roomName, (json: string) => {
      setLoading(false);

      const { participants: roomParticipants }: JoinRoomRequest = JSON.parse(json);
      setParticipantsState(roomParticipants);
    });
  }, [setLoading, setParticipantsState, roomName]);

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
