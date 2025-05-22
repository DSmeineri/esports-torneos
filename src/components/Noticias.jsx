// src/components/Noticias.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/noticias.css";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenAmpliada, setImagenAmpliada] = useState(null); // 👈 Modal

  useEffect(() => {
    const obtenerNoticias = async () => {
      const q = query(collection(db, "noticias"), orderBy("fecha", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNoticias(lista);
      setCargando(false);
    };
    obtenerNoticias();
  }, []);

  const cerrarModal = () => setImagenAmpliada(null);

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

              {noticia.imagenes && noticia.imagenes.length > 0 && (
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
                Publicado el: {new Date(noticia.fecha.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de imagen ampliada */}
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
