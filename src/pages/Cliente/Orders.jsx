import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosClient from "../../config/http-client/axios-client";

const Orders = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurant_id, setRestaurantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const totalCalc = storedCart.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    setTotal(totalCalc);

    if (storedCart.length > 0) {
      const { restaurantName, restaurant_id } = storedCart[0];
      if (restaurant_id) {
        setRestaurantName(restaurantName || "Restaurante");
        setRestaurantId(restaurant_id);
      } else {
        console.warn("restaurantId no está definido en el carrito.");
        // Podrías mostrar un mensaje al usuario o redirigir
      }
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      street: "",
      neighborhood: "",
      state: "",
      zip: "",
      paymentMethod: "",
    },
    validationSchema: Yup.object({
      street: Yup.string().required("Requerido"),
      neighborhood: Yup.string().required("Requerido"),
      state: Yup.string().required("Requerido"),
      zip: Yup.string().required("Requerido"),
      paymentMethod: Yup.string().required("Selecciona un método de pago"),
    }),
    onSubmit: async (values) => {
      if (!restaurant_id) {
        Swal.fire({
          title: "Error",
          text: "No se pudo identificar el restaurante. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      setIsSubmitting(true);
      const address = `${values.street}, ${values.neighborhood}, ${values.state}, CP ${values.zip}`;

      const orderData = {
        restaurant_id: restaurant_id,
        details: cartItems.map(item => ({
          food: item.id,
          quantity: item.quantity,
          price: item.price 
        })),
        address: address,
        payment_method: values.paymentMethod,
        total: total,
        status: "pending" 
      };

      try {
        const { data } = await axiosClient.post("/sales/api/", orderData);
        localStorage.removeItem("cart");

        Swal.fire({
          title: "¡Compra realizada!",
          text: "Tu pedido se ha procesado correctamente 🎉",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Opcional: Redirigir a una página de confirmación o historial
        });
      } catch (error) {
        console.error("Error al crear el pedido:", error);
        let errorMessage = "Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.";
        
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  return (
    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100">
      {/* Formulario y detalles */}
      <form onSubmit={formik.handleSubmit} className="col-span-8 p-4 text-white">
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Dirección de entrega
            </h5>
          </div>
          <div className="p-4 space-y-4 text-black">
            {["street", "neighborhood", "state", "zip"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={field === "zip" ? "Código Postal" : field.charAt(0).toUpperCase() + field.slice(1)}
                  className="mb-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <div className="text-sm text-red-600">{formik.errors[field]}</div>
                )}
              </div>
            ))}

            {/* Restaurante */}
            <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700 mt-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <p className="text-base text-gray-500 dark:text-gray-400">{restaurantName}</p>
              </div>
              <div className="p-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Asegúrate de que tu dirección y forma de pago estén correctas antes de continuar.
                </p>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700 mt-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <select
                  name="paymentMethod"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="">Selecciona un método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
                {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                  <div className="text-sm text-red-600">{formik.errors.paymentMethod}</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Selecciona tu forma de pago preferida para procesar tu pedido.
                </p>
              </div>
            </div>

            {/* Botón de envío en pantallas pequeñas */}
            <div className="block md:hidden">
              <button
                type="submit"
                className={`w-full p-3 mt-4 rounded-lg text-white ${
                  formik.isValid ? "bg-[#ff6227]" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!formik.isValid || isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Hacer el pedido"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Resumen del pedido */}
      <div className="col-span-4 flex p-5 grid place-items-center">
        <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-700 mt-5">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">Resumen</h5>
          </div>
          <div className="p-4 space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="text-base text-gray-700 dark:text-gray-300">
                <p>
                  {item.name} x {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  ${Number(item.price).toFixed(2)} c/u
                </p>
              </div>
            ))}
            <hr />
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botón para escritorio */}
        <form onSubmit={formik.handleSubmit} className="w-full mt-3">
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white ${
              formik.isValid ? "bg-[#ff6227]" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!formik.isValid || isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Hacer el pedido"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Orders;
