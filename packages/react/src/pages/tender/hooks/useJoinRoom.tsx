import { useCallback, useEffect, useState } from 'react';
import { SocketEvent, JoinRoomResponse } from '@lotus/shared';
import { useParams } from 'react-router-dom';

import { socket } from '../../../api';
import { useAppDispatch } from '../../../state/store';
import { tenderActions } from '../state/tender';

export type Loading = boolean;
const initialLoading = true;

export function useJoinRoom() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<Loading>(initialLoading);

  const { roomName } = useParams();

  const joinRoom = useCallback(() => {
    socket.emit(SocketEvent.JoinRoom, roomName, (json: string) => {
      setLoading(false);

      const { participants: roomParticipants }: JoinRoomResponse = JSON.parse(json);
      dispatch(tenderActions.setParticipants(roomParticipants));
    });
  }, [roomName, dispatch]);

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

  return loading;
}
