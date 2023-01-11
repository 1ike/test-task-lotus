import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { DEFAULT_ROOM_NAME, TITLE_POSTFIX } from '../../config';
import styles from './home.module.scss';

export function Home() {
  useEffect(() => {
    document.title = `Главная${TITLE_POSTFIX}`;
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Комнаты для торгов</h1>
      <Link to={`/room/${DEFAULT_ROOM_NAME}`}>Войти в комнату {DEFAULT_ROOM_NAME}</Link>
    </div>
  );
}

export default Home;
