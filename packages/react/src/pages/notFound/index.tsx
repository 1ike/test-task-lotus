import { useEffect } from 'react';

import { TITLE_POSTFIX } from '../../config';
import styles from './notFound.module.scss';

export function NotFound() {
  useEffect(() => {
    document.title = `Ничего не найдено${TITLE_POSTFIX}`;
  }, []);

  return <h1 className={styles.notFound}>Ничего не найдено</h1>;
}

export default NotFound;
