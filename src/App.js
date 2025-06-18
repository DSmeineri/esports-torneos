// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegistroJugador from "./components/RegistroJugador";
import Login from "./components/Login";
import RegistroEquipo from "./components/RegistroEquipo";
import PerfilEquipo from "./components/PerfilEquipo";
import PanelTorneos from "./components/PanelTorneos";
import VisualizacionTorneos from "./components/visualizaciontorneos";
import AdminTickets from "./components/AdminTickets";
import AdminGestionTorneos from "./components/admingestiontorneos";
import Home from "./pages/Home";
import AdminDashboard from "./components/AdminDashboard";
import PerfilJugador from "./components/PerfilJugador";
import Noticias from "./components/Noticias";
import Contacto from "./components/contacto";
import AdminNoticias from "./components/adminnoticias";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/AdminLayout";

// Wrapper para usuarios autenticados
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
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/registrarse" element={<MainLayout><RegistroJugador /></MainLayout>} />
        <Route path="/noticias" element={<MainLayout><Noticias /></MainLayout>} />
        <Route path="/contacto" element={<MainLayout><Contacto /></MainLayout>} />

        {/* 🔐 Rutas protegidas (usuarios autenticados) */}
        <Route path="/perfil" element={<RutaPrivadaLayout><PerfilJugador /></RutaPrivadaLayout>} />
        <Route path="/registro-equipo" element={<RutaPrivadaLayout><RegistroEquipo /></RutaPrivadaLayout>} />
        <Route path="/perfil-equipo" element={<RutaPrivadaLayout><PerfilEquipo /></RutaPrivadaLayout>} />
        <Route path="/torneos" element={<RutaPrivadaLayout><PanelTorneos /></RutaPrivadaLayout>} />
        <Route path="/torneos/:id" element={<RutaPrivadaLayout><VisualizacionTorneos /></RutaPrivadaLayout>} />

        {/* 🔒 Rutas exclusivas de administrador */}
        <Route path="/admin" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/torneos" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLayout><AdminGestionTorneos /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/tickets" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLayout><AdminTickets /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/admin/noticias" element={
          <PrivateRoute requireAdmin={true}>
            <AdminLayout><AdminNoticias /></AdminLayout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
