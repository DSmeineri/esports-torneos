import React from "react";

export default function VistaPreviaEstilos() {
    return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">🎨 TailwindCSS activo</h1>
        <p className="text-gray-600">
        Este bloque está estilizado con Tailwind. Si lo ves con bordes, sombra y fondo blanco, ¡funciona!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Botón de prueba
        </button>
        <div className="flex gap-2">
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Etiqueta 1</span>
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Etiqueta 2</span>
        </div>
    </div>
    );
}
