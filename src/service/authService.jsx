import axios from 'axios'

const API_URL = 'http://localhost:8000/api/auth/token/'
export const login = async (email, password) =>{
    const response = await axios.post(API_URL,{email, password});
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

//TO do 
//crear un metodo que jale informacion del usuario para fines de react 
