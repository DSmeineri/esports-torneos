import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
    const [user] = useAuthState(auth);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const cerrarSesion = async () => {
    await auth.signOut();
    navigate("/login");
    };

    return (
    <header className="bg-gray-900 text-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">
            <Link to="/">EsportsTorneos</Link>
        </h1>

        {/* Botón para mobile */}
        <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            ☰
        </button>

        {/* Menú principal */}
        <ul className={`md:flex gap-4 ${menuOpen ? "block" : "hidden"} md:block`}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/torneos">Torneos</Link></li>
            {user && (
            <>
                <li><Link to="/perfil">Perfil Jugador</Link></li>
                <li><Link to="/registro-equipo">Crear Equipo</Link></li>
                <li><Link to="/perfil-equipo">Mi Equipo</Link></li>
            </>
            )}
            <li><Link to="/contacto">Contacto</Link></li>
            {!user ? (
            <li><Link to="/login">Login</Link></li>
            ) : (
            <li>
                <button
                onClick={cerrarSesion}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                Cerrar sesión
                </button>
            </li>
            )}
        </ul>
        </nav>
    </header>
    );
}
