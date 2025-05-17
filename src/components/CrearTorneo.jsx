import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

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

    try {
        const fechaTimestamp = Timestamp.fromDate(new Date(form.fecha));

        await addDoc(collection(db, "torneos"), {
        nombre: form.nombre,
        juego: form.juego,
        fecha: fechaTimestamp,
        estado: "abierto",
        jugadoresPorEquipo: parseInt(form.jugadoresPorEquipo),
        equiposTotales: parseInt(form.equiposTotales),
        ticketsPorJugador: parseInt(form.ticketsPorJugador),
        equiposInscritos: [],
        });

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
    <div className="card max-w-xl mx-auto mt-10 space-y-4">
        <h2 className="titulo">Crear nuevo torneo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del torneo"
            required
            className="input"
        />

        <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="input"
        />

        <input
            type="number"
            name="jugadoresPorEquipo"
            value={form.jugadoresPorEquipo}
            onChange={handleChange}
            min="1"
            required
            className="input"
            placeholder="Jugadores por equipo"
        />

        <input
            type="number"
            name="equiposTotales"
            value={form.equiposTotales}
            onChange={handleChange}
            min="2"
            required
            className="input"
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
            className="input"
            placeholder="Tickets requeridos por jugador"
        />

        <button type="submit" className="boton-primario w-full">
            Crear torneo
        </button>
        </form>

        {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
    </div>
    );
}
