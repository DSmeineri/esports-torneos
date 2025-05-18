// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import "../styles/privateroute.css";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="prr-loading">
        Cargando...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
