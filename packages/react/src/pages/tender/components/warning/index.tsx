import styles from './warning.module.scss';

export type WarningProps = {
  text: string;
  className?: string;
};

export function Warning({ text, className }: WarningProps) {
  return (
    <div className={className}>
      <p className={styles.warning}>{text}</p>
    </div>
  );
}

export default Warning;
