import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoleForm = ({ roles, setRoles }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const initialState = { name: "" };
  const [formData, setFormData] = useState(initialState);

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
      setRoles(roles.map(role => (role.id === parseInt(id) ? formData : role)));
    } else {
      setRoles([...roles, { ...formData, id: roles.length + 1 }]);
    }
    navigate("/admin/roles");
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

        <button className="btn btn-primary btn-wide" type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar Rol"}
        </button>
      </form>
    </div>
  );
};

export default RoleForm;
