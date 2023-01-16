import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Participants, SocketEvent, JoinRoomResponse } from '@lotus/shared';
import { useParams } from 'react-router-dom';

import { socket } from '../../../api';

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

  const joinRoom = useCallback(() => {
    socket.emit(SocketEvent.JoinRoom, roomName, (json: string) => {
      setLoading(false);

      const { participants: roomParticipants }: JoinRoomResponse = JSON.parse(json);
      setParticipantsState(roomParticipants);
    });
  }, [roomName]);

  useEffect(() => {
    socket.io.on('reconnect', joinRoom);
    return () => {
      socket.io.off('reconnect', joinRoom);
    };
  }, [joinRoom]);

  useEffect(() => {
    joinRoom();

    return () => {
      socket.emit(SocketEvent.LeaveRoom, roomName);
    };
  }, [roomName, joinRoom]);

  const value = useMemo(
    () => ({
      participants,
      loading,
    }),
    [participants, loading],
  );

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>;
}
