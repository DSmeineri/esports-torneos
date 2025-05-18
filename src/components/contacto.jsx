// src/components/Contacto.jsx
import React from "react";
import "../styles/contacto.css";

export default function Contacto() {
  return (
    <div className="cnt-container">
      <h1 className="cnt-title">📩 Contacto</h1>
      <p className="cnt-text">
        Si tenés preguntas, sugerencias o necesitás ayuda, escribinos a:
      </p>
      <p className="cnt-email">📧 contacto@esportstorneos.com</p>
      <p className="cnt-subtext">¡Gracias por formar parte de nuestra comunidad!</p>
    </div>
  );
}
