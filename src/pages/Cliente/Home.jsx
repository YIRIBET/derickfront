import React from "react";

const Home = () => {
  return (
    <div className=" bg-gray-100 h-screen w-full fixed left-0 ">
      <h1 className="text-4xl font-bold">
        Deliciosa comida, entregada a domicilio
      </h1>
      <p className="text-lg">Elige entre cientos de restaurantes en tu zona</p>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <p className="text-2xl text-left  font-bold tracking-tight">Restaurantes populares</p>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          <div className="group relative">
            <img
              src="https://ecook.mx/wp-content/uploads/2024/07/receta-de-hamburguesa.png"
              alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
              className="w-full h-80 object-center object-cover"
            />
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href="/Menu">
                    <span aria-hidden="true" className="absolute inset-0" />
                    Restaurante 1 
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Comida rápida</p>
              </div>
              <p className="text-sm font-medium text-gray-900">$12</p>
            </div>
          </div>
         {/*} {products.map((product) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}*/}
        </div>
      </div>
    </div>
    
  );
};

export default Home;
