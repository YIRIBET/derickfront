import axios from 'axios';

// URL base -> http://localhost:8080/
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
const APP_JSON = 'application/json';
const AxiosClient = axios.create({
  baseURL: SERVER_URL,
});

// Función para configurar los headers de la solicitud
const requestHandler = (req) => {


  req.headers['Accept'] = APP_JSON;
  req.headers['Content-Type'] = APP_JSON;
  const session = JSON.parse(localStorage.getItem('user'));
  refreshAccessToken(session.refresh);
  if (session?.access) req.headers['Authorization'] = `Bearer ${session.access}`;
  return req;
};

// Interceptor para agregar token de autorización en las solicitudes
AxiosClient.interceptors.request.use(
  (req) => requestHandler(req),
  (err) => Promise.reject(err)
);

// Función para actualizar el token de acceso
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}api/auth/token/refresh/`,
      { refresh: refreshToken }
    );
    const { access } = response.data;
    // Actualizamos el localStorage con el nuevo access token
    const session = JSON.parse(localStorage.getItem('user'));
    session.access = access;

    localStorage.setItem('user', JSON.stringify(session));
    return access;  // Retorna el nuevo access token
  } catch (error) {
    console.error('Error al actualizar el token:', error);
    return null;  // En caso de error, devolver null
  }
};



export default AxiosClient;
