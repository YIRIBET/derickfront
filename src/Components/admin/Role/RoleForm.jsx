import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalDialog from "../DialogModal";

const RoleForm = ({ roles, setRoles }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const initialState = { name: "" };
  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('authToken');
  // Si es edición, cargar los datos del rol
  useEffect(() => {
    if (isEditing) {
      const roleToEdit = roles.find(role => role.id === parseInt(id));
      if (roleToEdit) {
        setFormData(roleToEdit);
      }
    }
  }, [id, roles]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar rol
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      fetch(`http://127.0.0.1:8000/role/api/${id}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al guardar los cambios");
          setRoles(roles.map(role => (role.id === parseInt(id) ? formData : role)));
          navigate("/admin/roles");
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Error al guardar los cambios");
        });
    } else {
      fetch("http://127.0.0.1:8000/role/api/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al agregar el rol");
          setRoles([...roles, { ...formData, id: roles.length + 1 }]);
          navigate("/admin/roles");
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Error al agregar el rol");
        });
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? "Editar Rol" : "Nuevo Rol"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="input validator">
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            placeholder="Nombre del Rol"
          />
        </label>

        <button className="btn bg-orange-400 text-gray-50 btn-wide" type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar Rol"}
        </button>
      </form>
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

export default RoleForm;
