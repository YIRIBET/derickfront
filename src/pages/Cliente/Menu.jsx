import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../config/http-client/axios-client";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from '../../config/context/auth-context';

const Menu = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false); 
  const { user } = useContext(AuthContext) || {};
  const isUserSignedIn = user?.signed || false;
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    setLoading(true);

    AxiosClient.get(`restaurante/api/${restaurantId}/`)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((err) => {
        setError("Error al obtener el restaurante: " + err.message);
      });

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

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 500);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AnimatePresence mode="wait">
      <div className="mb-90 relative min-h-screen">
        <Navbar onCartClick={() => setShowCart(!showCart)} />
        {!isExiting && (
          <motion.div
            key="menu"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-12 gap-2 p-4 ${!isUserSignedIn ? 'mt-20' : ''}`}
          >
            <div className="col-span-2 row-span-2 bg-white-500 text-gray">
              <button
                onClick={handleBack}
                className="bg-black text-white mt-[-94px] font-semibold py-2 px-4 rounded shadow transition duration-300"
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

                  <div className="p-4 items-center justify-center">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(restaurant.average_rating) ? "★" : "☆"}
                          </span>
                        ))}
                      </span>
                      <span className="text-gray-600 text-sm ml-1">
                        ({restaurant.average_rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No se encontró el restaurante</p>
              )}
            </div>

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
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Menu;