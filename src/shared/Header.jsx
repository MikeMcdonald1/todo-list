import React from 'react';
import { NavLink } from 'react-router-dom';

function Header({ title }) {
  return (
    <div>
      <header>
        <h1>{title}</h1>
        <div>
          <nav>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
            >
              Home
            </NavLink>
            <span className="separator">|</span>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
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
