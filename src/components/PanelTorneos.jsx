// src/components/PanelTorneos.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/paneltorneos.css";

export default function PanelTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [miEquipo, setMiEquipo] = useState(null);
  const [mensaje, setMensaje] = useState("");

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

      <div className="pts-lista">
        {torneos.map((torneo) => (
          <div key={torneo.id} className="pts-tarjeta">
            <h3 className="pts-titulo">{torneo.nombre}</h3>
            <p>🎮 Juego: {torneo.juego}</p>
            <p>🗓️ Fecha: {new Date(torneo.fecha).toLocaleString()}</p>
            <p>👥 Cupo: {(torneo.equipos_inscritos || []).length} / {torneo.equipos_totales}</p>
            <p>🧑‍🤝‍🧑 Integrantes por equipo: {torneo.jugadores_por_equipo}</p>
            <p>🎫 Tickets por jugador: {torneo.tickets_por_jugador}</p>
            <p>Estado: <strong className="capitalize">{torneo.estado}</strong></p>

            <button
              onClick={() => inscribirEquipo(torneo)}
              className="pts-btn"
            >
              Inscribir equipo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
