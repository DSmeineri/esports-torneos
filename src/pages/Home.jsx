import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  cardBase,
  titlePage,
  textBase,
  btnPrimary
} from "../styles";

export default function Home() {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const cargarTorneos = async () => {
      const snapshot = await getDocs(collection(db, "torneos"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTorneos(lista.slice(0, 3));
    };
    cargarTorneos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 space-y-12">
      {/* Sección de bienvenida */}
      <div className={`${cardBase} text-center max-w-2xl mx-auto`}>
        <h1 className={`${titlePage} mb-4`}>🎮 Bienvenido a eSports Torneos</h1>
        <p className={`${textBase} mb-6`}>
          Únete a nuestra comunidad de jugadores y participa en torneos competitivos de Mobile Legends. Crea tu equipo, gana tickets y demuestra tus habilidades.
        </p>
        <Link to="/registro-equipo" className={btnPrimary}>Crear equipo</Link>
      </div>

      {/* Torneos destacados */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Torneos destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneos.map((torneo) => (
            <div key={torneo.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">{torneo.nombre}</h3>
              <p className="text-sm text-gray-500">Juego: {torneo.juego}</p>
              <p className="text-sm">Fecha: {new Date(torneo.fecha.seconds * 1000).toLocaleDateString()}</p>
              <p className="text-sm">Equipos: {torneo.equiposInscritos.length} / {torneo.equiposTotales}</p>
              <Link
                to="/torneos"
                className="inline-block mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Ver torneo
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
