// src/components/RegistroCuenta.jsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/registrocuenta.css";

export default function RegistroCuenta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/completar-perfil" // O tu URL de producción
      }
    });

    if (error) {
      setMensaje("❌ Error al crear cuenta: " + error.message);
    } else {
      setMensaje("✅ Cuenta creada.");
      setTimeout(() => navigate("/completar-perfil"), 1500);
    }
  };

  return (
    <section className="rc-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} className="rc-form">
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Siguiente</button>
        {mensaje && <p>{mensaje}</p>}
      </form>
    </section>
  );
}
