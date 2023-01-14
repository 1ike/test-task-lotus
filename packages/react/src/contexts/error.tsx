import { SocketEvent } from '@lotus/shared';
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '../api';

export type ErrorMessage = string;

type ErrorMessageContextType = {
  errorMessage: ErrorMessage;
  setErrorMessage?: (message: ErrorMessage) => void;
  resetErrorMessage?: () => void;
};

const errorMessageInitialState = {
  errorMessage: '',
};

export const ErrorMessageContext =
  React.createContext<ErrorMessageContextType>(errorMessageInitialState);

export function ErrorMessageProvider({ children }: PropsWithChildren) {
  const [errorMessage, setErrorMessageState] = useState<ErrorMessageContextType['errorMessage']>(
    errorMessageInitialState.errorMessage,
  );

  const setErrorMessage = useCallback(
    (message: ErrorMessage) => {
      setErrorMessageState(message);
    },
    [setErrorMessageState],
  );

  const resetErrorMessage = useCallback(() => {
    setErrorMessageState(errorMessageInitialState.errorMessage);
  }, [setErrorMessageState]);

  const listener = useCallback(() => {
    setErrorMessage('Проблемы с соединением через socket.io.');
  }, [setErrorMessage]);

  const listenerConnect = useCallback(() => {
    resetErrorMessage();
  }, [resetErrorMessage]);

  useEffect(() => {
    socket.on(SocketEvent.ConnectError, listener);
    socket.on(SocketEvent.Disconnect, listener);
    socket.on(SocketEvent.Connect, listenerConnect);

    return () => {
      socket.off(SocketEvent.ConnectError, listener);
      socket.off(SocketEvent.Disconnect, listener);
    };
  }, [listener, listenerConnect]);

  const value = useMemo(
    () => ({
      errorMessage,
      setErrorMessage,
      resetErrorMessage,
    }),
    [errorMessage, setErrorMessage, resetErrorMessage],
  );

  return <ErrorMessageContext.Provider value={value}>{children}</ErrorMessageContext.Provider>;
}
