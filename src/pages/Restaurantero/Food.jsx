import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AxiosClient from "../../config/http-client/axios-client";

const Food = () => {
  const API_URL = "food/api/";
  const MENUS_URL = "menus/api/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    menu: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    start_date: new Date().toISOString().split("T")[0],
    existingImage: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrors({});

      try {
        // Obtener menús
        const menusResponse = await AxiosClient.get(MENUS_URL);
        if (Array.isArray(menusResponse.data)) {
          setMenus(menusResponse.data);
        } else {
          throw new Error("Formato de datos inesperado en menús");
        }

        // Obtener comidas
        const foodsResponse = await AxiosClient.get(API_URL);
        if (Array.isArray(foodsResponse.data)) {
          setFoods(foodsResponse.data);
        } else {
          throw new Error("Formato de datos inesperado en comidas");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({
          fetchError: "Error al cargar los datos. Por favor intenta nuevamente.",
        });
        Swal.fire("Error", "Error al cargar los datos", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.menu) newErrors.menu = "Menú es requerido";
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Nombre debe tener al menos 2 caracteres";
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Descripción debe tener al menos 10 caracteres";
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price)) {
      newErrors.price = "Precio debe ser un número";
    } else if (price <= 0) {
      newErrors.price = "Precio debe ser mayor que 0";
    }
    
    const stock = parseInt(formData.stock);
    if (isNaN(stock)) {
      newErrors.stock = "Stock debe ser un número entero";
    } else if (stock < 0) {
      newErrors.stock = "Stock no puede ser negativo";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = (food = null) => {
    if (food) {
      setSelectedFood(food);
      setFormData({
        menu: food.menu,
        name: food.name,
        description: food.description,
        price: food.price.toString(),
        stock: food.stock.toString(),
        image: null,
        start_date: food.start_date?.split("T")[0] || new Date().toISOString().split("T")[0],
        existingImage: food.image,
      });
    } else {
      setSelectedFood(null);
      setFormData({
        menu: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        start_date: new Date().toISOString().split("T")[0],
        existingImage: null,
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderImagePreview = () => {
    if (formData.image instanceof File) {
      return (
        <img
          src={URL.createObjectURL(formData.image)}
          alt="Previsualización de nueva imagen"
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (selectedFood?.image?.data) {
      return (
        <img
          src={`data:${selectedFood.image.type || 'image/jpeg'};base64,${selectedFood.image.data}`}
          alt={`Imagen de ${selectedFood.name}`}
          className="w-full h-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No hay imagen disponible</p>
      </div>
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
      const method = selectedFood ? "patch" : "post";
      const url = selectedFood ? `${API_URL}${selectedFood.id}/` : API_URL;
  
      // 1. Preparar los datos básicos
      const requestData = {
        menu: formData.menu,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        start_date: formData.start_date
      };
  
      // 2. Manejo especial para la imagen
      if (formData.image instanceof File) {
        // Caso 1: Hay una nueva imagen seleccionada
        const imageBase64 = await convertFileToBase64(formData.image);
        requestData.image = {
          name: formData.image.name,
          type: formData.image.type,
          image_base64: imageBase64
        };
      } else if (selectedFood?.image) {
        // Caso 2: Estamos editando y no se cambió la imagen
        // Enviamos solo la referencia a la imagen existente
        requestData.image_id = selectedFood.image.id;
      }
      // Caso 3: No hay imagen (creación sin imagen) - no hacemos nada
  
      // 3. Enviar la solicitud
      const response = await AxiosClient[method](url, requestData);
  
      // 4. Actualizar el estado
      const updatedResponse = await AxiosClient.get(API_URL);
      setFoods(updatedResponse.data);
  
      // 5. Cerrar modal y mostrar confirmación
      closeModal();
      Swal.fire({
        icon: 'success',
        title: selectedFood ? '¡Comida actualizada!' : '¡Comida creada!',
        text: selectedFood ? 'Los cambios se guardaron correctamente' : 'Nueva comida añadida al menú',
        showConfirmButton: false,
        timer: 1500
      });
  
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error);
      
      // Manejo de errores mejorado
      let errorMessage = "Error al procesar la solicitud";
      if (error.response?.data) {
        if (error.response.data.image) {
          errorMessage = `Error en la imagen: ${Array.isArray(error.response.data.image) 
            ? error.response.data.image.join(', ') 
            : error.response.data.image}`;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#3085d6',
      });
    }
  };
  
  // Función para convertir imagen a base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await AxiosClient.delete(`${API_URL}${id}/`);
      setFoods((prev) => prev.filter((food) => food.id !== id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "La comida ha sido eliminada",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting food:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-64 mt-[-40px]">
        <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Comidas disponibles
              </h1>
              <button
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200"
                onClick={() => openModal()}
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
                Agregar comida
              </button>
            </div>

            {errors.fetchError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.fetchError}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : foods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay comidas disponibles</p>
                <button
                  onClick={() => openModal()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Agregar primera comida
                </button>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Menú
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Imagen
                    </th>
                   
                    <th scope="col" className="px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => {
                    const menu = menus.find((m) => m.id === food.menu);
                    return (
                      <tr
                        key={food.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {menu ? menu.name : "Menú no encontrado"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {food.name}
                        </td>
                        <td className="px-6 py-4">{food.description}</td>
                        <td className="px-6 py-4">${food.price}</td>
                        <td className="px-6 py-4">{food.stock}</td>
                        <td className="px-6 py-4">
                          {food.image?.data ? (
                            <img
                              src={`data:${food.image.type || 'image/jpeg'};base64,${food.image.data}`}
                              alt={food.name}
                              className="w-20 h-15 object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500">
                                No hay imagen disponible
                              </p>
                            </div>
                          )}
                        </td>
                       
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => openModal(food)}
                            className="font-medium text-blue-600 hover:underline mr-3"
                            title="Editar"
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
                            onClick={() => handleDelete(food.id)}
                            className="font-medium text-red-600 hover:underline"
                            title="Eliminar"
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
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div className="relative w-full max-w-md max-h-[90vh]">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedFood ? "Editar Comida" : "Agregar Comida"}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Cerrar modal</span>
          </button>
        </div>
        
        {/* Modal body - con scroll */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Menú*</label>
              <select
                name="menu"
                value={formData.menu}
                onChange={handleInputChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                  errors.menu ? "border-red-500 dark:border-red-500" : ""
                }`}
              >
                <option value="">Selecciona un menú</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
              {errors.menu && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.menu}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                  errors.name ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                  errors.description ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                    errors.price ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stock*</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                    errors.stock ? "border-red-500 dark:border-red-500" : ""
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Imagen {selectedFood && "(opcional)"}
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <div className="mt-2 w-full h-40 border border-gray-300 rounded-lg overflow-hidden">
                {renderImagePreview()}
              </div>
            </div>

            

            {/* Modal footer */}
            <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200 rounded-b dark:border-gray-700">
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-white bg-[#ff6227] hover:bg-[#ff8d62] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {selectedFood ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Food;