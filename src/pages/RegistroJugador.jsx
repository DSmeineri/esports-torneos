import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    collection, getDocs, addDoc, doc, setDoc
} from "firebase/firestore";
import {
    ref, uploadBytes, getDownloadURL
} from "firebase/storage";

const RegistroJugador = () => {
    const [formData, setFormData] = useState({
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
    const obtenerEquipos = async () => {
        const snapshot = await getDocs(collection(db, "equipos"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEquipos(lista);
    };
    obtenerEquipos();
    }, []);

    const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "foto") {
        setFormData({ ...formData, foto: files[0] });
    } else {
        setFormData({ ...formData, [name]: value });
    }
    };

    const handleSubmit = async e => {
    e.preventDefault();

    try {
        const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password || "123456" // clave por defecto si no se personaliza
        );
        const uid = userCred.user.uid;

        let fotoURL = "";
        if (formData.foto) {
        const storageRef = ref(storage, `fotosPerfil/${uid}`);
        await uploadBytes(storageRef, formData.foto);
        fotoURL = await getDownloadURL(storageRef);
        }

        const jugadorData = {
        uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        idJuego: formData.idJuego,
        subCodigo: formData.subCodigo,
        equipo: formData.equipo,
        fotoURL,
        creado: new Date(),
        };

        await setDoc(doc(db, "jugadores", uid), jugadorData);

        setMensaje("Registro exitoso 🎉");
        setFormData({
        nombre: "", apellido: "", email: "", password: "",
        idJuego: "", subCodigo: "", equipo: "", foto: null,
        });
    } catch (error) {
        console.error("Error al registrar:", error.message);
        setMensaje("❌ Error al registrar: " + error.message);
    }
    };

    return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Registro de Jugador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
            <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-1/2 input"
            required
            />
            <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-1/2 input"
            required
            />
        </div>

        <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full input"
            required
        />

        <input
            type="text"
            name="idJuego"
            placeholder="ID del juego (8 dígitos)"
            maxLength="8"
            value={formData.idJuego}
            onChange={handleChange}
            pattern="\d{8}"
            title="Debe tener 8 dígitos"
            className="w-full input"
            required
        />

        <input
            type="text"
            name="subCodigo"
            placeholder="Subcódigo (4 dígitos entre paréntesis)"
            maxLength="6"
            value={formData.subCodigo}
            onChange={handleChange}
            pattern="\(\d{4}\)"
            title="Debe tener este formato: (1234)"
            className="w-full input"
            required
        />

        <select
            name="equipo"
            value={formData.equipo}
            onChange={handleChange}
            className="w-full input"
        >
            <option value="">Selecciona un equipo (opcional)</option>
            {equipos.map(e => (
            <option key={e.id} value={e.nombre}>
                {e.nombre}
            </option>
            ))}
        </select>

        <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
        />

        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
            Registrarse
        </button>
        </form>

        {mensaje && (
        <p className="mt-4 text-center text-green-600 font-semibold">
            {mensaje}
        </p>
        )}
    </div>
    );
};

export default RegistroJugador;
