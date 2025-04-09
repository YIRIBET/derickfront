import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Cliente/Home";
import Menu from "./pages/Cliente/Menu";
//import Menus from "./pages/Restaurantero/Menu";
import Orders from "./pages/Cliente/Orders";
import Navbar from "./Components/admin/Navbar";
import Tablelist from "./Components/admin/Tablelist";
import ModalForm from "./Components/admin/ModalForm";
import AdminLayout from "./pages/Admin/AdminLayout";
import UsersPage from "./pages/Admin/UsersPage";
import AdminRoutes from "./routes/AdminRoutes";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Cart from "./Components/Cart"
import Profile from "./pages/Cliente/Profile";
import Login from "./Components/Login"
import Register from "./Components/Register";
import Food from "./pages/Cliente/Food";
import Dashboard from "./pages/Restaurantero/Dashbord";



function App() {
  return (
    <Router>
      <Navbar />
     
      <div className="pt-14">

      <Routes>
    
     {/* Rutas para el cliente */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />

        {/* Rutas para el administrador */}
        <Route path="/*" element={<AdminRoutes />} />
          
          
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element ={<Register/>}/>
          <Route path="/Menu/:id" element={<Menu />} />
          <Route path="/dashbord" element={<Dashboard />} />
          {/*<Route path="/menus" element={<Menus />} />*/}
          <Route path="/food" element={<Food />} />
          <Route path="/order" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/perfil" element={<Profile/>}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
export default App;
