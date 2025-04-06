import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import AuthContext from './../config/context/auth-context'; // Importamos el contexto

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/auth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();     
      console.log("Respuesta del servidor:", data);
     // Guardamos el token y los datos del usuario
     localStorage.setItem("accessToken", data.access);
     localStorage.setItem("refreshToken", data.refresh);

      dispatch({ type: 'SIGNIN', payload: data });


      const session = JSON.parse(localStorage.getItem('user'));
      console.log(session.access);


      nav("/"); 


    } catch (error) {
      console.error("Error en el login:", error);
      setError(error.message); // Actualiza el estado de error para mostrarlo en pantalla
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Sección de imagen */}
      <div className="flex w-full items-center justify-center bg-primary/10 md:w-1/2">
        <img
          src="https://www.truefoodkitchen.com/wp-content/uploads/2025/01/TFK016_01f_A1B00195-Enhanced-NR_v02.jpg"
          alt="Login illustration"
          className="h-auto max-h-[400px] w-auto max-w-full object-cover p-6 md:max-h-[900px]"
        />
      </div>

      {/* Sección del formulario */}
      <div className="flex w-full items-center justify-center p-4 md:w-1/2 ">
        <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-5 m-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Bienvenido</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/90">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button type="submit" className="cursor-pointer w-full bg-black text-white rounded-xl p-3">
              Iniciar sesión
            </button>

            <div className="text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
