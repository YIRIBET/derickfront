import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RoleBadge from "./Role"

// Token fijo de autenticación (REEMPLAZA ESTO CON TU TOKEN REAL)
const FIXED_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0ODIzMzQzLCJpYXQiOjE3NDQyMTg1NDMsImp0aSI6IjNkNDIzOTFlY2M4MjQyZjhiNjQyNTcwNzVmNTNhM2JkIiwidXNlcl9pZCI6MiwiZW1haWwiOiJhZG1pbkBjb3JyZW8uY29tIiwicm9sZSI6IkFETUlOIn0.GKgEPig34_tlsWK83mgeE1-V7pFbtTThN-8O6ZPL8bE";

// Esquema de validación con Yup
const userSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email inválido")
    .required("Email es requerido"),
  name: Yup.string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("Nombre es requerido"),
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .required("Contraseña es requerida"),
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("USER"); // 'ADMIN', 'RESTAURANT_OWNER', 'USER'

  // Datos iniciales del formulario
  const initialValues = {
    id: "",
    email: "",
    name: "",
    password: "",
    isCreating: true,
  };

  // Función para llamadas API con el token fijo
  const apiRequest = async (url, method = "GET", body = null) => {
    const headers = {
      "Authorization": FIXED_TOKEN,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error en la solicitud");
    }

    return await response.json();
  };

  // Configuración de Formik
  const formik = useFormik({
    initialValues,
    validationSchema: userSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        let endpoint = "";
        
        // Determinar el endpoint según el tipo de usuario
        switch(userType) {
          case "ADMIN":
            endpoint = "http://127.0.0.1:8000/users/api/admin/save/";
            break;
          case "RESTAURANT_OWNER":
            endpoint = "http://127.0.0.1:8000/users/api/restaurant_owner/save/";
            break;
          case "USER":
          default:
            endpoint = "http://127.0.0.1:8000/users/api/user/save/";
        }

        const data = {
          email: values.email,
          name: values.name,
          password: values.password,
        };

        await apiRequest(endpoint, "POST", data);
        alert(`¡Usuario ${userType.toLowerCase()} creado con éxito!`);
        fetchUsers();
        closeModal();
      } catch (error) {
        console.error("Error:", error);
        alert(error.message || "Error al procesar la solicitud");
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  // Obtener usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest("http://127.0.0.1:8000/users/api/");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await apiRequest(
          `http://127.0.0.1:8000/users/api/${id}/`,
          "DELETE"
        );
        alert("Usuario eliminado");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Abrir modal para crear
  const openCreateModal = (type) => {
    setUserType(type);
    formik.resetForm();
    setCurrentUser(null);
    formik.setFieldValue("isCreating", true);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
  };

  // Datos para gráficos
 
  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        {/* Botones para crear diferentes tipos de usuarios */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Lista de Usuarios
          </h1>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
              onClick={() => openCreateModal("ADMIN")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Nuevo Admin
            </button>
            <button
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
              onClick={() => openCreateModal("RESTAURANT_OWNER")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Nuevo Restaurantero
            </button>
            <button
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
              onClick={() => openCreateModal("USER")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Tabla de usuarios */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        title="Eliminar"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <form
              onSubmit={formik.handleSubmit}
              className="relative bg-white rounded-lg shadow dark:bg-gray-700"
            >
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {`Agregar Nuevo ${userType === "ADMIN" ? "Administrador" : userType === "RESTAURANT_OWNER" ? "Restaurantero" : "Usuario"}`}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.email && formik.errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Email del usuario"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  ) : null}
                </div>

                {/* Nombre */}
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.name && formik.errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Nombre"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  ) : null}
                </div>

                {/* Contraseña */}
                <div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.password && formik.errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Contraseña"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    `Crear ${userType === "ADMIN" ? "Administrador" : userType === "RESTAURANT_OWNER" ? "Restaurantero" : "Usuario"}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;