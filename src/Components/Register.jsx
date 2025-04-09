import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(""); // formato YYYY-MM-DD
  const [status, setStatus] = useState(true);
  const [role, setRole] = useState(2);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = {
      name,
      start_date: startDate, // Asegúrate de que el nombre del campo coincida con lo que espera tu backend
      status,
      email,
      password,
      role
    };

    let endpoint = '';
    
    // Determinar el endpoint basado en el rol
    if (role === 1) {
      endpoint = 'http://127.0.0.1:8000/users/api/admin/save/';
    } else if (role === 2) {
      endpoint = 'http://127.0.0.1:8000/users/api/user/save/';
    } else if (role === 3) { // Asumo que 3 sería para restaurant_owner
      endpoint = 'http://127.0.0.1:8000/users/api/restaurant_owner/save/';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      nav('/login');
    } catch (err) {
      setError(err.message || 'Ocurrió un error al registrar');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="flex w-full items-center justify-center p-4 md:w-1/2 ">
        <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-5 m-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Registrate con nosotros</h2>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="sr-only">
                      {showPassword ? "Ocultar" : "Mostrar"} contraseña
                    </span>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Fecha de inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Usuario</option>
                  <option value={3}>Dueño de Restaurante</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="cursor-pointer w-full bg-black text-white rounded-xl p-3 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>

            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login">
                <p className="font-medium text-primary hover:text-primary/90">
                  Inicia sesión
                </p>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-primary/10 md:w-1/2">
        <img
          src="https://www.truefoodkitchen.com/wp-content/uploads/2025/01/TFK016_01f_A1B00195-Enhanced-NR_v02.jpg"
          alt="Login illustration"
          className="h-auto max-h-[400px] w-auto max-w-full object-cover p-6 md:max-h-[900px]"
        />
      </div>
    </div>
  );
};

export default Register;