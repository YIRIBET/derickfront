import React, { useContext } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import Home from '../pages/Cliente/Home';
import Menu from '../pages/Cliente/Menu';
import Orders from '../pages/Cliente/Orders';
import Cart from '../Components/Cart';
import Profile from '../pages/Cliente/Profile';
import Login from '../Components/Login';
import Register from '../Components/Register';
import Food from '../pages/Cliente/Food';
import Dashboard from '../pages/Restaurantero/Dashbord';
import AuthContext from '../config/context/auth-context';
import NotFound from '../pages/errorPages/404';
import AdminLayout from './../layout/adminLayout';
import RequestReset from '../Components/RequestReset';
import ResetPassword from '../Components/ResetPassword';

const AppRouter = () => {
  const { user } = useContext(AuthContext);
  const isUserSignedIn = user?.signed;

  const routesFromRole = (role) => {
    switch (role) {
      case 'ADMIN_ROLE':
        return (
          <Route path="/" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="Menu/:restaurantId" element={<Menu />} />
            <Route path="food/:menuId" element={<Food />} />
            <Route path="order" element={<Orders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="request-password" element={<RequestReset />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        );

      case 'CLIENT_ROLE':
        return (
          <Route path="/" element={<AdminLayout />}>
            <Route path="Menu/:restaurantId" element={<Menu />} />
            <Route path="food/:menuId" element={<Food />} />
            <Route path="order" element={<Orders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="request-password" element={<RequestReset />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        );

      case 'RESTAURANTERO':
        return (
          <Route path="/" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="Menu/:restaurantId" element={<Menu />} />
            <Route path="food/:menuId" element={<Food />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        );

      default:
        return <Route path="*" element={<NotFound />} />;
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {isUserSignedIn ? (
          routesFromRole(user?.role) // O user?.roles[0]?.rol si manejas array
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/request-password" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<NotFound />} />
          </>
        )}
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
