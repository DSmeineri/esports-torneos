// ✅ TODAS LAS IMPORTACIONES AL INICIO
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    useEffect(() => {
    if (user) {
        navigate("/perfil");
    }
    }, [user, navigate]);

    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        await signInWithEmailAndPassword(auth, form.email, form.password);
    } catch (err) {
        setError("❌ Email o contraseña incorrectos");
    }
    };

    return (
    <div className="max-w-md mx-auto bg-white shadow p-6 mt-10 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
        type="email"
        name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
        />
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
            Entrar
        </button>
        </form>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
    );
}
