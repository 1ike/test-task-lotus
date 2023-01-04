import { useContext } from 'react';

import { Participant } from '@lotus/shared';

import styles from './table.module.scss';
import { ParticipantsContext } from '../../contexts/paticipants';
import CountdownRow from './countdownRow';

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
  const { participants, loading } = useContext(ParticipantsContext);
  console.log('--- table render ---');

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.head}>
          <CountdownRow />
          <tr>
            <th>Параметры и требования</th>
            {!loading &&
              participants.map((participant) => (
                <th key={participant.id}>
                  Участник №{participant.id}
                  <br />
                  <span className={styles.participantName}>{participant.name}</span>
                </th>
              ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {displayedParams.map(([key, rowName]) => (
            <tr key={key}>
              <th className={styles.rowName}>
                <div>{rowName}</div>
              </th>
              {!loading &&
                participants.map((participant) => (
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
