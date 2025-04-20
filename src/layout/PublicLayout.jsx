import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./../Components/Navbar"; // Asegúrate de tener el componente Navbar
import Footer from "./../Components/Footer"; // Asegúrate de tener el componente Footer

const PublicLayout = ({ children }) => {
  return (
    <div
      className=""
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar /> {/* El Navbar se incluye al inicio */}
      <div
        className="container p-5  md:pt-[100px] w-full max-w-full"
        style={{ flex: 1 }}
      >
        {" "}
        <Outlet />
      </div>
      <Footer /> {/* El Footer se incluye al final */}
    </div>
  );
};

export default PublicLayout;
