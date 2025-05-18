import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <header className="nvr-header">
      <nav className="nvr-nav">
        {/* Logo */}
        <Link to="/" className="nvr-logo">
          EsportsTorneos
        </Link>

        {/* Botón menú mobile */}
        <button
          onClick={toggleMenu}
          className="nvr-menu-button"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <ul
          className={`nvr-links ${menuAbierto ? "nvr-links-open" : ""}`}
        >
          <li>
            <Link to="/" onClick={() => setMenuAbierto(false)} className="nvr-link">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/torneos" onClick={() => setMenuAbierto(false)} className="nvr-link">
              Torneos
            </Link>
          </li>
          <li>
            <Link to="/noticias" onClick={() => setMenuAbierto(false)} className="nvr-link">
              Noticias
            </Link>
          </li>
          <li>
            <Link to="/perfil" onClick={() => setMenuAbierto(false)} className="nvr-link">
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/contacto" onClick={() => setMenuAbierto(false)} className="nvr-link">
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
