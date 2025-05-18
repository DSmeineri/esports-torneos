// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegistroJugador from "./components/RegistroJugador";
import Login from "./components/Login";
import RegistroEquipo from "./components/RegistroEquipo";
import PerfilEquipo from "./components/PerfilEquipo";
import PanelTorneos from "./components/PanelTorneos";
import CrearTorneo from "./components/CrearTorneo";
import AdminTickets from "./components/AdminTickets";
import Home from "./pages/Home";
import AdminDashboard from "./components/AdminDashboard";
import PerfilJugador from "./components/PerfilJugador";
import Noticias from "./components/Noticias";
import Contacto from "./components/contacto";

import MainLayout from "./components/MainLayout";
import RutaPrivadaLayout from "./components/RutaPrivadaLayout";

function App() {
  
  return (
    <Router>
      <Routes>

        {/* 🌐 Rutas públicas envueltas en el layout */}
        <Route path="/" element={<MainLayout><RegistroJugador /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/noticias" element={<MainLayout><Noticias /></MainLayout>} />
        <Route path="/contacto" element={<MainLayout><Contacto /></MainLayout>} />

        {/* 🔐 Rutas privadas con layout + validación */}
        <Route path="/perfil" element={<RutaPrivadaLayout><PerfilJugador /></RutaPrivadaLayout>} />
        <Route path="/registro-equipo" element={<RutaPrivadaLayout><RegistroEquipo /></RutaPrivadaLayout>} />
        <Route path="/perfil-equipo" element={<RutaPrivadaLayout><PerfilEquipo /></RutaPrivadaLayout>} />
        <Route path="/torneos" element={<RutaPrivadaLayout><PanelTorneos /></RutaPrivadaLayout>} />
        <Route path="/admin" element={<RutaPrivadaLayout><AdminDashboard /></RutaPrivadaLayout>} />
        <Route path="/admin/crear-torneo" element={<RutaPrivadaLayout><CrearTorneo /></RutaPrivadaLayout>} />
        <Route path="/admin/tickets" element={<RutaPrivadaLayout><AdminTickets /></RutaPrivadaLayout>} />

      </Routes>
    </Router>
  );
}

export default App;
