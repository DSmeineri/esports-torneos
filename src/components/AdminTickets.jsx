import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminTickets() {
    const [uid, setUid] = useState("");
    const [jugador, setJugador] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState("");

    const buscarJugador = async () => {
    try {
        const docRef = doc(db, "jugadores", uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
        setJugador({ id: snapshot.id, ...snapshot.data() });
        setMensaje("");
        } else {
        setJugador(null);
        setMensaje("⚠️ Jugador no encontrado.");
        }
    } catch (err) {
        console.error(err);
        setMensaje("❌ Error al buscar jugador.");
    }
    };

    const actualizarTickets = async (tipo) => {
    if (!jugador) return;
    const nuevos =
        tipo === "sumar"
        ? (jugador.tickets || 0) + cantidad
        : Math.max(0, (jugador.tickets || 0) - cantidad);

    try {
        await updateDoc(doc(db, "jugadores", jugador.id), {
        tickets: nuevos,
        });
        setJugador({ ...jugador, tickets: nuevos });
        setMensaje(
        `✅ Tickets ${tipo === "sumar" ? "otorgados" : "debitados"} correctamente.`
        );
    } catch (err) {
        console.error(err);
        setMensaje("❌ Error al actualizar tickets.");
    }
    };

    return (
    <div className="card max-w-xl mx-auto mt-10 space-y-4">
        <h2 className="titulo text-center">Panel de Tickets por Jugador</h2>

        <div className="flex gap-2">
        <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="UID del jugador"
            className="input flex-1"
        />
        <button onClick={buscarJugador} className="boton-primario">
            Buscar
        </button>
        </div>

        {jugador && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-2">
            <p className="texto">
            <strong>Jugador:</strong> {jugador.nombre} {jugador.apellido}
            </p>
            <p className="texto">
            <strong>Tickets:</strong> {jugador.tickets || 0}
            </p>

            <div className="flex items-center gap-2 mt-4">
            <label className="texto">Cantidad:</label>
            <input
                type="number"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) =>
                setCantidad(
                    Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                )
                }
                className="input w-20 text-center"
            />
            </div>

            <div className="flex gap-4 mt-4">
            <button
                onClick={() => actualizarTickets("sumar")}
                className="boton-primario bg-green-600 hover:bg-green-700"
            >
                Otorgar
            </button>
            <button
                onClick={() => actualizarTickets("restar")}
                className="boton-primario bg-red-600 hover:bg-red-700"
            >
                Debitar
            </button>
            </div>
        </div>
        )}

        {mensaje && (
        <p className="text-center text-sm text-blue-700 font-medium mt-2">
            {mensaje}
        </p>
        )}
    </div>
    );
}
