import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../shared/Header.module.css';

function Header({ title }) {
  return (
    <div>
      <header>
        <h1 className={styles.title}>{title}</h1>
        <div>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : styles.inactive
              }
            >
              Home
            </NavLink>
            <span className="separator">|</span>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.active : styles.inactive
              }
            >
              About
            </NavLink>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;
