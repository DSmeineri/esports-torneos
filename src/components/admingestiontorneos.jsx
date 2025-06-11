import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../styles/admingestiontorneos.css";

export default function AdminGestionTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [estado, setEstado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [equipoAInscribir, setEquipoAInscribir] = useState("");
  const [faseActual, setFaseActual] = useState("");
  const [fases, setFases] = useState([]);

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
      const equipoSnap = await getDoc(doc(db, "equipos", e.equipoId));
      if (equipoSnap.exists()) {
        equipoList.push({ id: equipoSnap.id, ...equipoSnap.data() });
      }
    }
    setEquipos(equipoList);
  };

  const actualizarEstado = async () => {
    try {
      const torneoRef = doc(db, "torneos", torneoSeleccionado.id);
      await updateDoc(torneoRef, { estado });
      setMensaje("✅ Estado actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar el estado.");
    }
  };

  const actualizarFase = async () => {
    try {
      const torneoRef = doc(db, "torneos", torneoSeleccionado.id);
      await updateDoc(torneoRef, { faseActual });
      setMensaje("✅ Fase actualizada correctamente.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al actualizar la fase.");
    }
  };

  const guardarBracket = async () => {
    try {
      const torneoRef = doc(db, "torneos", torneoSeleccionado.id);
      await updateDoc(torneoRef, { fases });
      setMensaje("✅ Bracket actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al guardar el bracket.");
    }
  };

  const agregarFase = () => {
    const nuevaFase = { nombre: `Fase ${fases.length + 1}`, enfrentamientos: [] };
    setFases([...fases, nuevaFase]);
  };

  const agregarEnfrentamiento = (faseIndex) => {
    const nuevasFases = [...fases];
    nuevasFases[faseIndex].enfrentamientos.push({ equipo1: "", equipo2: "", resultado: "" });
    setFases(nuevasFases);
  };

  const actualizarEnfrentamiento = (faseIndex, matchIndex, campo, valor) => {
    const nuevasFases = [...fases];
    nuevasFases[faseIndex].enfrentamientos[matchIndex][campo] = valor;
    setFases(nuevasFases);
  };

  return (
    <div className="agt-container">
      <h2 className="agt-title">Administración de Torneos</h2>

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
          <p><strong>Equipos inscritos:</strong> {torneoSeleccionado.equiposInscritos?.length || 0} / {torneoSeleccionado.equiposTotales}</p>

          <label className="agt-label">Cambiar estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="agt-select">
            <option value="abierto">Abierto</option>
            <option value="en curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </select>

          <button onClick={actualizarEstado} className="agt-guardar">Guardar cambios</button>

          <div className="agt-fase-panel">
            <h4>Fase actual: {faseActual}</h4>
            <input value={faseActual} onChange={(e) => setFaseActual(e.target.value)} className="agt-input" />
            <button onClick={actualizarFase} className="agt-btn-actualizar">Actualizar fase</button>
          </div>

          <div className="agt-fase-panel">
            <h4>Editor de Fases / Bracket</h4>
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
