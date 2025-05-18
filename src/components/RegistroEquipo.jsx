import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../styles/registroequipo.css"; // ✅ Importar CSS dedicado

export default function RegistroEquipo() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    logo: null,
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setForm({ ...form, logo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const jugadorDoc = await getDoc(doc(db, "jugadores", user.uid));
      const jugadorData = jugadorDoc.exists() ? jugadorDoc.data() : null;

      let logoURL = "";
      if (form.logo) {
        const logoRef = ref(storage, `logosEquipos/${user.uid}_${Date.now()}`);
        await uploadBytes(logoRef, form.logo);
        logoURL = await getDownloadURL(logoRef);
      }

      const nuevoEquipo = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        logoURL,
        creadorUID: user.uid,
        integrantes: jugadorData
          ? [{ uid: user.uid, nombre: `${jugadorData.nombre} ${jugadorData.apellido}` }]
          : [],
        creado: new Date(),
      };

      await addDoc(collection(db, "equipos"), nuevoEquipo);
      setMensaje("✅ Equipo registrado con éxito");
      setForm({ nombre: "", descripcion: "", logo: null });

      setTimeout(() => navigate("/perfil-equipo"), 2000);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al registrar el equipo");
    }
  };

  return (
    <section className="reo-container">
      <form onSubmit={handleSubmit} className="reo-form">
        <h2 className="reo-title">Registro de Equipo</h2>

        <div className="reo-field">
          <label className="reo-label">Nombre del equipo</label>
          <input
            name="nombre"
            placeholder="Ej: Los Titanes"
            value={form.nombre}
            onChange={handleChange}
            className="reo-input"
            required
          />
        </div>

        <div className="reo-field">
          <label className="reo-label">Descripción (opcional)</label>
          <textarea
            name="descripcion"
            placeholder="Descripción del equipo"
            value={form.descripcion}
            onChange={handleChange}
            className="reo-input reo-textarea"
          />
        </div>

        <div className="reo-field">
          <label className="reo-label">Logo del equipo (opcional)</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="reo-input"
          />
        </div>

        <button type="submit" className="reo-btn">Crear equipo</button>

        {mensaje && <p className="reo-msg">{mensaje}</p>}
      </form>
    </section>
  );
}
