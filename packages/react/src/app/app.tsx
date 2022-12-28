import styles from './app.module.scss';
import Header from '../components/header';
import Warning from './../components/warning';
import Table from './../components/table';

export function App() {
  return (
    <>
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
      <div />
    </>
  );
}

export default App;
