import React from "react";

const Orders = () => {
  return (
    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100">
      
      <div className="col-span-8 row-span-2  p-4 text-white place-items-center ">
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 class="text-xl font-bold text-gray-900 dark:text-white">
              Dirección de entrega
            </h5>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
          </div>
        </div>
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 mb-5 mt-5">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 class="text-xl font-bold text-gray-900 dark:text-white">
              Nombre del restaurante
            </h5>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
          </div>
        </div>
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 mb-5 mt-5">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 class="text-xl font-bold text-gray-900 dark:text-white">
              Metodo de pago
            </h5>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
          </div>
        </div>
       
      </div>

      <div className="col-span-4 flex  p-5 grid place-items-center">
      <div class="relative bg-white w-full rounded-lg shadow-sm dark:bg-gray-700  mt-5">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 class="text-xl font-bold text-gray-900 dark:text-white">
              Resumen
            </h5>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              total    $137.99
            </p>
          </div>
        </div>
        <button className=" w-full p-3 rounded-lg text-white mt-1 bg-[#ff6227]">
            Hacer el pedido
        </button>
      </div>
    </div>
  );
};

export default Orders;
