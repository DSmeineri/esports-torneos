import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/registrojugador.css";

export default function RegistroJugador() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    passwordConfirm: "",
    gameId: "",
    subCodigo: "",
    descripcion: "",
    equipo: "",
    foto: null,
    mayorEdad: false,
    aceptaTerminos: false,
  });

  const [equipos, setEquipos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!form.nombre) nuevosErrores.nombre = true;
    if (!form.apellido) nuevosErrores.apellido = true;
    if (!form.email) nuevosErrores.email = true;
    if (!form.telefono) nuevosErrores.telefono = true;
    if (!form.password || form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      nuevosErrores.password = true;
    }
    if (form.password !== form.passwordConfirm) nuevosErrores.passwordConfirm = true;
    if (!form.gameId.match(/^\d{8}$/)) nuevosErrores.gameId = true;
    if (!form.subCodigo.match(/^\d{4}$/)) nuevosErrores.subCodigo = true;
    if (!form.mayorEdad) nuevosErrores.mayorEdad = true;
    if (!form.aceptaTerminos) nuevosErrores.aceptaTerminos = true;
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      setMensaje("❌ Por favor, completa todos los campos obligatorios correctamente.");
      return;
    }

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
        telefono: form.telefono,
        email: form.email,
        password: form.password,
        gameId: form.gameId,
        subCodigo: form.subCodigo,
        descripcion: form.descripcion || "",
        equipo: form.equipo || null,
        juegos: ["Mobile Legends"],
        id_MobileLegends: `${form.gameId} (${form.subCodigo})`,
        roles_MobileLegends: [],
        fotoURL,
        tickets: 0,
        mostrarNombre: false,
        creado: new Date(),
        rol: "usuario"
      });

      setMensaje("✅ Registro exitoso.");
      setForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        password: "",
        passwordConfirm: "",
        gameId: "",
        subCodigo: "",
        descripcion: "",
        equipo: "",
        foto: null,
        mayorEdad: false,
        aceptaTerminos: false,
      });
      setErrores({});
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
          <input
            name="nombre"
            placeholder="Nombre *"
            value={form.nombre}
            onChange={handleChange}
            className={`rjr-input ${errores.nombre ? "error" : ""}`}
          />
          <input
            name="apellido"
            placeholder="Apellido *"
            value={form.apellido}
            onChange={handleChange}
            className={`rjr-input ${errores.apellido ? "error" : ""}`}
          />
        </div>

        <div className="rjr-grid2">
          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono *"
            value={form.telefono}
            onChange={handleChange}
            className={`rjr-input ${errores.telefono ? "error" : ""}`}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico *"
            value={form.email}
            onChange={handleChange}
            className={`rjr-input ${errores.email ? "error" : ""}`}
          />
        </div>

        <div className="rjr-grid2">
          <input
            name="password"
            type="password"
            placeholder="Contraseña *"
            value={form.password}
            onChange={handleChange}
            className={`rjr-input ${errores.password ? "error" : ""}`}
          />
          <input
            name="passwordConfirm"
            type="password"
            placeholder="Repetir contraseña *"
            value={form.passwordConfirm}
            onChange={handleChange}
            className={`rjr-input ${errores.passwordConfirm ? "error" : ""}`}
          />
        </div>
        <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
          La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
        </small>

        <div className="rjr-grid2">
          <input
            name="gameId"
            placeholder="ID MLBB (8 dígitos)"
            value={form.gameId}
            onChange={handleChange}
            pattern="^\d{8}$"
            className={`rjr-input ${errores.gameId ? "error" : ""}`}
          />
          <input
            name="subCodigo"
            placeholder="Código servidor (4 dígitos)"
            value={form.subCodigo}
            onChange={handleChange}
            pattern="^\d{4}$"
            className={`rjr-input ${errores.subCodigo ? "error" : ""}`}
          />
        </div>

        <textarea
          name="descripcion"
          placeholder="Descripción (opcional)"
          value={form.descripcion}
          onChange={handleChange}
          className="rjr-input"
        />

        <select name="equipo" value={form.equipo} onChange={handleChange} className="rjr-input">
          <option value="">Selecciona un equipo (opcional)</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.nombre}>{eq.nombre}</option>
          ))}
        </select>

        <input name="foto" type="file" accept="image/*" onChange={handleChange} className="rjr-input" />

        <div className="rjr-checkboxes">
          <div className="rjr-checkbox-group">
            <input
              type="checkbox"
              name="mayorEdad"
              checked={form.mayorEdad}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="mayorEdad">Declaro que soy mayor de edad</label>
          </div>

          <div className="rjr-checkbox-group">
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={form.aceptaTerminos}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="aceptaTerminos">Acepto los términos y condiciones de uso</label>
          </div>
        </div>

        <button type="submit" className="rjr-btn">Registrarse</button>

        {mensaje && <p className="rjr-msg">{mensaje}</p>}
      </form>
    </section>
  );
}
