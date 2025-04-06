import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../config/context/auth-context"; // Asumiendo que tienes este contexto para manejar la autenticación
import Pythones from "../assets/pythonEsLogo.png";

const Navbar = ({ onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { dispatch } = useContext(AuthContext);
  const { user } = useContext(AuthContext); // Aquí se obtiene la información del usuario
  const nav = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false);  // Nuevo estado para la redirección
  
  const logout = () => {
    dispatch({ type: 'SIGNOUT', signed: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setRedirectToHome(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (redirectToHome) {
    nav("/")
    }
  }, [redirectToHome, nav]);  // Dependencias para el useEffect

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav style={{zIndex:'15'}} className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-black p-3 w-full fixed top-0 start-0 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <img src={Pythones} className="h-10 sm:h-12 md:h-14 object-contain rounded-xl transition-all duration-300"
            alt="Pythones Logo" />
        </Link>

        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="search"
            className="block w-150 p-2 pl-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Botón del carrito */}
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onCartClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>

          {/* Botón de perfil con dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div
                className=" absolute right-0 z-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/earnings"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Earnings
                    </Link>
                  </li>
                </ul>
                <div className="py-2">
                  {!user.signed ? (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                  ) : (

                    <Link
                      className=" block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={() => logout()}
                    >
                      Cerrar sesión
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
