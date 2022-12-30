import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ID } from '@lotus/shared';

export type ActiveParticipantID = ID | null;

const initialActiveParticipantID = null;

interface ActiveParticipantIDContextType {
  activeParticipantID: ActiveParticipantID;
  setActiveParticipantID?: (activeParticipantID: ActiveParticipantID) => void;
}
export const ActiveParticipantIDContext =
  React.createContext<ActiveParticipantIDContextType>({
    activeParticipantID: initialActiveParticipantID,
  });

export function ActiveParticipantIDProvider({ children }: PropsWithChildren) {
  const [activeParticipantID, setActiveParticipantIDState] =
    useState<ActiveParticipantID>(initialActiveParticipantID);

  const setActiveParticipantID = useCallback(
    (activeParticipantID: ActiveParticipantID) =>
      setActiveParticipantIDState(activeParticipantID),
    [setActiveParticipantIDState]
  );

  useEffect(() => {
    // setTimeout(() => setParticipants([]), 0);
  }, [setActiveParticipantIDState]);

  const value = useMemo(
    () => ({
      activeParticipantID,
      setActiveParticipantID,
    }),
    [activeParticipantID, setActiveParticipantID]
  );

  return (
    <ActiveParticipantIDContext.Provider value={value}>
      {children}
    </ActiveParticipantIDContext.Provider>
  );
}
