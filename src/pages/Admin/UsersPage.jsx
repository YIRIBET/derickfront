import React, { useState } from "react";
import UsersList from "../../Components/admin/User/UsersList";
import { useNavigate } from "react-router-dom";


const initialUsers = [
  { id: 1, name: "Carlos López", role: "Administrador", email: "carlos@example.com" },
  { id: 2, name: "María Rodríguez", role: "Editor", email: "maria@example.com" },
  { id: 3, name: "Luis Pérez", role: "Usuario", email: "luis@example.com" },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirmDelete) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>

      {/* Botón para agregar usuarios */}
      <button 
        className="btn btn-primary btn-wide mb-4"
        onClick={() => navigate("new")}
      >
        Agregar Usuario
      </button>

      <UsersList users={users} onDelete={handleDelete} />
    </div>
  );
};

export default UsersPage;
