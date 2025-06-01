import React from 'react';
import { NavLink } from 'react-router';

function Header({ title }) {
  return (
    <div>
      <header>
        <h1>{title}</h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <span className="separator">|</span>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
    </div>
  );
}

export default Header;
