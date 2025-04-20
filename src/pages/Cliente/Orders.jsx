import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const Orders = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const totalCalc = storedCart.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
    setTotal(totalCalc);

    if (storedCart.length > 0) {
      setRestaurantName(storedCart[0].restaurantName || "Restaurante");
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
    onSubmit: (values) => {
      const address = `${values.street}, ${values.neighborhood}, ${values.state}, CP ${values.zip}`;
      const orderData = {
        items: cartItems,
        total,
        address,
        paymentMethod: values.paymentMethod,
        restaurant: restaurantName,
      };

      console.log("Enviando pedido...", orderData);

      // Aquí podrías enviar los datos al backend con fetch o axios

      localStorage.removeItem("cart");

      Swal.fire({
        title: "¡Compra realizada!",
        text: "Tu pedido se ha procesado correctamente 🎉",
        icon: "success",
        confirmButtonText: "Ok",
      });
    },
  });

  return (
    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100">
      {/* Formulario y detalles */}
      <div className="col-span-8 p-4 text-white">
        {/* Dirección */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              Dirección de entrega
            </h5>
          </div>
          <form onSubmit={formik.handleSubmit} className="p-4 space-y-4 text-black">
            {["street", "neighborhood", "state", "zip"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={field === "zip" ? "Código Postal" : field.charAt(0).toUpperCase() + field.slice(1)}
                  class="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  Con menos de un mes para que entren en vigor nuevas leyes de privacidad...
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
                disabled={!formik.isValid}
              >
                Hacer el pedido
              </button>
            </div>
          </form>
        </div>
      </div>

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
        <button
          type="submit"
          onClick={formik.handleSubmit}
          className={`w-full p-3 rounded-lg text-white mt-3 ${
            formik.isValid ? "bg-[#ff6227]" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!formik.isValid}
        >
          Hacer el pedido
        </button>
      </div>
    </div>
  );
};

export default Orders;
