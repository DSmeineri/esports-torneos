// src/components/CompletarPerfil.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/completarperfil.css";

export default function CompletarPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    gameId: "",
    subCodigo: "",
    equipo: "",
    foto: null,
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data?.user);
    });
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

    if (!usuario) return setMensaje("⚠️ No hay usuario autenticado.");

    const uid = usuario.id;

    // Subir foto si existe
    let fotoURL = "";
    if (form.foto) {
      const archivo = `fotosperfil/${uid}_${Date.now()}`;
      const { error: uploadError } = await supabase
        .storage
        .from("fotosperfil")
        .upload(archivo, form.foto);
      if (uploadError) return setMensaje("❌ Error al subir imagen.");

      const { data: urlData } = supabase
        .storage
        .from("fotosperfil")
        .getPublicUrl(archivo);
      fotoURL = urlData.publicUrl;
    }

    // Insertar en jugadores
    const { error } = await supabase.from("jugadores").insert([{
      uid,
      nombre: form.nombre,
      apellido: form.apellido,
      email: usuario.email,
      gameId: form.gameId,
      subCodigo: form.subCodigo,
      equipo: form.equipo || null,
      fotoURL,
      tickets: 0,
      rol: "usuario",
      creado: new Date().toISOString(),
    }]);

    if (error) {
      console.error(error);
      return setMensaje("❌ Error al guardar perfil.");
    }

    setMensaje("✅ Perfil completado.");
    setTimeout(() => navigate("/perfil-jugador"), 1500);
  };

  return (
    <section className="cp-container">
      <h2>Completar perfil</h2>
      <form onSubmit={handleSubmit} className="cp-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input name="gameId" placeholder="Game ID (8 dígitos)" value={form.gameId} onChange={handleChange} required />
        <input name="subCodigo" placeholder="Subcódigo (ej: (1234))" value={form.subCodigo} onChange={handleChange} required />
        <input type="file" name="foto" onChange={handleChange} />
        <button type="submit">Guardar perfil</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </section>
  );
}
