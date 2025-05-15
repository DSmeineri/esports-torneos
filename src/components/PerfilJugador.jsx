import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function PerfilJugador() {
    const [jugador, setJugador] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const cargarDatos = async () => {
        const user = auth.currentUser;
        if (!user) return navigate("/login");

        const docRef = doc(db, "jugadores", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        setJugador(docSnap.data());
        }
    };

    cargarDatos();
    }, [navigate]);

    const cerrarSesion = async () => {
    await auth.signOut();
    navigate("/login");
    };

    if (!jugador) {
    return <p className="text-center mt-10">Cargando perfil...</p>;
    }

    return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
        <div className="flex items-center gap-4 mb-6">
        <img
            src={jugador.fotoURL || "/default.jpg"}
            alt="Foto de perfil"
            className="w-20 h-20 object-cover rounded-full"
        />
        <div>
            <h2 className="text-2xl font-bold">{jugador.nombre} {jugador.apellido}</h2>
            <p className="text-gray-600 text-sm">{jugador.email}</p>
            <p className="text-sm">ID del juego: {jugador.idJuego} {jugador.subCodigo}</p>
            {jugador.equipo && (
            <p className="text-sm text-blue-600">Equipo: {jugador.equipo}</p>
            )}
        </div>
        </div>

        <button
        onClick={cerrarSesion}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
        Cerrar sesión
        </button>
    </div>
    );
}

