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
      // Obtener nombre del creador
        const jugadorDoc = await getDoc(doc(db, "jugadores", user.uid));
        const jugadorData = jugadorDoc.exists() ? jugadorDoc.data() : null;

      // Subir logo (opcional)
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

      setTimeout(() => navigate("/perfil-equipo"), 2000); // opcional
    } catch (err) {
        console.error(err);
        setMensaje("❌ Error al registrar el equipo");
    }
    };

    return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Registro de Equipo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            name="nombre"
            placeholder="Nombre del equipo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
        />
        <textarea
            name="descripcion"
            placeholder="Descripción (opcional)"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
        />
        <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
        />
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
            Crear Equipo
        </button>
        </form>
        {mensaje && <p className="text-center mt-4 font-semibold text-green-600">{mensaje}</p>}
    </div>
    );
}
