import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Cargar y escuchar cambios en el carrito
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Validar y normalizar los datos del carrito
          const validatedCart = parsedCart.map((item) => ({
            ...item,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
          }));
          setCartItems(validatedCart);
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        setCartItems([]);
      }
    };

    // Carga inicial
    loadCart();

    // Escucha cambios personalizados (desde Food en la misma pestaña)
    const handleCartUpdated = () => loadCart();

    // Escucha cambios de storage (desde otras pestañas)
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

  // Actualizar cantidad optimizado
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, (parseInt(item.quantity) || 1) + amount),
            }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Eliminar item optimizado
  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Función para formatear precios
  const formatPrice = (price) => {
    const numericPrice = parseFloat(price) || 0;
    return numericPrice.toFixed(2);
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      return total + itemPrice * itemQuantity;
    }, 0);
  };
  const handleCheckout = () => {
    const token = localStorage.getItem("accessToken");
  
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
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 pb-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={50}
                height={50}
                className="rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-[#f75518]">
                  ${formatPrice(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ×
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
