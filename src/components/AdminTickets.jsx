import React, { useState } from "react";
import { doc, getDoc, getDocs, updateDoc, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/admintickets.css"; // ✅ Estilos específicos ya aplicados

export default function AdminTickets() {
  // Estado para jugadores
  const [uid, setUid] = useState("");
  const [jugador, setJugador] = useState(null);

  // Estado para equipos
  const [equipoNombre, setEquipoNombre] = useState("");
  const [equipo, setEquipo] = useState(null);

  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  // Buscar jugador
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

  // Buscar equipo
  const buscarEquipo = async () => {
    try {
      const q = query(collection(db, "equipos"), where("nombre", "==", equipoNombre));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        setEquipo({ id: docData.id, ...docData.data() });
        setMensaje("");
      } else {
        setEquipo(null);
        setMensaje("⚠️ Equipo no encontrado.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al buscar equipo.");
    }
  };

  // Actualizar tickets (jugador o equipo)
  const actualizarTickets = async (tipo, entidad, isEquipo = false) => {
    const campo = isEquipo ? "ticketsEquipo" : "tickets";
    const obj = isEquipo ? equipo : jugador;
    if (!obj) return;

    const nuevos =
      tipo === "sumar"
        ? (obj[campo] || 0) + cantidad
        : Math.max(0, (obj[campo] || 0) - cantidad);

    try {
      await updateDoc(doc(db, isEquipo ? "equipos" : "jugadores", obj.id), {
        [campo]: nuevos,
      });

      if (isEquipo) {
        setEquipo({ ...obj, [campo]: nuevos });
      } else {
        setJugador({ ...obj, [campo]: nuevos });
      }

      setMensaje(`✅ Tickets ${tipo === "sumar" ? "otorgados" : "debitados"} correctamente a ${isEquipo ? "equipo" : "jugador"}.`);
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
            <button onClick={() => actualizarTickets("sumar", jugador)} className="atk-boton green">Otorgar</button>
            <button onClick={() => actualizarTickets("restar", jugador)} className="atk-boton red">Debitar</button>
          </div>
        </div>
      )}

      <hr className="atk-separator" />

      <h2 className="atk-title">Panel de Tickets por Equipo</h2>

      <div className="atk-busqueda">
        <input
          type="text"
          value={equipoNombre}
          onChange={(e) => setEquipoNombre(e.target.value)}
          placeholder="Nombre del equipo"
          className="atk-input"
        />
        <button onClick={buscarEquipo} className="atk-boton">Buscar</button>
      </div>

      {equipo && (
        <div className="atk-info">
          <p><strong>Equipo:</strong> {equipo.nombre}</p>
          <p><strong>Tickets:</strong> {equipo.ticketsEquipo || 0}</p>

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
            <button onClick={() => actualizarTickets("sumar", equipo, true)} className="atk-boton green">Otorgar</button>
            <button onClick={() => actualizarTickets("restar", equipo, true)} className="atk-boton red">Debitar</button>
          </div>
        </div>
      )}

      {mensaje && <p className="atk-mensaje">{mensaje}</p>}
    </div>
  );
}
