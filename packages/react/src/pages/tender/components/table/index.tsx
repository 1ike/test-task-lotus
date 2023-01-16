import { Participant } from '@lotus/shared';
import styles from './table.module.scss';
import CountdownRow from './countdownRow';
import ColumnNamesRow from './columnNamesRow';
import { useAppSelector } from '../../../../state/store';
import { selectParticipants } from '../../state/tender';
import { useJoinRoom } from '../../hooks/useJoinRoom';
import { useSubscribeBid } from '../../hooks/useSubscribeBid';
import { useSubscribeCountdown } from '../../hooks/useSubscribeCountdown';

type DisplayedParamsKey = keyof Omit<Participant, 'id' | 'name'>;

const displayedParams: Array<[DisplayedParamsKey, string]> = [
  [
    'qualityImprovementEvent',
    'Наличие комплекса мероприятий, повышающих стандарты качества изготовления',
  ],
  ['productionTime', 'Срок изготовления лота, дней'],
  ['warranty', 'Гарантийные обязательства, мес'],
  ['paymentTerms', 'Условия оплаты'],
  ['value', 'Стоимость изготовления лота, руб. (без НДС)'],
  ['actions', 'Действия:'],
];

export function Table() {
  const loading = useJoinRoom();
  useSubscribeCountdown();
  useSubscribeBid();

  const participants = useAppSelector(selectParticipants);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.head}>
          <CountdownRow participants={participants} loading={loading} />
          <ColumnNamesRow participants={participants} loading={loading} />
        </thead>
        <tbody className={styles.body}>
          {displayedParams.map(([key, rowName]) => (
            <tr key={key}>
              <th className={styles.rowName}>
                <div>{rowName}</div>
              </th>
              {!loading &&
                participants?.map((participant) => (
                  <td key={participant.id}>
                    <div className={styles.rowValues}>
                      {key === 'value' ? (
                        <div className={styles.value}>
                          <span className={styles.valueOffered}>{participant[key]} руб.</span>
                          <br />
                          <span className={styles.valueDiscont}>-25,000 руб.</span>
                          <br />
                          <span className={styles.valueStart}>2,475,000 руб.</span>
                        </div>
                      ) : (
                        participant[key]
                      )}
                    </div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className={styles.loading}>Загрузка...</p>}
    </div>
  );
}

export default Table;
