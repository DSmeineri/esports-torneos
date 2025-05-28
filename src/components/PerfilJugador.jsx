import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/perfiljugador.css";

export default function PerfilJugador() {
  const [jugador, setJugador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data: user } = await supabase.auth.getUser();
      const uid = user?.user?.id;
      if (!uid) return;

      const { data, error } = await supabase.from("jugadores").select("*").eq("uid", uid).single();
      if (error) {
        console.error("Error cargando jugador:", error);
        setLoading(false);
        return;
      }

      setJugador(data);
      setLoading(false);

      // Cargar equipo si está asignado
      if (data.equipo_id) {
        const { data: equipoData } = await supabase.from("equipos").select("*").eq("id", data.equipo_id).single();
        if (equipoData) setEquipo(equipoData);
      }
    };

    cargarPerfil();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;
  if (!jugador) return <p className="text-center mt-10">No se pudo cargar el perfil.</p>;

  return (
    <div className="pjr-container">
      <section className="pjr-perfil">
        <img
          src={jugador.foto_url || "https://via.placeholder.com/100"}
          alt="Foto de perfil"
          className="pjr-foto"
        />
        <div className="pjr-info">
          <h2 className="pjr-nombre">{jugador.nombre} {jugador.apellido}</h2>
          <p>Email: {jugador.email}</p>
          <p>ID de juego: {jugador.game_id} {jugador.subcodigo}</p>
          <p>🎫 Tickets disponibles: {jugador.tickets || 0}</p>
        </div>
      </section>

      {equipo ? (
        <section className="pjr-equipo">
          <h3>Equipo actual</h3>
          <p>👥 {equipo.nombre}</p>
          <p>{equipo.descripcion}</p>
        </section>
      ) : (
        <p className="pjr-sin-equipo">⚠️ No perteneces a ningún equipo aún.</p>
      )}
    </div>
  );
}
