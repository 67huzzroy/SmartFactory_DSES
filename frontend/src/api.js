import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // FastAPI default port
    timeout: 5000,
});

export default api;
