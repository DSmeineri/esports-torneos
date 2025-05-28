// src/components/MainLayout.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/footer.css";
import "../styles/navbar.css";
import "../styles/mainlayout.css";

export default function MainLayout({ children }) {
  const [nombreJugador, setNombreJugador] = useState("");

  useEffect(() => {
    const obtenerNombreJugador = async () => {
      const { data: session } = await supabase.auth.getUser();

      if (session?.user) {
        const { data: jugador } = await supabase
          .from("jugadores")
          .select("nombre")
          .eq("uid", session.user.id)
          .single();

        if (jugador?.nombre) {
          setNombreJugador(jugador.nombre);
        }
      }
    };

    obtenerNombreJugador();
  }, []);

  return (
    <div className="lyt-wrapper">
      <Navbar nombreJugador={nombreJugador} /> {/* ✅ Pasamos como prop */}

      <main className="lyt-main">{children}</main>

      <Footer />
    </div>
  );
}
