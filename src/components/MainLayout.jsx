// src/components/MainLayout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/footer.css";
import "../styles/navbar.css";
import "../styles/mainlayout.css"; // 👈 nuevo archivo dedicado

export default function MainLayout({ children }) {
  return (
    <div className="lyt-wrapper">
      <Navbar />

      <main className="lyt-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}
