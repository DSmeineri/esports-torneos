import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore";

export default function AdminEquipos() {
    const [nombreEquipo, setNombreEquipo] = useState("");
    const [equipos, setEquipos] = useState([]);
    const [nuevoIntegrante, setNuevoIntegrante] = useState({ uid: "", nombre: "" });
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    useEffect(() => {
    cargarEquipos();
    }, []);

    const cargarEquipos = async () => {
    const snapshot = await getDocs(collection(db, "equipos"));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEquipos(lista);
    };

    const crearEquipo = async (e) => {
    e.preventDefault();
    if (!nombreEquipo) return;
    await addDoc(collection(db, "equipos"), {
        nombre: nombreEquipo,
        integrantes: [],
    });
    setNombreEquipo("");
    cargarEquipos();
    };

    const agregarIntegrante = async () => {
    if (!nuevoIntegrante.uid || !nuevoIntegrante.nombre || !equipoSeleccionado) return;
    const equipoRef = doc(db, "equipos", equipoSeleccionado.id);
    const nuevos = [...equipoSeleccionado.integrantes, nuevoIntegrante];
    await updateDoc(equipoRef, { integrantes: nuevos });
    setNuevoIntegrante({ uid: "", nombre: "" });
    cargarEquipos();
    };

    return (
    <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Administrar Equipos</h2>

        <form onSubmit={crearEquipo} className="mb-6 flex gap-2">
        <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Crear Equipo
        </button>
        </form>

        <h3 className="text-xl font-semibold mb-2">Equipos existentes</h3>
        <ul className="space-y-4">
        {equipos.map((eq) => (
            <li key={eq.id} className="border p-4 rounded bg-white">
            <div className="flex justify-between items-center">
                <strong>{eq.nombre}</strong>
                <button
                onClick={() => setEquipoSeleccionado(eq)}
                className="text-blue-600 underline"
                >
                Administrar
                </button>
            </div>
            {eq.integrantes?.length > 0 && (
                <ul className="ml-4 mt-2 list-disc text-sm">
                {eq.integrantes.map((intg, i) => (
                    <li key={i}>{intg.nombre} ({intg.uid})</li>
                ))}
                </ul>
            )}
            </li>
        ))}
        </ul>

        {equipoSeleccionado && (
        <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-bold mb-2">
            Agregar integrante a <span className="text-blue-700">{equipoSeleccionado.nombre}</span>
            </h4>
            <div className="flex gap-2 mb-4">
            <input
                type="text"
                placeholder="UID del jugador"
                value={nuevoIntegrante.uid}
                onChange={(e) =>
                setNuevoIntegrante({ ...nuevoIntegrante, uid: e.target.value })
                }
                className="border p-2 rounded w-1/2"
            />
            <input
                type="text"
                placeholder="Nombre del jugador"
                value={nuevoIntegrante.nombre}
                onChange={(e) =>
                setNuevoIntegrante({ ...nuevoIntegrante, nombre: e.target.value })
                }
                className="border p-2 rounded w-1/2"
            />
            </div>
            <button
            onClick={agregarIntegrante}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            >
            Agregar Integrante
            </button>
        </div>
        )}
    </div>
    );
}
