import React, { useState } from "react";
import { Link } from "react-router-dom";
import { flexBetween, textBase } from "../styles";
import { Menu, X } from "lucide-react"; // íconos modernos

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    return (
    <header className="bg-gray-900 text-white shadow">
        <nav className="container mx-auto px-4 py-3">
        <div className={`${flexBetween} items-center`}>
            <h1 className="text-lg font-bold">EsportsTorneos</h1>
            <button
            onClick={toggleMenu}
            className="sm:hidden text-white focus:outline-none"
            aria-label="Abrir menú"
            >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
            <ul
            className={`${
                menuAbierto ? "flex" : "hidden"
            } sm:flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:items-center mt-4 sm:mt-0`}
            >
            <li><Link to="/" className={`${textBase} hover:text-white`} onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
            <li><Link to="/torneos" className={`${textBase} hover:text-white`} onClick={() => setMenuAbierto(false)}>Torneos</Link></li>
            <li><Link to="/noticias" className={`${textBase} hover:text-white`} onClick={() => setMenuAbierto(false)}>Noticias</Link></li>
            <li><Link to="/perfil" className={`${textBase} hover:text-white`} onClick={() => setMenuAbierto(false)}>Perfil</Link></li>
            <li><Link to="/contacto" className={`${textBase} hover:text-white`} onClick={() => setMenuAbierto(false)}>Contacto</Link></li>
            </ul>
        </div>
        </nav>
    </header>
    );
}
