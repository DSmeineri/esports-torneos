import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/visualizaciontorneos.css";

const logos = {
  "Mobile Legends": require("../assets/juegos/mobile-legends.png"),
  "League of Legends": require("../assets/juegos/lol.png"),
  Valorant: require("../assets/juegos/valorant.png"),
};

export default function VisualizacionTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const obtenerTorneos = async () => {
      const snap = await getDocs(collection(db, "torneos"));
      const activos = snap.docs
        .filter(doc => doc.data().estado !== "finalizado")
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setTorneos(activos);
    };
    obtenerTorneos();
  }, []);

  const seleccionarTorneo = async (torneo) => {
    setTorneoSeleccionado(torneo);

    const equipoList = [];
    for (const equipo of torneo.equiposInscritos || []) {
      const equipoSnap = await getDoc(doc(db, "equipos", equipo.equipoId));
      if (equipoSnap.exists()) {
        equipoList.push({ id: equipoSnap.id, ...equipoSnap.data() });
      }
    }
    setEquipos(equipoList);
  };

  const renderBracket = (fases) => {
    return (
      <div className="vzt-bracket">
        <div className="vzt-bracket-grid">
          {fases.map((fase, idx) => (
            <div key={idx} className="vzt-bracket-col">
              <h5 className="vzt-fase-nombre">{fase.nombre}</h5>
              {fase.enfrentamientos?.length > 0 ? (
                fase.enfrentamientos.map((match, i) => (
                  <div key={i} className="vzt-bracket-match">
                    {match.equipo1} vs {match.equipo2}
                    <br />
                    <em>{match.resultado || "Sin resultado"}</em>
                  </div>
                ))
              ) : (
                <div className="vzt-bracket-match">Fase vacía</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="vzt-container">
      <h2 className="vzt-title">Torneos en Curso</h2>

      <div className="vzt-listado">
        {torneos.map((t) => (
          <button key={t.id} onClick={() => seleccionarTorneo(t)} className="vzt-torneo-btn">
            🏆 {t.nombre}
          </button>
        ))}
      </div>

      {torneoSeleccionado && (
        <div className="vzt-detalle">
          <div className="vzt-header">
            {logos[torneoSeleccionado.juego] && (
              <img
                src={logos[torneoSeleccionado.juego]}
                alt={`${torneoSeleccionado.juego} logo`}
                className="vzt-juego-logo"
              />
            )}
            <div>
              <h3 className="vzt-nombre">{torneoSeleccionado.nombre}</h3>
              <p><strong>Juego:</strong> {torneoSeleccionado.juego}</p>
              <p><strong>Estado:</strong> {torneoSeleccionado.estado}</p>
              <p><strong>Fase actual:</strong> {torneoSeleccionado.faseActual || "-"}</p>
              <p><strong>Fecha:</strong> {new Date(torneoSeleccionado.fecha.seconds * 1000).toLocaleDateString()}</p>
            </div>
          </div>

          <h4 className="vzt-subtitulo">Participantes</h4>
          {equipos.length === 0 ? (
            <p className="vzt-vacio">No hay equipos inscritos aún.</p>
          ) : (
            <ul className="vzt-equipos">
              {equipos.map((eq) => (
                <li key={eq.id}>⚔️ {eq.nombre}</li>
              ))}
            </ul>
          )}

          {torneoSeleccionado.fases?.length > 0 && (
            <>
              <h4 className="vzt-subtitulo">Diagrama del Torneo</h4>
              {renderBracket(torneoSeleccionado.fases)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
