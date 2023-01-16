import { Bid } from '@lotus/shared';
import styles from './columnNamesRow.module.scss';
import { useRequestNewBid } from './useRequestNewBid';
import type { TableHeaderProps } from '..';

type Props = { bid?: Bid } & TableHeaderProps;

export function ColumnNamesRow({ participants, loading, bid }: Props) {
  const requestNewBid = useRequestNewBid(bid);

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
