import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DialogModal from "../DialogModal"; // Ajusta el path según tu estructura

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;

  const [formData, setFormData] = useState({
    name: "",
    role: 2,
    email: "",
    password: "",
    startDate: "",
    status: true,
  });

  const [modalInfo, setModalInfo] = useState({ show: false, title: "", message: "", variant: "success" });

  useEffect(() => {
    if (isEditing) {
      fetch(`http://127.0.0.1:8000/users/api/${id}/`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(() =>
          setModalInfo({
            show: true,
            title: "Error",
            message: "No se pudo cargar el usuario.",
            variant: "error",
          })
        );
    }
  }, [id]);

  useEffect(() => {
    if (modalInfo.show) {
      const modal = document.getElementById("dialog_user");
      if (modal) modal.showModal();
    }
  }, [modalInfo.show]);

  useEffect(() => {
    if (!isEditing) {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 16); // formato para datetime-local
      setFormData((prevData) => ({
        ...prevData,
        startDate: formattedDate,
      }));
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/users/api/", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      setModalInfo({
        show: true,
        title: isEditing ? "Usuario actualizado" : "Usuario creado",
        message: isEditing ? "El usuario ha sido actualizado correctamente." : "El usuario ha sido creado correctamente.",
        variant: "success",
      });

    } catch (error) {
      setModalInfo({
        show: true,
        title: "Error",
        message: "Hubo un error al guardar el usuario.",
        variant: "error",
      });
    }
  };

  return (
    <>
          <form onSubmit={handleSubmit} className="p-6 bg-base-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h2>

      {/* Nombre */}
      <label className="input validator mb-4">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          name="nombre"
          required
          placeholder="Nombre Completo"
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,50}"
          minLength="3"
          maxLength="50"
          title="Solo letras y espacios, entre 3 y 50 caracteres"
          value={formData.nombre}
          onChange={handleChange}
        />
      </label>
      <p className="validator-hint">
        Debe tener entre 3 y 50 caracteres y solo contener letras.
      </p>

      {/* Rol */}
      <label className="input validator mb-4">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M5 10h14M5 14h14"></path>
          </g>
        </svg>
        <select
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="" disabled>Selecciona un rol</option>
          <option value="1">Administrador</option>
          <option value="2">Editor</option>
          <option value="3">Usuario</option>
        </select>
      </label>
      <p className="validator-hint">Elige un rol para el usuario.</p>

      {/* Correo Electrónico */}
      <label className="input validator mb-4">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <p className="validator-hint hidden">Ingrese una dirección de correo válida.</p>

{/* Contraseña */}
<label className="input validator mb-4">
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <p className="validator-hint hidden">Ingrese una contraseña válida.</p>

   

      {/* Estado */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={handleChange}
        />
        <span>Activo</span>
      </label>

      {/* Botón de Envío */}
      <button className="btn bg-orange-400 text-gray-50 btn-wide" type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
    </form>

    {modalInfo.show && (
  <DialogModal
    id="dialog_user"
    title={modalInfo.title}
    message={modalInfo.message}
    variant={modalInfo.variant}
    onClose={() => {
      setModalInfo({ ...modalInfo, show: false });
      if (modalInfo.variant === "success") navigate("/admin/users");
    }}
  />
)}
      <script>
        {modalInfo.show && `document.getElementById('dialog_user')?.showModal()`}
      </script>
    </>
  );
};

export default UserForm;
