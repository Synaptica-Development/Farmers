import BASE_URL from '@/app/config/api';
import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
