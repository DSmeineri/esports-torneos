import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";

export default function RutaSinEquipo({ children }) {
  const [user, loading] = useAuthState(auth);
  const [verificando, setVerificando] = useState(true);
  const [permitir, setPermitir] = useState(false);

  useEffect(() => {
    const verificar = async () => {
      if (!user) return setPermitir(false);
      const equiposSnapshot = await getDocs(collection(db, "equipos"));
      const pertenece = equiposSnapshot.docs.some((doc) =>
        doc.data().integrantes?.some((i) => i.uid === user.uid)
      );
      setPermitir(!pertenece);
      setVerificando(false);
    };

    if (!loading) verificar();
  }, [user, loading]);

  if (loading || verificando) return <p className="text-center mt-10">Verificando acceso...</p>;

  return permitir ? children : <Navigate to="/perfil-equipo" replace />;
}

