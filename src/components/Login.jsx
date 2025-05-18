import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // ✅ Importamos el CSS modular

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/perfil");
    } catch (error) {
      setMensaje("❌ Error al iniciar sesión.");
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
