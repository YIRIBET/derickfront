import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../config/http-client/axios-client";

const Menu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Obtener info del restaurante
    AxiosClient.get(`restaurante/api/${restaurantId}/`)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((err) => {
        setError("Error al obtener el restaurante: " + err.message);
      });

    // Obtener menús
    AxiosClient.get(`menus/findByRestaurant/${restaurantId}/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMenus(response.data);
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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-12 gap-2 p-4">
      {/* Sidebar del restaurante - Estilo original */}
      <div className="col-span-2 row-span-2 bg-white-500 text-gray">
        <button
          onClick={() => navigate(-1)}
          className="bg-black hover:bg-black text-white mt-[-94px] font-semibold py-2 px-4 rounded shadow transition duration-300"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center mb-2">Restaurante</h2>
        {restaurant ? (
          <div className="mb-4">
            {restaurant.restaurant_image ? (
              <img
                src={`data:${restaurant.restaurant_image.type};base64,${restaurant.restaurant_image.data}`}
                alt={restaurant.name}
                style={{ width: "200px", height: "auto" }}
              />
            ) : (
              <p>No hay imagen disponible.</p>
            )}
            <h3 className="text-xl font-bold text-center mt-2">
              {restaurant.name}
            </h3>
            <p className="text-center text-muted-foreground">
              {restaurant.description}
            </p>
            <p className="text-sm font-medium text-gray-900 text-center">
              {restaurant.address}
            </p>

            <div className="flex items-center justify-center mt-2">
              <svg
                className="w-4 h-4 text-yellow-300"
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
                className="w-4 h-4 ms-1 text-gray-300"
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

      {/* Menús - Estilo original */}
      <div className="col-span-10 bg-white-500 p-4 text-white text-center grid grid-cols-2 gap-3 border-1">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col md:flex-row items-center h-auto w-full p-5 bg-white dark:bg-gray-800 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gray-200 dark:after:bg-gray-600 after:w-full hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate(`/food/${menu.id}`)}
            >
              <div className="flex flex-col w-full">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white w-full text-left">
                  {menu.name}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 w-full text-left break-words">
                  {menu.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-800 dark:text-white col-span-2">
            No hay menús disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;