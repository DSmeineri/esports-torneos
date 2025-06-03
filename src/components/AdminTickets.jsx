// src/components/AdminTickets.jsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import "../styles/admintickets.css";

export default function AdminTickets() {
  const [uid, setUid] = useState("");
  const [jugador, setJugador] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const [nombreEquipo, setNombreEquipo] = useState("");
  const [equipo, setEquipo] = useState(null);
  const [mensajeEquipo, setMensajeEquipo] = useState("");

  // 🎮 Buscar jugador por UID
  const buscarJugador = async () => {
    try {
      const { data, error } = await supabase
        .from("jugadores")
        .select("*")
        .eq("uid", uid)
        .single();

      if (error || !data) {
        setJugador(null);
        setMensaje("⚠️ Jugador no encontrado.");
      } else {
        setJugador(data);
        setMensaje("");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al buscar jugador.");
    }
  };

  // 🤝 Buscar equipo por nombre
  const buscarEquipo = async () => {
    try {
      const { data, error } = await supabase
        .from("equipos")
        .select("*")
        .eq("nombre", nombreEquipo)
        .single();

      if (error || !data) {
        setEquipo(null);
        setMensajeEquipo("⚠️ Equipo no encontrado.");
      } else {
        setEquipo(data);
        setMensajeEquipo("");
      }
    } catch (err) {
      console.error(err);
      setMensajeEquipo("❌ Error al buscar equipo.");
    }
  };

  // 🎫 Actualizar tickets de jugador
  const actualizarTickets = async (tipo) => {
    if (!jugador) return;
    const nuevos = tipo === "sumar"
      ? (jugador.tickets || 0) + cantidad
      : Math.max(0, (jugador.tickets || 0) - cantidad);

    try {
      const { error } = await supabase
        .from("jugadores")
        .update({ tickets: nuevos })
        .eq("uid", jugador.uid);

      if (error) throw error;

      setJugador({ ...jugador, tickets: nuevos });
      setMensaje(`✅ Tickets ${tipo === "sumar" ? "otorgados" : "debitados"} correctamente.`);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar tickets.");
    }
  };

  // 🎫 Actualizar tickets de equipo
  const actualizarTicketsEquipo = async (tipo) => {
    if (!equipo) return;
    const actuales = equipo.ticketsEquipo || 0;
    const nuevos = tipo === "sumar" ? actuales + cantidad : Math.max(0, actuales - cantidad);

    try {
      const { error } = await supabase
        .from("equipos")
        .update({ ticketsEquipo: nuevos })
        .eq("id", equipo.id);

      if (error) throw error;

      setEquipo({ ...equipo, ticketsEquipo: nuevos });
      setMensajeEquipo(`✅ Tickets ${tipo === "sumar" ? "otorgados" : "debitados"} correctamente al equipo.`);
    } catch (err) {
      console.error(err);
      setMensajeEquipo("❌ Error al actualizar tickets del equipo.");
    }
  };

  return (
    <div className="atk-grid-container">
      {/* PANEL JUGADOR */}
      <div className="atk-container">
        <h2 className="atk-title">🎮 Tickets por Jugador</h2>

        <div className="atk-busqueda">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="UID del jugador"
            className="atk-input"
          />
          <button onClick={buscarJugador} className="atk-boton">Buscar</button>
        </div>

        {jugador && (
          <div className="atk-info">
            <p><strong>Jugador:</strong> {jugador.nombre} {jugador.apellido}</p>
            <p><strong>Tickets:</strong> {jugador.tickets || 0}</p>

            <div className="atk-cantidad">
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="atk-input cantidad"
              />
            </div>

            <div className="atk-acciones">
              <button onClick={() => actualizarTickets("sumar")} className="atk-boton green">Otorgar</button>
              <button onClick={() => actualizarTickets("restar")} className="atk-boton red">Debitar</button>
            </div>
          </div>
        )}

        {mensaje && <p className="atk-mensaje">{mensaje}</p>}
      </div>

      {/* PANEL EQUIPO */}
      <div className="atk-container">
        <h2 className="atk-title">🤝 Tickets por Equipo</h2>

        <div className="atk-busqueda">
          <input
            type="text"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            placeholder="Nombre del equipo"
            className="atk-input"
          />
          <button onClick={buscarEquipo} className="atk-boton">Buscar</button>
        </div>

        {equipo && (
          <div className="atk-info">
            <p><strong>Equipo:</strong> {equipo.nombre}</p>
            <p><strong>Tickets equipo:</strong> {equipo.ticketsEquipo || 0}</p>

            <div className="atk-cantidad">
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="atk-input cantidad"
              />
            </div>

            <div className="atk-acciones">
              <button onClick={() => actualizarTicketsEquipo("sumar")} className="atk-boton green">Otorgar</button>
              <button onClick={() => actualizarTicketsEquipo("restar")} className="atk-boton red">Debitar</button>
            </div>
          </div>
        )}

        {mensajeEquipo && <p className="atk-mensaje">{mensajeEquipo}</p>}
      </div>
    </div>
  );
}
