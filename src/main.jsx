import React from "react"; // Asegúrate de importar React
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Si tienes estilos globales
import Login from "./Components/Login";
import Dashboard from "./pages/Restaurantero/Dashbord";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
