import React from "react";
import { NavLink } from "react-router-dom";
import { FaFilm, FaSearch, FaRegBookmark } from "react-icons/fa";
import "../index.css";

const linkClass = ({ isActive }) =>
  [
    "inline-flex items-center justify-center transition outline-none focus:ring-2",
    "border-2 border-[var(--color-border)] text-[var(--color-button)] focus:ring-[var(--color-border)]/40",
    "w-11 h-11 rounded-full",
    "md:w-48 md:h-9 md:rounded-full",
    "hover:bg-[var(--color-border)] hover:text-[var(--color-background)]",
    isActive ? "bg-[var(--color-border)] text-[var(--color-background)]" : "",
  ].join(" ");

function Navbar() {
  return (
    <header>
      <nav className="mx-auto max-w-5xl px-4 py-3">
        <ul className="mx-auto w-full max-w-4xl flex justify-center md:justify-between gap-6 md:gap-8">
          <li>
            <NavLink to="/search" className={linkClass} aria-label="Buscar">
              <FaSearch className="text-[1.1rem]" />
            </NavLink>
          </li>

          <li>
            <NavLink to="/" end className={linkClass} aria-label="Descubrir">
              <FaFilm className="text-[1.1rem]" />
            </NavLink>
          </li>

          <li>
            <NavLink to="/watchlist" className={linkClass} aria-label="Watchlist">
              <FaRegBookmark className="text-[1.1rem]" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
