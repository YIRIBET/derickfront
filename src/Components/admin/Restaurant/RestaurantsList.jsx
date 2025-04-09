import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../DialogModal";


const RestaurantsList = ({ restaurants, onDelete }) => {
  const navigate = useNavigate();
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  const openModal = (restaurant) => {
    setRestaurantToDelete(restaurant);
    document.getElementById("delete_restaurant_modal").showModal();
  };

  const handleConfirmDelete = () => {
    if (restaurantToDelete) {
      onDelete(restaurantToDelete.id);
      setRestaurantToDelete(null);
    }
  };
  return (
    <>
    
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th>#</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Telefono</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <tr key={restaurant.id} className="hover">
                <th>{index + 1}</th>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.phone}</td>
                <td>{restaurant.description}</td>
                <td>
                  {/* Botón Editar */}
                  <button
                    className="btn btn-sm btn-outline btn-primary mr-2"
                    onClick={() => navigate(`/admin/restaurants/edit/${restaurant.id}`)}
                  >
                    Editar
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => openModal(restaurant)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No hay restaurantes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
       {/* Modal de confirmación de eliminación */}
      <ModalDialog
        id="delete_restaurant_modal"
        title="¿Eliminar Restaurante?"
        message={`¿Estás seguro de que deseas eliminar a ${restaurantToDelete?.name}?`}
        type="warning"
        showActions={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRestaurantToDelete(null)}
      />
    </div>
    </>
  );
};

export default RestaurantsList;
