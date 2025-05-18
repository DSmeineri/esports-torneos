import React from "react";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "./MainLayout";

export default function RutaPrivadaLayout({ children }) {
  return (
    <PrivateRoute>
      <MainLayout>{children}</MainLayout>
    </PrivateRoute>
  );
}
