// src/components/AdminLayout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/adminlayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Navbar />
      <main className="admin-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
