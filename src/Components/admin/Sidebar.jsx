import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MdDashboard, MdPeople, MdRestaurant, MdOutlineSell, MdSecurity } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`h-screen  bg-blue-200 ${isOpen ? "w-64" : "w-20"} transition-all duration-300 p-4 flex flex-col`}>
      {/* Botón para expandir/cerrar */}
      <button 
        className="btn btn-square btn-ghost mb-4 self-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* Menú de navegación */}
      <ul className="menu p-0 space-y-2">
        <li>
          <Link to="/admin/" className="flex items-center gap-2">
            <MdDashboard size={24} /> {isOpen && "Dashboard"}
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center gap-2">
            <MdPeople size={24} /> {isOpen && "Usuarios"}
          </Link>
        </li>
        <li>
          <Link to="/admin/roles" className="flex items-center gap-2">
            <MdSecurity size={24} /> {isOpen && "Roles"}
          </Link>
        </li>
        <li>
          <Link to="/admin/restaurants" className="flex items-center gap-2">
            <MdRestaurant size={24} /> {isOpen && "Restaurantes"}
          </Link>
        </li>
        <li>
          <Link to="/admin/sales" className="flex items-center gap-2">
            <MdOutlineSell size={24} /> {isOpen && "Ventas"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
