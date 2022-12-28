import styles from './table.module.scss';
import { participants as mockedParticipants } from './mockData';

export type Participant = {
  id: number;
  name: string;
  qualityImprovementEvent?: string;
  productionTime: number;
  warranty: number;
  paymentTerms: number;
  value: number;
  actions?: string;
};

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

export function Table({
  participants = mockedParticipants,
}: {
  participants: Participant[];
}) {
  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.head}>
          <tr>
            <th>Ход</th>
            {participants.map((participant) => (
              <th key={participant.id}></th>
            ))}
          </tr>
          <tr>
            <th>Параметры и требования</th>
            {participants.map((participant) => (
              <th key={participant.id}>
                Участник №{participant.id}
                <br />
                {participant.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {displayedParams.map(([key, rowName]) => (
            <tr key={key}>
              <th>{rowName}</th>
              {participants.map((participant) => (
                <td key={participant.id}>{participant[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
