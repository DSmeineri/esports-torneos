import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegistroJugador from "./components/RegistroJugador";
import Login from "./components/Login";
import PerfilJugador from "./components/PerfilJugador";
import RegistroEquipo from "./components/RegistroEquipo";
import PerfilEquipo from "./components/PerfilEquipo";
import PanelTorneos from "./components/PanelTorneos";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import CrearTorneo from "./components/CrearTorneo";
import AdminTickets from "./components/AdminTickets";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<RegistroJugador />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <PerfilJugador />
              </PrivateRoute>
            }
          />
          <Route
            path="/registro-equipo"
            element={
              <PrivateRoute>
                <RegistroEquipo />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil-equipo"
            element={
              <PrivateRoute>
                <PerfilEquipo />
              </PrivateRoute>
            }
          />
          <Route
            path="/torneos"
            element={
              <PrivateRoute>
                <PanelTorneos />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/crear-torneo"
            element={
              <PrivateRoute>
                <CrearTorneo />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <PrivateRoute>
                <AdminTickets />
              </PrivateRoute>
            }
          />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
