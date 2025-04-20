import React, { useState, useEffect } from "react";

const Food = () => {
  const API_URL = "http://127.0.0.1:8000/food/api/";
  const MENUS_URL = "http://127.0.0.1:8000/menus/api/"; // Nueva URL para obtener menús
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);
  const [menus, setMenus] = useState([]); // Estado para almacenar los menús
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    menu: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    start_date: new Date().toISOString().split('T')[0]
  });

  // Hardcodeado para pruebas - deberías mover esto a variables de entorno
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1Njk2NDQzLCJpYXQiOjE3NDUwOTE2NDMsImp0aSI6IjJkNmMyZGVhMDhlMjQyNzVhZGYwMGVlODQzY2I5NmFkIiwidXNlcl9pZCI6Miwicm9sZSI6IlVTRVIifQ.Ob2mj-F20EkmiR_c9sqPb9v0oLcskWpmfw1VYF32UuY";
  };

  // Fetch foods and menus from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener menús primero
        const menusResponse = await fetch(MENUS_URL, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });
        
        if (!menusResponse.ok) throw new Error('Error al cargar los menús');
        const menusData = await menusResponse.json();
        setMenus(menusData);
        
        // Obtener comidas
        const foodsResponse = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });
        
        if (!foodsResponse.ok) throw new Error('Error al cargar las comidas');
        const foodsData = await foodsResponse.json();
        setFoods(foodsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nombre es requerido";
    if (!formData.description) newErrors.description = "Descripción es requerida";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Precio válido es requerido";
    if (!formData.stock || isNaN(formData.stock)) newErrors.stock = "Stock válido es requerido";
    if (!formData.menu) newErrors.menu = "Debes seleccionar un menú";
    
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
        price: food.price,
        stock: food.stock,
        image: null, // Resetear la imagen para evitar problemas
        start_date: food.start_date.split('T')[0],
        existingImage: food.image // Guardamos la imagen existente por si no se cambia
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
        start_date: new Date().toISOString().split('T')[0],
        existingImage: null
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
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const url = selectedFood ? `${API_URL}${selectedFood.id}/` : API_URL;
      const method = selectedFood ? 'PUT' : 'POST';

      // Preparamos los datos para enviar
      const data = {
        menu: formData.menu,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        start_date: formData.start_date
      };

      // Manejo de imágenes:
      // 1. Si hay una imagen nueva, la convertimos y enviamos
      // 2. Si estamos editando y no hay imagen nueva, mantenemos la existente
      // 3. Si estamos creando y no hay imagen, no enviamos nada
      if (formData.image) {
        const imageBase64 = await convertFileToBase64(formData.image);
        data.image = {
          name: formData.image.name,
          type: formData.image.type,
          image_base64: imageBase64
        };
      } else if (selectedFood && formData.existingImage) {
        // Si estamos editando y no se cambió la imagen, mantenemos la existente
        data.image = formData.existingImage;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar los datos");
      }

      // Actualizamos la lista
      const updatedResponse = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      const updatedData = await updatedResponse.json();
      setFoods(updatedData);
      closeModal();
    } catch (error) {
      console.error("Error saving food:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta comida?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setFoods(foods.filter(food => food.id !== id));
    } catch (error) {
      console.error("Error deleting food:", error);
      alert(error.message);
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar comida
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Menú</th>
                    <th scope="col" className="px-6 py-3">Nombre</th>
                    <th scope="col" className="px-6 py-3">Descripción</th>
                    <th scope="col" className="px-6 py-3">Precio</th>
                    <th scope="col" className="px-6 py-3">Stock</th>
                    <th scope="col" className="px-6 py-3">Imagen</th>
                    <th scope="col" className="px-6 py-3">Fecha Inicio</th>
                    <th scope="col" className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => {
                    // Buscamos el menú correspondiente para mostrar su nombre
                    const menu = menus.find(m => m.id === food.menu);
                    return (
                      <tr key={food.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{menu ? menu.name : 'Menú no encontrado'}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {food.name}
                        </td>
                        <td className="px-6 py-4">{food.description}</td>
                        <td className="px-6 py-4">${food.price}</td>
                        <td className="px-6 py-4">{food.stock}</td>
                        <td className="px-6 py-4">
                          {food.image ? (
                            <img
                              src={`data:${food.image.type};base64,${food.image.data}`}
                              alt={food.name}
                              className="w-20 h-15 object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                              Sin imagen
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(food.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedFood ? "Editar Comida" : "Agregar Comida"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="menu" className="block text-sm font-medium text-gray-700">
                  Menú*
                </label>
                <select
                  id="menu"
                  name="menu"
                  value={formData.menu}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                    errors.menu ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                >
                  <option value="">Seleccione un menú</option>
                  {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                  ))}
                </select>
                {errors.menu && <p className="mt-1 text-sm text-red-600">{errors.menu}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                    errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  rows="3"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Precio*
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                      errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock*
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                      errors.stock ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                  {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Imagen {selectedFood && "(opcional)"}
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedFood && formData.existingImage && !formData.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Imagen actual: {formData.existingImage.name || "Imagen del menú"}
                  </p>
                )}
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Nueva imagen seleccionada: {formData.image.name}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  {selectedFood ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Food;