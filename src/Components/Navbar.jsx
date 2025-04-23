import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../config/context/auth-context";
import Pythones from "../assets/pythonEsLogo.png";
import Cart from "./Cart";

const Navbar = ({ onCartClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { dispatch, user } = useContext(AuthContext);
  const nav = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const logout = () => {
    dispatch({ type: 'SIGNOUT', signed: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.clear()
    setRedirectToHome(true);
  };

  useEffect(() => {
    if (redirectToHome) nav("/");
  }, [redirectToHome, nav]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // Determinar qué elementos mostrar según el rol
  const shouldShowSearch = user?.role !== 'ADMIN' && user?.role !== 'RESTAURANT_OWNER';
  const shouldShowCart = user?.role === 'USER';
  const shouldShowProfile = user?.role === 'USER';

  return (
    <nav style={{ zIndex: '15' }} className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-black p-3 w-full fixed top-0 start-0 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="text-xl font-bold">
          <img src={Pythones} className="h-10 sm:h-12 md:h-14 object-contain rounded-xl transition-all duration-300" alt="Pythones Logo" />
        </Link>


        {/* Botones principales */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Hamburguesa para móviles */}
          <button className="sm:hidden" onClick={toggleMobileMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Carrito y perfil en pantallas grandes */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Mostrar carrito solo para usuarios normales */}
            {shouldShowCart && (
              <button className="p-1 hover:bg-gray-100 rounded-full" onClick={() => setShowCart(!showCart)}>
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
            )}

            {/* Perfil */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="p-1 hover:bg-gray-100 rounded-full focus:outline-none">
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

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-sm z-10">
                  <ul className="py-2 text-sm text-gray-700">
                    {!user?.signed ? (
                      <></>
                    ) : (
                      <>
                        <li><Link to="/" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Inicio</Link></li>
                        {shouldShowProfile && (
                          <li><Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Perfil</Link></li>
                        )}
                       
                      </>
                    )}
                  </ul>

                  <div className="py-2">
                    {!user?.signed ? (
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Iniciar sesión</Link>
                    ) : (
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar sesión</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md p-4">
          <div className="flex flex-col gap-2">
            {shouldShowProfile && (
              <Link to="/perfil" onClick={toggleMobileMenu}>Perfil</Link>
            )}
            <Link to="/earnings" onClick={toggleMobileMenu}>Earnings</Link>

            {user?.signed ? (
              <button onClick={logout}>Cerrar sesión</button>
            ) : (
              <Link to="/login" onClick={toggleMobileMenu}>Iniciar sesión</Link>
            )}
          </div>
        </div>
      )}
      
      {showCart && shouldShowCart && (
        <Cart onClose={() => setShowCart(false)} />
      )}
    </nav>
  );
};

export default Navbar;