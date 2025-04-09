import React, { useState } from "react";
import Orders from "../pages/Cliente/Orders";

const Cart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Producto 1", price: 100, quantity: 1 },
    { id: 2, name: "Producto 2", price: 200, quantity: 1 },
  ]);

  // Función para actualizar la cantidad
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // Función para eliminar un producto
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <aside className="fixed top-16 right-0 w-80 h-full bg-white shadow-lg p-6 overflow-y-auto">
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4  pb-4"
            >
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
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.id, -1)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6  pt-4">
          <div className="flex justify-between font-medium ">
            <span>Total</span>
            <span className="text-[#ff6227]">
              $
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>

          <button className="w-full mt-4 bg-[#ff6227] text-white py-2 rounded"
          onClick={Orders}>
            Finalizar Compra
          </button>
          <button className="w-full mt-2 border py-2 rounded" onClick={onClose}>
            Seguir Comprando
          </button>
        </div>
      )}
    </aside>
  );
};

export default Cart;
