
import axios from 'axios';



const api = axios.create({

    baseURL: 'http://localhost:3001/api/v1', // URL do seu backend NestJS

});



// Interceptor que adiciona o token de autenticação em cada requisição

api.interceptors.request.use(config => {

    const token = localStorage.getItem('authToken');

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

}, error => {

    return Promise.reject(error);

});



export default api;

