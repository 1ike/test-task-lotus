import { useContext } from 'react';

import styles from './columnNamesRow.module.scss';
import { ParticipantsContext } from '../../../contexts/paticipants';
import { BidContext } from '../../../contexts/bid';

export function ColumnNamesRow() {
  const { participants, loading } = useContext(ParticipantsContext);
  const { requestNewBid, bid } = useContext(BidContext);

  return (
    <tr>
      <th>Параметры и требования</th>
      {!loading &&
        participants.map(({ id, name }) => {
          const isActive = id === bid?.participantID;
          return (
            <th
              key={id}
              className={isActive ? styles.participantActive : styles.participant}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(!isActive && {
                onClick: () => requestNewBid?.(id),
              })}
            >
              Участник №{id}
              <br />
              <span className={styles.participantName}>{name}</span>
            </th>
          );
        })}
    </tr>
  );
}

export default ColumnNamesRow;
