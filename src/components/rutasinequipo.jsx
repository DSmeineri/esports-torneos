// src/components/RutaSinEquipo.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function RutaSinEquipo({ children }) {
  const [verificando, setVerificando] = useState(true);
  const [permitir, setPermitir] = useState(false);

  useEffect(() => {
    const verificar = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setPermitir(false);
        setVerificando(false);
        return;
      }

      const { data: equipos, error } = await supabase
        .from("equipos")
        .select("integrantes");

      if (error) {
        console.error("❌ Error al verificar equipo:", error);
        setPermitir(false);
      } else {
        const pertenece = equipos?.some(eq =>
          eq.integrantes?.some(i => i.uid === user.id)
        );
        setPermitir(!pertenece);
      }

      setVerificando(false);
    };

    verificar();
  }, []);

  if (verificando) {
    return <p className="text-center mt-10">Verificando acceso...</p>;
  }

  return permitir ? children : <Navigate to="/perfil-equipo" replace />;
}
