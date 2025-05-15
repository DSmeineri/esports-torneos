import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Torneos from "../pages/Torneos";
import Noticias from "../pages/Noticias";
import Perfil from "../pages/Perfil";
import Contacto from "../pages/Contacto";

export default function AppRoutes() {
    return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/contacto" element={<Contacto />} />
    </Routes>
    );
}
