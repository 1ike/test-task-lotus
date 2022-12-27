import styles from './header.module.scss';

export type HeaderProps = {
  title: string;
  preTitle: string;
};

export function Header({ title, preTitle }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>
        <span className={styles.header__preTitle}>{title}</span>
        {preTitle}
      </h1>
    </header>
  );
}

export default Header;
