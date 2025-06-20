// src/components/AdminNoticias.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "../styles/adminnoticias.css";

import ImageKitUploader from "./ImageKitUploader";

export default function AdminNoticias() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    autor: "",
  });

  // URLs de las imágenes subidas
  const [imagenesURLs, setImagenesURLs] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onUploadSuccess = (url) => {
    setImagenesURLs((prev) => {
      if (prev.length >= 3) return prev; // máximo 3 imágenes
      return [...prev, url];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.contenido || !form.autor) {
      return setMensaje("❌ Todos los campos son obligatorios");
    }
    if (imagenesURLs.length === 0) {
      return setMensaje("❌ Debes subir al menos una imagen");
    }

    try {
      await addDoc(collection(db, "noticias"), {
        titulo: form.titulo,
        contenido: form.contenido,
        autor: form.autor,
        fecha: Timestamp.now(),
        imagenes: imagenesURLs,
      });

      setMensaje("✅ Noticia publicada exitosamente");
      setForm({ titulo: "", contenido: "", autor: "" });
      setImagenesURLs([]);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al publicar noticia");
    }
  };

  return (
    <div className="adm-container">
      <h2 className="adm-title">📝 Publicar Noticia</h2>
      <form onSubmit={handleSubmit} className="adm-form">
        <label className="adm-label">Título</label>
        <input
          type="text"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className="adm-input"
          required
        />

        <label className="adm-label">Contenido</label>
        <textarea
          name="contenido"
          value={form.contenido}
          onChange={handleChange}
          className="adm-textarea"
          rows={6}
          required
        />

        <label className="adm-label">Autor</label>
        <input
          type="text"
          name="autor"
          value={form.autor}
          onChange={handleChange}
          className="adm-input"
          required
        />

        <label className="adm-label">Imágenes (máximo 3)</label>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[0, 1, 2].map((index) => (
            <ImageKitUploader
              key={index}
              fileName={`noticia_img_${Date.now()}_${index}.jpg`}
              onUploadSuccess={onUploadSuccess}
            />
          ))}
        </div>

        <button type="submit" className="adm-btn" style={{ marginTop: "1rem" }}>
          Publicar
        </button>
      </form>

      {mensaje && <p className="adm-msg">{mensaje}</p>}

      {imagenesURLs.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Imágenes subidas:</h4>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {imagenesURLs.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Noticia imagen ${i + 1}`}
                style={{ width: 120, borderRadius: 6 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
