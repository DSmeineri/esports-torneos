// src/components/AdminNoticias.jsx
import React, { useState, useRef } from "react";
import { supabase } from "../supabase";
import "../styles/adminnoticias.css";

export default function AdminNoticias() {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    autor: "",
  });

  const [imagenes, setImagenes] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImagenes(files);
    setPreviewURLs(files.map((file) => URL.createObjectURL(file)));
  };

  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
    setPreviewURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const subirImagen = async (archivo) => {
    const nombre = `noticias/${Date.now()}_${archivo.name}`;
    const { error: uploadError } = await supabase.storage
      .from("noticias")
      .upload(nombre, archivo);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("noticias")
      .getPublicUrl(nombre);

    return urlData?.publicUrl || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!form.titulo.trim() || !form.contenido.trim() || !form.autor.trim()) {
      setMensaje("❌ Todos los campos son obligatorios");
      return;
    }

    try {
      const urls = [];

      for (const img of imagenes) {
        const url = await subirImagen(img);
        urls.push(url);
      }

      const { error: insertError } = await supabase.from("noticias").insert([{
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),
        autor: form.autor.trim(),
        fecha: new Date().toISOString(),
        imagenes: urls,
      }]);

      if (insertError) throw insertError;

      setMensaje("✅ Noticia publicada exitosamente");
      setForm({ titulo: "", contenido: "", autor: "" });
      setImagenes([]);
      setPreviewURLs([]);
      if (inputRef.current) inputRef.current.value = null;
    } catch (err) {
      console.error("Error al publicar noticia:", err);
      setMensaje("❌ Ocurrió un error al subir la noticia.");
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
          accept="image/*"
          multiple
          onChange={handleImagenes}
          className="adm-input"
          ref={inputRef}
        />

        {previewURLs.length > 0 && (
          <div className="adm-preview">
            {previewURLs.map((src, i) => (
              <div key={i} className="adm-preview-wrapper">
                <img src={src} alt={`preview-${i}`} className="adm-preview-img" />
                <button type="button" className="adm-remove-img" onClick={() => eliminarImagen(i)}>❌</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="adm-btn">Publicar</button>
      </form>

      {mensaje && <p className="adm-msg">{mensaje}</p>}
    </div>
  );
}
