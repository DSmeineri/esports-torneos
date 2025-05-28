// src/components/RegistroJugador.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/registrojugador.css";

export default function RegistroJugador() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    gameId: "",
    subCodigo: "",
    equipo: "",
    foto: null,
  });

  const [equipos, setEquipos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarEquipos = async () => {
      const { data } = await supabase.from("equipos").select("nombre");
      if (data) setEquipos(data);
    };
    cargarEquipos();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "foto" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError || !signUpData.user) throw signUpError;
      const uid = signUpData.user.id;

      let fotoURL = "";
      if (form.foto) {
        const nombreArchivo = `fotosperfil/${uid}_${Date.now()}`;
        const { error: uploadError } = await supabase
          .storage
          .from("fotosperfil")
          .upload(nombreArchivo, form.foto);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase
          .storage
          .from("fotosperfil")
          .getPublicUrl(nombreArchivo);
        fotoURL = urlData?.publicUrl || "";
      }

      const { error: insertError } = await supabase.from("jugadores").insert([{
        uid,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        gameId: form.gameId,
        subCodigo: form.subCodigo,
        equipo: form.equipo || null,
        fotoURL,
        tickets: 0,
        creado: new Date().toISOString(),
        rol: "usuario",
      }]);

      if (insertError) throw insertError;

      setMensaje("✅ Registro exitoso.");
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        gameId: "",
        subCodigo: "",
        equipo: "",
        foto: null,
      });
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al registrar: " + (err?.message || "Error desconocido"));
    }
  };

  return (
    <section className="rjr-container">
      <form onSubmit={handleSubmit} className="rjr-form">
        <h2 className="rjr-title">Registro de Jugador</h2>

        <div className="rjr-grid2">
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="rjr-input"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="rjr-input"
            required
          />
        </div>

        <div className="rjr-grid2">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="rjr-input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="rjr-input"
            required
          />
        </div>

        <div className="rjr-grid2">
          <input
            name="gameId"
            placeholder="Game ID (8 dígitos)"
            value={form.gameId}
            onChange={handleChange}
            pattern="^\d{8}$"
            className="rjr-input"
            required
          />
          <input
            name="subCodigo"
            placeholder="Subcódigo (formato: (1234))"
            value={form.subCodigo}
            onChange={handleChange}
            pattern="^\(\d{4}\)$"
            className="rjr-input"
            required
          />
        </div>

        <select
          name="equipo"
          value={form.equipo}
          onChange={handleChange}
          className="rjr-input"
        >
          <option value="">Selecciona un equipo (opcional)</option>
          {equipos.map((eq, i) => (
            <option key={i} value={eq.nombre}>
              {eq.nombre}
            </option>
          ))}
        </select>

        <input
          name="foto"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="rjr-input"
        />

        <button type="submit" className="rjr-btn">Registrarse</button>
        {mensaje && <p className="rjr-msg">{mensaje}</p>}
      </form>
    </section>
  );
}
