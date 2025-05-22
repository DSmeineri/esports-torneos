// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const [user, loading] = useAuthState(auth);
  const [allowAccess, setAllowAccess] = useState(null); // null = aún verificando
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const verificarRol = async () => {
      if (user) {
        const docRef = doc(db, "jugadores", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : null;

        if (requireAdmin) {
          setAllowAccess(data?.rol === "admin");
        } else {
          setAllowAccess(true);
        }
      } else {
        setAllowAccess(false);
      }
      setCheckingRole(false);
    };

    if (!loading) verificarRol();
  }, [user, loading, requireAdmin]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Verificando acceso...
      </div>
    );
  }

  return allowAccess ? children : <Navigate to="/login" replace />;
}
