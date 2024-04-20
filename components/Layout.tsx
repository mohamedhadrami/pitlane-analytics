// components/Layout.tsx

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import styles from '../styles/layout.module.css';
import MenuIcon from '@mui/icons-material/Menu';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Title Not Found" }: Props) => {
  const [isNavOpen, setIsNavOpen] = useState(true); // Change initial state to false
  const formattedTitle = `${title} - Pitlane Analytics`;

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{formattedTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={`${styles.topnav} ${isNavOpen ? styles.responsive : ''}`}>
        <a className={styles.title}>Pitlane Analytics</a>
        <a
          className={`${styles.icon} ${isNavOpen ? styles.hide : ''}`}
          onMouseEnter={toggleNav} // Change event to onMouseEnter
        // onClick={toggleNav} // Comment out or remove this line
        >
          <MenuIcon />
        </a>
        <div className={`${styles.navLinks} ${isNavOpen ? '' : styles.show}`} onMouseLeave={toggleNav}> {/* Close dropdown when mouse leaves */}
          <Link href="/schedule" className={styles.navlink}>Schedule</Link>
          <Link href="/championships" className={styles.navlink}>Championship</Link>
          <Link href="/telemetry" className={styles.navlink}>Telemetry</Link>
          <Link href="/dashboard" className={styles.navlink}>Live</Link>
          <Link href="/archive" className={styles.navlink}>F1 Archive</Link>
        </div>

      </header>
      <div className={styles.container}>{children}</div>
      <footer className={styles.footer}>
        <hr />
        <p>
          Powered by <a href="https://openf1.org/">OpenF1 API</a> and <a href="https://ergast.com/mrd/">Ergast API</a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
