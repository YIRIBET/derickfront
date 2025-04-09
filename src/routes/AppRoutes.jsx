import React, { useContext } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Home from '../pages/Cliente/Home';
import Menu from '../pages/Cliente/Menu';
import Orders from '../pages/Cliente/Orders';
import Cart from '../Components/Cart';
import Profile from '../pages/Cliente/Profile';
import Login from '../Components/Login'
import Register from '../Components/Register';
import Food from '../pages/Cliente/Food';
import Dashboard from '../pages/Restaurantero/Dashbord';
import AuthContext from '../config/context/auth-context'; // El contexto de autenticación
import NotFound from '../pages/errorPages/404'; // Tu componente de 404
import AdminLayout from './../layout/adminLayout'
import RequestReset from '../Components/RequestReset'
import ResetPassword from '../Components/ResetPassword'


const AppRouter = () => {
  const { user } = useContext(AuthContext) || {}; // Asegurarnos de que user esté definido
  const isUserSignedIn = user?.signed || false; // Usar optional chaining y asignar un valor predeterminado si no está definido

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Si el usuario está autenticado */}
        {isUserSignedIn ? (
          <Route path="/" element={<AdminLayout />}>
            {/* Rutas del administrador */}
            <Route path="/Menu/:restaurantId" element={<Menu />} />
            <Route path="/food/:menuId" element={<Food />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/request-password" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        ) : (
          // Si el usuario no está autenticado, redirigir a la página de login
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request-password" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </>
        )}

        {/* Ruta por defecto para cualquier ruta no encontrada */}
        <Route path="/*" element={<NotFound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
