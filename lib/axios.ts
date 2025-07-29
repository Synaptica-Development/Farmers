import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL:'https://185.49.165.101:5002',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
