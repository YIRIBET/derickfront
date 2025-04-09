import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantForm = ({ restaurants, setRestaurants }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== undefined;
  
  const initialState = {
    name: "",
    address: "",
    phone: "",
    logo: "",
    description: "",
    user: 2, // Asignando un valor de ejemplo para 'user', ajusta según lo que necesites
    start_date: new Date().toISOString(), // Se manda la fecha actual
  };

  const [formData, setFormData] = useState(initialState);

  // Si es edición, cargar los datos del restaurante
  useEffect(() => {
    if (isEditing) {
      const restaurantToEdit = restaurants.find((rest) => rest.id === parseInt(id));
      if (restaurantToEdit) {
        setFormData({
          ...restaurantToEdit,
          start_date: restaurantToEdit.start_date || new Date().toISOString(), // Asegura que tenga la fecha actual si no existe
        });
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

    const requestMethod = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:8000/restaurante/api/${id}/`
      : "http://127.0.0.1:8000/restaurante/api/";

    fetch(url, {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar el restaurante");
        return res.json();
      })
      .then((data) => {
        if (isEditing) {
          setRestaurants(restaurants.map((rest) => (rest.id === data.id ? data : rest)));
        } else {
          setRestaurants([...restaurants, data]);
        }
        navigate("/admin/restaurants");
      })
      .catch((err) => {
        console.error(err);
        alert("Error al guardar el restaurante");
      });
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
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Dirección"
          />
        </label>

        <label className="input validator">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Teléfono"
          />
        </label>

        <label className="input validator">
          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="Logo URL"
          />
        </label>

        <label className="input validator">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descripción"
          />
        </label>

        {/* start_date no se muestra en la UI pero se incluye en los datos enviados */}
        <input
          type="hidden"
          name="start_date"
          value={formData.start_date}
        />

        <button className="btn bg-orange-400 text-green-50 btn-wide" type="submit">
          {isEditing ? "Guardar Cambios" : "Agregar Restaurante"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
