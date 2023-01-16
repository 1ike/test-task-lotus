import { Bid } from '@lotus/shared';
import styles from './countdownRow.module.scss';
import Countdown from './countdown';
import type { TableHeaderProps } from '..';

type Props = { bid?: Bid } & TableHeaderProps;

export function CountdownRow({ participants, loading, bid }: Props) {
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
