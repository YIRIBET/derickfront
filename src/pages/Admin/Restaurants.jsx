import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Esquema de validación con Yup
const restaurantSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("Nombre es requerido"),
  address: Yup.string()
    .min(10, "Mínimo 10 caracteres")
    .required("Dirección es requerida"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Solo números")
    .min(7, "Mínimo 7 dígitos")
    .max(15, "Máximo 15 dígitos")
    .required("Teléfono es requerido"),
  description: Yup.string()
    .min(20, "Mínimo 20 caracteres")
    .required("Descripción es requerida"),
  user: Yup.number().required("ID de usuario es requerido"),
  restaurant_image: Yup.mixed()
    .test("is-required", "Logo es requerido", function (value) {
      // "this.parent" accede a los otros valores del formulario
      return !this.parent.isCreating || (value !== undefined && value !== null);
    })
    .test("file-size", "El archivo es muy grande (máx 1MB)", (value) => {
      if (!value) return true; // No hay archivo = válido (para updates)
      return value.size <= 1024 * 1024;
    })
    .test("file-type", "Solo imágenes JPG/PNG", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png"].includes(value.type);
    }),
});

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NjEwNzg3LCJpYXQiOjE3NDQwMDU5ODcsImp0aSI6ImY0NTFlYzI1NWMzZDQ2ZTRhNzRlZjVjYTY2ZTI2MzYxIiwidXNlcl9pZCI6MywiZW1haWwiOiJ1c2VyQGNvcnJlby5jb20iLCJyb2xlIjoiVVNFUiJ9.LAOYeVLTu7c6p9l9LHiBkQqUENlKy3VvuD84gxEFGYw"; // Reemplaza con tu token

  // Datos iniciales del formulario
  const initialValues = {
    id: "",
    name: "",
    address: "",
    phone: "",
    user: "",
    description: "",
    restaurant_image: null,
    isCreating: true,
  };

  // Configuración de Formik
  const formik = useFormik({
    initialValues,
    validationSchema: restaurantSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const method = values.isCreating ? "POST" : "PUT";
        const endpoint = values.isCreating
          ? "http://localhost:8000/restaurante/api/"
          : `http://localhost:8000/restaurante/api/${values.id}/`;

        let imageData = null;
        if (values.restaurant_image) {
          const imageBase64 = await convertFileToBase64(
            values.restaurant_image
          );
          imageData = {
            name: values.restaurant_image.name,
            type: values.restaurant_image.type,
            image_base64: imageBase64,
          };
        }

        const data = {
          name: values.name,
          address: values.address,
          phone: values.phone,
          description: values.description,
          user: values.user,
          ...(values.isCreating && { restaurant_image: imageData }),
          ...(!values.isCreating &&
            imageData && { restaurant_image: imageData }),
        };

        const response = await fetch(endpoint, {
          method,
          headers: {
            Authorization: TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Error en la solicitud");

        const result = await response.json();
        alert(
          values.isCreating
            ? "¡Restaurante creado!"
            : "¡Restaurante actualizado!"
        );
        fetchRestaurants();
        closeModal();
      } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar la solicitud");
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  // Convertir imagen a Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar cambio de imagen
  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("restaurant_image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Obtener restaurantes
  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/restaurante/api/", {
        headers: {
          Authorization: TOKEN,
        },
      });
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para editar
  const openEditModal = (restaurant) => {
    setCurrentRestaurant(restaurant);
    formik.setValues({
      ...restaurant,
      isCreating: false,
      restaurant_image: null,
    });
    setImagePreview(restaurant.image_url || null);
    setIsModalOpen(true);
  };

  // Abrir modal para crear
  const openCreateModal = () => {
    formik.resetForm();
    setCurrentRestaurant(null);
    setImagePreview(null);
    formik.setFieldValue("isCreating", true);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setImagePreview(null);
  };

  // Eliminar restaurante
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este restaurante?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/restaurante/api/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: TOKEN,
            },
          }
        );

        if (response.ok) {
          alert("Restaurante eliminado");
          fetchRestaurants();
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  // Datos para gráficos
  const chartData = {
    labels: restaurants.map((r) => r.name),
    datasets: [
      {
        label: "Restaurantes",
        data: restaurants.map(() => Math.floor(Math.random() * 100) + 50), // Datos de ejemplo
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cargar restaurantes al montar el componente
  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="p-4 sm:ml-64 ">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        {/* Sección de gráficos */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Estadísticas de Restaurantes
            </h3>
            <div className="h-64">
              <Bar
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Tabla de restaurantes */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Lista de Restaurantes
            </h1>
            <button
              className="flex items-center gap-2 bg-black hover:bg-gray-400 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
              onClick={openCreateModal}
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
              Agregar Restaurante
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dirección
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Teléfono
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr
                    key={restaurant.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4">{restaurant.address}</td>
                    <td className="px-6 py-4">{restaurant.phone}</td>
                    <td>
                      {restaurant.restaurant_image ? (
                        <img
                          src={
                            restaurant.restaurant_image.data
                              ? `data:${
                                  restaurant.restaurant_image.content_type ||
                                  "image/jpeg"
                                };base64,${restaurant.restaurant_image.data}`
                              : restaurant.restaurant_image.url ||
                                "/placeholder-image.jpg"
                          }
                          alt={restaurant.name}
                          className="rounded-l w-20 object-cover p-1"
                        />
                      ) : (
                        <div className="rounded-full w-60 h-60 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Sin imagen</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(restaurant)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        title="Editar"
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
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
          )}
        </div>
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
                  {formik.values.isCreating
                    ? "Agregar Nuevo Restaurante"
                    : "Editar Restaurante"}
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
                {/* Campo oculto para ID */}
                {!formik.values.isCreating && (
                  <input type="hidden" name="id" value={formik.values.id} />
                )}

                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Nombre del Restaurante"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.address && formik.errors.address
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Dirección"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.address}
                    </p>
                  ) : null}
                </div>

                {/* Teléfono */}
                <div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Ej: 5551234567"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.phone}
                    </p>
                  ) : null}
                </div>

                {/* ID de Usuario */}
                <div>
                  <input
                    type="number"
                    id="user"
                    name="user"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.user && formik.errors.user
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="ID del usuario asociado"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user}
                  />
                  {formik.touched.user && formik.errors.user ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.user}
                    </p>
                  ) : null}
                </div>

                {/* Logo/Imagen */}
                <div>
                  <label
                    htmlFor="restaurant_image"
                    className="block  text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {formik.values.isCreating
                      ? "Logo (requerido)"
                      : "Logo (opcional)"}
                  </label>
                  <input
                    type="file"
                    id="restaurant_image"
                    name="restaurant_image"
                    accept="image/*"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.restaurant_image &&
                      formik.errors.restaurant_image
                        ? "border-red-500"
                        : ""
                    }`}
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.restaurant_image &&
                  formik.errors.restaurant_image ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.restaurant_image}
                    </p>
                  ) : null}

                  {/* Vista previa de la imagen */}
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">
                        Vista previa:
                      </p>
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="h-20 object-contain rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Descripción del restaurante"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.description}
                    </p>
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
                  ) : formik.values.isCreating ? (
                    "Crear Restaurante"
                  ) : (
                    "Guardar Cambios"
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

export default Restaurants;
