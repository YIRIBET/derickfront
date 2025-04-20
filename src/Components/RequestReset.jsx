import { useState } from "react";
import axios from "axios";
import React from "react";
import Fondo from "../assets/fondo.jpg";

function RequestReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/users/api/password-reset/request/",
        {
          email,
          redirect_url: `${window.location.origin}/reset-password`,
        }
      );
      setMessage({
        text: "Si el email existe, se ha enviado un enlace de recuperación.",
        isError: false,
      });
    } catch (error) {
      setMessage({
        text: "Ocurrió un error al procesar tu solicitud.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-100"
      // style={{ backgroundImage: `url(${Fondo})` }}
    >

      {/* Formulario encima */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Recuperar contraseña
        </h2>
        <p className="text-gray-500">
          Ingresa tu correo electrónico para recibir un enlace de recuperación
        </p>

        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>

            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black-500 focus:border-black-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 font-medium text-white rounded-md ${
              isLoading
                ? "bg-black cursor-not-allowed"
                : "bg-black hover:bg-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </span>
            ) : (
              "Enviar enlace"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-[#ff6227] hover:underline">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default RequestReset;
