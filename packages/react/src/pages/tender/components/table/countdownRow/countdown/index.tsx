import { useContext } from 'react';

import { CountdownContext } from '../../../../contexts/countdown';
import styles from './countdown.module.scss';
import { ReactComponent as TimerIcon } from './hourglass-outline.svg';

const formatTime = (secondsAll: number) => {
  const seconds = secondsAll % 60;
  const minutesAll = (secondsAll - seconds) / 60;
  const minutes = minutesAll % 60;
  const hours = (minutesAll - minutes) / 60;

  const timeUnitsToString = (units: number) => {
    if (units === 0) return '00';
    if (units.toString().length === 1) return `0${units}`;

    return String(units);
  };

  return `${timeUnitsToString(hours)}:${timeUnitsToString(minutes)}:${timeUnitsToString(seconds)}`;
};

export function Countdown() {
  const { countdown } = useContext(CountdownContext);

  if (!countdown) return null;

  const formattedCountdown = formatTime(countdown);

  return (
    <div className={styles.countdown}>
      <span className={styles.timer}>{formattedCountdown}</span>
      <TimerIcon className={styles.icon} />
    </div>
  );
}

export default Countdown;
