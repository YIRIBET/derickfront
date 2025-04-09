import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleList from "./RolesList";
import ModalDialog from "../DialogModal";

const fallbackRoles = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Usuario" },
];

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Obtener roles desde el backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/role/api/")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener roles");
        return res.json();
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => {
        console.error(err);
        setRoles(fallbackRoles);
      });
  }, []);

  // Abrir modal con ID del rol a eliminar
  const openDeleteModal = (id) => {
    setRoleToDelete(id);
    document.getElementById("delete_modal").showModal();
  };

 // Confirmar eliminación de rol
 const confirmDelete = () => {
  if (roleToDelete !== null) {
    fetch(`http://127.0.0.1:8000/role/api/${roleToDelete}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar el rol");
        setRoles(roles.filter((role) => role.id !== roleToDelete));
        setRoleToDelete(null);
        document.getElementById("delete_modal").close();
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Error al eliminar el rol");
        document.getElementById("delete_modal").close();
      });
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Roles</h1>

      <button 
        className="btn bg-orange-400 text-gray-50 btn-wide mb-4"
        onClick={() => navigate("/admin/roles/new")}
      >
        Agregar Rol
      </button>

      <RoleList roles={roles} onDelete={openDeleteModal} />
{/* Modal de confirmación de eliminación */}
<ModalDialog
        id="delete_modal"
        title="¿Eliminar rol?"
        message="¿Estás seguro de que deseas eliminar este rol?"
        type="warning"
        showActions={true}
        onConfirm={confirmDelete}
        onCancel={() => setRoleToDelete(null)}
      />

      {/* Modal de error */}
      {errorMessage && (
        <ModalDialog
          id="error_modal"
          title="Error"
          message={errorMessage}
          type="error"
          showActions={false}
        />
      )}
     
    </div>
  );
};

export default RolesPage;
