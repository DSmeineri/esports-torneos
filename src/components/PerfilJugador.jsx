import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "../styles/perfiljugador.css"; // ✅ Importar estilos específicos

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
    <section className="pjr-container">
      <div className="pjr-card">
        <div className="pjr-header">
          <img
            src={jugador.fotoURL || "/default.jpg"}
            alt="Foto de perfil"
            className="pjr-avatar"
          />
          <div className="pjr-info">
            <h2 className="pjr-nombre">
              {jugador.nombre} {jugador.apellido}
            </h2>
            <p className="pjr-email">{jugador.email}</p>
            <p className="pjr-id">
              <strong>ID de juego:</strong> {jugador.gameId} {jugador.subCodigo}
            </p>
            {jugador.equipo && (
              <p className="pjr-equipo">🏅 Equipo: <span>{jugador.equipo}</span></p>
            )}
          </div>
        </div>

        <button onClick={cerrarSesion} className="pjr-btn-salir">
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
