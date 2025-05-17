import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
} from "firebase/firestore";

export default function PerfilEquipo() {
    const [equipo, setEquipo] = useState(null);
    const [integranteNuevo, setIntegranteNuevo] = useState({ uid: "", nombre: "" });
    const [mensaje, setMensaje] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", logoURL: "" });
    const [torneos, setTorneos] = useState([]);

    useEffect(() => {
    const cargarDatos = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(collection(db, "equipos"), where("creadorUID", "==", uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
        const equipoData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setEquipo(equipoData);
        setFormEdit({
            nombre: equipoData.nombre,
            descripcion: equipoData.descripcion || "",
            logoURL: equipoData.logoURL || "",
        });
        }
    };
    cargarDatos();
    }, []);

    useEffect(() => {
    const cargarTorneos = async () => {
        if (!equipo) return;
        const snap = await getDocs(collection(db, "torneos"));
        const filtrados = snap.docs
        .filter(doc => doc.data().equiposInscritos?.some(e => e.equipoId === equipo.id))
        .map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(filtrados);
    };
    cargarTorneos();
    }, [equipo]);

    const agregarIntegrante = async () => {
    if (!equipo || !integranteNuevo.uid || !integranteNuevo.nombre) return;
    const equipoRef = doc(db, "equipos", equipo.id);
    const nuevosIntegrantes = [...equipo.integrantes, integranteNuevo];
    await updateDoc(equipoRef, { integrantes: nuevosIntegrantes });
    setEquipo({ ...equipo, integrantes: nuevosIntegrantes });
    setIntegranteNuevo({ uid: "", nombre: "" });
    setMensaje("✅ Integrante agregado");
    };

    const eliminarIntegrante = async (uid) => {
    if (!equipo) return;
    const nuevos = equipo.integrantes.filter(i => i.uid !== uid);
    const equipoRef = doc(db, "equipos", equipo.id);
    await updateDoc(equipoRef, { integrantes: nuevos });
    setEquipo({ ...equipo, integrantes: nuevos });
    };

    const guardarCambios = async () => {
    const equipoRef = doc(db, "equipos", equipo.id);
    await updateDoc(equipoRef, {
        nombre: formEdit.nombre,
        descripcion: formEdit.descripcion,
        logoURL: formEdit.logoURL
    });
    setEquipo({ ...equipo, ...formEdit });
    setModoEdicion(false);
    };

    if (!equipo) return <p className="text-center mt-10">Cargando equipo...</p>;

    return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-10">
      {/* Información del equipo */}
        <section className="flex items-start gap-6">
        {equipo.logoURL && (
            <img
            src={equipo.logoURL}
            alt="Logo del equipo"
            className="w-24 h-24 object-cover rounded-full border shadow"
            />
        )}
        <div className="flex-1">
            {modoEdicion ? (
            <div className="space-y-2">
                <input
                type="text"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="Nombre del equipo"
                />
                <input
                type="text"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="Descripción"
                />
                <input
                type="text"
                value={formEdit.logoURL}
                onChange={(e) => setFormEdit({ ...formEdit, logoURL: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="URL del logo"
                />
                <div className="flex gap-2 mt-2">
                <button onClick={guardarCambios} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
                <button onClick={() => setModoEdicion(false)} className="text-gray-500 hover:underline">Cancelar</button>
                </div>
            </div>
            ) : (
            <>
                <h2 className="text-2xl font-bold text-gray-800">{equipo.nombre}</h2>
                <p className="text-sm text-gray-600">{equipo.descripcion}</p>
                <button onClick={() => setModoEdicion(true)} className="mt-2 text-sm text-blue-600 hover:underline">Editar información</button>
            </>
            )}
        </div>
        </section>

      {/* Lista de integrantes */}
        <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Integrantes</h3>
        <ul className="divide-y divide-gray-200">
            {equipo.integrantes.map((i, idx) => (
            <li key={idx} className="py-2 flex justify-between items-center text-sm">
                <span>{i.nombre} <span className="text-gray-400">({i.uid})</span></span>
                {i.uid !== auth.currentUser.uid && (
                <button
                    onClick={() => eliminarIntegrante(i.uid)}
                    className="text-red-500 hover:underline"
                >
                    Quitar
                </button>
                )}
            </li>
            ))}
        </ul>
        </section>

      {/* Agregar nuevo integrante */}
        <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Agregar nuevo integrante</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
            placeholder="UID del jugador"
            value={integranteNuevo.uid}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, uid: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
            />
            <input
            placeholder="Nombre del jugador"
            value={integranteNuevo.nombre}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, nombre: e.target.value })}
            className="border border-gray-300 p-2 rounded-md"
            />
        </div>
        <button
            onClick={agregarIntegrante}
            disabled={!integranteNuevo.uid || !integranteNuevo.nombre}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            Agregar integrante
        </button>
        {mensaje && <p className="mt-2 text-green-600 text-sm">{mensaje}</p>}
        </section>

      {/* Historial de torneos */}
        <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Torneos inscritos</h3>
        {torneos.length === 0 ? (
            <p className="text-sm text-gray-500">Este equipo aún no está inscrito en torneos.</p>
        ) : (
            <ul className="space-y-1 list-disc ml-6 text-sm text-gray-700">
            {torneos.map((t) => (
                <li key={t.id}>
                🏆 {t.nombre} - {new Date(t.fecha.seconds * 1000).toLocaleDateString()} - Estado: <span className="font-semibold">{t.estado}</span>
                </li>
            ))}
            </ul>
        )}
        </section>
    </div>
    );
}
