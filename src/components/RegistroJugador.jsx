import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    cardBase,
    inputBase,
    btnPrimary,
    titlePage,
    textBase,
    grid2cols
} from "../styles";

export default function RegistroJugador() {
    const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    gameId: "",
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
        const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
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
        gameId: form.gameId,
        subCodigo: form.subCodigo,
        equipo: form.equipo || null,
        fotoURL,
        tickets: 0,
        creado: new Date(),
        });

        setMensaje("✅ Registro exitoso.");
        setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        gameId: "",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className={cardBase + " w-full max-w-2xl"}>
        <h2 className={titlePage + " mb-6"}>Registro de Jugador</h2>

        <div className={grid2cols + " mb-4"}>
            <input
            className={inputBase}
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            />
            <input
            className={inputBase}
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            />
        </div>

        <div className={grid2cols + " mb-4"}>
            <input
            className={inputBase}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            />
            <input
            className={inputBase}
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            />
        </div>

        <div className={grid2cols + " mb-4"}>
            <input
            className={inputBase}
            name="gameId"
            placeholder="Game ID (8 dígitos)"
            value={form.gameId}
            onChange={handleChange}
            pattern="^\d{8}$"
            title="Debe tener exactamente 8 dígitos"
            required
            />
            <input
            className={inputBase}
            name="subCodigo"
            placeholder="Subcódigo (formato: (1234))"
            value={form.subCodigo}
            onChange={handleChange}
            pattern="^\(\d{4}\)$"
            title="Debe estar entre paréntesis, ejemplo: (1234)"
            required
            />
        </div>

        <select
            name="equipo"
            value={form.equipo}
            onChange={handleChange}
            className={inputBase + " mb-4"}
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
            className={inputBase + " mb-4"}
        />

        <button type="submit" className={btnPrimary + " w-full"}>
            Registrarse
        </button>

        {mensaje && <p className="mt-4 text-sm text-center text-green-600">{mensaje}</p>}
        </form>
    </div>
    );
}
