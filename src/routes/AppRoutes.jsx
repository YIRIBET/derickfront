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
import RestaurantLayout from '../layout/restaurantLayout'
import RequestReset from '../Components/RequestReset';
import ResetPassword from '../Components/ResetPassword';
import MenuR from '../pages/Restaurantero/Menu';
import FoodR from '../pages/Restaurantero/Food';
import Admindashbord from '../pages/Admin/Admindashbord';
import Restarantes from '../pages/Restaurantero/Restaurants';
import Users from '../pages/Admin/Users';
import PublicLayout from '../layout/PublicLayout'

const AppRouter = () => {
  const { user } = useContext(AuthContext);
  console.log(user?.role)
  console.log(user?.user_id);
  const isUserSignedIn = user?.signed;

  const routesFromRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Admindashbord />} />
            
            <Route path="users/" element={<Users />} />
            <Route path="request-password" element={<RequestReset />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        );

      case 'USER':
        return (
          <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="Menu/:restaurantId" element={<Menu />} />
          <Route path="food/:menuId" element={<Food />} />
          <Route path="order/" element={<Orders />} />
          <Route path="cart/" element={<Cart />} />
          <Route path="perfil/" element={<Profile />} />
          <Route path="request-password" element={<RequestReset />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        );

      case 'RESTAURANT_OWNER':
        return (
          <Route path="/" element={<RestaurantLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="restaurants/" element={<Restarantes />} />
            <Route path="menu/" element={<MenuR />} />
            <Route path="food/" element={<FoodR />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        );

      default:
        return <Route path="*" element={<Home/>} />;
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {isUserSignedIn ? (
          routesFromRole(user?.role) // O user?.roles[0]?.rol si manejas array
        ) : (
          <>
            <Route index element={<Home />} />
            
            <Route path="Menu/:restaurantId" element={<Menu />} />
          <Route path="food/:menuId" element={<Food />} />
          <Route path="order/" element={<Orders />} />
          <Route path="cart/" element={<Cart />} />
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
