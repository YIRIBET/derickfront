import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append("username", email);
    data.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/api/auth/token/", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.access);
        navigate("/admin"); // Redirigir al dashboard
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
