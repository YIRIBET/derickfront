import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/http-client/axios-client";
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
  
  const [data, setData] = useState({
    users: 0,
    restaurants: 0,
    orders: 2984,  // Mantenemos tus valores iniciales
    revenue: 2984, // Mantenemos tus valores iniciales
    loading: false,
    error: null,
    growthData: {
      months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      users: [10, 15, 22, 30, 42, 55],
      restaurants: [2, 4, 7, 10, 12, 15],
    },
    globalMostSoldFoods: [],
    restaurantMostSoldFoods: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        // 1. Obtener usuarios y restaurantes (TUS ENDPOINTS ORIGINALES)
        const [usersResponse, restaurantsResponse] = await Promise.all([
          axiosClient.get("users/api/"),
          axiosClient.get("restaurante/api/")
        ]);

        // 2. Obtener datos de ventas (TUS NUEVOS ENDPOINTS)
        const [globalSales, restaurantSales] = await Promise.all([
          axiosClient.get("sales/globalMostSoldFoods/"),
          axiosClient.get("sales/restaurantMostSoldFoods/1")
        ]);

        // Normalizar datos de ventas
        const normalizeSalesData = (responseData) => {
          if (Array.isArray(responseData)) return responseData;
          if (typeof responseData === 'object') {
            return Object.entries(responseData).map(([food_name, total_quantity_sold]) => ({
              food_name,
              total_quantity_sold
            }));
          }
          return [];
        };

        setData(prev => ({
          ...prev,
          users: extractCount(usersResponse.data),
          restaurants: extractCount(restaurantsResponse.data),
          globalMostSoldFoods: normalizeSalesData(globalSales.data),
          restaurantMostSoldFoods: normalizeSalesData(restaurantSales.data),
          loading: false
        }));

      } catch (error) {
        console.error("Error:", error);
        setData(prev => ({ ...prev, loading: false, error: "Error al cargar datos" }));
      }
    };

    const extractCount = (responseData) => {
      if (Array.isArray(responseData)) return responseData.length;
      if (typeof responseData === 'object') {
        return responseData.count || responseData.total || 0;
      }
      return 0;
    };

    fetchData();
  }, []);

  // Gráfico de crecimiento (CON TUS DATOS ORIGINALES)
  const lineChartData = {
    labels: data.growthData.months,
    datasets: [
      {
        label: "Usuarios registrados",
        data: data.growthData.users,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Restaurantes registrados",
        data: data.growthData.restaurants,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  // Gráfico de productos más vendidos (NUEVO)
  const barChartData = {
    labels: data.globalMostSoldFoods.slice(0, 5).map(item => item.food_name),
    datasets: [{
      label: "Cantidad vendida",
      data: data.globalMostSoldFoods.slice(0, 5).map(item => item.total_quantity_sold),
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    }],
  };

  return (
    <div className="p-4 sm:ml-64 mt-[-40px]">
      <div className="p-2 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        
        <div className="flex flex-col items-start mb-4">
          <p className="font-bold text-3xl text-gray-800 dark:text-white">Panel de Administración</p>
          <p className="text-gray-500 dark:text-gray-400">Gestiona todo en un solo lugar</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="items-center rounded-sm h-28 dark:border-gray-600 border-1 border-gray-200">
            <p className="font-semibold mt-5">Total de usuarios</p>
            <h2 className="font-bold text-[23px]">{data.loading ? "Cargando..." : data.users}</h2>
          </div>
          <div className="items-center rounded-sm h-28 dark:border-gray-600 border-1 border-gray-200">
            <p className="font-semibold mt-5">Total de restaurantes</p>
            <h2 className="font-bold text-[23px]">{data.loading ? "Cargando..." : data.restaurants}</h2>
          </div>
        
        </div>

        {/* Gráfico de crecimiento (MISMO CÓDIGO ORIGINAL) */}
        <div className="h-98 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800 p-6">
          <div className="flex flex-col items-start mb-4">
            <p className="font-semibold text-2xl text-gray-800 dark:text-white">
              Crecimiento de Usuarios y Restaurantes
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Evolución mensual durante el último año
            </p>
          </div>
          <div className="w-full h-70 bg-white dark:bg-gray-700 rounded p-6">
            <Line data={lineChartData} options={{
              responsive: true,
              plugins: { legend: { position: "top" } }
            }} />
          </div>
        </div>

        {/* ACCIONES RÁPIDAS (MISMO CÓDIGO ORIGINAL) */}
        <h4 className="font-bold text-2xl text-start mt-5">Acciones rápidas</h4>
        <div className="grid grid-cols-3 gap-2 mt-4 w-full mb-5">
          {/* ... (Tus botones originales aquí) ... */}
        </div>

        {/* NUEVOS COMPONENTES MEJORADOS */}
        <div className="grid grid-cols-2 gap-8">
          {/* Gráfico de productos más vendidos (NUEVO) */}
          <div className="items-center rounded-sm p-4 h-78 dark:border-gray-600 border-1 border-gray-200">
            <p className="font-semibold text-[24px]">Productos más vendidos</p>
            <p className="text-gray-500">Top 5 global</p>
            <div className="h-48 mt-4">
              {data.globalMostSoldFoods.length > 0 ? (
                <Bar data={barChartData} options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } }
                }} />
              ) : (
                <p className="text-center py-8 text-gray-500">No hay datos</p>
              )}
            </div>
          </div>

          {/* Lista de menús más vendidos (MEJORADO) */}
          <div className="items-center rounded-sm p-4 h-58 dark:border-gray-600 border-1 border-gray-200">
            <p className="font-semibold text-[24px]">Menús más vendidos</p>
            <p className="text-gray-500">Restaurante ID: 1</p>
            <ul className="mt-5 space-y-2">
              {data.restaurantMostSoldFoods.slice(0, 5).map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.food_name}</span>
                  <span className="font-bold">{item.total_quantity_sold} ventas</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;