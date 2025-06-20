// src/components/PerfilJugador.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/perfiljugador.css";

import mlLogo from "../assets/juegos/mobile-legends.png";
import lolLogo from "../assets/juegos/lol.png";
import valorantLogo from "../assets/juegos/valorant.png";
import defaultAvatar from "../assets/default.png";

import roleMid from "../assets/MLBB roles/mid lane.jpeg";
import roleGold from "../assets/MLBB roles/gold lane.jpeg";
import roleExp from "../assets/MLBB roles/exp lane.jpeg";
import roleJungler from "../assets/MLBB roles/jungler lane.jpeg";
import roleRoamer from "../assets/MLBB roles/roamer lane.jpeg";

import ImageKitUploader from "./ImageKitUploader";

const logos = {
  "Mobile Legends": mlLogo,
  "League of Legends": lolLogo,
  Valorant: valorantLogo,
};

const rolesMLBB = [
  { name: "Mid Lane", icon: roleMid },
  { name: "Gold Lane", icon: roleGold },
  { name: "EXP Lane", icon: roleExp },
  { name: "Jungler", icon: roleJungler },
  { name: "Roamer", icon: roleRoamer },
];

export default function PerfilJugador() {
  const [jugador, setJugador] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");
      const docRef = doc(db, "jugadores", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const datos = docSnap.data();
        setJugador(datos);
        setForm({ ...datos });
      }
    };
    cargarDatos();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleJuego = (juego) => {
    const juegos = form.juegos || [];
    if (juegos.includes(juego)) {
      setForm((prev) => ({ ...prev, juegos: juegos.filter((j) => j !== juego) }));
    } else {
      setForm((prev) => ({ ...prev, juegos: [...juegos, juego] }));
    }
  };

  const toggleRolMLBB = (rol) => {
    const roles = form.rolesMLBB || [];
    if (roles.includes(rol)) {
      setForm((prev) => ({ ...prev, rolesMLBB: roles.filter((r) => r !== rol) }));
    } else {
      setForm((prev) => ({ ...prev, rolesMLBB: [...roles, rol] }));
    }
  };

  const guardarCambios = async () => {
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, "jugadores", user.uid), form);
      setJugador(form);
      setEditando(false);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
    }
  };

  const cerrarSesion = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const eliminarPerfil = async () => {
    try {
      const user = auth.currentUser;
      if (passwordConfirm.trim() === "") return;
      await deleteDoc(doc(db, "jugadores", user.uid));
      await user.delete();
      navigate("/registrarse");
    } catch (err) {
      console.error("Error al eliminar perfil:", err);
    }
  };

  if (!jugador) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <section className="pjr-container">
      <div className="pjr-card">
        <button onClick={() => setEditando(true)} className="pjr-btn-editar">Editar perfil</button>
        <div className="pjr-header">
          <img
            src={jugador.fotoURL || defaultAvatar}
            alt="Foto de perfil"
            className="pjr-avatar"
          />
          <div className="pjr-info">
            <h2 className="pjr-nombre">{jugador.nickname}</h2>
            {jugador.mostrarNombre && (
              <p className="pjr-email">{jugador.nombre} {jugador.apellido}</p>
            )}
            {jugador.equipo ? (
              <p className="pjr-equipo">🏅 Equipo: {jugador.equipo}</p>
            ) : (
              <p className="pjr-sin-equipo">No pertenece a un equipo</p>
            )}
            {jugador.descripcion && (
              <div className="pjr-extra">
                <label>Descripción:</label>
                <p>{jugador.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {jugador.juegos?.includes("Mobile Legends") && (
          <div className="pjr-stats">
            <h4>Mobile Legends</h4>
            <div className="pjr-id-mlbb">
              <img src={mlLogo} alt="Mobile Legends" className="pjr-juego-icono" />
              <p>ID: {jugador.id_MobileLegends} - {jugador.subCodigo_MobileLegends}</p>
            </div>
            {jugador.rolesMLBB?.length > 0 && (
              <div className="pjr-mlbb-roles">
                {jugador.rolesMLBB.map((rol) => {
                  const r = rolesMLBB.find((r) => r.name === rol);
                  return r ? <img key={rol} src={r.icon} alt={rol} title={rol} /> : null;
                })}
              </div>
            )}
          </div>
        )}

        <p className="pjr-id">Tickets disponibles: {jugador.tickets || 0}</p>

        <button onClick={cerrarSesion} className="pjr-btn-salir">Cerrar sesión</button>
      </div>

      {editando && (
        <div className="pjr-modal">
          <div className="pjr-modal-contenido" style={{ position: "relative" }}>
            <button
              onClick={() => setEditando(false)}
              className="pjr-btn-editar"
              style={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              ✕
            </button>
            <h3>Editar perfil</h3>

            <label className="pjr-foto-label">Foto de perfil</label>
            <ImageKitUploader
              fileName={`avatar_jugador_${auth.currentUser.uid}.jpg`}
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, fotoURL: url }))}
            />
            {form.fotoURL && (
              <img
                src={form.fotoURL}
                alt="Preview foto perfil"
                style={{ width: 120, borderRadius: 8, marginTop: 10 }}
              />
            )}

            <label>Nickname</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname || ""}
              onChange={handleChange}
              className="pjr-input"
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="pjr-input"
            />

            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              className="pjr-input"
            />

            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido || ""}
              onChange={handleChange}
              className="pjr-input"
            />

            <label>Mostrar nombre públicamente</label>
            <select
              name="mostrarNombre"
              value={form.mostrarNombre ? "true" : "false"}
              onChange={(e) => setForm(prev => ({ ...prev, mostrarNombre: e.target.value === "true" }))}
              className="pjr-select"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>

            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono || ""}
              onChange={handleChange}
              className="pjr-input"
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
              className="pjr-textarea"
            />

            {form.juegos?.includes("Mobile Legends") && (
              <>
                <label>ID de Mobile Legends</label>
                <div className="pjr-id-mlbb">
                  <input
                    type="text"
                    name="id_MobileLegends"
                    placeholder="Ej: 12345678"
                    value={form.id_MobileLegends || ""}
                    onChange={handleChange}
                    className="pjr-input"
                  />
                  <input
                    type="text"
                    name="subCodigo_MobileLegends"
                    placeholder="Ej: 1234"
                    value={form.subCodigo_MobileLegends || ""}
                    onChange={handleChange}
                    className="pjr-input"
                  />
                </div>

                <label>Roles en MLBB</label>
                <div className="pjr-mlbb-roles">
                  {rolesMLBB.map(({ name, icon }) => (
                    <img
                      key={name}
                      src={icon}
                      alt={name}
                      title={name}
                      className={form.rolesMLBB?.includes(name) ? "selected" : ""}
                      onClick={() => toggleRolMLBB(name)}
                    />
                  ))}
                </div>
              </>
            )}

            <button onClick={guardarCambios} className="pjr-btn-guardar">Guardar cambios</button>

            <div style={{ marginTop: "2rem" }}>
              <label>Eliminar cuenta (requiere contraseña)</label>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="pjr-input"
              />
              <button onClick={eliminarPerfil} className="pjr-btn-salir">Eliminar cuenta</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
