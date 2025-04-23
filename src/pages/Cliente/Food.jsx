import React, { useEffect, useState,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosClient from "../../config/http-client/axios-client";
import Swal from "sweetalert2";
import Navbar from "../../Components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from '../../config/context/auth-context';

const Food = () => {
  const navigate = useNavigate();
  const { menuId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidades, setCantidades] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const { user } = useContext(AuthContext) || {};
  const isUserSignedIn = user?.signed || false;
  const [showCart, setShowCart] = useState(false);
 


  useEffect(() => {
    setLoading(true);
    AxiosClient.get(`food/findByMenu/${menuId}/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setFoods(response.data);
        } else {
          throw new Error("Formato de datos inesperado");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al obtener las comidas: " + err.message);
        setLoading(false);
      });
  }, [menuId]);

  const handleCantidadChange = (id, value) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const updateCantidad = (id, increment) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + increment),
    }));
  };

  const agregarAlCarrito = (comida) => {
    const cantidad = cantidades[comida.id] || 1;

    if (cantidad > comida.stock) {
      Swal.fire({
        title: "Stock insuficiente",
        text: `Solo hay ${comida.stock} unidades disponibles.`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const carritoActual = JSON.parse(localStorage.getItem("cart")) || [];
    const yaExiste = carritoActual.find((item) => item.id === comida.id);

    if (!yaExiste) {
      const nuevoCarrito = [
        ...carritoActual,
        { ...comida, quantity: cantidad },
      ];
      localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
      window.dispatchEvent(new Event("storage"));

      Swal.fire({
        title: `${comida.name}`,
        text: `¡${cantidad} unidades agregadas al carrito!`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: `${comida.name}`,
        text: "Este producto ya está en el carrito.",
        icon: "info",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 500);
  };

  if (loading) return <p>Cargando alimentos...</p>;
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
          className={`grid-cols-12 gap-2 p-4 ${!isUserSignedIn ? 'mt-20' : ''}`}
        >
          <div className="col-span-2 mb-4 text-left">
            <button
              onClick={handleBack}
              className="bg-black hover:bg-black text-white mt-[-95px] font-semibold py-2 px-4 rounded shadow transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {foods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
               
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                {food.image ? (
                  <img
                    src={`data:${food.image.type};base64,${food.image.data}`}
                    alt={food.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                    Sin imagen
                  </div>
                )}

                <div className="p-4 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                    <p className="text-[#ff6227] font-bold">${food.price}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <button onClick={() => updateCantidad(food.id, -1)} className="p-2.5 bg-gray-100 rounded hover:bg-gray-200 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14" />
                      </svg>
                    </button>

                    <span className="w-10 text-center font-bold mt-2">
                      {cantidades[food.id] || 1}
                    </span>

                    <button onClick={() => updateCantidad(food.id, 1)} className="p-2.5 bg-gray-100 rounded hover:bg-gray-200 mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    <button
                      onClick={() => agregarAlCarrito(food)}
                      className={`mt-2 bg-[#ff6227] text-white w-20 py-2 rounded-lg hover:bg-[#ff4427] transition ${
                        food.stock === 0 ? "bg-gray-400 cursor-not-allowed" : ""
                      }`}
                      disabled={food.stock === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
        </div>
    </AnimatePresence>
  );
};

export default Food;
