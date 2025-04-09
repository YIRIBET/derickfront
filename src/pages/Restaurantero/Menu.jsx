import React, { useState, useEffect } from "react";

const Menu = () => {
  const API_URL = "http://127.0.0.1:8000/menus/api/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    restaurants: 1,
    name: "",
    description: "",
    start_date: new Date().toISOString(),
  });

  // Hardcodeado para pruebas
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NTc4NTQzLCJpYXQiOjE3NDM5NzM3NDMsImp0aSI6IjJkMTViYTljOThhYTQzM2U5MjViOTk5YmMzNTA5YzJlIiwidXNlcl9pZCI6MywiZW1haWwiOiJpbGNlQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIn0.AxH6QoQr7NZEAL_WYvT12qSEnqhnTwwF26WSGLk_K_c"; // Token hardcodeado
  };

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = getAuthToken(); // Recupera el token
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agrega el token al header
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMenus(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching menus:", error);
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const openModal = (menu = null) => {
    if (menu) {
      setSelectedMenu(menu);
      setFormData({
        restaurants: menu.restaurants,
        name: menu.name,
        description: menu.description,
        start_date: menu.start_date,
      });
    } else {
      setSelectedMenu(null);
      setFormData({
        restaurants: 1,
        name: "",
        description: "",
        start_date: new Date().toISOString(),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
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
      const token = getAuthToken(); // Recupera el token
      const url = selectedMenu ? `${API_URL}${selectedMenu.id}/` : API_URL;
      const method = selectedMenu ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token al header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // Refresh menu list
      const updatedResponse = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token al header
        },
      });
      const updatedData = await updatedResponse.json();
      setMenus(updatedData);
      closeModal();
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este menú?")) {
      try {
        const token = getAuthToken(); // Recupera el token
        const response = await fetch(`${API_URL}${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agrega el token al header
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        setMenus(menus.filter((menu) => menu.id !== id));
      } catch (error) {
        console.error("Error deleting menu:", error);
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
                Menús disponibles
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
                    <th scope="col" className="px-6 py-3">
                      Restaurante
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fecha Inicio
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr
                      key={menu.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">{menu.restaurants}</td>
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
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0=" />
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
    </>
  );
};

export default Menu;
