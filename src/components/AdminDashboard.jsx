import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
    <div className="container">
        <h1 className="titulo text-center">Panel de Administración</h1>

        <div className="grid2">
        {/* Bloque: Tickets */}
        <div className="card">
            <h2 className="titulo text-blue-700">🎫 Gestión de Tickets</h2>
            <p className="texto">Otorgá o debitá tickets a jugadores registrados.</p>
            <Link to="/admin/tickets" className="boton-primario inline-block mt-2">
            Administrar Tickets
            </Link>
        </div>

        {/* Bloque: Crear torneo */}
        <div className="card">
            <h2 className="titulo text-green-700">🏆 Crear Torneo</h2>
            <p className="texto">Configurá nuevos torneos con reglas personalizadas.</p>
            <Link to="/admin/crear-torneo" className="boton-primario inline-block mt-2 bg-green-600 hover:bg-green-700">
            Crear Torneo
            </Link>
        </div>

        {/* Bloque: Torneos activos */}
        <div className="card">
            <h2 className="titulo text-purple-700">📋 Torneos activos</h2>
            <p className="texto">Revisá el estado y participantes actuales.</p>
            <Link to="/torneos" className="boton-primario inline-block mt-2 bg-purple-600 hover:bg-purple-700">
            Ver Torneos
            </Link>
        </div>
        </div>
    </div>
    );
}
