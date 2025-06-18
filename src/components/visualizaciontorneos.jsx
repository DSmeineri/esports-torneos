import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import "../styles/visualizaciontorneos.css";

const logos = {
  "Mobile Legends": require("../assets/juegos/mobile-legends.png"),
  "League of Legends": require("../assets/juegos/lol.png"),
  Valorant: require("../assets/juegos/valorant.png"),
};

export default function VisualizacionTorneos() {
  const { id } = useParams();
  const [torneo, setTorneo] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [miEquipo, setMiEquipo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarTorneoYEquipo = async () => {
      if (!id) return;
      const ref = doc(db, "torneos", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setTorneo(data);

        const equipoList = [];
        for (const e of data.equiposInscritos || []) {
          const equipoSnap = await getDoc(doc(db, "equipos", e.equipoId));
          if (equipoSnap.exists()) {
            equipoList.push({ id: equipoSnap.id, ...equipoSnap.data() });
          }
        }
        setEquipos(equipoList);
      }

      // Buscar equipo del usuario
      const userUID = auth.currentUser?.uid;
      const equiposSnap = await getDocs(collection(db, "equipos"));
      const equipoUsuario = equiposSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(eq => eq.creadorUID === userUID);

      setMiEquipo(equipoUsuario || null);
    };

    cargarTorneoYEquipo();
  }, [id]);

  const inscribirEquipo = async () => {
    if (!miEquipo || !torneo) return setMensaje("❌ No tenés equipo creado.");

    const cantidadJugadores = miEquipo.integrantes.length;
    const requeridos = torneo.jugadoresPorEquipo || 5;
    const ticketsRequeridos = torneo.ticketsPorJugador || 1;

    if (cantidadJugadores < requeridos) {
      return setMensaje(`❌ Tu equipo necesita al menos ${requeridos} jugadores.`);
    }

    if (torneo.equiposInscritos.some(e => e.equipoId === miEquipo.id)) {
      return setMensaje("⚠️ Ya estás inscrito en este torneo.");
    }

    if (torneo.equiposInscritos.length >= torneo.equiposTotales) {
      return setMensaje("❌ El cupo del torneo está completo.");
    }

    try {
      const jugadoresSnap = await Promise.all(
        miEquipo.integrantes.map(i => getDoc(doc(db, "jugadores", i.uid)))
      );

      const jugadores = jugadoresSnap.map(s => ({ uid: s.id, ...s.data() }));
      const sinTickets = jugadores.filter(j => (j.tickets || 0) < ticketsRequeridos);

      if (sinTickets.length > 0) {
        return setMensaje(`❌ Sin tickets: ${sinTickets.map(j => j.nombre).join(", ")}`);
      }

      await Promise.all(
        jugadores.map(j =>
          updateDoc(doc(db, "jugadores", j.uid), {
            tickets: j.tickets - ticketsRequeridos,
          })
        )
      );

      const ref = doc(db, "torneos", torneo.id);
      const actualizados = [
        ...torneo.equiposInscritos,
        { equipoId: miEquipo.id, nombre: miEquipo.nombre },
      ];
      await updateDoc(ref, { equiposInscritos: actualizados });

      setTorneo({ ...torneo, equiposInscritos: actualizados });
      setMensaje("✅ Inscripción exitosa.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al inscribir al torneo.");
    }
  };

  if (!torneo) return <p className="vzt-vacio">Cargando torneo...</p>;

  return (
    <div className="vzt-container">
      <h2 className="vzt-title">Torneo: {torneo.nombre}</h2>

      <div className="vzt-detalle">
        <div className="vzt-header">
          {logos[torneo.juego] && (
            <img
              src={logos[torneo.juego]}
              alt={torneo.juego}
              className="vzt-juego-logo"
            />
          )}
          <div>
            <p><strong>Juego:</strong> {torneo.juego}</p>
            <p><strong>Estado:</strong> {torneo.estado}</p>
            <p><strong>Fase actual:</strong> {torneo.faseActual || "Pendiente"}</p>
            <p><strong>Fecha:</strong> {new Date(torneo.fecha.seconds * 1000).toLocaleDateString()}</p>
            <p><strong>Cupo:</strong> {torneo.equiposInscritos.length}/{torneo.equiposTotales}</p>
            <p><strong>Tickets por jugador:</strong> {torneo.ticketsPorJugador}</p>
          </div>
        </div>

        {torneo.descripcion && (
          <>
            <h4 className="vzt-subtitulo">Reglas & Descripción</h4>
            <div className="vzt-desc">{torneo.descripcion}</div>
          </>
        )}

        <h4 className="vzt-subtitulo">Equipos Participantes</h4>
        {equipos.length === 0 ? (
          <p className="vzt-vacio">No hay equipos aún.</p>
        ) : (
          <ul className="vzt-equipos">
            {equipos.map(eq => (
              <li key={eq.id}>⚔️ {eq.nombre}</li>
            ))}
          </ul>
        )}

        {torneo.fases?.length > 0 && (
          <div className="vzt-fases">
            <h4>Llaves del torneo</h4>
            <div className="vzt-bracket">
              <div className="vzt-bracket-grid">
                {torneo.fases.map((fase, idx) => (
                  <div key={idx} className="vzt-bracket-col">
                    <h5>{fase.nombre}</h5>
                    {fase.enfrentamientos.map((m, i) => (
                      <div key={i} className="vzt-bracket-match">
                        {m.equipo1} vs {m.equipo2}
                        <br />
                        <em>{m.resultado || "Sin resultado"}</em>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "1.5rem" }}>
          {mensaje && <p className="vzt-msg">{mensaje}</p>}

          {torneo.estado === "abierto" ? (
            <button onClick={inscribirEquipo} className="vzt-btn verde">
              Inscribirme a este torneo
            </button>
          ) : (
            <button className="vzt-btn rojo" disabled>
              Torneo en curso
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
