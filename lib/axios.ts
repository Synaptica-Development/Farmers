import BASE_URL from '@/app/config/api';
import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      api.get(`/api/Auth/refresh`)
        .then((res) => {
          Cookies.set('token', res.data.token, { secure: true, sameSite: 'none' });
        })
        .catch(() => {
          window.location.href = '/signin';
        });
    }
    return Promise.reject(error);
  }
);

export default api;
