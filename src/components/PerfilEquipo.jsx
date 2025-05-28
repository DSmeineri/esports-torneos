import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/perfilequipo.css";

export default function PerfilEquipo() {
  const [equipo, setEquipo] = useState(undefined);
  const [integranteNuevo, setIntegranteNuevo] = useState({ uid: "", nombre: "" });
  const [mensaje, setMensaje] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", logoURL: "" });
  const [torneos, setTorneos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ victorias: 0, derrotas: 0, empates: 0 });

  const uidActual = supabase.auth.getUser().then(r => r.data.user?.id);

  const esLider = equipo?.creador_uid === uidActual;

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: equipos, error } = await supabase.from("equipos").select("*");

      if (error) return console.error("Error cargando equipos:", error);

      const equipoDoc = equipos.find((eq) =>
        eq.integrantes?.some((i) => i.uid === uidActual)
      );

      if (equipoDoc) {
        setEquipo(equipoDoc);
        setFormEdit({
          nombre: equipoDoc.nombre,
          descripcion: equipoDoc.descripcion || "",
          logoURL: equipoDoc.logo_url || "",
        });
        setEstadisticas({
          victorias: equipoDoc.victorias || 0,
          derrotas: equipoDoc.derrotas || 0,
          empates: equipoDoc.empates || 0,
        });
      } else {
        setEquipo(null);
      }
    };
    uidActual.then(() => cargarDatos());
  }, [uidActual]);

  useEffect(() => {
    const cargarTorneos = async () => {
      if (!equipo) return;

      const { data: torneos, error } = await supabase.from("torneos").select("*");

      if (error) return console.error("Error cargando torneos:", error);

      const filtrados = torneos.filter(t =>
        t.equipos_inscritos?.some(e => e.equipo_id === equipo.id)
      );
      setTorneos(filtrados);
    };

    cargarTorneos();
  }, [equipo]);

  const subirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !equipo) return;

    const filePath = `logosEquipos/${equipo.id}_${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from("public").upload(filePath, archivo);

    if (uploadError) return setMensaje("❌ Error subiendo imagen");

    const { data } = supabase.storage.from("public").getPublicUrl(filePath);
    const logoURL = data.publicUrl;

    await supabase.from("equipos").update({ logo_url: logoURL }).eq("id", equipo.id);
    setEquipo({ ...equipo, logo_url: logoURL });
    setFormEdit((prev) => ({ ...prev, logoURL }));
  };

  const agregarIntegrante = async () => {
    if (!equipo || !integranteNuevo.uid || !integranteNuevo.nombre) return;
    const nuevos = [...(equipo.integrantes || []), integranteNuevo];

    await supabase.from("equipos").update({ integrantes: nuevos }).eq("id", equipo.id);
    setEquipo({ ...equipo, integrantes: nuevos });
    setIntegranteNuevo({ uid: "", nombre: "" });
    setMensaje("✅ Integrante agregado");
  };

  const eliminarIntegrante = async (uid) => {
    const nuevos = equipo.integrantes.filter((i) => i.uid !== uid);
    await supabase.from("equipos").update({ integrantes: nuevos }).eq("id", equipo.id);
    setEquipo({ ...equipo, integrantes: nuevos });
  };

  const salirDelEquipo = async () => {
    const nuevos = equipo.integrantes.filter((i) => i.uid !== uidActual);
    await supabase.from("equipos").update({ integrantes: nuevos }).eq("id", equipo.id);
    setEquipo(null);
  };

  const guardarCambios = async () => {
    await supabase.from("equipos").update({
      nombre: formEdit.nombre,
      descripcion: formEdit.descripcion,
    }).eq("id", equipo.id);
    setEquipo({ ...equipo, ...formEdit });
    setModoEdicion(false);
  };

  if (equipo === undefined) return <p className="text-center mt-10">Cargando equipo...</p>;
  if (equipo === null) return <p className="text-center mt-10">No perteneces a ningún equipo aún.</p>;

  return (
    <div className="peo-container">
      <section className="peo-info">
        <div className="peo-logo-container">
          <img src={equipo.logo_url} alt="Logo del equipo" className="peo-logo" />
          {esLider && (
            <label className="peo-logo-upload">
              Cambiar logo
              <input type="file" accept="image/*" onChange={subirFoto} hidden />
            </label>
          )}
        </div>

        <div className="peo-info-text">
          {modoEdicion && esLider ? (
            <div className="peo-form-edit">
              <input
                type="text"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                placeholder="Nombre del equipo"
              />
              <input
                type="text"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                placeholder="Descripción"
              />
              <div className="peo-edit-btns">
                <button onClick={guardarCambios} className="peo-btn guardar">Guardar</button>
                <button onClick={() => setModoEdicion(false)} className="peo-btn cancelar">Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="peo-nombre">{equipo.nombre}</h2>
              <p className="peo-desc">{equipo.descripcion}</p>
              <p className="peo-tickets">🎫 Tickets del equipo: {equipo.tickets_equipo || 0}</p>
              {esLider && (
                <button onClick={() => setModoEdicion(true)} className="peo-btn editar">Editar información</button>
              )}
            </>
          )}
        </div>
      </section>

      <section className="peo-stats">
        <h3>Estadísticas del equipo</h3>
        <ul>
          <li>🏆 Victorias: <strong>{estadisticas.victorias}</strong></li>
          <li>❌ Derrotas: <strong>{estadisticas.derrotas}</strong></li>
          <li>🤝 Empates: <strong>{estadisticas.empates}</strong></li>
        </ul>
      </section>

      <section className="peo-integrantes">
        <h3>Integrantes</h3>
        <ul>
          {equipo.integrantes?.map((i, idx) => (
            <li key={idx}>
              <span>{i.nombre}</span>
              <span className="uid">
                {i.uid === equipo.creador_uid ? "👑 Líder" : "🎮 Integrante"}
              </span>
              {esLider && i.uid !== uidActual && (
                <button onClick={() => eliminarIntegrante(i.uid)} className="quitar">Quitar</button>
              )}
              {!esLider && i.uid === uidActual && (
                <button onClick={salirDelEquipo} className="quitar">Salir</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {esLider && (
        <section className="peo-agregar">
          <h3>Agregar nuevo integrante</h3>
          <div className="peo-agregar-form">
            <input
              placeholder="UID del jugador"
              value={integranteNuevo.uid}
              onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, uid: e.target.value })}
            />
            <input
              placeholder="Nombre del jugador"
              value={integranteNuevo.nombre}
              onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, nombre: e.target.value })}
            />
          </div>
          <button
            onClick={agregarIntegrante}
            disabled={!integranteNuevo.uid || !integranteNuevo.nombre}
            className="peo-btn agregar"
          >
            Agregar integrante
          </button>
          {mensaje && <p className="peo-msg">{mensaje}</p>}
        </section>
      )}

      <section className="peo-torneos">
        <h3>Torneos inscritos</h3>
        {torneos.length === 0 ? (
          <p>Este equipo aún no está inscrito en torneos.</p>
        ) : (
          <ul>
            {torneos.map((t) => (
              <li key={t.id}>
                🏆 {t.nombre} - {new Date(t.fecha).toLocaleDateString()} - Estado: <strong>{t.estado}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
