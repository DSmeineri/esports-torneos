import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/admintickets.css"; // ✅ Estilos específicos para este componente

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
      await updateDoc(doc(db, "jugadores", jugador.id), { tickets: nuevos });
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
    <div className="atk-container">
      <h2 className="atk-title">Panel de Tickets por Jugador</h2>

      <div className="atk-busqueda">
        <input
          type="text"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="UID del jugador"
          className="atk-input"
        />
        <button onClick={buscarJugador} className="atk-boton">
          Buscar
        </button>
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
            <button
              onClick={() => actualizarTickets("sumar")}
              className="atk-boton green"
            >
              Otorgar
            </button>
            <button
              onClick={() => actualizarTickets("restar")}
              className="atk-boton red"
            >
              Debitar
            </button>
          </div>
        </div>
      )}

      {mensaje && (
        <p className="atk-mensaje">{mensaje}</p>
      )}
    </div>
  );
}
