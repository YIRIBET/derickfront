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
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      fetch("http://127.0.0.1:8000/users/api/")
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


    const openDeleteModal = (id) => {
      setUserToDelete(id);
      document.getElementById('delete_modal').showModal();
    };
  
    const confirmDelete = () => {
      if (userToDelete !== null) {
        setUsers(users.filter(user => user.id !== userToDelete));
        setUserToDelete(null);
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

        <UsersList users={users} onDelete={openDeleteModal} />

        {/* Modal de confirmación */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">¿Eliminar usuario?</h3>
          <p className="py-4">¿Estás seguro de que deseas eliminar este usuario?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn" onClick={() => setUserToDelete(null)}>Cancelar</button>
              <button className="btn btn-error" onClick={confirmDelete}>Eliminar</button>
            </form>
          </div>
        </div>
      </dialog>
      </div>
    );
  };

  export default UsersPage;
