import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

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
    <div className="login-container">
        <form className="formulario" onSubmit={iniciarSesion}>
        <h2>Iniciar sesión</h2>

        <label>Email</label>
        <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="boton-primario" type="submit">
            Ingresar
        </button>

        {mensaje && <p className="mensaje-error">{mensaje}</p>}
        </form>
    </div>
    );
}
