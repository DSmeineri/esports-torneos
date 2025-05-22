import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/registrojugador.css"; // ✅ Importación del CSS dedicado

export default function RegistroJugador() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    gameId: "",
    subCodigo: "",
    equipo: "",
    foto: null,
  });

  const [equipos, setEquipos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarEquipos = async () => {
      const snapshot = await getDocs(collection(db, "equipos"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipos(lista);
    };
    cargarEquipos();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const uid = userCred.user.uid;

    let fotoURL = "";
    if (form.foto) {
      const fotoRef = ref(storage, `fotosPerfil/${uid}`);
      await uploadBytes(fotoRef, form.foto);
      fotoURL = await getDownloadURL(fotoRef);
    }

    await setDoc(doc(db, "jugadores", uid), {
      uid,
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      gameId: form.gameId,
      subCodigo: form.subCodigo,
      equipo: form.equipo || null,
      fotoURL,
      tickets: 0,
      creado: new Date(),
      rol: "usuario" // ✅ Esta línea agrega el rol por defecto
    });

    setMensaje("✅ Registro exitoso.");
    setForm({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      gameId: "",
      subCodigo: "",
      equipo: "",
      foto: null,
    });
  } catch (error) {
    console.error(error);
    setMensaje("❌ Error al registrar: " + error.message);
  }
};


  return (
    <section className="rjr-container">
      <form onSubmit={handleSubmit} className="rjr-form">
        <h2 className="rjr-title">Registro de Jugador</h2>

        <div className="rjr-grid2">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="rjr-input" required />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} className="rjr-input" required />
        </div>

        <div className="rjr-grid2">
          <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="rjr-input" required />
          <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="rjr-input" required />
        </div>

        <div className="rjr-grid2">
          <input name="gameId" placeholder="Game ID (8 dígitos)" value={form.gameId} onChange={handleChange} pattern="^\d{8}$" className="rjr-input" required />
          <input name="subCodigo" placeholder="Subcódigo (formato: (1234))" value={form.subCodigo} onChange={handleChange} pattern="^\(\d{4}\)$" className="rjr-input" required />
        </div>

        <select name="equipo" value={form.equipo} onChange={handleChange} className="rjr-input">
          <option value="">Selecciona un equipo (opcional)</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>
          ))}
        </select>

        <input name="foto" type="file" accept="image/*" onChange={handleChange} className="rjr-input" />

        <button type="submit" className="rjr-btn">Registrarse</button>

        {mensaje && <p className="rjr-msg">{mensaje}</p>}
      </form>
    </section>
  );
}
