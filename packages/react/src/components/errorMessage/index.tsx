import styles from './errorMessage.module.scss';
import { errorMessageActions, selectErrorMessage } from '../../state/errorMessage';
import { useAppDispatch, useAppSelector } from '../../state/store';

export function ErrorMessage() {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectErrorMessage);

  if (!errorMessage) return null;

  return (
    <div className={styles.container}>
      <div>{errorMessage ?? 'Произошла ошибка.'}</div>
      <button
        type="button"
        className={styles.close}
        onClick={() => dispatch(errorMessageActions.resetErrorMessage())}
      >
        &#11198;
      </button>
    </div>
  );
}

export default ErrorMessage;
