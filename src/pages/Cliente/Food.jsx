import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import React from "react";

const Food = () => {
  const navigate = useNavigate();
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
  
    fetch("http://localhost:8000/food/api/", {
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
          setFoods(data);
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

  return (
    <div className="p-4 bg-gray-100">
      {loading && <p className="text-center text-gray-500">Cargando...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div key={food.id} className="p-4  rounded-lg shadow-md bg-white">
              <img
                src={food.image || "/images/default-food.jpg"} // Imagen por defecto si no hay URL
                alt={food.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-2">{food.name}</h3>
              <p className="text-[#ff6227] font-bold">${food.price}</p>
              <button className="mt-2 bg-[#ff6227] text-white px-4 py-2 rounded-lg hover:bg-[#ff6227]">
                Ordenar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Food;
