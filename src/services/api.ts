import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rifatudo-backend.herokuapp.com',
});

export default api;