// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";
import "../styles/home.css"; // ✅ CSS modular

export default function Home() {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const cargarTorneos = async () => {
      const { data, error } = await supabase
        .from("torneos")
        .select("*")
        .order("fecha", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error al obtener torneos:", error);
      } else {
        setTorneos(data);
      }
    };

    cargarTorneos();
  }, []);

  return (
    <div className="hme-wrapper">
      {/* Sección de bienvenida */}
      <section className="hme-bienvenida">
        <h1 className="hme-titulo">
          🎮 Bienvenido a <span className="hme-destacado">eSports Torneos</span>
        </h1>
        <p className="hme-texto">
          Participá en torneos competitivos de Mobile Legends. Crea tu equipo, ganá tickets y demostrale al mundo tu habilidad.
        </p>
        <Link to="/registro-equipo" className="hme-btn">
          Crear equipo
        </Link>
      </section>

      {/* Torneos destacados */}
      <section className="hme-torneos">
        <h2 className="hme-subtitulo">Torneos destacados</h2>
        <div className="hme-grid">
          {torneos.map((torneo) => (
            <div key={torneo.id} className="hme-torneo-card">
              <h3 className="hme-torneo-nombre">{torneo.nombre}</h3>
              <p className="hme-torneo-detalle">Juego: {torneo.juego}</p>
              <p className="hme-torneo-detalle">
                Fecha: {new Date(torneo.fecha).toLocaleDateString()}
              </p>
              <p className="hme-torneo-detalle">
                Equipos: {torneo.equipos_inscritos?.length || 0} / {torneo.equipos_totales}
              </p>
              <Link to="/torneos" className="hme-torneo-link">
                Ver torneo
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
