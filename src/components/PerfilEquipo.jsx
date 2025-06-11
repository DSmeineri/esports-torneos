import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/perfilequipo.css";

export default function PerfilEquipo() {
  const [equipo, setEquipo] = useState(null);
  const [integranteNuevo, setIntegranteNuevo] = useState({ uid: "", nombre: "" });
  const [mensaje, setMensaje] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", logoURL: "" });
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(collection(db, "equipos"), where("creadorUID", "==", uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const equipoData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setEquipo(equipoData);
        setFormEdit({
          nombre: equipoData.nombre,
          descripcion: equipoData.descripcion || "",
          logoURL: equipoData.logoURL || "",
        });
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarTorneos = async () => {
      if (!equipo) return;
      const snap = await getDocs(collection(db, "torneos"));
      const filtrados = snap.docs
        .filter(doc => doc.data().equiposInscritos?.some(e => e.equipoId === equipo.id))
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setTorneos(filtrados);
    };
    cargarTorneos();
  }, [equipo]);

  const agregarIntegrante = async () => {
    if (!equipo || !integranteNuevo.uid || !integranteNuevo.nombre) return;
    const equipoRef = doc(db, "equipos", equipo.id);
    const nuevosIntegrantes = [...equipo.integrantes, integranteNuevo];
    await updateDoc(equipoRef, { integrantes: nuevosIntegrantes });
    setEquipo({ ...equipo, integrantes: nuevosIntegrantes });
    setIntegranteNuevo({ uid: "", nombre: "" });
    setMensaje("✅ Integrante agregado");
  };

  const eliminarIntegrante = async (uid) => {
    if (!equipo) return;
    const nuevos = equipo.integrantes.filter(i => i.uid !== uid);
    const equipoRef = doc(db, "equipos", equipo.id);
    await updateDoc(equipoRef, { integrantes: nuevos });
    setEquipo({ ...equipo, integrantes: nuevos });
  };

  const guardarCambios = async () => {
    const equipoRef = doc(db, "equipos", equipo.id);
    await updateDoc(equipoRef, {
      nombre: formEdit.nombre,
      descripcion: formEdit.descripcion,
      logoURL: formEdit.logoURL
    });
    setEquipo({ ...equipo, ...formEdit });
    setModoEdicion(false);
  };

  if (!equipo) return <p className="text-center mt-10">Cargando equipo...</p>;

  return (
    <div className="peo-container">
      {/* Información del equipo */}
      <section className="peo-info">
        {equipo.logoURL && (
          <img src={equipo.logoURL} alt="Logo del equipo" className="peo-logo" />
        )}
        <div className="peo-info-text">
          {modoEdicion ? (
            <div className="peo-form-edit">
              <input
                type="text"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                placeholder="Nombre del equipo"
              />
              <input
                type="text"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                placeholder="Descripción"
              />
              <input
                type="text"
                value={formEdit.logoURL}
                onChange={(e) => setFormEdit({ ...formEdit, logoURL: e.target.value })}
                placeholder="URL del logo"
              />
              <div className="peo-edit-btns">
                <button onClick={guardarCambios} className="peo-btn guardar">Guardar</button>
                <button onClick={() => setModoEdicion(false)} className="peo-btn cancelar">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="peo-nombre">{equipo.nombre}</h2>
              <p className="peo-desc">{equipo.descripcion}</p>
              <button onClick={() => setModoEdicion(true)} className="peo-btn editar">
                Editar información
              </button>
            </>
          )}
        </div>
      </section>

      {/* Lista de integrantes */}
      <section className="peo-integrantes">
        <h3>Integrantes</h3>
        <ul>
          {equipo.integrantes.map((i, idx) => (
            <li key={idx}>
              {i.nombre} <span className="uid">({i.uid})</span>
              {i.uid !== auth.currentUser.uid && (
                <button onClick={() => eliminarIntegrante(i.uid)} className="quitar">Quitar</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Agregar integrante */}
      <section className="peo-agregar">
        <h3>Agregar nuevo integrante</h3>
        <div className="peo-agregar-form">
          <input
            placeholder="UID del jugador"
            value={integranteNuevo.uid}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, uid: e.target.value })}
          />
          <input
            placeholder="Nombre del jugador"
            value={integranteNuevo.nombre}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, nombre: e.target.value })}
          />
        </div>
        <button
          onClick={agregarIntegrante}
          disabled={!integranteNuevo.uid || !integranteNuevo.nombre}
          className="peo-btn agregar"
        >
          Agregar integrante
        </button>
        {mensaje && <p className="peo-msg">{mensaje}</p>}
      </section>

      {/* Historial de torneos */}
      <section className="peo-torneos">
        <h3>Torneos inscritos</h3>
        {torneos.length === 0 ? (
          <p>Este equipo aún no está inscrito en torneos.</p>
        ) : (
          <ul>
            {torneos.map((t) => (
              <li key={t.id}>
                🏆 {t.nombre} - {new Date(t.fecha.seconds * 1000).toLocaleDateString()} - Estado: <strong>{t.estado}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bloque de Tickets del Equipo */}
      <section className="peo-tickets">
        <h3>Tickets del equipo</h3>
        <div className="peo-tickets-box">
          🎟️ <strong>{equipo.ticketsEquipo || 0}</strong> tickets disponibles
        </div>
      </section>
    </div>
  );
}
