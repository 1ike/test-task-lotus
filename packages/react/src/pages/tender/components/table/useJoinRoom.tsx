import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SocketEvent, JoinRoomResponse, Participants } from '@lotus/shared';
import { socket } from '../../../../api';

export type Loading = boolean;
const initialLoading = true;

export function useJoinRoom() {
  const [participants, setParticipants] = useState<Participants>();
  const [loading, setLoading] = useState<Loading>(initialLoading);

  const { roomName } = useParams();

  const joinRoom = useCallback(() => {
    socket.emit(SocketEvent.JoinRoom, roomName, (json: string) => {
      setLoading(false);

      const { participants: roomParticipants }: JoinRoomResponse = JSON.parse(json);
      setParticipants(roomParticipants);
    });
  }, [roomName, setParticipants]);

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

  return { participants, loading };
}
