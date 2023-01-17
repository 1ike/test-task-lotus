import { PropsWithChildren } from 'react';

import { Participants } from '@lotus/shared';
import styles from './countdownRow.module.scss';
import Countdown from './countdown';

import { Loading } from '../../../hooks/useJoinRoom';
import { useAppSelector } from '../../../../../state/store';
import { selectBid } from '../../../state/tender';

type Props = { participants?: Participants; loading?: Loading } & PropsWithChildren;

export function CountdownRow({ participants, loading }: Props) {
  const bid = useAppSelector(selectBid);
  const activeParticipantID = bid?.participantID;

  return (
    <tr>
      <th>
        <div className={styles.header}>
          Ход
          {!activeParticipantID && (
            <div className={styles.noBid}>
              <Countdown />
            </div>
          )}
        </div>
      </th>
      {participants?.length === 0 && !loading ? (
        <th>
          <Countdown />
        </th>
      ) : (
        participants?.map((participant) => (
          <th key={participant.id}>{participant.id === activeParticipantID && <Countdown />}</th>
        ))
      )}
    </tr>
  );
}

export default CountdownRow;