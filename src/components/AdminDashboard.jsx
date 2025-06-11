import React from "react";
import { Link } from "react-router-dom";
import "../styles/admindashboard.css"; // ✅ Estilos dedicados

export default function AdminDashboard() {
  return (
    <div className="ads-container">
      <h1 className="ads-title">Panel de Administración</h1>

      <div className="ads-grid">
        {/* Gestión de Tickets */}
        <div className="ads-card ads-card-blue">
          <h2 className="ads-card-title">🎫 Gestión de Tickets</h2>
          <p className="ads-texto">Otorgá o debitá tickets a jugadores registrados.</p>
          <Link to="/admin/tickets" className="ads-boton">
            Administrar Tickets
          </Link>
        </div>

        {/* Crear Torneo */}
        <div className="ads-card ads-card-green">
          <h2 className="ads-card-title">🏆 Crear Torneo</h2>
          <p className="ads-texto">Configurá nuevos torneos con reglas personalizadas.</p>
          <Link to="/admin/crear-torneo" className="ads-boton green">
            Crear Torneo
          </Link>
        </div>

        {/* Torneos Activos */}
        <div className="ads-card ads-card-purple">
          <h2 className="ads-card-title">📋 Torneos activos</h2>
          <p className="ads-texto">Revisá el estado y participantes actuales.</p>
          <Link to="/admin/gestion-torneos" className="ads-boton purple">
            Gestionar Torneos
          </Link>
        </div>
      </div>
    </div>
  );
}
