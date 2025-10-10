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
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      const message = error.response.data?.message;
      const requestUrl = error.config?.url ?? '';
      if (message !== 'პაროლი არასწორია' && !requestUrl.endsWith('/me')) {
        Cookies.remove('token');
        Cookies.remove('role');
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
