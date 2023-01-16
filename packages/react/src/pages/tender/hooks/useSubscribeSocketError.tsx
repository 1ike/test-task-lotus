import { SocketEvent } from '@lotus/shared';
import { useCallback, useEffect } from 'react';
import { socket } from '../../../api';
import { useAppDispatch } from '../../../state/store';
import { errorMessageActions } from '../../../state/errorMessage';

export function useSubscribeSocketError() {
  const dispatch = useAppDispatch();

  const handler = useCallback(() => {
    dispatch(errorMessageActions.setErrorMessage('Проблемы с соединением через socket.io.'));
  }, [dispatch]);

  const handlerConnect = useCallback(() => {
    dispatch(errorMessageActions.resetErrorMessage());
  }, [dispatch]);

  useEffect(() => {
    socket.on(SocketEvent.ConnectError, handler);
    socket.on(SocketEvent.Disconnect, handler);
    socket.on(SocketEvent.Connect, handlerConnect);

    return () => {
      socket.off(SocketEvent.ConnectError, handler);
      socket.off(SocketEvent.Disconnect, handler);
    };
  }, [handler, handlerConnect]);
}
