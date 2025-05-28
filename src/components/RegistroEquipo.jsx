// src/components/RegistroEquipo.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/registroequipo.css";

export default function RegistroEquipo() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    logo: null,
  });
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      setUsuario(data?.user || null);
    };
    obtenerUsuario();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "logo" ? files[0] : value,
    }));
  };

  const verificarSiYaTieneEquipo = async (uid) => {
    const { data } = await supabase
      .from("equipos")
      .select("id")
      .contains("integrantes", [{ uid }]);
    return data && data.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    try {
      const uid = usuario.id;
      const yaTiene = await verificarSiYaTieneEquipo(uid);
      if (yaTiene) {
        setMensaje("⚠️ Ya perteneces a un equipo. No puedes crear otro.");
        return;
      }

      const { data: jugador } = await supabase
        .from("jugadores")
        .select("nombre, apellido")
        .eq("uid", uid)
        .single();

      let logoURL = "";
      if (form.logo) {
        const nombreLogo = `logosEquipos/${uid}_${Date.now()}`;
        const uploadRes = await supabase.storage
          .from("logosEquipos")
          .upload(nombreLogo, form.logo);
        if (uploadRes.error) throw uploadRes.error;

        const { data: urlData } = supabase.storage
          .from("logosEquipos")
          .getPublicUrl(nombreLogo);
        logoURL = urlData.publicUrl;
      }

      const nuevoEquipo = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        logoURL,
        creadorUID: uid,
        integrantes: jugador
          ? [{ uid, nombre: `${jugador.nombre} ${jugador.apellido}` }]
          : [],
        ticketsEquipo: 0,
        creado: new Date().toISOString(),
      };

      const { error } = await supabase.from("equipos").insert([nuevoEquipo]);
      if (error) throw error;

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
