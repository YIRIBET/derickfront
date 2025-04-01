import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleList from "./RolesList";

const initialRoles = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Usuario" },
];

const RolesPage = () => {
  const [roles, setRoles] = useState(initialRoles);
  const navigate = useNavigate();

  // Función para eliminar un rol
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este rol?");
    if (confirmDelete) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Roles</h1>

      {/* Botón para agregar rol */}
      <button 
        className="btn btn-primary btn-wide mb-4"
        onClick={() => navigate("/admin/roles/new")}
      >
        Agregar Rol
      </button>

      <RoleList roles={roles} onDelete={handleDelete} />
    </div>
  );
};

export default RolesPage;
