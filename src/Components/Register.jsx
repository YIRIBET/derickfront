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

  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      startDate,
      status,
      email,
      password,
      role
    };

    console.log("Datos enviados:", data);


    fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) nav('/login');
    });

  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="flex w-full items-center justify-center p-4 md:w-1/2 ">
        <div className="mx-auto w-full max-w-md space-y-8 rounded-xl p-5 m-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Registrate con nosotros</h2>
          </div>

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
                </select>
              </div>

            </div>

            <button type="submit" className="cursor-pointer w-full bg-black text-white rounded-xl p-3">
              Registrar
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
