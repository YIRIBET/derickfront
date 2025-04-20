import React from "react";
import Pythones from "../../assets/PythonEsLogo.png";
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
      <div className="p-4 sm:ml-64 mt-[-40px] ">
        <div class="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
          <div class="grid grid-cols-3 gap-4 mb-4 w-full">
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  class="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
              ventas del mes
            </div>
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  class="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
              div 2
            </div>
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
              Filtrar por fecha
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Ventas hoy</p>
              <h2 className="font-bold text-[23px]">$2984.00</h2>
            </div>
            <div class=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Ordenes de hoy</p>
              <h2 className="font-bold text-[23px]">134</h2>
            </div>
            <div class=" items-center  rounded-sm  h-28 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5">Ticket promedio</p>
              <h2 className="font-bold text-[23px]">$2984.00</h2>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
              <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  class="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
              div 8
            </div>
          </div>
          <div class="h-98 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800 p-6">
            <div class="flex flex-col items-start mb-4">
              <p class="font-semibold text-[24px] text-gray-800 dark:text-white">
                Ventas de hoy
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                Visualización de ventas del día
              </p>
            </div>

            <div class="flex items-center justify-center h-64 bg-white dark:bg-gray-700 rounded">
            <div className="w-full h-75 bg-white dark:bg-gray-700 rounded p-6">
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }}
              />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div class=" items-center  rounded-sm p-4 h-58 dark:border-gray-600 border-1 border-gray-200 ">
              <p className="font-semibold mt-5 text-start text-[24px]">
                Productos más vendidos
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
            <div class=" items-center  rounded-sm p-4 h-58 dark:border-gray-600 border-1 border-gray-200 ">
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
