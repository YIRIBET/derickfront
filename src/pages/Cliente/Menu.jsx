import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Menu = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      setError("No hay token disponible");
      setLoading(false);
      return;
    }
  
    fetch("http://localhost:8000/menus/api/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json(); // Convertir la respuesta a JSON directamente
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          throw new Error("Formato de datos inesperado");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al obtener los restaurantes: " + err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      setError("No hay token disponible");
      setLoading(false);
      return;
    }
  
    fetch("http://localhost:8000/restaurante/api/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json(); // Convertir la respuesta a JSON directamente
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          throw new Error("Formato de datos inesperado");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al obtener los restaurantes: " + err.message);
        setLoading(false);
      });
  }, []);

  const openModal = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-4">
      {/* Sidebar con el listado de restaurantes */}
      <div className="col-span-2 row-span-2 bg-white-500 p-4 text-gray">
        <h2 className="text-lg font-bold text-center mb-2">Sidebar</h2>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="mb-4">
            <img
              src={restaurant.logo}
              alt={`${restaurant.name} imagen`}
              className="w-full h-32 object-cover rounded-md shadow-md transition-transform hover:scale-105"
            />
            <h3 className="text-xl font-bold text-center mt-2">
              <a href="/Menu" className="relative">
                <span aria-hidden="true" className="absolute inset-0" />
                {restaurant.name}
              </a>
            </h3>
            <p className="text-center text-muted-foreground">
              {restaurant.description}
            </p>
            <p className="text-sm font-medium text-gray-900 text-center">
              {restaurant.address}
            </p>
          </div>
        ))}
      </div>

      

      {/* Menús */}
      <div className="col-span-10 bg-white-500 p-4 text-white text-center grid grid-cols-2 gap-3 border-1">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex flex-col md:flex-row items-center h-25 w-full p-5 bg-white dark:bg-gray-800 relative after:content-[''] after:absolute after:bottom-0
             after:left-0 after:right-0 after:h-px after:bg-gray-200 dark:after:bg-gray-600 after:w-full hover:scale-105 transition-transform duration-300"
            //onClick={() => openModal(menu)}
            onClick={() => navigate(`/food`)}
          >
            {/* Contenido de texto */}
            <div className="flex flex-col items-center md:w-1/2">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {menu.name}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-center md:text-left">
                {menu.description}
              </p>
            </div>

            
          </div>
        ))}
      </div>

      {/* Modal de comida */}
      {isModalOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden={!isModalOpen}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-400"
          onClick={closeModal}
        >
          <div
            className="relative p-4 w-full max-w-2xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedMenu?.name || "Detalles del menú"}
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <img
                  className="w-full h-64 object-cover rounded-lg"
                  src="https://cloudfront-us-east-1.images.arcpublishing.com/infobae/24P2OKC3RVEHRD3F2VKQ76XX7M.jpg"
                  alt={selectedMenu?.name}
                />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {selectedMenu?.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Precio:</h4>
                    <p>price</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Disponibilidad:</h4>
                    <p>Disponible</p>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <div className="col-span-3">
                  
                </div>
                <button
                  type="button"
                  className="mt-4 bg-[#ff6227] text-white hover:bg-[#ff4427] focus:ring-4 focus:outline-none focus:ring-[#ff6227]font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#ff6227] dark:hover:bg-[#ff6227] dark:focus:ring-[#ff6227]"
                  onClick={closeModal}
                >
                 Agregar al carrito
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-[#ff6227] focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-[#ff4427] focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={closeModal}
                >
                  agregar e ir a pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;