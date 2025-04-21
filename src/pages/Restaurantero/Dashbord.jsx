import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [sales, setSales] = useState([]);
  const [topFoods, setTopFoods] = useState([]);

  const restaurantId = 1;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/sales/restaurantSales/${restaurantId}/`
        );
        const data = response.data;
        setSales(data);

        // Top alimentos
        const foodMap = {};
        data.forEach((sale) => {
          sale.details.forEach((detail) => {
            const name = detail.food_info.name;
            if (!foodMap[name]) {
              foodMap[name] = {
                quantity: 1,
                total: parseFloat(detail.food_info.price),
              };
            } else {
              foodMap[name].quantity += 1;
              foodMap[name].total += parseFloat(detail.food_info.price);
            }
          });
        });

        const sortedFoods = Object.entries(foodMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setTopFoods(sortedFoods);
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
      }
    };

    fetchSales();
  }, []);

  // Cálculos
  const totalSales = sales.reduce(
    (acc, sale) => acc + parseFloat(sale.total),
    0
  );
  const totalOrders = sales.length;
  const avgTicket = totalOrders ? (totalSales / totalOrders).toFixed(2) : 0;

  const todayISO = new Date().toISOString().split("T")[0]; // "2025-04-20"
  const todaySales = sales
    .filter((sale) => sale.date.startsWith(todayISO))
    .reduce((acc, sale) => acc + parseFloat(sale.total), 0);

  const todayOrders = sales.filter((sale) =>
    sale.date.startsWith(todayISO)
  ).length;
  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(199, 199, 199, 0.6)",
    "rgba(83, 102, 255, 0.6)",
    "rgba(255, 99, 255, 0.6)",
    "rgba(99, 255, 132, 0.6)",
  ];

  const borderColors = colors.map((c) => c.replace("0.6", "1"));
  const chartData = {
    labels: topFoods.map((item) => item.name),
    datasets: [
      {
        label: "Cantidad vendida",
        data: topFoods.map((item) => item.quantity),
        backgroundColor: colors.slice(0, topFoods.length),
        borderColor: borderColors.slice(0, topFoods.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 sm:ml-60 mt-[-70px]">
      <div className="p-4 bg-gray-100 rounded-lg dark:border-gray-700">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-3 gap-4 mb-4 w-full">
          <div className="flex items-center justify-center h-24 rounded bg-white dark:bg-gray-800">
            <div>
              <p className="font-semibold">Ventas del mes</p>
              <h2 className="font-bold text-[23px]">
                ${totalSales.toFixed(2)}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-center h-24 rounded bg-white dark:bg-gray-800">
            <div>
              <p className="font-semibold">Órdenes del mes</p>
              <h2 className="font-bold text-[23px]">{totalOrders}</h2>
            </div>
          </div>
          <div className="flex items-center justify-center h-24 rounded bg-white dark:bg-gray-800">
            <div>
              <p className="font-semibold">Ticket promedio</p>
              <h2 className="font-bold text-[23px] ">${avgTicket}</h2>
            </div>
          </div>
        </div>

        {/* Resumen diario */}
        <div className="grid grid-cols-2 gap-4 mb-4 ">
        <div className="flex items-center justify-center h-24 rounded bg-white dark:bg-gray-800">
          <div>
          <p className="font-semibold">Ventas hoy</p>
          <h2 className="font-bold text-[23px] text-[#f75518]">${todaySales.toFixed(2)}</h2>
          </div>
          </div>
          <div className="flex items-center justify-center h-24 rounded bg-white dark:bg-gray-800">
            <div>
            <p className="font-semibold">Órdenes hoy</p>
            <h2 className="font-bold text-[23px] text-[#f75518]">{todayOrders}</h2>
            </div>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="h-98 mb-4 rounded bg-gray-50 dark:bg-gray-800 p-6">
          <div className="mb-4">
            <p className="font-semibold text-[24px] text-gray-800 dark:text-white">
              Productos más vendidos
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Basado en cantidad de ventas registradas
            </p>
          </div>
          <div className="w-full h-65 p-4 bg-white rounded dark:bg-gray-700">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Top productos" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
