import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const useAuth = () => {
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  const requireAuth = () => {
    useEffect(() => {
      if (!isAuthenticated()) {
        Swal.fire({
          title: 'Acceso restringido',
          text: 'Debes iniciar sesión para acceder a esta página',
          icon: 'warning'
        }).then(() => {
          navigate('/login');
        });
      }
    }, [navigate]);
  };

  const logout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return { getToken, getUser, isAuthenticated, requireAuth, logout };
};