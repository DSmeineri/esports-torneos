// src/components/CrearTorneo.jsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import "../styles/creartorneo.css"; // ✅ Hoja de estilo exclusiva

export default function CrearTorneo() {
  const [form, setForm] = useState({
    nombre: "",
    juego: "Mobile Legends",
    fecha: "",
    jugadoresPorEquipo: 5,
    equiposTotales: 8,
    ticketsPorJugador: 1,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const { error } = await supabase.from("torneos").insert({
        nombre: form.nombre,
        juego: form.juego,
        fecha: form.fecha, // ISO string (datetime-local del input)
        estado: "abierto",
        jugadores_por_equipo: parseInt(form.jugadoresPorEquipo),
        equipos_totales: parseInt(form.equiposTotales),
        tickets_por_jugador: parseInt(form.ticketsPorJugador),
        equipos_inscritos: [],
      });

      if (error) throw error;

      setMensaje("✅ Torneo creado correctamente.");
      setForm({
        nombre: "",
        juego: "Mobile Legends",
        fecha: "",
        jugadoresPorEquipo: 5,
        equiposTotales: 8,
        ticketsPorJugador: 1,
      });
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear el torneo.");
    }
  };

  return (
    <div className="crt-container">
      <h2 className="crt-title">Crear nuevo torneo</h2>

      <form onSubmit={handleSubmit} className="crt-form">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del torneo"
          required
          className="crt-input"
        />

        <input
          type="datetime-local"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
          className="crt-input"
        />

        <input
          type="number"
          name="jugadoresPorEquipo"
          value={form.jugadoresPorEquipo}
          onChange={handleChange}
          min="1"
          required
          className="crt-input"
          placeholder="Jugadores por equipo"
        />

        <input
          type="number"
          name="equiposTotales"
          value={form.equiposTotales}
          onChange={handleChange}
          min="2"
          required
          className="crt-input"
          placeholder="Cantidad de equipos"
        />

        <input
          type="number"
          name="ticketsPorJugador"
          value={form.ticketsPorJugador}
          onChange={handleChange}
          min="1"
          max="5"
          required
          className="crt-input"
          placeholder="Tickets requeridos por jugador"
        />

        <button type="submit" className="crt-button">
          Crear torneo
        </button>
      </form>

      {mensaje && <p className="crt-mensaje">{mensaje}</p>}
    </div>
  );
}
