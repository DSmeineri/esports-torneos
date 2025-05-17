import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
        <Navbar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
        </main>

        <Footer />
    </div>
    );
}
