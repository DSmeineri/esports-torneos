// src/components/PanelTorneos.jsx
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
    const cargarDatos = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;

      if (!uid) return;

      // Obtener todos los torneos
      const { data: torneosData, error: torneosError } = await supabase
        .from("torneos")
        .select("*");

      if (torneosError) {
        console.error("Error al obtener torneos:", torneosError);
        return;
      }
      setTorneos(torneosData);

      // Obtener mi equipo
      const { data: equipos, error: equiposError } = await supabase
        .from("equipos")
        .select("*");

      if (equiposError) return console.error(equiposError);

      const equipo = equipos.find((eq) => eq.creador_uid === uid);
      setMiEquipo(equipo || null);
    };

    cargarDatos();
  }, []);

  const inscribirEquipo = async (torneo) => {
    if (!miEquipo) return setMensaje("❌ No tenés un equipo creado.");

    const cantidadJugadores = miEquipo.integrantes?.length || 0;
    const requeridos = torneo.jugadores_por_equipo || 5;
    const ticketsRequeridos = torneo.tickets_por_jugador || 1;

    if (cantidadJugadores < requeridos) {
      return setMensaje(`❌ Tu equipo necesita al menos ${requeridos} jugadores.`);
    }

    if (torneo.equipos_inscritos?.some((e) => e.equipoId === miEquipo.id)) {
      return setMensaje("⚠️ Tu equipo ya está inscrito en este torneo.");
    }

    if ((torneo.equipos_inscritos?.length || 0) >= torneo.equipos_totales) {
      return setMensaje("❌ El cupo del torneo ya está completo.");
    }

    // Validar tickets
    try {
      const { data: jugadores, error } = await supabase
        .from("jugadores")
        .select("uid, nombre, tickets")
        .in("uid", miEquipo.integrantes.map((i) => i.uid));

      if (error) return setMensaje("❌ Error al obtener datos de jugadores.");

      const sinTickets = jugadores.filter((j) => (j.tickets || 0) < ticketsRequeridos);
      if (sinTickets.length > 0) {
        return setMensaje(
          `❌ Jugadores sin tickets: ${sinTickets.map((j) => j.nombre).join(", ")}`
        );
      }

      // Descontar tickets
      for (const jugador of jugadores) {
        await supabase
          .from("jugadores")
          .update({ tickets: jugador.tickets - ticketsRequeridos })
          .eq("uid", jugador.uid);
      }

      const inscritosActualizados = [...(torneo.equipos_inscritos || []), {
        equipoId: miEquipo.id,
        nombre: miEquipo.nombre
      }];

      await supabase
        .from("torneos")
        .update({ equipos_inscritos: inscritosActualizados })
        .eq("id", torneo.id);

      setMensaje("✅ Equipo inscrito correctamente.");
      setTorneos((prev) =>
        prev.map((t) =>
          t.id === torneo.id
            ? { ...t, equipos_inscritos: inscritosActualizados }
            : t
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
