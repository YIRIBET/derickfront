import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from 'sweetalert2';
import AuthContext from '../../config/context/auth-context';
import AxiosClient from "../../config/http-client/axios-client";

const Menu = () => {
  const API_URL = "menus/api/";
  const RESTAURANTS_URL = "restaurante/api/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const isUserSignedIn = user?.signed || false;

  // Esquema de validación con Yup
  const menuSchema = Yup.object().shape({
    restaurants: Yup.number()
      .required("Restaurante es requerido")
      .test('valid-restaurant', 'Seleccione un restaurante válido', value => {
        return restaurants.some(rest => rest.id === value);
      }),
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .max(50, "Máximo 50 caracteres")
      .required("Nombre es requerido"),
    description: Yup.string()
      .min(10, "Mínimo 10 caracteres")
      .required("Descripción es requerida"),
    start_date: Yup.date()
      .required("Fecha de inicio es requerida")
      .min(new Date(), "La fecha no puede ser en el pasado")
  });

  // Obtener restaurantes disponibles
  const fetchRestaurants = async () => {
    try {
      const response = await AxiosClient.get(RESTAURANTS_URL);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      showErrorAlert("Error", "No se pudieron cargar los restaurantes");
    }
  };

  // Obtener menús
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosClient.get(API_URL);
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      showErrorAlert("Error", "No se pudieron cargar los menús");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar alerta de éxito
  const showSuccessAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  };

  // Mostrar alerta de error
  const showErrorAlert = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  };

  // Mostrar diálogo de confirmación
  const showConfirmDialog = async (title, text) => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  };

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      restaurants: '',
      name: "",
      description: "",
      start_date: new Date().toISOString().split('T')[0]
    },
    validationSchema: menuSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      
      if (!isUserSignedIn) {
        showErrorAlert("Error", "Debe iniciar sesión para realizar esta acción");
        setIsLoading(false);
        return;
      }

      try {
        const method = selectedMenu ? 'PUT' : 'POST';
        const url = selectedMenu ? `${API_URL}${selectedMenu.id}/` : API_URL;

        const data = {
          restaurants: values.restaurants,
          name: values.name,
          description: values.description,
          start_date: values.start_date
        };

        await AxiosClient({
          url,
          method,
          data
        });

        showSuccessAlert(
          selectedMenu ? "¡Menú actualizado!" : "¡Menú creado!",
          selectedMenu 
            ? "El menú ha sido actualizado exitosamente"
            : "El menú ha sido creado exitosamente"
        );
        
        fetchMenus();
        closeModal();
      } catch (error) {
        console.error("Error saving menu:", error);
        showErrorAlert(
          "Error al guardar",
          error.response?.data?.message || "Ocurrió un error al guardar el menú"
        );
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Abrir modal para editar/crear
  const openModal = (menu = null) => {
    if (!isUserSignedIn) {
      showErrorAlert("Error", "Debe iniciar sesión para realizar esta acción");
      return;
    }

    setSelectedMenu(menu);
    if (menu) {
      formik.setValues({
        restaurants: menu.restaurants.id,
        name: menu.name,
        description: menu.description,
        start_date: menu.start_date.split('T')[0]
      });
    } else {
      formik.resetForm();
      formik.setFieldValue('start_date', new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  // Eliminar menú
  const handleDelete = async (id) => {
    const confirmed = await showConfirmDialog(
      "¿Eliminar menú?",
      "Esta acción no se puede deshacer"
    );
    
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await AxiosClient.delete(`${API_URL}${id}/`);
      
      showSuccessAlert(
        "Menú eliminado",
        "El menú ha sido eliminado del sistema"
      );
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      showErrorAlert(
        "Error al eliminar",
        error.response?.data?.message || "No se pudo eliminar el menú"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchRestaurants();
    fetchMenus();
  }, []);

  return (
    <div className="p-4 sm:ml-64 mt-[-40px] ">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Menús disponibles
            </h1>
            <div className="flex justify-center items-center">
              <button
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => openModal()}
                disabled={isLoading}
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
                Agregar menú
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Fecha Inicio</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr
                    key={menu.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {menu.name}
                    </td>
                    <td className="px-6 py-4">{menu.description}</td>
                    <td className="px-6 py-4">
                      {new Date(menu.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(menu)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
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
          )}
        </div>
      </div>

      {/* Modal para formulario */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div className="relative w-full max-w-md max-h-[90vh]">
      <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedMenu ? "Editar Menú" : "Agregar Menú"}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-700 dark:hover:text-white"
            disabled={isLoading}
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Cerrar modal</span>
          </button>
        </div>
        
        {/* Modal body - con scroll */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="restaurants" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Restaurante*</label>
              <select
                id="restaurants"
                name="restaurants"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.restaurants}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                disabled={isLoading}
              >
                <option value="">Seleccione un restaurante</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                ))}
              </select>
              {formik.touched.restaurants && formik.errors.restaurants ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formik.errors.restaurants}</p>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre*</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                disabled={isLoading}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formik.errors.name}</p>
              ) : null}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción*</label>
              <textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                disabled={isLoading}
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formik.errors.description}</p>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Inicio*</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.start_date}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                disabled={isLoading}
              />
              {formik.touched.start_date && formik.errors.start_date ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{formik.errors.start_date}</p>
              ) : null}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200 rounded-b dark:border-gray-700">
              <button 
                type="button" 
                onClick={closeModal} 
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="text-white bg-[#ff6227] hover:bg-[#ff8d62] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
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
                  selectedMenu ? "Actualizar" : "Agregar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Menu;