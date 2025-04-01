import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantForm = ({ restaurants, setRestaurants }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const initialState = { name: "", location: "" };
  const [formData, setFormData] = useState(initialState);

  // Si es edición, cargar los datos del restaurante
  useEffect(() => {
    if (isEditing) {
      const restaurantToEdit = restaurants.find(rest => rest.id === parseInt(id));
      if (restaurantToEdit) {
        setFormData(restaurantToEdit);
      }
    }
  }, [id, restaurants]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar restaurante
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setRestaurants(restaurants.map(rest => (rest.id === parseInt(id) ? formData : rest)));
    } else {
      setRestaurants([...restaurants, { ...formData, id: restaurants.length + 1 }]);
    }
    navigate("/admin/restaurants");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? "Editar Restaurante" : "Nuevo Restaurante"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="input validator">
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            placeholder="Nombre del Restaurante"
          />
        </label>

        <label className="input validator">
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            required 
            placeholder="Ubicación"
          />
        </label>

        <button className="btn btn-primary btn-wide" type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar Restaurante"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
