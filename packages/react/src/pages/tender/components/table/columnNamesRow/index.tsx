import { PropsWithChildren } from 'react';

import { Participants } from '@lotus/shared';
import styles from './columnNamesRow.module.scss';
import { Loading } from '../../../hooks/useJoinRoom';
import { useAppSelector } from '../../../../../state/store';
import { selectBid } from '../../../state/tender';
import { useRequestNewBid } from './useRequestNewBid';

type Props = {
  participants?: Participants;
  loading?: Loading;
} & PropsWithChildren;

export function ColumnNamesRow({ participants, loading }: Props) {
  const bid = useAppSelector(selectBid);
  const requestNewBid = useRequestNewBid();

  return (
    <tr>
      <th>Параметры и требования</th>
      {!loading &&
        participants?.map(({ id, name }) => {
          const isActive = id === bid?.participantID;
          return (
            <th
              key={id}
              className={isActive ? styles.participantActive : styles.participant}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(!isActive && {
                onClick: () => requestNewBid(id),
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
