import axios from 'axios';

const API = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});


API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;