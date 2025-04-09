import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../DialogModal"; 

const UsersList = ({ users, onDelete }) => {
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState(null);

  const openModal = (user) => {
    setUserToDelete(user);
    document.getElementById("delete_user_modal").showModal();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4">
        <table className="table">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover">
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-primary mr-2"
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => openModal(user)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Modal de confirmación de eliminación */}
       <ModalDialog
        id="delete_user_modal"
        title="¿Eliminar usuario?"
        message={`¿Estás seguro de que deseas eliminar a ${userToDelete?.name}?`}
        type="warning"
        showActions={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </>
  );
};

export default UsersList;
