import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantsList from ".//RestaurantsList";

const initialRestaurants = [
  { id: 1, name: "La Cocina Mexicana", location: "CDMX" },
  { id: 2, name: "El Asador Argentino", location: "Monterrey" },
  { id: 3, name: "Pizzería Italiana", location: "Guadalajara" },
];

const RestaurantsPage = ({ restaurants, setRestaurants }) => {
  
  const navigate = useNavigate();

  // Función para eliminar un restaurante
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este restaurante?");
    if (confirmDelete) {
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Restaurantes</h1>

      {/* Botón para agregar restaurante */}
      <button 
        className="btn btn-primary btn-wide mb-4"
        onClick={() => navigate("/admin/restaurants/new")}
      >
        Agregar Restaurante
      </button>

      <RestaurantsList restaurants={restaurants} onDelete={handleDelete} />
    </div>
  );
};

export default RestaurantsPage;
