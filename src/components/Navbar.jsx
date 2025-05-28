// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { supabase } from "../supabase";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const [tieneEquipo, setTieneEquipo] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      setUsuario(user);

      if (!user) return;

      // Obtener datos del jugador
      const { data: jugador } = await supabase
        .from("jugadores")
        .select("nombre, rol")
        .eq("uid", user.id)
        .single();

      if (jugador) {
        setNombreUsuario(jugador.nombre || "Jugador");
        setEsAdmin(jugador.rol === "admin");
      }

      // Verificar si pertenece a un equipo
      const { data: equipos } = await supabase
        .from("equipos")
        .select("integrantes");

      const pertenece = equipos?.some(eq =>
        eq.integrantes?.some(i => i.uid === user.id)
      );

      setTieneEquipo(pertenece);
    };

    cargarUsuario();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleEquipoClick = () => {
    navigate(tieneEquipo ? "/perfil-equipo" : "/registro-equipo");
    setMenuAbierto(false);
  };

  return (
    <header className="nvr-header">
      <nav className="nvr-nav">
        <Link to={usuario ? "/home" : "/"} className="nvr-logo">
          EsportsTorneos
        </Link>

        <button onClick={toggleMenu} className="nvr-menu-button" aria-label="Abrir menú">
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`nvr-links ${menuAbierto ? "nvr-links-open" : ""}`}>
          <li><Link to="/torneos" onClick={toggleMenu} className="nvr-link">Torneos</Link></li>
          <li><Link to="/noticias" onClick={toggleMenu} className="nvr-link">Noticias</Link></li>
          <li><Link to="/perfil" onClick={toggleMenu} className="nvr-link">Perfil</Link></li>

          {usuario && (
            <li>
              <button onClick={handleEquipoClick} className="nvr-link" style={{ background: "none", border: "none" }}>
                Equipo
              </button>
            </li>
          )}

          {usuario && esAdmin && (
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

          {usuario ? (
            <>
              <li className="nvr-link nombre-jugador">👋 {nombreUsuario}</li>
              <li>
                <button onClick={cerrarSesion} className="nvr-link nvr-logout-btn">Cerrar sesión</button>
              </li>
            </>
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
