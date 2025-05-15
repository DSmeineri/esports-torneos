import { Link } from "react-router-dom";

export default function Navbar() {
    return (
    <header className="bg-gray-900 text-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">EsportsTorneos</h1>
        <ul className="flex gap-4">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/torneos">Torneos</Link></li>
            <li><Link to="/noticias">Noticias</Link></li>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
        </ul>
        </nav>
    </header>
    );
}
