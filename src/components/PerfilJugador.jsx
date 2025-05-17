import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  cardBase,
  titlePage,
  textBase,
  avatar,
  btnPrimary
} from "../styles";
import MainLayout from "../components/MainLayout.jsx"; // ✅ Importar el layout

export default function PerfilJugador() {
  const [jugador, setJugador] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      const docRef = doc(db, "jugadores", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setJugador(docSnap.data());
      }
    };

    cargarDatos();
  }, [navigate]);

  const cerrarSesion = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (!jugador) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
  }

  return (
    <MainLayout>
      <div className={`${cardBase} max-w-2xl mx-auto mt-10`}>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={jugador.fotoURL || "/default.jpg"}
            alt="Foto de perfil"
            className={avatar}
          />
          <div>
            <h2 className={titlePage}>
              {jugador.nombre} {jugador.apellido}
            </h2>
            <p className={textBase}>{jugador.email}</p>
            <p className={textBase}>ID del juego: {jugador.gameId} {jugador.subCodigo}</p>
            {jugador.equipo && (
              <p className="text-sm text-blue-600">Equipo: {jugador.equipo}</p>
            )}
          </div>
        </div>

        <button
          onClick={cerrarSesion}
          className={`${btnPrimary} bg-red-600 hover:bg-red-700`}
        >
          Cerrar sesión
        </button>
        </div>
    </MainLayout>
    );
}
