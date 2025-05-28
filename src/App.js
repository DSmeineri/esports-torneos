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
import AdminNoticias from "./components/adminnoticias";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/AdminLayout";
import RutaSinEquipo from "./components/rutasinequipo"; // ✅ Nuevo componente

// Componente wrapper para rutas privadas de usuario común
const RutaPrivadaLayout = ({ children }) => (
  <PrivateRoute>
    <MainLayout>{children}</MainLayout>
  </PrivateRoute>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route path="/" element={<MainLayout><RegistroJugador /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/noticias" element={<MainLayout><Noticias /></MainLayout>} />
        <Route path="/contacto" element={<MainLayout><Contacto /></MainLayout>} />

        {/* 🔐 Usuario autenticado */}
        <Route path="/perfil" element={<RutaPrivadaLayout><PerfilJugador /></RutaPrivadaLayout>} />
        <Route path="/perfil-equipo" element={<RutaPrivadaLayout><PerfilEquipo /></RutaPrivadaLayout>} />
        <Route path="/torneos" element={<RutaPrivadaLayout><PanelTorneos /></RutaPrivadaLayout>} />

        {/* ✅ Solo mostrar esta ruta si NO pertenece a un equipo */}
        <Route
          path="/registro-equipo"
          element={
            <RutaSinEquipo>
              <RutaPrivadaLayout>
                <RegistroEquipo />
              </RutaPrivadaLayout>
            </RutaSinEquipo>
          }
        />

        {/* 🔒 Solo Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/crear-torneo"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminLayout><CrearTorneo /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminLayout><AdminTickets /></AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/noticias"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminLayout><AdminNoticias /></AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
