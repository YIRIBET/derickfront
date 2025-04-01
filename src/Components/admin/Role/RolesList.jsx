import React from "react";
import { useNavigate } from "react-router-dom";

const RoleList = ({ roles, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th>#</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((role, index) => (
              <tr key={role.id} className="hover">
                <th>{index + 1}</th>
                <td>{role.name}</td>
                <td>
                  {/* Botón Editar */}
                  <button
                    className="btn btn-sm btn-outline btn-primary mr-2"
                    onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                  >
                    Editar
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => onDelete(role.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 py-4">
                No hay roles registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;
