import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Cliente/Home";
import Menu from "./pages/Cliente/Menu";
import Orders from "./pages/Cliente/Orders";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-9">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/order/:uuid" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
