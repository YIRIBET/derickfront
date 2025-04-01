import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Cliente/Home";
import Menu from "./pages/Cliente/Menu";
import Orders from "./pages/Cliente/Orders";
import Navbar from "./Components/admin/Navbar";
import Tablelist from "./Components/admin/Tablelist";
import ModalForm from "./Components/admin/ModalForm";
import AdminLayout from "./pages/Admin/AdminLayout";
import UsersPage from "./pages/Admin/UsersPage";
import AdminRoutes from "./routes/AdminRoutes";
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas para el cliente */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />

        {/* Rutas para el administrador */}
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}
export default App;
