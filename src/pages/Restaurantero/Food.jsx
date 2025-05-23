import React, { useState, useEffect } from "react";

const Food = () => {
  const API_URL = "http://127.0.0.1:8000/food/api/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    menu: 1,
    name: "",
    description: "",
    price: "",
    image: "",
    start_date: new Date().toISOString()
  });

  // Hardcodeado para pruebas
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NjAzNjA0LCJpYXQiOjE3NDM5OTg4MDQsImp0aSI6ImFlYjYyNzViZTFkNDQyODJhNDMwZDhhY2Q0OGI1YmJhIiwidXNlcl9pZCI6MywiZW1haWwiOiJpbGNlQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIn0.nvd3IN5qmZnzqn8HACB-vy_QStQeroJd9d39di5PSho"; // Token hardcodeado
  };

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, // Agregar token aquí
          },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFoods(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const openModal = (food = null) => {
    if (food) {
      setSelectedFood(food);
      setFormData({
        menu: food.menu,
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        start_date: food.start_date
      });
    } else {
      setSelectedFood(null);
      setFormData({
        menu: 1,
        name: "",
        description: "",
        price: "",
        image: "",
        start_date: new Date().toISOString()
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedFood ? `${API_URL}${selectedFood.id}/` : API_URL;
      const method = selectedFood ? 'PUT' : 'POST';

      // Usamos FormData si vamos a trabajar con imágenes
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('menu', formData.menu);
      form.append('image', formData.image); // Si es una imagen, usa FormData
      form.append('start_date', formData.start_date);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`, // Token en los headers
        },
        body: form,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const updatedResponse = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`, // Token para la actualización
        },
      });
      const updatedData = await updatedResponse.json();
      setFoods(updatedData);
      closeModal();
    } catch (error) {
      console.error("Error saving food:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta comida?")) {
      try {
        const response = await fetch(`${API_URL}${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`, // Token para la eliminación
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        setFoods(foods.filter(food => food.id !== id));
      } catch (error) {
        console.error("Error deleting food:", error);
      }
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-64 mt-9">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Comidas disponibles
              </h1>
              <div className="flex justify-center items-center">
                <button 
                  className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
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
                    <th scope="col" className="px-6 py-3">Precio</th>
                    <th scope="col" className="px-6 py-3">Imagen</th>
                    <th scope="col" className="px-6 py-3">Fecha Inicio</th>
                    <th scope="col" className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {food.name}
                      </td>
                      <td className="px-6 py-4">{food.description}</td>
                      <td className="px-6 py-4">${food.price}</td>
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
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
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
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
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
      </div>

      {/* Modal for adding/editing food */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">{selectedFood ? "Editar Comida" : "Agregar Comida"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
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
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-black text-white px-4 py-2 rounded-lg"
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