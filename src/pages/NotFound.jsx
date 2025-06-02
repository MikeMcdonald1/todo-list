import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../pages/NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <p className={styles.notFoundParagraph}>Page not found. Womp womp.</p>
      <Link to="/" className={styles.notFoundLink}>
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
