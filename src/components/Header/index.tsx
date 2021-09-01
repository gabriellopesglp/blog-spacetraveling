import Link from 'next/link';
import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header() {
  return (
    <header className={`${styles.headerContainer} ${commonStyles.container}`}>
      <Link href="/">
        <a>
          <div>
            <img src="/spacetraveling.svg" alt="logo" />
          </div>
        </a>
      </Link>
    </header>
  );
}
