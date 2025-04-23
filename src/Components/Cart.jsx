import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (storedCart.length > 0) {
          const firstRestaurantId = storedCart[0].restaurant_id;
          const allSameRestaurant = storedCart.every(
            (item) => item.restaurant_id === firstRestaurantId
          );

          if (!allSameRestaurant) {
            console.warn("Carrito contiene items de distintos restaurantes");
            localStorage.removeItem("cart");
            setCartItems([]);
            setRestaurantInfo(null);
            return;
          }

          setRestaurantInfo({
            id: firstRestaurantId,
            name: storedCart[0].restaurantName || "Restaurante",
          });
        }

        const validatedCart = storedCart.map((item) => ({
          ...item,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
        }));

        setCartItems(validatedCart);
      } catch (error) {
        console.error("Error cargando carrito:", error);
        setCartItems([]);
        setRestaurantInfo(null);
      }
    };

    loadCart();

    const handleCartUpdated = () => loadCart();
    const handleStorageChange = (e) => {
      if (e.key === "cart") loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = (parseInt(item.quantity) || 1) + amount;
          if (newQuantity > item.stock) {
            alert(
              `Solo hay ${item.stock} unidades disponibles de "${item.name}"`
            );
            return item;
          }
          return {
            ...item,
            quantity: Math.max(1, newQuantity),
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("cartUpdated"));
      return updatedItems;
    });
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      window.dispatchEvent(new Event("cartUpdated"));

      if (updatedItems.length === 0) {
        setRestaurantInfo(null);
      }

      return updatedItems;
    });
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price) || 0;
    return numericPrice.toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      return total + itemPrice * itemQuantity;
    }, 0);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("accessToken");

    if (cartItems.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    if (!restaurantInfo) {
      alert("Error al verificar el restaurante");
      return;
    }

    if (token) {
      navigate("/order");
    } else {
      navigate("/login");
    }
  };

  return (
    <aside className="fixed top-16 right-0 w-80 h-screen bg-white shadow-lg p-6 overflow-y-auto">
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        <div className="space-y-4">
          {restaurantInfo && (
            <div className="pb-2 border-b">
              <h3 className="font-semibold">{restaurantInfo.name}</h3>
            </div>
          )}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 pb-4 border-b relative"
            >
              {item.image ? (
                <img
                  src={`data:${item.image.type};base64,${item.image.data}`}
                  alt={item.name}
                  className="w-20 h-15 object-cover"
                />
              ) : (
                <div className="w-20 h-15 flex items-center justify-center bg-gray-200 text-gray-500">
                  Sin imagen
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-[#f75518]">
                  ${formatPrice(item.price)}
                </p>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className={`p-1 rounded ${
                      item.quantity >= item.stock
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={item.quantity >= item.stock}
                    title={
                      item.quantity >= item.stock
                        ? "Stock máximo alcanzado"
                        : "Agregar uno más"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Eliminar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 pt-4 h-full">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-[#ff6227]">
              ${formatPrice(calculateTotal())}
            </span>
          </div>

          <button
            className="w-full mt-4 bg-[#ff6227] text-white py-2 rounded hover:bg-[#e55320] transition-colors"
            onClick={handleCheckout}
          >
            Finalizar Compra
          </button>
          <button
            className="w-full mt-2 border py-2 rounded hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Seguir Comprando
          </button>
        </div>
      )}
    </aside>
  );
};

export default Cart;
