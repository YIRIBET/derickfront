import React, { useEffect, useReducer } from 'react';
import AuthContext from './config/context/auth-context';
import { authManager } from './config/context/auth-manager';
import AppRouter from './routes/AppRoutes';

const init = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : { signed: false }; // Si no hay usuario, inicializa con signed: false
};

function App() {
  const [user, dispatch] = useReducer(authManager, { signed: false }, init);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Guarda el estado de usuario en localStorage
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, dispatch }}>
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
