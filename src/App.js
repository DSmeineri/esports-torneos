import React from 'react';

function App() {
  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold">🏆 Bienvenido a eSports Torneos</h1>
      <p className="mt-2 text-gray-600">Tu plataforma de torneos con Firebase + React</p>
    </div>
  );
}

import RegistroJugador from "./components/RegistroJugador";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <RegistroJugador />
    </div>
  );
}
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistroJugador from "./components/RegistroJugador";
import Login from "./components/Login";
import PerfilJugador from "./components/PerfilJugador"; // aún por crear
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}
import RegistroEquipo from "./components/RegistroEquipo";

<Route
  path="/registro-equipo"
  element={
    <PrivateRoute>
      <RegistroEquipo />
    </PrivateRoute>
  }
/>

import PerfilEquipo from "./components/PerfilEquipo";

<Route
  path="/perfil-equipo"
  element={
    <PrivateRoute>
      <PerfilEquipo />
    </PrivateRoute>
  }
/>
import PanelTorneos from "./components/PanelTorneos";

<Route
  path="/torneos"
  element={
    <PrivateRoute>
      <PanelTorneos />
    </PrivateRoute>
  }
/>

export default App;
