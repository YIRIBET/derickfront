import React, { useState }  from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/DashboardPage";
import UsersPage from "../pages/Admin/UsersPage";
import UserForm from "../Components/admin/User/UserForm";
import RolesPage from "../Components/admin/Role/RolesPage";
import RoleForm from "../Components/admin/Role/RoleForm";
import RestaurantsPage from "../Components/admin/Restaurant/RestaurantsPage";
import RestaurantForm from "../Components/admin/Restaurant/RestaurantForm";
import Login from "../pages/Admin/Login";
{/*
    import RolesPage from "../pages/Admin/RolesPage";
import RestaurantsPage from "../pages/Admin/RestaurantsPage";
import SalesPage from "../pages/Admin/SalesPage";




 <Route path="roles" element={<RolesPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="sales" element={<SalesPage />} />
    */}




const AdminRoutes = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
  return (
    <Routes>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserForm />} /> 
        <Route path="users/edit/:id" element={<UserForm />} />

        {/* Rutas para Roles */}
        <Route path="roles" element={<RolesPage roles={roles} setRoles={setRoles} />} />
        <Route path="roles/new" element={<RoleForm roles={roles} setRoles={setRoles} />} />
        <Route path="roles/edit/:id" element={<RoleForm roles={roles} setRoles={setRoles} />} />
        <Route path="login" element={<Login />} />
        
      <Route path="restaurants" element={<RestaurantsPage restaurants={restaurants} setRestaurants={setRestaurants} />} />
        <Route path="restaurants/new" element={<RestaurantForm restaurants={restaurants} setRestaurants={setRestaurants} />} />
        <Route path="restaurants/edit/:id" element={<RestaurantForm restaurants={restaurants} setRestaurants={setRestaurants} />} />
       

      </Route>

    </Routes>
  );
};
 
export default AdminRoutes;
