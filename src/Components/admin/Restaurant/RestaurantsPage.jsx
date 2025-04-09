import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantsList from ".//RestaurantsList";

const defaultRestaurants = [
  { id: 1, name: "La Cocina Mexicana", address: "CDMX", phone:"7776051224", logo: "https://hola.com/logo.png", description: "Comida tradicional mexicana", user: 2, start_date: "2023-01-01" },
  { id: 2, name: "El Asador Argentino", address: "Monterrey", phone:"7776051224", logo: "https://hola.com/logo.png", description: "Comida tradicional argentina", user: 2, start_date: "2023-01-01" },
  { id: 3, name: "Pizzería Italiana", address: "Guadalajara", phone:"7776051224", logo: "https://hola.com/logo.png", description: "Comida tradicional italiana", user: 2, start_date: "2023-01-01" },
  { id: 4, name: "Sushi Bar", address: "Tijuana", phone:"7776051224", logo: "https://hola.com/logo.png", description: "Comida tradicional japonesa", user: 2, start_date: "2023-01-01" },
];

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

    // Llamada a la API para obtener los restaurantes
    useEffect(() => {
      fetch("http://localhost:8000/restaurants/api/")
        .then((res) => {
          if (!res.ok) {
            throw new Error("No se pudo obtener la lista de restaurantes");
          }
          return res.json();
        })
        .then((data) => {
          setRestaurants(data.length > 0 ? data : defaultRestaurants);
        })
        .catch((error) => {
          console.error("Error al obtener restaurantes:", error.message);
          setRestaurants(defaultRestaurants);
        });
    }, []);
  // Función para eliminar un restaurante
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/restaurants/api/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
      } else {
        throw new Error("Error al eliminar el restaurante");
      }
    } catch (error) {
      console.error("Error al eliminar el restaurante:", error.message);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Restaurantes</h1>

      {/* Botón para agregar restaurante */}
      <button 
        className="btn bg-orange-400 text-gray-50 btn-wide mb-4"
        onClick={() => navigate("/admin/restaurants/new")}
      >
        Agregar Restaurante
      </button>

      {/* Lista de restaurantes */}
      <RestaurantsList restaurants={restaurants} onDelete={handleDelete} />
    </div>
  );
};

export default RestaurantsPage;
