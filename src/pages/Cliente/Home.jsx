import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Cart from "../../Components/Cart";
import Swal from "sweetalert2";
import AuthContext from '../../config/context/auth-context';
import AxiosClient from "../../config/http-client/axios-client";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurants, setNewRestaurants] = useState([]);  // Para los restaurantes nuevos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { user } = useContext(AuthContext) || {};

  const isUserSignedIn = user?.signed || false;
  const navigate = useNavigate();

  // Llamada a la API para obtener los restaurantes
  useEffect(() => {
    setLoading(true);

    // Obtener los restaurantes populares
    AxiosClient({
      url: "restaurante/api/",
      method: 'GET',
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRestaurants(response.data);
        } else {
          throw new Error("Formato de datos inesperado");
        }
      })
      .catch((err) => {
        console.error("Error en la API:", err);
        setError("Error al obtener los restaurantes: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    // Obtener los restaurantes más recientes
    AxiosClient({
      url: "restaurante/findLatest/",  // Endpoint para restaurantes nuevos
      method: 'GET',
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setNewRestaurants(response.data);
        } else {
          throw new Error("Formato de datos inesperado");
        }
      })
      .catch((err) => {
        console.error("Error en la API:", err);
        setError("Error al obtener los restaurantes recientes: " + err.message);
      });
  }, []);

  return (
    <div className={`${!isUserSignedIn ? 'mt-[140px]' : ''} relative min-h-screen`}>
      <Navbar onCartClick={() => setShowCart(!showCart)} />
      <div className="flex min-h-screen flex-col w-full start-0">
        <h1 className="text-4xl font-bold text-center">
          Deliciosa comida, entregada a domicilio
        </h1>
        <p className="text-lg text-center mt-2">
          Elige entre cientos de restaurantes en tu zona
        </p>

        {/* Restaurantes Populares */}
        <div className="w-full py-12 md:py-20">
          <p className="text-2xl font-bold text-start mb-6">
            Restaurantes populares
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigate(`/menu/${restaurant.id}`)}
              >
                {/* Imagen del restaurante */}
                <div className="h-40 overflow-hidden">
                  {restaurant.restaurant_image ? (
                    <img
                      src={`data:${restaurant.restaurant_image.type};base64,${restaurant.restaurant_image.data}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No hay imagen disponible</p>
                    </div>
                  )}
                </div>
                
                {/* Información del restaurante */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{restaurant.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(restaurant.average_rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </span>
                    <span className="text-gray-600 text-sm ml-1">
                      ({restaurant.average_rating.toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurantes Nuevos */}
        <div className="w-full py-6 lg:py-32 bg-gray-100">
          <div className="container">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-12">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Descubre los restaurantes más recientes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Explora las mejores opciones gastronómicas que han llegado a nuestra plataforma.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-3 py-12 lg:grid-cols-5">
              {newRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex flex-col justify-between rounded-lg border p-6 shadow-sm border-gray-200"
                >
                  <div className="space-y-4">
                    {/* Imagen del restaurante */}
                    <div className="h-40 overflow-hidden">
                      {restaurant.restaurant_image ? (
                        <img
                          src={`data:${restaurant.restaurant_image.type};base64,${restaurant.restaurant_image.data}`}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No hay imagen disponible</p>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      <a href={`/menu/${restaurant.id}`} className="relative">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCart && <Cart />}
    </div>
  );
};

export default Home;
