  import React, { useState, useEffect } from "react";
  import UsersList from "../../Components/admin/User/UsersList";
  import { useNavigate } from "react-router-dom";


  const initialUsers = [
    { id: 1, name: "Carlos López", role: "Administrador", email: "carlos@example.com" },
    { id: 2, name: "María Rodríguez", role: "Editor", email: "maria@example.com" },
    { id: 3, name: "Luis Pérez", role: "Usuario", email: "luis@example.com" },
  ];

  const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      fetch("http://localhost:8000/users/api/")
        .then((res) => {
          if (!res.ok) {
            throw new Error("No se pudo obtener la lista de usuarios");
          }
          return res.json();
        })
        .then((data) => {
          // Puedes adaptar esto si los datos del backend no vienen ya formateados
          const formattedUsers = data.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role === 1 ? "Administrador" : user.role === 2 ? "Editor" : "Usuario",
            email: user.email
          }));
          setUsers(formattedUsers);
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error.message);
          setUsers(initialUsers);
        });
    }, []);

    const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:8000/users/api/${id}/`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          // Eliminar el usuario de la lista localmente después de eliminarlo en el backend
          setUsers(users.filter((user) => user.id !== id));
        } else {
          throw new Error("Error al eliminar el usuario");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
      }
    };

  

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>

        {/* Botón para agregar usuarios */}
        <button 
          className="btn bg-orange-400 text-gray-50 btn-wide mb-4"
          onClick={() => navigate("new")}
        >
          Agregar Usuario
        </button>

        <UsersList users={users} onDelete={handleDelete} />

      </div>
    );
  };

  export default UsersPage;
