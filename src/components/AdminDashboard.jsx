import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bloque: Tickets */}
        <div className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-xl font-semibold text-blue-700">🎫 Gestión de Tickets</h2>
            <p className="text-sm text-gray-600">Otorgá o debitá tickets a jugadores registrados.</p>
            <Link
            to="/admin/tickets"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Administrar Tickets
            </Link>
        </div>

        {/* Bloque: Crear torneo */}
        <div className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-xl font-semibold text-green-700">🏆 Crear Torneo</h2>
            <p className="text-sm text-gray-600">Configurá nuevos torneos con reglas personalizadas.</p>
            <Link
            to="/admin/crear-torneo"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
            Crear Torneo
            </Link>
        </div>

        {/* Bloque: Torneos activos */}
        <div className="bg-white p-5 rounded-xl shadow space-y-2">
            <h2 className="text-xl font-semibold text-purple-700">📋 Torneos activos</h2>
            <p className="text-sm text-gray-600">Revisá el estado y participantes actuales.</p>
            <Link
            to="/torneos"
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
            Ver Torneos
            </Link>
        </div>
        </div>
    </div>
    );
}
