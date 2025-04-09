import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Datos para el gráfico de línea
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
  ];
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Usuarios registrados",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Restaurantes registrados",
        data: [30, 42, 48, 51, 45, 38, 35],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  // Datos para el gráfico de barras (productos más vendidos)
  const barChartData = {
    labels: [
      "Producto 1",
      "Producto 2",
      "Producto 3",
      "Producto 4",
      "Producto 5",
    ],
    datasets: [
      {
        label: "Ventas mensuales",
        data: [120, 190, 90, 80, 70],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/*Contenido */}
      <div className="p-4 sm:ml-64">
        <div className="p-2 border-2 border-gray-200  rounded-lg dark:border-gray-700">
          
          <div className="flex flex-col items-start mb-4">
              <p className="font-bold text-3xl text-gray-800 dark:text-white">
              Panel de Administración
              </p>
              <p className="text-gray-500 dark:text-gray-400">
              Gestiona todo en un solo lugar
              </p>
            </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Total de usuarios</p>
              <h2 className="font-bold text-[23px]">$2984.00</h2>
            </div>
            <div className=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Total de restaurantes</p>
              <h2 className="font-bold text-[23px]">134</h2>
            </div>
            <div className=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Pedidos mensuales</p>
              <h2 className="font-bold text-[23px]">$2984.00</h2>
            </div>
            <div className=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Ingresos mensuales</p>
              <h2 className="font-bold text-[23px]">$2984.00</h2>
            </div>
          </div>

          <div className="h-98 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800 p-6">
            <div className="flex flex-col items-start mb-4">
              <p className="font-semibold text-2xl text-gray-800 dark:text-white">
                Crecimiento de Usuarios y Restaurantes
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Evolucion mensual durante el ultimo año
              </p>
            </div>

            <div className="w-full h-70 bg-white dark:bg-gray-700 rounded p-6">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          <h4 className=" font-bold text-2xl text-start mt-5">
            Acciones rápidas
          </h4>
          <div className="grid grid-cols-3 gap-2 mt-4 w-full mb-5">
            <div className="flex items-center justify-center h-24 rounded-sm bg-black dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                  />
                </svg>
              </p>
              <p className="text-gray-400 font-semibold "> Añadir restaurante</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded-sm bg-black bg-opacity-80 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-black-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </p>
              <p className="text-gray-400 font-semibold ">Añadir Propietario</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
              Filtrar por fecha
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className=" items-center  rounded-sm p-4 h-78 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5 text-start text-[24px]">
                Ingresos mensuales
              </p>
              <p className="text-gray-500 text-start">
                Top 5 productos del mes
              </p>
              <div className="h-48 mt-4">
                <Bar data={barChartData} />
              </div>
            </div>

            <div className=" items-center  rounded-sm p-4 h-58 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5 text-start  text-[24px]">
                Menus más vendidos
              </p>
              <p className="text-gray-500 text-start">
                Top 5 productos del mes
              </p>
              <ul className=" mt-5 text-start ">
                <li>nombre de producto</li>
                <li>nombre de producto</li>
                <li>nombre de producto</li>
                <li>nombre de producto</li>
              </ul>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
