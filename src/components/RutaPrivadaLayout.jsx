// src/components/RutaPrivadaLayout.jsx
import React from "react";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./MainLayout";

export default function RutaPrivadaLayout({ children, requireAdmin = false }) {
  return (
    <PrivateRoute requireAdmin={requireAdmin}>
      <MainLayout>{children}</MainLayout>
    </PrivateRoute>
  );
}
