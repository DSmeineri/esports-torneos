import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/noticias.css";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  useEffect(() => {
    const obtenerNoticias = async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .order("fecha", { ascending: false });

      if (error) {
        console.error("❌ Error al cargar noticias:", error);
      } else {
        setNoticias(data || []);
      }

      setCargando(false);
    };

    obtenerNoticias();
  }, []);

  const cerrarModal = () => setImagenAmpliada(null);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = typeof fecha === "string" ? new Date(fecha) : fecha;
    return date.toLocaleDateString("es-AR");
  };

  return (
    <div className="nts-container">
      <h1 className="nts-title">📰 Noticias y Actualizaciones</h1>

      {cargando ? (
        <p className="nts-loading">Cargando noticias...</p>
      ) : noticias.length === 0 ? (
        <p className="nts-text">Aún no hay noticias publicadas.</p>
      ) : (
        <div className="nts-feed">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="nts-card">
              <h3 className="nts-card-title">{noticia.titulo}</h3>
              <p className="nts-card-text">{noticia.contenido}</p>

              {Array.isArray(noticia.imagenes) && noticia.imagenes.length > 0 && (
                <div className="nts-img-group">
                  {noticia.imagenes.map((url, index) => (
                    <div key={index} className="nts-img-wrapper">
                      <img
                        src={url}
                        alt={`imagen-${index}`}
                        className="nts-img"
                        onClick={() => setImagenAmpliada(url)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <p className="nts-card-date">
                Publicado el: {formatearFecha(noticia.fecha)}
              </p>
            </div>
          ))}
        </div>
      )}

      {imagenAmpliada && (
        <div className="nts-modal" onClick={cerrarModal}>
          <div className="nts-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="nts-modal-close" onClick={cerrarModal}>×</button>
            <img src={imagenAmpliada} alt="imagen ampliada" className="nts-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}
