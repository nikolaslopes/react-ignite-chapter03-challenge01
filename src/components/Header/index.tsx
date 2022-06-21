import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContent}>
      <Link href="/">
        <a>
          <img src="/images/logo-space-traveling.svg" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
