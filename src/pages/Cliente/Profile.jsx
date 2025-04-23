import React, { useState, useEffect } from "react";
import axiosClient from "../../config/http-client/axios-client";
import Swal from "sweetalert2";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Datos en edición
  const [isEditing, setIsEditing] = useState(false); // Modo edición
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No user ID found in localStorage");
          return;
        }

        // Obtener datos del usuario
        const responseUser = await axiosClient.get(`/users/api/${userId}/`);
        setUser(responseUser.data);
        setEditingUser({ ...responseUser.data }); // Inicializar datos de edición

        // Obtener pedidos del usuario
        const responseOrders = await axiosClient.get(
          `/sales/userSales/${userId}/`
        );
        setOrders(responseOrders.data);

        // Obtener todos los restaurantes
        const responseRestaurants = await axiosClient.get("/restaurante/api/");
        const restaurantsMap = {};
        responseRestaurants.data.forEach((restaurant) => {
          restaurantsMap[restaurant._id] = restaurant;
        });
        setRestaurants(restaurantsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingUser({ ...user }); // Resetear a los valores originales
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // Excluir el campo `password` si no se está editando
      const dataToSend = { ...editingUser };
      delete dataToSend.password;

      const response = await axiosClient.put(
        `/users/api/${userId}/`,
        dataToSend
      );

      setUser(response.data);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios se han guardado correctamente.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil. Intenta nuevamente.",
      });
    }
  };

  const handleRateRestaurant = (order) => {
    setCurrentOrder(order);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!currentOrder?.restaurant) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "No se encontró el restaurante para calificar",
      });
      return;
    }

    const ratingData = {
      score: rating,
      comment: comment || "Sin comentarios",
      user: currentOrder.user,
      restaurant: currentOrder.restaurant,
    };

    try {
      await axiosClient.post("/rating/api/", ratingData);
      Swal.fire({
        icon: "success",
        title: "¡Gracias por tu calificación!",
        text: "Tu opinión ha sido enviada con éxito.",
      });

      setShowRatingModal(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error al enviar la calificación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al enviar la calificación. Intenta nuevamente.",
      });
    }
  };

  if (loading) return <div>Cargando perfil...</div>;
  if (!user) return <div>No se pudo cargar la información del usuario</div>;

  return (
    <div className="grid grid-cols-12 gap-2 bg-gray-100 w-full mt-[-20px]">
      {/* Modal de calificación */}
      {showRatingModal && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Calificar a{" "}
              {restaurants[currentOrder.restaurant._id]?.name ||
                "el restaurante"}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Calificación:</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Comentario (opcional):
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Cómo fue tu experiencia?"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setComment("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className={`px-4 py-2 rounded ${
                  rating === 0
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Enviar Calificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perfil del usuario */}
      <div className="col-span-3 row-span-2 p-4">
  <div className="relative bg-white dark:bg-gray-800 sticky top-30 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    {/* Encabezado */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-6 bg-gradient-to-r from-orange-500 to-orange-400 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center space-x-4">
        <img
          className="rounded-full h-16 w-16 ring-4 ring-white/60 dark:ring-gray-600 object-cover transition-transform duration-300 hover:scale-105"
          src={
            user.avatar ||
            "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8"
          }
          alt="Avatar del usuario"
        />
        <div>
          <p className="text-sm text-white/80 mb-1">Mi perfil</p>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editingUser.name || ""}
                onChange={handleInputChange}
                className="text-lg font-semibold text-white bg-orange-600 rounded px-2 py-1 mb-1 w-full"
              />
              <input
                type="email"
                name="email"
                value={editingUser.email || ""}
                onChange={handleInputChange}
                className="text-sm text-white bg-orange-600 rounded px-2 py-1 w-full"
              />
            </>
          ) : (
            <>
              <h5 className="text-lg font-bold text-white">{user.name}</h5>
              <p className="text-sm text-white/80">{user.email}</p>
            </>
          )}
          <p className="inline-block text-xs font-medium text-white bg-orange-600 px-3 py-1 mt-2 rounded-full">
            {user.role === "RESTAURANT_OWNER"
              ? "Dueño de Restaurante"
              : "Cliente"}
          </p>
        </div>
      </div>
    </div>

    {/* Acciones */}
    <div className="p-4 bg-white dark:bg-gray-700 flex justify-end items-center gap-2">
      {isEditing ? (
        <>
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Guardar
          </button>
          <button
            onClick={handleCancelEdit}
            className="bg-gray-400 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm px-4 py-2 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
          Editar perfil
        </button>
      )}
    </div>
  </div>
</div>


      {/* Sección de pedidos */}
      <div className="col-span-9 flex p-5 justify-center overflow-y-auto">
        <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-sm dark:bg-gray-700 mt-5">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 className="text-[30px] font-bold text-gray-900 dark:text-white">
              Mis últimos pedidos!
            </h5>
          </div>

          {orders.length > 0 ? (
  orders.map((order, index) => {
    const restaurant =
      restaurants[order.restaurant._id] || order.restaurant;
    const imageUrl = restaurant?.restaurant_image?.data
      ? `data:${restaurant.restaurant_image.type || "image/jpeg"};base64,${restaurant.restaurant_image.data}`
      : "/placeholder-image.jpg";

    return (
      <div key={index} className="flex justify-center p-4">
        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-md w-full max-w-3xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          {/* Imagen */}
          <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden">
            <img
              src={imageUrl}
              alt={restaurant.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Info del pedido */}
          <div className="flex flex-col justify-between p-4 md:w-2/3 w-full">
            <div>
              <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                Pedido en {restaurant?.name || "Restaurante no disponible"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Fecha: {new Date(order.date).toLocaleDateString()}
              </p>

              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Productos:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                {order.details.map((detail, idx) => (
                  <li key={idx}>
                    {detail.quantity}x {detail.food_info.name}
                  </li>
                ))}
              </ul>

              <p className="text-xl font-semibold text-orange-600 mt-3">
                Total: ${Number(order.total).toFixed(2)}
              </p>
            </div>

            {/* Botón de calificar */}
            <div className="mt-4 md:mt-0 md:self-end">
              <button
                onClick={() => handleRateRestaurant(order)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Calificar este restaurante
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  })
) : (
  <div className="p-4 text-center">
    <p className="text-gray-600 dark:text-gray-300">
      No tienes pedidos recientes
    </p>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Profile;
