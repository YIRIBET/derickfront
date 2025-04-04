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
    start_date: new Date().toISOString(),
  });

  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNzMyMTE1LCJpYXQiOjE3NDM3MzE4MTUsImp0aSI6ImM3YWI5OWY2NTNlODRkMjI4NzMwZDgzMTI0MmY5MTMxIiwidXNlcl9pZCI6MywiZW1haWwiOiJpbGNlQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIn0.HORUYhRQQT0OiGeV12mSnYHqpUjkZyjuq4L_x82-H8Y";
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
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
        start_date: food.start_date,
      });
    } else {
      setSelectedFood(null);
      setFormData({
        menu: 1,
        name: "",
        description: "",
        price: "",
        image: "",
        start_date: new Date().toISOString(),
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedFood ? `${API_URL}${selectedFood.id}/` : API_URL;
      const method = selectedFood ? "PUT" : "POST";
      const token = getAuthToken();

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const updatedResponse = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
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
        const token = getAuthToken();
        const response = await fetch(`${API_URL}${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        setFoods(foods.filter((food) => food.id !== id));
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
                        {food.image && (
                          <img 
                            src={food.image} 
                            alt={food.name} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(food.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openModal(food)}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                        ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
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

        {/* Modal de comida */}
        {isModalOpen && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden={!isModalOpen}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="relative p-4 w-full max-w-2xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="relative bg-white h-full rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedFood ? "Editar comida" : "Agregar nueva comida"}
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

                  <div className="p-4 md:p-5 space-y-4">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                          required
                          placeholder="Nombre del platillo"
                        />
                      </div>
                      <div>
                   
                        <textarea 
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                          required
                          placeholder="Descripción del platillo"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                          <input 
                            type="number" 
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="menu" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Menú</label>
                          <input 
                            type="number" 
                            id="menu"
                            name="menu"
                            value={formData.menu}
                            onChange={handleInputChange}
                            min="1"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <input 
                          type="url" 
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                          placeholder="URL de la imagen"
                        />
                      </div>
                      <div>
                        <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de inicio</label>
                        <input 
                          type="datetime-local" 
                          id="start_date"
                          name="start_date"
                          value={formData.start_date.substring(0, 16)}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 mr-2"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {selectedFood ? "Actualizar" : "Agregar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Food;