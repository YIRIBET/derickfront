import React, { useState, useEffect } from "react";
import axiosClient from "../../config/http-client/axios-client";
import Restaurants from "../Restaurantero/Restaurants";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No user ID found in localStorage");
          return;
        }

        const responseUser = await axiosClient.get(`/users/api/${userId}`);
        setUser(responseUser.data);

        const responseOrders = await axiosClient.get(
          `/sales/userSales/${userId}/`
        );
        setOrders(responseOrders.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Cargando perfil...</div>;
  if (!user) return <div>No se pudo cargar la información del usuario</div>;

  return (
    <div className="grid grid-cols-12 gap-2 bg-gray-100 w-full">
      <div className="col-span-3 row-span-2 p-4 text-white">
        <div className="relative bg-white h-80 fixed rounded-lg shadow-sm dark:bg-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-600/50">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-orange-500 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-4">
              <img
                className="rounded-full h-16 w-16 ring-4 ring-white/50 dark:ring-gray-600/50 object-cover transition-transform duration-300 hover:scale-105"
                src={
                  user.avatar ||
                  "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8"
                }
                alt="Avatar del usuario"
              />
              <div>
                <p className="text-sm text-white/80">Mi perfil</p>
                <h5 className="text-xl font-bold text-white">{user.name}</h5>
                <p className="text-xs text-white/80">{user.email}</p>
                <p className="text-xs text-white/80 mt-1 px-2 py-1 bg-orange-600 rounded-full">
                  {user.role === "RESTAURANT_OWNER"
                    ? "Dueño de Restaurante"
                    : "Cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de pedidos */}
      <div className="col-span-9 flex p-5 justify-center">
        <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-sm dark:bg-gray-700 mt-5">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 className="text-[30px] font-bold text-gray-900 dark:text-white">
              Mis últimos pedidos!
            </h5>
          </div>

          {orders.map((order, index) => {
            const restaurant = order.restaurant;
            const imageUrl = restaurant?.restaurant_image?.data
              ? `data:${
                  restaurant.restaurant_image.type || "image/jpeg"
                };base64,${restaurant.restaurant_image.data}`
              : "/placeholder-image.jpg";

            return (
              <div key={index} className="flex justify-center p-4">
                <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row w-full max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  {restaurant?.restaurant_image ? (
                    <img
                      src={imageUrl}
                      alt={restaurant.name}
                      className="rounded-l w-35 h-35 object-cover p-4 items-center justify-center mt-5"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Sin imagen</span>
                    </div>
                  )}

                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Pedido en {restaurant.name}
                    </h5>
                    <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                      Fecha: {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
                      Productos:
                    </p>
                    <ul className="list-disc list-inside mb-1 text-sm text-gray-600 dark:text-gray-300">
                      {order.details.map((detail, idx) => (
                        <li key={idx}>
                          {detail.quantity}x {detail.food_info.name}
                        </li>
                      ))}
                    </ul>
                    <p className="mb-1 font-bold text-xl text-[#ff6227]">
                      Total: ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
