import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Food = () => {
  const navigate = useNavigate();
  const { menuId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("No hay token disponible");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/food/findByMenu/${menuId}/`, {
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
          setFoods(data);
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

  const agregarAlCarrito = (comida) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  
    const yaExiste = carritoActual.find((item) => item.id === comida.id);
  
    if (!yaExiste) {
      const nuevoCarrito = [...carritoActual, comida];
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      alert(`${comida.name} agregado al carrito ✅`);
    } else {
      alert(`${comida.name} ya está en el carrito 🛒`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {loading && <p className="text-center text-gray-500">Cargando...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {food.name}
                </h3>
                <p className="text-[#ff6227] font-bold">${food.price}</p>
                <button 
                  onClick={() => agregarAlCarrito(food)}
                  className="mt-3 bg-[#ff6227] w-full text-white px-4 py-2 rounded-lg hover:bg-[#ff4427] transition"
                >
                  Ordenar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Food;