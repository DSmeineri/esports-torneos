// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const [user] = useAuthState(auth);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      if (user) {
        const ref = doc(db, "jugadores", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNombreUsuario(data.nombre || "Usuario");
          setEsAdmin(data.rol === "admin");
        }
      }
    };
    obtenerDatos();
  }, [user]);

  const cerrarSesion = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="nvr-header">
      <nav className="nvr-nav">
        <Link to={user ? "/home" : "/"} className="nvr-logo">
          EsportsTorneos
        </Link>

        <button onClick={toggleMenu} className="nvr-menu-button" aria-label="Abrir menú">
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nvr-links ${menuAbierto ? "nvr-links-open" : ""}`}>
          <li><Link to="/torneos" onClick={toggleMenu} className="nvr-link">Torneos</Link></li>
          <li><Link to="/noticias" onClick={toggleMenu} className="nvr-link">Noticias</Link></li>
          <li><Link to="/perfil" onClick={toggleMenu} className="nvr-link">Perfil</Link></li>
          <li><Link to="/contacto" onClick={toggleMenu} className="nvr-link">Contacto</Link></li>

          {user && esAdmin && (
            <li className="nvr-admin-dropdown">
              <span className="nvr-link nvr-admin-toggle">⚙️ Admin</span>
              <ul className="nvr-admin-submenu">
                <li><Link to="/admin" onClick={toggleMenu} className="nvr-link">Dashboard</Link></li>
                <li><Link to="/admin/crear-torneo" onClick={toggleMenu} className="nvr-link">Crear Torneo</Link></li>
                <li><Link to="/admin/tickets" onClick={toggleMenu} className="nvr-link">Tickets</Link></li>
                <li><Link to="/admin/noticias" onClick={toggleMenu} className="nvr-link">Noticias</Link></li>
              </ul>
            </li>
          )}

          {user ? (
            <li>
              <button onClick={cerrarSesion} className="nvr-link nvr-logout-btn">Cerrar sesión</button>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={toggleMenu} className="nvr-link">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
