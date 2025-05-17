import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    return (
    <header className="navbar">
        <nav className="container">
        <div className="navbar-top">
            <h1 className="logo">EsportsTorneos</h1>
            <button
            onClick={toggleMenu}
            className="menu-button"
            aria-label="Abrir menú"
            >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
        <ul className={`navbar-links ${menuAbierto ? "open" : ""}`}>
            <li><Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
            <li><Link to="/torneos" onClick={() => setMenuAbierto(false)}>Torneos</Link></li>
            <li><Link to="/noticias" onClick={() => setMenuAbierto(false)}>Noticias</Link></li>
            <li><Link to="/perfil" onClick={() => setMenuAbierto(false)}>Perfil</Link></li>
            <li><Link to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</Link></li>
        </ul>
        </nav>
    </header>
    );
}
