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

  const handler = useCallback(() => {
    setErrorMessage('Проблемы с соединением через socket.io.');
  }, [setErrorMessage]);

  const handlerConnect = useCallback(() => {
    resetErrorMessage();
  }, [resetErrorMessage]);

  useEffect(() => {
    socket.on(SocketEvent.ConnectError, handler);
    socket.on(SocketEvent.Disconnect, handler);
    socket.on(SocketEvent.Connect, handlerConnect);

    return () => {
      socket.off(SocketEvent.ConnectError, handler);
      socket.off(SocketEvent.Disconnect, handler);
    };
  }, [handler, handlerConnect]);

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
