import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { Participants } from '@lotus/shared';

import { participants as mockedParticipants } from './mockData';
import { socket } from './../api';

const initialParticipants: Participants = [];
const initialLoading = true;

interface ParticipantsContextType {
  participants: Participants;
  loading: boolean;
}
export const ParticipantsContext = React.createContext<ParticipantsContextType>(
  {
    participants: initialParticipants,
    loading: initialLoading,
  }
);

export function ParticipantsProvider({ children }: PropsWithChildren) {
  const [participants, setParticipantsState] =
    useState<Participants>(initialParticipants);

  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    socket.onopen = (event) => {
      console.log('open');
      socket.send(
        JSON.stringify({
          event: 'events',
          data: 'test events',
        })
      );
      socket.send(
        JSON.stringify({
          event: 'jjj',
          data: 'test jjj',
        })
      );
      socket.onmessage = function ({ data }) {
        console.log(data);
      };
    };
    setTimeout(() => {
      setLoading(false);
      setParticipantsState(mockedParticipants);
    }, 1000);
  }, [setParticipantsState]);

  const value = useMemo(
    () => ({
      participants,
      loading,
    }),
    [participants, loading]
  );

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}
