export default function Footer() {
    return (
    <footer className="bg-gray-900 text-white text-center py-6 mt-10 border-t border-gray-700">
        <p className="text-sm">&copy; 2025 <span className="font-semibold">EsportsTorneos</span>. Todos los derechos reservados.</p>
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-xs text-gray-300">
        <a href="/terminos" className="hover:text-white transition-colors duration-150 underline">Términos de uso</a>
        <a href="/privacidad" className="hover:text-white transition-colors duration-150 underline">Privacidad</a>
        <a href="mailto:contacto@esportstorneos.com" className="hover:text-white transition-colors duration-150 underline">Contacto</a>
        </div>
    </footer>
    );
}
