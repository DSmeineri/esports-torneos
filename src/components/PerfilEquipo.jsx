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

    useEffect(() => {
    const cargarEquipoDelUsuario = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(collection(db, "equipos"), where("creadorUID", "==", uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
        setEquipo({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
    };
    cargarEquipoDelUsuario();
    }, []);

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

    if (!equipo) return <p className="text-center mt-10">Cargando equipo...</p>;

    return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-4 mb-6">
        {equipo.logoURL && (
            <img
            src={equipo.logoURL}
            alt="Logo del equipo"
            className="w-20 h-20 object-cover rounded-full"
            />
        )}
        <div>
            <h2 className="text-2xl font-bold">{equipo.nombre}</h2>
            <p className="text-sm text-gray-600">{equipo.descripcion}</p>
        </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">Integrantes</h3>
        <ul className="list-disc ml-6 mb-4">
        {equipo.integrantes.map((i, idx) => (
            <li key={idx} className="flex justify-between">
            <span>{i.nombre} ({i.uid})</span>
            {i.uid !== auth.currentUser.uid && (
                <button
                onClick={() => eliminarIntegrante(i.uid)}
                className="text-red-500 text-sm"
                >
                Quitar
                </button>
            )}
            </li>
        ))}
        </ul>

        <h4 className="font-semibold mb-2">Agregar integrante</h4>
        <div className="flex gap-2 mb-4">
        <input
            placeholder="UID"
            value={integranteNuevo.uid}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, uid: e.target.value })}
            className="border p-2 rounded w-1/2"
        />
        <input
            placeholder="Nombre"
            value={integranteNuevo.nombre}
            onChange={(e) => setIntegranteNuevo({ ...integranteNuevo, nombre: e.target.value })}
            className="border p-2 rounded w-1/2"
        />
        </div>
        <button
        onClick={agregarIntegrante}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
        Agregar integrante
        </button>

        {mensaje && <p className="mt-4 text-green-600 text-sm">{mensaje}</p>}
    </div>
    );
}
