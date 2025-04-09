import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/admin/Sidebar";
import NavbarAdmin from "../../Components/admin/Navbar";
import Dashboard from "./DashboardPage";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavbarAdmin />

        {/* Contenido dinámico */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
