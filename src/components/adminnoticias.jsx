// src/components/AdminNoticias.jsx
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/adminnoticias.css";

export default function AdminNoticias() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    autor: "",
    imagenes: [],
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenes") {
      setForm({ ...form, imagenes: Array.from(files).slice(0, 3) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.contenido || !form.autor) {
      return setMensaje("❌ Todos los campos son obligatorios");
    }

    try {
      const urls = [];
      for (const img of form.imagenes) {
        const imgRef = ref(storage, `noticias/${Date.now()}_${img.name}`);
        await uploadBytes(imgRef, img);
        const url = await getDownloadURL(imgRef);
        urls.push(url);
      }

      await addDoc(collection(db, "noticias"), {
        titulo: form.titulo,
        contenido: form.contenido,
        autor: form.autor,
        fecha: Timestamp.now(),
        imagenes: urls,
      });

      setMensaje("✅ Noticia publicada exitosamente");
      setForm({ titulo: "", contenido: "", autor: "", imagenes: [] });
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
        <input
          type="file"
          name="imagenes"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="adm-input"
        />

        <button type="submit" className="adm-btn">
          Publicar
        </button>
      </form>

      {mensaje && <p className="adm-msg">{mensaje}</p>}
    </div>
  );
}
