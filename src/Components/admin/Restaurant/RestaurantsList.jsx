import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantsList = ({ restaurants, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th>#</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <tr key={restaurant.id} className="hover">
                <th>{index + 1}</th>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
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
                    onClick={() => onDelete(restaurant.id)}
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
    </div>
  );
};

export default RestaurantsList;
