import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registro de Equipo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre del equipo</label>
            <input
            name="nombre"
            placeholder="Ej: Los Titanes"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción (opcional)</label>
            <textarea
            name="descripcion"
            placeholder="Descripción del equipo"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block text-sm text-gray-600 mb-1">Logo del equipo (opcional)</label>
            <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-700"
            />
        </div>

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
            Crear equipo
        </button>
        </form>

        {mensaje && <p className="text-center text-sm font-medium text-green-600">{mensaje}</p>}
    </div>
    );
}
