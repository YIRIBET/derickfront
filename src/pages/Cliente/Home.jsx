import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Cart from "../../Components/Cart";
import Swal from "sweetalert2";
import AuthContext from '../../config/context/auth-context';
import AxiosClient from "../../config/http-client/axios-client";

const Home = () => {

  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurants, setNewRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useContext(AuthContext) || {};

  const isUserSignedIn = user?.signed || false;
  const navigate = useNavigate();
  useEffect(() => {
    // Obtén el token desde localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (!storedUser || !storedUser.access) {
      setError("No hay token disponible");
      setLoading(false);
      return;
    }
  
    setLoading(true); // Inicia la carga antes de hacer la solicitud
  
    // Realiza la solicitud con Axios
    AxiosClient({
      url: "restaurante/api/", // La URL que necesitas
      method: 'GET',
    })
    .then((response) => {
      // Axios maneja automáticamente el .data, así que no necesitas hacer .json() ni .text()
      console.log("Datos recibidos:", response.data);
  
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
      setLoading(false); // Siempre se ejecuta después de la solicitud
    });
  }, []);
  



  return (
    <div className={`${!isUserSignedIn ? 'mt-[140px]' : ''} relative min-h-screen`} >
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
          <div className="grid grid-cols-1 gap-4 overflow-x-auto xl:grid-cols-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-4 rounded-xl">
                <div className="aspect-[4/3] overflow-hidden rounded-xl relative z-10">
                  <img
                    onClick={() => navigate(`/menu/${restaurant.id}`)}
                    src={restaurant.logo}
                    alt={`${restaurant.name} imagen`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                  />
                </div>

                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      <a href={`/menu/${restaurant.id}`} className="relative">
                        {restaurant.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {restaurant.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurantes Nuevos */}
        <div className="w-full py-12 lg:py-32 bg-gray-100">
          <div className="container">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Descubre los restaurantes más recientes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Explora las mejores opciones gastronómicas que han llegado a nuestra plataforma.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {newRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex flex-col justify-between rounded-lg border p-6 shadow-sm border-gray-200"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl">
                      <img
                        src={restaurant.logo}
                        alt={`${restaurant.name} imagen`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
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

        {/* Sección CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold text-start tracking-tighter">
                  Comience hoy mismo
                </h2>
                <p className="max-w-[600px] text-muted-foreground text-start md:text-xl">
                  Únase a miles de empresas que ya están aprovechando nuestra plataforma para crecer.
                </p>
              </div>
              <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-5 m-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">Registrate con nosotros</h2>
                </div>

                <form className="mt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white"
                      >
                        Nombre completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Juan Perez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white"
                      >
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white"
                      >
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          <span className="sr-only">
                            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="cursor-pointer w-full bg-black text-white rounded-xl p-3">
                    Registrar
                  </button>

                  <div className="text-center text-sm">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to={"/login"}>
                      Inicia sesión

                    </Link>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Condicionalmente mostrar el carrito */}
      {showCart && <Cart />}
    </div>
  );
};

export default Home;
