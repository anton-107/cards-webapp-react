import * as React from "react";
import { NavLink } from "react-router-dom";

export function LeftMenuLinks(): React.ReactElement {
  return (
    <ul className="menu-links">
      <li>
        <NavLink
          to="/"
          data-testid="notebooks-page-link"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/people"
          data-testid="people-page-link"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          People
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/questions"
          data-testid="people-page-link"
          className={({ isActive }) => (isActive ? "active-nav-link" : "")}
        >
          Open questions
        </NavLink>
      </li>
    </ul>
  );
}
