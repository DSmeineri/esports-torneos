import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/paneltorneos.css";

// Mapear logos según juego
const logos = {
  "Mobile Legends": require("../assets/juegos/mobile-legends.png"),
  "League of Legends": require("../assets/juegos/lol.png"),
  Valorant: require("../assets/juegos/valorant.png"),
};

export default function PanelTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [miEquipo, setMiEquipo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarTorneosYEquipo = async () => {
      try {
        const snapshot = await getDocs(collection(db, "torneos"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(lista);

        const userUID = auth.currentUser?.uid;
        const equiposSnapshot = await getDocs(collection(db, "equipos"));
        const equipo = equiposSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(eq => eq.creadorUID === userUID);

        setMiEquipo(equipo || null);
      } catch (err) {
        console.error("Error al cargar torneos o equipo:", err);
      }
    };

    cargarTorneosYEquipo();
  }, []);

  const inscribirEquipo = async (torneo) => {
    if (!miEquipo) return setMensaje("❌ No tenés un equipo creado.");

    const cantidadJugadores = miEquipo.integrantes.length;
    const requeridos = torneo.jugadoresPorEquipo || 5;
    const ticketsRequeridos = torneo.ticketsPorJugador || 1;

    if (cantidadJugadores < requeridos) {
      return setMensaje(`❌ Tu equipo necesita al menos ${requeridos} jugadores.`);
    }

    if (torneo.equiposInscritos.some(e => e.equipoId === miEquipo.id)) {
      return setMensaje("⚠️ Tu equipo ya está inscrito en este torneo.");
    }

    if (torneo.equiposInscritos.length >= torneo.equiposTotales) {
      return setMensaje("❌ El cupo del torneo ya está completo.");
    }

    try {
      const jugadoresSnapshot = await Promise.all(
        miEquipo.integrantes.map((i) => getDoc(doc(db, "jugadores", i.uid)))
      );

      const jugadoresConDatos = jugadoresSnapshot.map((snap) => ({
        uid: snap.id,
        ...snap.data(),
      }));

      const sinTickets = jugadoresConDatos.filter(
        (j) => (j.tickets || 0) < ticketsRequeridos
      );

      if (sinTickets.length > 0) {
        return setMensaje(
          `❌ Jugadores sin tickets: ${sinTickets.map((j) => j.nombre).join(", ")}`
        );
      }

      await Promise.all(
        jugadoresConDatos.map((j) =>
          updateDoc(doc(db, "jugadores", j.uid), {
            tickets: j.tickets - ticketsRequeridos,
          })
        )
      );

      const torneoRef = doc(db, "torneos", torneo.id);
      const actualizado = [
        ...torneo.equiposInscritos,
        { equipoId: miEquipo.id, nombre: miEquipo.nombre },
      ];
      await updateDoc(torneoRef, { equiposInscritos: actualizado });

      setMensaje("✅ Equipo inscrito correctamente.");
      setTorneos((prev) =>
        prev.map((t) =>
          t.id === torneo.id ? { ...t, equiposInscritos: actualizado } : t
        )
      );
    } catch (err) {
      console.error("Error al inscribir equipo:", err);
      setMensaje("❌ Ocurrió un error al inscribir al equipo.");
    }
  };

  return (
    <div className="pts-container">
      <h2 className="pts-title">Torneos disponibles</h2>

      {mensaje && <p className="pts-msg">{mensaje}</p>}

      <div className="pts-grid">
        {torneos.map((torneo) => (
          <div key={torneo.id} className="pts-card">
            <div className="pts-header">
              {logos[torneo.juego] && (
                <img
                  src={logos[torneo.juego]}
                  alt={torneo.juego}
                  className="pts-logo"
                />
              )}
              <h3 className="pts-nombre">{torneo.nombre}</h3>
            </div>

            <p><strong>🎮 Juego:</strong> {torneo.juego}</p>
            <p><strong>📅 Fecha:</strong> {new Date(torneo.fecha.seconds * 1000).toLocaleDateString()}</p>
            <p><strong>🎫 Inscripción:</strong> {torneo.ticketsPorJugador} ticket(s)</p>
            <p><strong>👥 Equipos:</strong> {torneo.equiposInscritos.length} / {torneo.equiposTotales}</p>
            <p><strong>Estado:</strong> {torneo.estado}</p>

            {torneo.descripcion && (
              <div className="pts-desc">
                <p><strong>📘 Reglas:</strong></p>
                <p>{torneo.descripcion}</p>
              </div>
            )}

            <div className="pts-acciones">
              <button
                onClick={() => navigate(`/torneos/${torneo.id}`)}
                className="pts-ver-btn"
              >
                Ver detalles
              </button>

              {torneo.estado === "abierto" ? (
                <button
                  onClick={() => inscribirEquipo(torneo)}
                  className="pts-inscribir-btn"
                >
                  Inscribir equipo
                </button>
              ) : (
                <button className="pts-curso-btn" disabled>
                  Torneo en curso
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
