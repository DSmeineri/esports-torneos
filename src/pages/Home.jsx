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
import MainLayout from "../components/MainLayout.jsx"; // 👈 Importar el layout

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
    <MainLayout>
      <div className="space-y-12">
        {/* Sección de bienvenida */}
        <section className={`${cardBase} text-center max-w-2xl mx-auto`}>
          <h1 className={`${titlePage} mb-4`}>
            🎮 Bienvenido a <span className="text-blue-600">eSports Torneos</span>
          </h1>
          <p className={`${textBase} mb-6`}>
            Participá en torneos competitivos de Mobile Legends. Crea tu equipo, ganá tickets y demostrale al mundo tu habilidad.
          </p>
          <Link to="/registro-equipo" className={btnPrimary}>
            Crear equipo
          </Link>
        </section>

        {/* Torneos destacados */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Torneos destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {torneos.map((torneo) => (
              <div key={torneo.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-800">{torneo.nombre}</h3>
                <p className="text-sm text-gray-500">Juego: {torneo.juego}</p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(torneo.fecha.seconds * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Equipos: {torneo.equiposInscritos.length} / {torneo.equiposTotales}
                </p>
                <Link
                  to="/torneos"
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Ver torneo
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
