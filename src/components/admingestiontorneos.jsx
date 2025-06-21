import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/admingestiontorneos.css";

export default function AdminGestionTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [estado, setEstado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [faseActual, setFaseActual] = useState("");
  const [fases, setFases] = useState([]);

  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: "",
    juego: "Mobile Legends",
    fecha: "",
    jugadoresPorEquipo: 5,
    equiposTotales: 8,
    ticketsPorJugador: 1,
    ticketsPorEquipo: 0,
    descripcion: "",
  });

  useEffect(() => {
    const obtenerTorneos = async () => {
      const snap = await getDocs(collection(db, "torneos"));
      const datos = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTorneos(datos);
    };
    obtenerTorneos();
  }, []);

  const seleccionarTorneo = async (torneo) => {
    setTorneoSeleccionado(torneo);
    setEstado(torneo.estado);
    setFaseActual(torneo.faseActual || "pendiente");
    setFases(torneo.fases || []);

    const equipoList = [];
    for (const e of torneo.equiposInscritos || []) {
      const snap = await getDoc(doc(db, "equipos", e.equipoId));
      if (snap.exists()) equipoList.push({ id: snap.id, ...snap.data() });
    }
    setEquipos(equipoList);
  };

  const actualizarEstado = async () => {
    try {
      await updateDoc(doc(db, "torneos", torneoSeleccionado.id), { estado });
      setMensaje("✅ Estado actualizado.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar estado.");
    }
  };

  const actualizarFase = async () => {
    try {
      await updateDoc(doc(db, "torneos", torneoSeleccionado.id), {
        faseActual,
      });
      setMensaje("✅ Fase actualizada.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar fase.");
    }
  };

  const guardarBracket = async () => {
    try {
      await updateDoc(doc(db, "torneos", torneoSeleccionado.id), {
        fases,
      });
      setMensaje("✅ Bracket guardado.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al guardar bracket.");
    }
  };

  const agregarFase = () => {
    setFases([...fases, { nombre: `Fase ${fases.length + 1}`, enfrentamientos: [] }]);
  };

  const agregarEnfrentamiento = (faseIdx) => {
    const actualizadas = [...fases];
    actualizadas[faseIdx].enfrentamientos.push({
      equipo1: "",
      equipo2: "",
      resultado: "",
    });
    setFases(actualizadas);
  };

  const actualizarEnfrentamiento = (faseIdx, matchIdx, campo, valor) => {
    const actualizadas = [...fases];
    actualizadas[faseIdx].enfrentamientos[matchIdx][campo] = valor;
    setFases(actualizadas);
  };

  const crearTorneo = async (e) => {
    e.preventDefault();
    try {
      const fechaTimestamp = Timestamp.fromDate(new Date(nuevoTorneo.fecha));
      await addDoc(collection(db, "torneos"), {
        ...nuevoTorneo,
        fecha: fechaTimestamp,
        estado: "abierto",
        faseActual: "pendiente",
        equiposInscritos: [],
        fases: [],
        jugadoresPorEquipo: parseInt(nuevoTorneo.jugadoresPorEquipo),
        equiposTotales: parseInt(nuevoTorneo.equiposTotales),
        ticketsPorJugador: parseInt(nuevoTorneo.ticketsPorJugador),
        ticketsPorEquipo: parseInt(nuevoTorneo.ticketsPorEquipo),
      });

      setMensaje("✅ Torneo creado exitosamente.");
      setNuevoTorneo({
        nombre: "",
        juego: "Mobile Legends",
        fecha: "",
        jugadoresPorEquipo: 5,
        equiposTotales: 8,
        ticketsPorJugador: 1,
        ticketsPorEquipo: 0,
        descripcion: "",
      });
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear torneo.");
    }
  };

  return (
    <div className="agt-container">
      <h2 className="agt-title">Administración de Torneos</h2>

      <div className="agt-creacion-torneo">
        <h3>Crear Torneo</h3>
        <form onSubmit={crearTorneo} className="agt-form">
          <input name="nombre" placeholder="Nombre del torneo" className="agt-input"
            value={nuevoTorneo.nombre} onChange={e => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })} required />
          <input name="fecha" type="datetime-local" className="agt-input"
            value={nuevoTorneo.fecha} onChange={e => setNuevoTorneo({ ...nuevoTorneo, fecha: e.target.value })} required />
          <input type="number" name="jugadoresPorEquipo" min="1" className="agt-input"
            value={nuevoTorneo.jugadoresPorEquipo} onChange={e => setNuevoTorneo({ ...nuevoTorneo, jugadoresPorEquipo: e.target.value })} required />
          <input type="number" name="equiposTotales" min="2" className="agt-input"
            value={nuevoTorneo.equiposTotales} onChange={e => setNuevoTorneo({ ...nuevoTorneo, equiposTotales: e.target.value })} required />
          <input type="number" name="ticketsPorJugador" min="0" className="agt-input"
            value={nuevoTorneo.ticketsPorJugador} onChange={e => setNuevoTorneo({ ...nuevoTorneo, ticketsPorJugador: e.target.value })} />
          <input type="number" name="ticketsPorEquipo" min="0" className="agt-input"
            value={nuevoTorneo.ticketsPorEquipo} onChange={e => setNuevoTorneo({ ...nuevoTorneo, ticketsPorEquipo: e.target.value })} />
          <textarea className="agt-input" rows="3" placeholder="Descripción o reglas del torneo"
            value={nuevoTorneo.descripcion} onChange={e => setNuevoTorneo({ ...nuevoTorneo, descripcion: e.target.value })}></textarea>
          <button type="submit" className="agt-form-button">Crear torneo</button>
        </form>
      </div>

      <div className="agt-listado">
        {torneos.map((t) => (
          <button key={t.id} onClick={() => seleccionarTorneo(t)} className="agt-torneo-btn">
            🛠️ {t.nombre}
          </button>
        ))}
      </div>

      {torneoSeleccionado && (
        <div className="agt-panel">
          <h3>{torneoSeleccionado.nombre}</h3>
          <p><strong>Juego:</strong> {torneoSeleccionado.juego}</p>
          <p><strong>Fecha:</strong> {new Date(torneoSeleccionado.fecha.seconds * 1000).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {torneoSeleccionado.estado}</p>
          <p><strong>Equipos inscritos:</strong> {torneoSeleccionado.equiposInscritos?.length} / {torneoSeleccionado.equiposTotales}</p>

          <label className="agt-label">Cambiar estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="agt-select">
            <option value="abierto">Abierto</option>
            <option value="en curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <button onClick={actualizarEstado} className="agt-guardar">Guardar estado</button>

          <div className="agt-fase-panel">
            <h4>Fase actual</h4>
            <input value={faseActual} onChange={(e) => setFaseActual(e.target.value)} className="agt-input" />
            <button onClick={actualizarFase} className="agt-btn-actualizar">Actualizar fase</button>
          </div>

          <div className="agt-fase-panel">
            <h4>Editor de Brackets</h4>
            {fases.map((fase, fIdx) => (
              <div key={fIdx} className="agt-fase-bloque">
                <h5>{fase.nombre}</h5>
                {fase.enfrentamientos.map((match, mIdx) => (
                  <div key={mIdx} className="agt-enfrentamiento">
                    <input value={match.equipo1} onChange={(e) => actualizarEnfrentamiento(fIdx, mIdx, "equipo1", e.target.value)} placeholder="Equipo 1" className="agt-input" />
                    <input value={match.equipo2} onChange={(e) => actualizarEnfrentamiento(fIdx, mIdx, "equipo2", e.target.value)} placeholder="Equipo 2" className="agt-input" />
                    <input value={match.resultado} onChange={(e) => actualizarEnfrentamiento(fIdx, mIdx, "resultado", e.target.value)} placeholder="Resultado" className="agt-input" />
                  </div>
                ))}
                <button onClick={() => agregarEnfrentamiento(fIdx)} className="agt-btn-actualizar">+ Enfrentamiento</button>
              </div>
            ))}
            <button onClick={agregarFase} className="agt-btn-actualizar">+ Fase</button>
            <button onClick={guardarBracket} className="agt-guardar">Guardar Bracket</button>
          </div>

          <h4>Equipos inscritos</h4>
          <ul className="agt-equipos">
            {equipos.map((eq) => (
              <li key={eq.id}>{eq.nombre}</li>
            ))}
          </ul>

          {mensaje && <p className="agt-msg">{mensaje}</p>}
        </div>
      )}
    </div>
  );
}
