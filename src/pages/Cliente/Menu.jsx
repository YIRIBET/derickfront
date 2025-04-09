import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
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

    fetch(`http://localhost:8000/menus/findByRestaurant/${restaurantId}/`, {
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
        return response.json();
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
        setError("Error al obtener los menús: " + err.message);
        setLoading(false);
      });
  }, [restaurantId]);

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
        return response.json();
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

  const selectedRestaurant = restaurants.find(
    (r) => r.id === parseInt(restaurantId)
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-12 gap-2 p-4">
      {/* Sidebar del restaurante */}
      <div className="col-span-2 row-span-2 bg-white-500 p-4 text-gray">
        <h2 className="text-lg font-bold text-center mb-2">Restaurante</h2>
        {selectedRestaurant ? (
          <div className="mb-4">
            {selectedRestaurant.restaurant_image ? (
                <img
                  src={`data:${selectedRestaurant.restaurant_image.type};base64,${selectedRestaurant.restaurant_image.data}`}
                  alt={selectedRestaurant.name}
                  style={{ width: '200px', height: 'auto' }}
                />
              ) : (
                <p>No hay imagen disponible.</p>
              )}
            <h3 className="text-xl font-bold text-center mt-2">
              {selectedRestaurant.name}
            </h3>
            <p className="text-center text-muted-foreground">
              {selectedRestaurant.description}
            </p>
            <p className="text-sm font-medium text-gray-900 text-center">
              {selectedRestaurant.address}
            </p>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-300 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 text-yellow-300 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            </div>
          </div>
        ) : (
          <p>No se encontró el restaurante</p>
        )}
      </div>

      {/* Menús */}
      <div className="col-span-10 bg-white-500 p-4 text-white text-center grid grid-cols-2 gap-3 border-1">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col md:flex-row items-center h-25 w-full p-5 bg-white dark:bg-gray-800 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gray-200 dark:after:bg-gray-600 after:w-full hover:scale-105 transition-transform duration-300"
              onClick={() => navigate(`/food/${menu.id}`)}
            >
              <div className="flex flex-col items-center md:w-1/2">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {menu.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-center md:text-left">
                  {menu.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay menús disponibles para este restaurante.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedMenu.name}</h2>
            <p className="mb-4">{selectedMenu.description}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;