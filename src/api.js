import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-backend-95gv.onrender.com';

const api = axios.create({
  baseURL: API_URL
});

export default api;
export { API_URL };
