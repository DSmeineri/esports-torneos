// Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from "../assets/logo.png";
import iconoUsuario from "../assets/icono_usuario.png";
import iconoTickets from "../assets/tickets_usuarios.png";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [user] = useAuthState(auth);
  const [nickname, setNickname] = useState("");
  const [tickets, setTickets] = useState(0);
  const [equipo, setEquipo] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      if (user) {
        const ref = doc(db, "jugadores", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNickname(data.nickname || "Jugador");
          setTickets(data.tickets || 0);
          setEquipo(data.equipo || null);
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

  const irAPerfilEquipo = () => {
    if (equipo) {
      navigate("/perfil-equipo");
    } else {
      setMostrarModal(true);
    }
  };

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const resultados = [];
    const jugadoresSnap = await getDocs(collection(db, "jugadores"));
    jugadoresSnap.forEach(doc => {
      const data = doc.data();
      if (data.nickname?.toLowerCase().includes(term.toLowerCase())) {
        resultados.push({ tipo: "Jugador", label: data.nickname, id: doc.id });
      }
    });

    const equiposSnap = await getDocs(collection(db, "equipos"));
    equiposSnap.forEach(doc => {
      const data = doc.data();
      if (data.nombre?.toLowerCase().includes(term.toLowerCase())) {
        resultados.push({ tipo: "Equipo", label: data.nombre, id: doc.id });
      }
    });

    const torneosSnap = await getDocs(collection(db, "torneos"));
    torneosSnap.forEach(doc => {
      const data = doc.data();
      if (data.nombre?.toLowerCase().includes(term.toLowerCase())) {
        resultados.push({ tipo: "Torneo", label: data.nombre, id: doc.id });
      }
    });

    setSearchResults(resultados);
  };

  const handleResultClick = (item) => {
    if (item.tipo === "Jugador") navigate(`/perfil/${item.id}`);
    if (item.tipo === "Equipo") navigate(`/equipo/${item.id}`);
    if (item.tipo === "Torneo") navigate(`/torneos/${item.id}`);
    setSearchTerm("");
    setSearchResults([]);
    setMenuAbierto(false);
  };

  useEffect(() => {
    const cerrarResultados = (e) => {
      if (!e.target.closest(".nvr-search-container")) {
        setSearchResults([]);
      }
    };
    document.addEventListener("click", cerrarResultados);
    return () => document.removeEventListener("click", cerrarResultados);
  }, []);

  return (
    <header className="nvr-header">
      <nav className="nvr-nav">
        <Link to="/home" className="nvr-logo">
          <img src={logo} alt="logo" className="nvr-logo-img" />
          <span className="nvr-logo-text">Arena Eternal</span>
        </Link>

        <div className="nvr-derecha">
          <div className="nvr-search-container">
            <input
              type="text"
              className="nvr-search-input"
              placeholder="Buscar jugadores, equipos o torneos"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
              <div className="nvr-search-results">
                {searchResults.map((item, index) => (
                  <div key={index} className="nvr-search-item" onClick={() => handleResultClick(item)}>
                    <strong>{item.label}</strong>
                    <span className={`nvr-search-label ${
                      item.tipo === "Jugador"
                        ? "tipo-jugador"
                        : item.tipo === "Equipo"
                        ? "tipo-equipo"
                        : "tipo-torneo"
                    }`}>
                      {item.tipo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setMenuAbierto(!menuAbierto)} className="nvr-menu-button" aria-label="Menú">
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>

          <ul className={`nvr-links ${menuAbierto ? "nvr-links-open" : ""}`}>
            <li><Link to="/torneos" className="nvr-link">Torneos</Link></li>
            <li><Link to="/noticias" className="nvr-link">Noticias</Link></li>
            {user && <li><button onClick={irAPerfilEquipo} className="nvr-link">Equipo</button></li>}
            {user && esAdmin && (
              <li className="nvr-admin-dropdown">
                <span className="nvr-link nvr-admin-toggle">⚙️ Admin</span>
                <ul className="nvr-admin-submenu">
                  <li><Link to="/admin" className="nvr-link">Dashboard</Link></li>
                  <li><Link to="/admin/torneos" className="nvr-link">Gestión de Torneos</Link></li>
                  <li><Link to="/admin/tickets" className="nvr-link">Tickets</Link></li>
                  <li><Link to="/admin/noticias" className="nvr-link">Noticias</Link></li>
                </ul>
              </li>
            )}
            {user ? (
              <li className="nvr-usuario-info-box">
                <div className="nvr-user-badge" onClick={() => navigate("/perfil")}>
                  <img src={iconoUsuario} alt="usuario" /> {nickname}
                </div>
                <div className="nvr-user-tickets">
                  <img src={iconoTickets} alt="tickets" /> {tickets} tickets
                </div>
                <button onClick={cerrarSesion} className="nvr-btn-salir">Cerrar sesión</button>
              </li>
            ) : (
              <>
                <li className="nvr-login-wrapper">
                  <Link to="/login" className="nvr-link">Iniciar sesión</Link>
                  <Link to="/registrarse" className="nvr-link">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {mostrarModal && (
        <div className="nvr-modal">
          <div className="nvr-modal-contenido">
            <p>No perteneces a ningún equipo.</p>
            <button onClick={() => setMostrarModal(false)} className="nvr-btn-cerrar-modal">Cerrar</button>
          </div>
        </div>
      )}
    </header>
  );
}
