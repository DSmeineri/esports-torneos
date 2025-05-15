import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

export default function PanelTorneos() {
    const [torneos, setTorneos] = useState([]);
    const [miEquipo, setMiEquipo] = useState(null);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
    const cargarTorneosYEquipo = async () => {
        const snapshot = await getDocs(collection(db, "torneos"));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(lista);

      // Buscar el equipo del usuario actual (como creador)
        const equiposSnapshot = await getDocs(collection(db, "equipos"));
        const userUID = auth.currentUser?.uid;
        const equipo = equiposSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(eq => eq.creadorUID === userUID);

        setMiEquipo(equipo || null);
    };

    cargarTorneosYEquipo();
    }, []);

    const inscribirEquipo = async (torneo) => {
    if (!miEquipo) {
        return setMensaje("❌ No tenés un equipo creado.");
    }

    if (miEquipo.integrantes.length < 5) {
        return setMensaje("❌ Tu equipo no cumple con el mínimo de 5 integrantes.");
    }

    if (torneo.equiposInscritos.some(e => e.equipoId === miEquipo.id)) {
        return setMensaje("⚠️ Tu equipo ya está inscrito en este torneo.");
    }

    if (torneo.equiposInscritos.length >= torneo.cupoMaximo) {
        return setMensaje("❌ Este torneo ya alcanzó el cupo máximo.");
    }

    const torneoRef = doc(db, "torneos", torneo.id);
    const actualizados = [...torneo.equiposInscritos, {
        equipoId: miEquipo.id,
        nombre: miEquipo.nombre
    }];
    await updateDoc(torneoRef, { equiposInscritos: actualizados });

    setMensaje("✅ Equipo inscrito correctamente.");
    setTorneos(prev => prev.map(t =>
        t.id === torneo.id ? { ...t, equiposInscritos: actualizados } : t
    ));
    };

    return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Torneos disponibles</h2>

        {mensaje && <p className="mb-4 text-center text-green-600 font-semibold">{mensaje}</p>}

        {torneos.map((torneo) => (
        <div key={torneo.id} className="border p-4 rounded mb-4">
            <h3 className="text-xl font-semibold">{torneo.nombre}</h3>
            <p className="text-sm text-gray-600">Juego: {torneo.juego}</p>
          <p className="text-sm">Fecha: {new Date(torneo.fecha.seconds * 1000).toLocaleString()}</p>
            <p className="text-sm">Cupo: {torneo.equiposInscritos.length} / {torneo.cupoMaximo}</p>
            <p className="text-sm mb-2">Estado: <strong>{torneo.estado}</strong></p>

            <button
            onClick={() => inscribirEquipo(torneo)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Inscribir equipo
            </button>
        </div>
        ))}
    </div>
    );
}
