export default function Footer() {
    return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-10">
        <p>&copy; 2025 EsportsTorneos. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
        <a href="/terminos" className="underline">Términos de uso</a>
        <a href="/privacidad" className="underline">Privacidad</a>
        <a href="mailto:contacto@esportstorneos.com" className="underline">Contacto</a>
        </div>
    </footer>
    );
}
