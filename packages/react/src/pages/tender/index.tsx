import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ParticipantsProvider } from '../../contexts/paticipants';
import { BidProvider } from '../../contexts/bid';
import { CountdownProvider } from '../../contexts/countdown';
import styles from './tender.module.scss';
import Header from '../../components/header';
import Warning from '../../components/warning';
import Table from '../../components/table';
import { TITLE_POSTFIX } from '../../config';

export function Tender() {
  const { roomName } = useParams();
  useEffect(() => {
    document.title = `Комната  ${roomName}${TITLE_POSTFIX}`;
  }, [roomName]);

  return (
    <ParticipantsProvider>
      <BidProvider>
        <CountdownProvider>
          <Header
            title="Ход торгов"
            preTitle="Тестовые торги на аппарат ЛОТОС №2033564 (09.11.2020 07:00)"
          />
          <main className={styles.content}>
            <Warning
              text="Уважаемые участники, во время вашего хода вы можете изменить параметры торгов, указанных в таблице:"
              className={styles.warning}
            />
            <Table />
          </main>
        </CountdownProvider>
      </BidProvider>
    </ParticipantsProvider>
  );
}

export default Tender;
