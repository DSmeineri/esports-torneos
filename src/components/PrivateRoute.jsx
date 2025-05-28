// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const [allowAccess, setAllowAccess] = useState(null); // null = en proceso
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verificarAcceso = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setAllowAccess(false);
        setChecking(false);
        return;
      }

      if (requireAdmin) {
        const { data: jugador, error: rolError } = await supabase
          .from("jugadores")
          .select("rol")
          .eq("uid", user.id)
          .single();

        if (rolError || !jugador) {
          setAllowAccess(false);
        } else {
          setAllowAccess(jugador.rol === "admin");
        }
      } else {
        setAllowAccess(true);
      }

      setChecking(false);
    };

    verificarAcceso();
  }, [requireAdmin]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Verificando acceso...
      </div>
    );
  }

  return allowAccess ? children : <Navigate to="/login" replace />;
}
