import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../Firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RegistroJugador() {
    const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    idJuego: "",
    subCodigo: "",
    equipo: "",
    foto: null,
    });

    const [equipos, setEquipos] = useState([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
    const cargarEquipos = async () => {
        const snapshot = await getDocs(collection(db, "equipos"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEquipos(lista);
    };
    cargarEquipos();
    }, []);

    const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
        setForm({ ...form, foto: files[0] });
    } else {
        setForm({ ...form, [name]: value });
    }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password || "123456");
        const uid = userCred.user.uid;

        let fotoURL = "";
        if (form.foto) {
        const fotoRef = ref(storage, `fotosPerfil/${uid}`);
        await uploadBytes(fotoRef, form.foto);
        fotoURL = await getDownloadURL(fotoRef);
        }

        await setDoc(doc(db, "jugadores", uid), {
        uid,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        idJuego: form.idJuego,
        subCodigo: form.subCodigo,
        equipo: form.equipo || null,
        fotoURL,
        creado: new Date(),
        });

        setMensaje("✅ Registro exitoso.");
        setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        idJuego: "",
        subCodigo: "",
        equipo: "",
        foto: null,
        });
    } catch (error) {
        console.error(error);
        setMensaje("❌ Error al registrar: " + error.message);
    }
    };

    return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
        <h2 className="text-2xl font-bold mb-4">Registro de Jugador</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
            <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
            />
            <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
            />
        </div>

        <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
        />

        <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
        />

        <input
            name="idJuego"
            placeholder="ID del juego (8 dígitos)"
            value={form.idJuego}
            onChange={handleChange}
            pattern="^\d{8}$"
            title="Debe tener exactamente 8 dígitos"
            className="w-full p-2 border rounded"
            required
        />

        <input
            name="subCodigo"
            placeholder="Subcódigo (formato: (1234))"
            value={form.subCodigo}
            onChange={handleChange}
            pattern="^\(\d{4}\)$"
            title="Debe estar entre paréntesis, ejemplo: (1234)"
            className="w-full p-2 border rounded"
            required
        />

        <select
            name="equipo"
            value={form.equipo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
        >
            <option value="">Selecciona un equipo (opcional)</option>
            {equipos.map(eq => (
            <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>
            ))}
        </select>

        <input
            name="foto"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
        />

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
            Registrarse
        </button>
        </form>

        {mensaje && (
        <div className="mt-4 text-center font-semibold text-green-600">{mensaje}</div>
        )}
    </div>
    );
}
