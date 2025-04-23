import axios from 'axios'
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export const login = async (email, password) =>{
    const response = await axios.post(SERVER_URL,{email, password});
    if (response.data.access){
        localStorage.setItem('accessToken',response.data.access);
        localStorage.setItem('refeshToken',response.data.refresh);

    }
    return response.data;
};

export const logout =() =>{
    localStorage.removeItem('accesToken');
    localStorage.removeItem('refeshToken');


}

