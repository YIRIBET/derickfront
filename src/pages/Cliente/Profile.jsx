import React from "react";

const Profile = () => {
  return (
    <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100 w-full">
      <div className="col-span-3 row-span-2 p-4 text-white">
        <div className="relative bg-white h-full rounded-lg shadow-sm dark:bg-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-600/50">
          {/* Header con avatar y nombre */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-orange-500 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-4">
              <img
                className="rounded-full h-16 w-16 ring-4 ring-white/50 dark:ring-gray-600/50 object-cover transition-transform duration-300 hover:scale-105"
                src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8"
                alt="Avatar del usuario"
              />
              <div>
                <p className="text-sm text-white/80">Mi perfil</p>
                <h5 className="text-xl font-bold text-white">
                  Nombre de usuario
                </h5>
              </div>
            </div>
          </div>

          {/* Menú de opciones */}
          <div className="p-4 space-y-2">
            {/* Opción Configuración */}
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200 group">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
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
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <span className="font-medium">Configuración</span>
            </button>

            {/* Opción Ayuda */}
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200 group">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors duration-200">
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
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </div>
              <span className="font-medium">Ayuda</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200 group mt-8">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors duration-200">
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
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </div>
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-9 flex p-5 justify-center ">
        <div class="relative bg-white w-full max-w-4xl rounded-lg shadow-sm dark:bg-gray-700 mt-5">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h5 class="text-[30px] font-bold text-gray-900 dark:text-white">
              Mis últimos pedidos!
            </h5>
          </div>

          <div class="flex justify-center p-4">
            <a
              href="#"
              class="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row w-full max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <img
                className="object-cover w-60 rounded-t-lg md:h-auto md:rounded-none md:rounded-s-lg"
                src="https://cloudfront-us-east-1.images.arcpublishing.com/infobae/24P2OKC3RVEHRD3F2VKQ76XX7M.jpg"
                alt=""
              />
              <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Nombre del restaurante
                </h5>
                <p class="mb-3 font-normal text-start text-gray-700 dark:text-gray-400">
                  Fecha
                </p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  cantidad
                </p>
                <p class="mb-3 font-bold text-xl text-[#ff6227] ">
                  Total
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
