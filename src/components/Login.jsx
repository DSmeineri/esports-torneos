// Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
    cardBase,
    inputBase,
    btnPrimary,
    titlePage,
    textBase,
} from "../styles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/perfil");
    } catch (err) {
        setError("Credenciales incorrectas o error al iniciar sesión.");
    }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className={cardBase + " w-full max-w-md"}>
        <h2 className={titlePage + " mb-6"}>Iniciar Sesión</h2>
        <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputBase + " mb-4"}
        />
        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputBase + " mb-4"}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className={btnPrimary + " w-full"}>
            Ingresar
        </button>
        </form>
    </div>
    );
}
