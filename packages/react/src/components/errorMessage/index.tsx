import { useContext } from 'react';

import { ErrorMessageContext } from '../../contexts/error';
import styles from './errorMessage.module.scss';

export function ErrorMessage() {
  const { errorMessage, resetErrorMessage } = useContext(ErrorMessageContext);

  if (!errorMessage) return null;

  return (
    <div className={styles.container}>
      <div>{errorMessage ?? 'Произошла ошибка.'}</div>
      <button type="button" className={styles.close} onClick={() => resetErrorMessage?.()}>
        &#11198;
      </button>
    </div>
  );
}

export default ErrorMessage;
