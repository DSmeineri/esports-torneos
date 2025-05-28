import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensaje("❌ Error al iniciar sesión: " + error.message);
    } else {
      navigate("/perfil");
    }
  };

  return (
    <div className="lgn-container">
      <form onSubmit={iniciarSesion} className="lgn-form">
        <h2 className="lgn-title">Iniciar sesión</h2>

        <div>
          <label className="lgn-label">Email</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="lgn-input"
            required
          />
        </div>

        <div>
          <label className="lgn-label">Contraseña</label>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="lgn-input"
            required
          />
        </div>

        <button type="submit" className="lgn-btn">
          Ingresar
        </button>

        {mensaje && <p className="lgn-error">{mensaje}</p>}
      </form>
    </div>
  );
}
